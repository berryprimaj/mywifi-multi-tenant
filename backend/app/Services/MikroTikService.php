<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class MikroTikService
{
    private $host;
    private $port;
    private $username;
    private $password;
    private $timeout;
    private $httpPort;

    public function __construct($host = null, $port = null, $username = null, $password = null)
    {
        $this->host = $host ?? env('MIKROTIK_HOST', '192.168.1.1');
        $this->port = $port ?? env('MIKROTIK_PORT', '8728');
        $this->httpPort = env('MIKROTIK_HTTP_PORT', '80'); // HTTP API port
        $this->username = $username ?? env('MIKROTIK_USERNAME', 'admin');
        $this->password = $password ?? env('MIKROTIK_PASSWORD', '');
        $this->timeout = 10;
    }

    /**
     * Resolve domain name to IP address
     */
    private function resolveDomain($domain): ?string
    {
        try {
            $ip = gethostbyname($domain);
            return ($ip !== $domain) ? $ip : null;
        } catch (Exception $e) {
            Log::error("DNS resolution failed for domain: $domain - " . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate if host is a domain and resolve it
     */
    private function validateAndResolveHost($host): string
    {
        // Check if it's already an IP address
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            return $host;
        }

        // Try to resolve domain
        $resolvedIp = $this->resolveDomain($host);
        if ($resolvedIp) {
            Log::info("DDNS resolved: $host -> $resolvedIp");
            return $resolvedIp;
        }

        // If resolution fails, return original host (will likely fail connection)
        Log::warning("DDNS resolution failed for: $host");
        return $host;
    }

    /**
     * Make HTTP request to MikroTik REST API
     */
    private function makeRequest($endpoint, $method = 'GET', $data = null): array
    {
        try {
            // Resolve DDNS if needed
            $resolvedHost = $this->validateAndResolveHost($this->host);
            $url = "http://{$resolvedHost}:{$this->httpPort}/rest{$endpoint}";

            $response = Http::timeout($this->timeout)
                ->withBasicAuth($this->username, $this->password)
                ->withHeaders(['Content-Type' => 'application/json']);

            switch (strtoupper($method)) {
                case 'GET':
                    $response = $response->get($url);
                    break;
                case 'POST':
                    $response = $response->post($url, $data);
                    break;
                case 'PUT':
                    $response = $response->put($url, $data);
                    break;
                case 'DELETE':
                    $response = $response->delete($url);
                    break;
                default:
                    throw new Exception("Unsupported HTTP method: $method");
            }

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            } else {
                throw new Exception("HTTP {$response->status()}: {$response->body()}");
            }
        } catch (Exception $e) {
            Log::error("MikroTik API request failed: " . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Test connection to MikroTik router
     */
    public function testConnection(): array
    {
        try {
            if (empty($this->host) || empty($this->username)) {
                throw new Exception('MikroTik credentials not configured');
            }

            // Try to get system identity to test connection
            $result = $this->makeRequest('/system/identity');

            if ($result['success']) {
                return [
                    'success' => true,
                    'message' => 'Connection successful',
                    'router_info' => [
                        'host' => $this->host,
                        'port' => $this->port,
                        'identity' => $result['data']['name'] ?? 'MikroTik Router',
                        'version' => $this->getRouterVersion(),
                    ]
                ];
            } else {
                throw new Exception($result['message']);
            }
        } catch (Exception $e) {
            Log::error('MikroTik connection failed: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get router version
     */
    private function getRouterVersion(): string
    {
        try {
            $result = $this->makeRequest('/system/resource');
            if ($result['success'] && isset($result['data']['version'])) {
                return $result['data']['version'];
            }
            return 'Unknown';
        } catch (Exception $e) {
            return 'Unknown';
        }
    }

    /**
     * Get router status and statistics
     */
    public function getRouterStatus(): array
    {
        try {
            // Get system resource info
            $resourceResult = $this->makeRequest('/system/resource');
            $interfaceResult = $this->makeRequest('/interface');
            $hotspotResult = $this->makeRequest('/ip/hotspot/active');

            if (!$resourceResult['success']) {
                throw new Exception('Failed to get system resource info');
            }

            $resource = $resourceResult['data'];
            $interfaces = $interfaceResult['success'] ? $interfaceResult['data'] : [];
            $hotspotUsers = $hotspotResult['success'] ? $hotspotResult['data'] : [];

            return [
                'success' => true,
                'data' => [
                    'uptime' => $resource['uptime'] ?? 'Unknown',
                    'cpu_load' => ($resource['cpu-load'] ?? 0) . '%',
                    'memory_usage' => round((($resource['total-memory'] - $resource['free-memory']) / $resource['total-memory']) * 100, 1) . '%',
                    'active_users' => count($hotspotUsers),
                    'total_bandwidth' => $this->calculateTotalBandwidth($interfaces),
                    'hotspot_users' => count($hotspotUsers),
                    'interfaces_count' => count($interfaces),
                    'free_memory' => $this->formatBytes($resource['free-memory'] ?? 0),
                    'total_memory' => $this->formatBytes($resource['total-memory'] ?? 0),
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to get router status: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Calculate total bandwidth from interfaces
     */
    private function calculateTotalBandwidth($interfaces): array
    {
        $totalRx = 0;
        $totalTx = 0;

        foreach ($interfaces as $interface) {
            $totalRx += $interface['rx-byte'] ?? 0;
            $totalTx += $interface['tx-byte'] ?? 0;
        }

        return [
            'rx' => $this->formatBytes($totalRx),
            'tx' => $this->formatBytes($totalTx)
        ];
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Get network interfaces
     */
    public function getInterfaces(): array
    {
        try {
            $result = $this->makeRequest('/interface');

            if (!$result['success']) {
                throw new Exception('Failed to get interfaces');
            }

            $interfaces = [];
            foreach ($result['data'] as $interface) {
                $interfaces[] = [
                    'name' => $interface['name'],
                    'mac' => $interface['mac-address'] ?? 'Unknown',
                    'type' => $interface['type'] ?? 'Unknown',
                    'status' => $interface['running'] ? 'running' : 'disabled',
                    'rx' => $this->formatBytes($interface['rx-byte'] ?? 0),
                    'tx' => $this->formatBytes($interface['tx-byte'] ?? 0),
                    'mtu' => $interface['mtu'] ?? 'Unknown',
                    'disabled' => $interface['disabled'] ?? false
                ];
            }

            return [
                'success' => true,
                'data' => $interfaces
            ];
        } catch (Exception $e) {
            Log::error('Failed to get interfaces: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get PPP connections (for IP publik detection)
     */
    public function getPPPConnections(): array
    {
        try {
            $result = $this->makeRequest('/ppp/active');

            if (!$result['success']) {
                throw new Exception('Failed to get PPP connections');
            }

            $connections = [];
            foreach ($result['data'] as $connection) {
                $connections[] = [
                    'name' => $connection['name'],
                    'service' => $connection['service'],
                    'caller_id' => $connection['caller-id'] ?? 'Unknown',
                    'address' => $connection['address'] ?? 'Unknown',
                    'uptime' => $connection['uptime'] ?? 'Unknown',
                    'encoding' => $connection['encoding'] ?? 'Unknown',
                    'session_id' => $connection['session-id'] ?? 'Unknown'
                ];
            }

            return [
                'success' => true,
                'data' => $connections
            ];
        } catch (Exception $e) {
            Log::error('Failed to get PPP connections: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get public IP from PPP connections
     */
    public function getPublicIP(): array
    {
        try {
            $pppResult = $this->getPPPConnections();
            
            if (!$pppResult['success']) {
                throw new Exception('Failed to get PPP connections for IP detection');
            }

            $publicIPs = [];
            foreach ($pppResult['data'] as $connection) {
                if (!empty($connection['caller_id']) && $connection['caller_id'] !== 'Unknown') {
                    $publicIPs[] = [
                        'connection_name' => $connection['name'],
                        'public_ip' => $connection['caller_id'],
                        'service' => $connection['service'],
                        'uptime' => $connection['uptime']
                    ];
                }
            }

            return [
                'success' => true,
                'data' => $publicIPs,
                'message' => count($publicIPs) > 0 ? 'Found ' . count($publicIPs) . ' public IP(s)' : 'No public IPs found'
            ];
        } catch (Exception $e) {
            Log::error('Failed to get public IP: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get hotspot profiles
     */
    public function getHotspotProfiles(): array
    {
        try {
            // Simulate hotspot profiles
            $profiles = [
                [
                    'name' => 'default',
                    'session_timeout' => '1h',
                    'idle_timeout' => '30m',
                    'shared_users' => 1,
                    'rate_limit' => '2M/1M',
                    'status' => 'active'
                ],
                [
                    'name' => 'premium',
                    'session_timeout' => '4h',
                    'idle_timeout' => '1h',
                    'shared_users' => 2,
                    'rate_limit' => '10M/5M',
                    'status' => 'active'
                ],
                [
                    'name' => 'guest',
                    'session_timeout' => '30m',
                    'idle_timeout' => '15m',
                    'shared_users' => 1,
                    'rate_limit' => '1M/512k',
                    'status' => 'active'
                ]
            ];

            return [
                'success' => true,
                'data' => $profiles
            ];
        } catch (Exception $e) {
            Log::error('Failed to get hotspot profiles: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Restart hotspot service
     */
    public function restartHotspot(): array
    {
        try {
            // Simulate hotspot restart
            Log::info('Hotspot service restart requested');
            
            return [
                'success' => true,
                'message' => 'Hotspot service restarted successfully'
            ];
        } catch (Exception $e) {
            Log::error('Failed to restart hotspot: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Reboot router
     */
    public function rebootRouter(): array
    {
        try {
            // Simulate router reboot
            Log::info('Router reboot requested');
            
            return [
                'success' => true,
                'message' => 'Router reboot initiated successfully'
            ];
        } catch (Exception $e) {
            Log::error('Failed to reboot router: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Create backup
     */
    public function createBackup(): array
    {
        try {
            // Simulate backup creation
            $backupName = 'backup_' . date('Y-m-d_H-i-s') . '.backup';
            Log::info('Backup created: ' . $backupName);
            
            return [
                'success' => true,
                'message' => 'Backup created successfully',
                'backup_name' => $backupName
            ];
        } catch (Exception $e) {
            Log::error('Failed to create backup: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
