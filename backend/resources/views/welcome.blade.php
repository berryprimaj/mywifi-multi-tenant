<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MikroTik Hotspot Management System - Backend API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
        }
        .status {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            border: 1px solid #c3e6cb;
        }
        .api-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            text-align: left;
        }
        .endpoint {
            background: #e9ecef;
            padding: 0.5rem;
            margin: 0.5rem 0;
            border-radius: 3px;
            font-family: monospace;
        }
        .credentials {
            background: #fff3cd;
            color: #856404;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            border: 1px solid #ffeaa7;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 MikroTik Hotspot Management System</h1>
        <h2>Backend API Server</h2>
        
        <div class="status">
            ✅ Laravel Backend API is running successfully!
        </div>
        
        <div class="credentials">
            <h3>🔑 Default Admin Credentials:</h3>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin</p>
            <p><strong>Role:</strong> Super Administrator</p>
        </div>
        
        <div class="api-info">
            <h3>📡 Available API Endpoints:</h3>
            <div class="endpoint">POST /api/auth/login - Login</div>
            <div class="endpoint">GET /api/user - Get current user</div>
            <div class="endpoint">GET /api/settings - Get settings</div>
            <div class="endpoint">GET /api/admins - List admins</div>
            <div class="endpoint">GET /api/members - List members</div>
            <div class="endpoint">GET /api/social-users - List social users</div>
        </div>
        
        <p><strong>Frontend Application:</strong> <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
        <p><strong>API Base URL:</strong> <code>http://127.0.0.1:8000/api</code></p>
        
        <p style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
            Laravel {{ app()->version() }} | PHP {{ phpversion() }}
        </p>
    </div>
</body>
</html>
