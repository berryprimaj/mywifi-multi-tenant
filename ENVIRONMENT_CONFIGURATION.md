# 🔧 Environment Configuration Guide

Panduan lengkap konfigurasi environment variables untuk MikroTik Hotspot Management System.

## 📋 Overview

Sistem ini menggunakan environment variables untuk konfigurasi yang berbeda antara development, staging, dan production. File `.env` berisi konfigurasi sensitif yang tidak boleh di-commit ke repository.

## 🏗️ Environment Structure

```
myhotspot/
├── backend/
│   ├── .env                    # Laravel environment (TIDAK di-commit)
│   ├── .env.example           # Template environment
│   └── .env.production        # Production template (optional)
├── frontend/
│   ├── .env                    # Vite environment (TIDAK di-commit)
│   ├── .env.local             # Local overrides
│   ├── .env.development       # Development config
│   └── .env.production        # Production config
```

## 🔙 Backend Environment (.env)

### 📁 Location: `backend/.env`

### 🔑 Basic Configuration
```env
# Application
APP_NAME="MikroTik Hotspot Management System"
APP_ENV=local
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

# Timezone
APP_TIMEZONE=Asia/Jakarta
```

### 🗄️ Database Configuration

#### Development (SQLite)
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

#### Production (MySQL - Hostinger)
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456_mikrotik_db
DB_USERNAME=u123456_mikrotik_user
DB_PASSWORD=your_strong_password_here
```

#### Production (MySQL - cPanel)
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cpanel_username_dbname
DB_USERNAME=cpanel_username_dbuser
DB_PASSWORD=your_database_password
```

### 🔐 Authentication & Security
```env
# Laravel Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,yourdomain.com
SESSION_DOMAIN=localhost

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

# Session Configuration
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_SAME_SITE=lax
```

### 📧 Mail Configuration
```env
# SMTP Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 🌐 MikroTik Configuration
```env
# Default MikroTik Settings
MIKROTIK_HOST=192.168.1.1
MIKROTIK_PORT=8728
MIKROTIK_HTTP_PORT=80
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=
MIKROTIK_TIMEOUT=30

# MikroTik API Settings
MIKROTIK_SSL=false
MIKROTIK_LEGACY=false
```

### 🏢 Multi-Tenant Configuration
```env
# Tenant Settings
TENANT_CACHE_TTL=3600
DEFAULT_TENANT_THEME=light
TENANT_LOGO_PATH=storage/tenant-logos
TENANT_MAX_USERS=1000

# Tenant Database Isolation
TENANT_DB_PREFIX=tenant_
TENANT_STRICT_MODE=true
```

### 📊 Cache & Queue Configuration
```env
# Cache
CACHE_DRIVER=file
CACHE_PREFIX=mikrotik_hotspot

# Queue
QUEUE_CONNECTION=sync
QUEUE_FAILED_DRIVER=database-uuids

# Redis (Optional)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 📝 Logging Configuration
```env
# Logging
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Custom Log Channels
LOG_MIKROTIK_CHANNEL=daily
LOG_TENANT_CHANNEL=daily
LOG_AUTH_CHANNEL=daily
```

## 🎨 Frontend Environment (.env)

### 📁 Location: `frontend/.env`

### 🔗 API Configuration
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173

# Application Info
VITE_APP_NAME="MikroTik Hotspot Management"
VITE_APP_VERSION=1.0.0
```

### 🌐 External Services
```env
# Social Login
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_WHATSAPP_BUSINESS_ID=your-whatsapp-business-id

# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_HOTJAR_ID=your-hotjar-id
```

### 🎯 Feature Flags
```env
# Feature Toggles
VITE_ENABLE_SOCIAL_LOGIN=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_MULTI_TENANT=true
VITE_ENABLE_MIKROTIK_INTEGRATION=true
```

### 🔧 Development Settings
```env
# Development
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
VITE_SHOW_DEV_TOOLS=true
```

## 🌍 Environment-Specific Configurations

### 🏠 Development Environment

#### Backend (.env)
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

LOG_LEVEL=debug
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

#### Frontend (.env.development)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
```

### 🧪 Staging Environment

#### Backend (.env.staging)
```env
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=staging-db-host
DB_DATABASE=staging_mikrotik_db

LOG_LEVEL=info
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 🚀 Production Environment

#### Backend (.env.production)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=production_mikrotik_db

LOG_LEVEL=error
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# Security
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_DEBUG_MODE=false
VITE_MOCK_API=false
VITE_SHOW_DEV_TOOLS=false
```

## 🔐 Security Best Practices

### ✅ DO's
- ✅ Use strong, unique passwords
- ✅ Generate new APP_KEY for each environment
- ✅ Use environment-specific database credentials
- ✅ Enable HTTPS in production
- ✅ Set APP_DEBUG=false in production
- ✅ Use secure session cookies in production
- ✅ Regularly rotate API keys and passwords

### ❌ DON'Ts
- ❌ Never commit .env files to repository
- ❌ Don't use default passwords
- ❌ Don't share production credentials
- ❌ Don't use development settings in production
- ❌ Don't expose debug information in production

## 🛠️ Setup Commands

### Generate Application Key
```bash
cd backend
php artisan key:generate
```

### Create Environment File
```bash
# Copy example file
cp .env.example .env

# Edit with your settings
nano .env
```

### Verify Configuration
```bash
# Check configuration
php artisan config:show

# Test database connection
php artisan migrate:status

# Clear configuration cache
php artisan config:clear
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
SQLSTATE[HY000] [1045] Access denied
```
**Solution**: Check DB_* credentials in .env

#### 2. APP_KEY Missing
```
No application encryption key has been specified
```
**Solution**: Run `php artisan key:generate`

#### 3. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Update CORS_ALLOWED_ORIGINS in .env

#### 4. Session Issues
```
Session store not set on request
```
**Solution**: Check SESSION_* configuration

## 📚 References

- [Laravel Environment Configuration](https://laravel.com/docs/configuration)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Laravel Sanctum Configuration](https://laravel.com/docs/sanctum)
- [CORS Configuration](https://laravel.com/docs/routing#cors)

---

**🔧 Environment configuration is crucial for proper application deployment and security!**
