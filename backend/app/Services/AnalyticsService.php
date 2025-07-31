<?php

namespace App\Services;

use App\Models\Member;
use App\Models\SocialUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get dashboard analytics data
     */
    public function getDashboardAnalytics($tenantId): array
    {
        return Cache::remember("analytics_dashboard_{$tenantId}", 300, function () use ($tenantId) {
            return [
                'overview' => $this->getOverviewStats($tenantId),
                'user_growth' => $this->getUserGrowthData($tenantId),
                'bandwidth_usage' => $this->getBandwidthUsageData($tenantId),
                'device_types' => $this->getDeviceTypesData($tenantId),
                'peak_hours' => $this->getPeakHoursData($tenantId),
                'top_locations' => $this->getTopLocationsData($tenantId),
                'revenue_analytics' => $this->getRevenueAnalytics($tenantId),
            ];
        });
    }

    /**
     * Get overview statistics
     */
    private function getOverviewStats($tenantId): array
    {
        $totalMembers = Member::where('tenant_id', $tenantId)->count();
        $activeMembersToday = Member::where('tenant_id', $tenantId)
            ->where('last_login', '>=', Carbon::today())
            ->count();
        
        $totalSocialUsers = SocialUser::where('tenant_id', $tenantId)->count();
        $newUsersThisWeek = Member::where('tenant_id', $tenantId)
            ->where('created_at', '>=', Carbon::now()->subWeek())
            ->count();

        $totalAdmins = User::where('tenant_id', $tenantId)->count();

        return [
            'total_members' => $totalMembers,
            'active_members_today' => $activeMembersToday,
            'total_social_users' => $totalSocialUsers,
            'new_users_this_week' => $newUsersThisWeek,
            'total_admins' => $totalAdmins,
            'growth_rate' => $this->calculateGrowthRate($tenantId),
        ];
    }

    /**
     * Get user growth data for charts
     */
    private function getUserGrowthData($tenantId): array
    {
        $last30Days = [];
        $memberGrowth = [];
        $socialUserGrowth = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $last30Days[] = $date->format('Y-m-d');
            
            $memberCount = Member::where('tenant_id', $tenantId)
                ->whereDate('created_at', '<=', $date)
                ->count();
            
            $socialCount = SocialUser::where('tenant_id', $tenantId)
                ->whereDate('created_at', '<=', $date)
                ->count();
            
            $memberGrowth[] = $memberCount;
            $socialUserGrowth[] = $socialCount;
        }

        return [
            'labels' => $last30Days,
            'member_growth' => $memberGrowth,
            'social_user_growth' => $socialUserGrowth,
        ];
    }

    /**
     * Get bandwidth usage data
     */
    private function getBandwidthUsageData($tenantId): array
    {
        // Simulate bandwidth data (in real implementation, get from MikroTik)
        $hours = [];
        $downloadData = [];
        $uploadData = [];

        for ($i = 23; $i >= 0; $i--) {
            $hour = Carbon::now()->subHours($i)->format('H:00');
            $hours[] = $hour;
            
            // Simulate realistic bandwidth patterns
            $baseDownload = rand(50, 200);
            $baseUpload = rand(20, 80);
            
            // Peak hours (19:00-23:00) have higher usage
            $currentHour = Carbon::now()->subHours($i)->hour;
            if ($currentHour >= 19 && $currentHour <= 23) {
                $baseDownload *= 1.5;
                $baseUpload *= 1.3;
            }
            
            $downloadData[] = round($baseDownload, 2);
            $uploadData[] = round($baseUpload, 2);
        }

        return [
            'labels' => $hours,
            'download' => $downloadData,
            'upload' => $uploadData,
            'unit' => 'Mbps'
        ];
    }

    /**
     * Get device types distribution
     */
    private function getDeviceTypesData($tenantId): array
    {
        // Simulate device type data
        return [
            'labels' => ['Mobile', 'Desktop', 'Tablet', 'Smart TV', 'Gaming Console'],
            'data' => [45, 25, 15, 10, 5],
            'colors' => ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        ];
    }

    /**
     * Get peak hours data
     */
    private function getPeakHoursData($tenantId): array
    {
        $hours = [];
        $userCounts = [];

        for ($i = 0; $i < 24; $i++) {
            $hours[] = sprintf('%02d:00', $i);
            
            // Simulate realistic usage patterns
            if ($i >= 6 && $i <= 9) { // Morning peak
                $userCounts[] = rand(20, 40);
            } elseif ($i >= 12 && $i <= 14) { // Lunch peak
                $userCounts[] = rand(25, 45);
            } elseif ($i >= 19 && $i <= 23) { // Evening peak
                $userCounts[] = rand(40, 80);
            } else {
                $userCounts[] = rand(5, 20);
            }
        }

        return [
            'labels' => $hours,
            'data' => $userCounts,
        ];
    }

    /**
     * Get top locations data
     */
    private function getTopLocationsData($tenantId): array
    {
        // Simulate location data
        return [
            ['location' => 'Lobby Area', 'users' => 45, 'percentage' => 35],
            ['location' => 'Food Court', 'users' => 38, 'percentage' => 30],
            ['location' => 'Meeting Room A', 'users' => 25, 'percentage' => 20],
            ['location' => 'Outdoor Terrace', 'users' => 12, 'percentage' => 10],
            ['location' => 'Conference Hall', 'users' => 6, 'percentage' => 5],
        ];
    }

    /**
     * Get revenue analytics (if applicable)
     */
    private function getRevenueAnalytics($tenantId): array
    {
        $last12Months = [];
        $revenueData = [];

        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $last12Months[] = $month->format('M Y');
            
            // Simulate revenue data
            $baseRevenue = rand(1000, 5000);
            $revenueData[] = $baseRevenue;
        }

        return [
            'labels' => $last12Months,
            'data' => $revenueData,
            'currency' => 'IDR',
            'total_revenue' => array_sum($revenueData),
            'average_monthly' => round(array_sum($revenueData) / count($revenueData)),
        ];
    }

    /**
     * Calculate growth rate
     */
    private function calculateGrowthRate($tenantId): float
    {
        $thisWeek = Member::where('tenant_id', $tenantId)
            ->where('created_at', '>=', Carbon::now()->subWeek())
            ->count();
        
        $lastWeek = Member::where('tenant_id', $tenantId)
            ->whereBetween('created_at', [
                Carbon::now()->subWeeks(2),
                Carbon::now()->subWeek()
            ])
            ->count();

        if ($lastWeek == 0) {
            return $thisWeek > 0 ? 100 : 0;
        }

        return round((($thisWeek - $lastWeek) / $lastWeek) * 100, 1);
    }

    /**
     * Get real-time statistics
     */
    public function getRealTimeStats($tenantId): array
    {
        return [
            'online_users' => rand(15, 50),
            'current_bandwidth' => [
                'download' => rand(100, 300) . ' Mbps',
                'upload' => rand(50, 150) . ' Mbps'
            ],
            'server_load' => rand(20, 80) . '%',
            'active_sessions' => rand(25, 75),
            'last_updated' => Carbon::now()->toISOString(),
        ];
    }
}
