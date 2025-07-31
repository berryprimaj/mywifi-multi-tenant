# 🌐 Deployment ke Hostinger Shared Hosting

Panduan lengkap untuk deploy MikroTik Hotspot Management System ke Hostinger Shared Hosting.

## 📋 Persyaratan

### Hostinger Requirements:
- ✅ **PHP 8.1+** (Laravel 11 requirement)
- ✅ **MySQL Database** (minimum 1 database)
- ✅ **Composer** (untuk dependencies)
- ✅ **SSL Certificate** (untuk HTTPS)
- ✅ **File Manager** atau **FTP Access**

### Yang Perlu Disiapkan:
- Domain/subdomain yang sudah pointing ke Hostinger
- Akses ke Hostinger hPanel
- File project yang sudah di-zip

## 🚀 Langkah-langkah Deployment

### Step 0: Clone Repository dari GitHub

#### 0.1 Clone Project
```bash
git clone https://github.com/berryprimaj/myhotspot.git
cd myhotspot
```

**✅ BACKEND SUDAH BERSIH DI GITHUB:**
- ❌ **vendor/** - Tidak di-commit (akan di-install via composer)
- ❌ **.env** - Tidak di-commit (akan dibuat manual)
- ❌ **storage/logs/** - Tidak di-commit (akan dibuat otomatis)
- ❌ **node_modules/** - Tidak di-commit (akan di-install via npm)
- ❌ **database.sqlite** - Tidak di-commit (akan dibuat via migration)
- ✅ **Source code** - Bersih dan production-ready

### Step 1: Persiapan File Project

#### 1.1 Install Dependencies Backend
```bash
cd backend
composer install --optimize-autoloader --no-dev
```

#### 1.2 Build Frontend React
```bash
cd ../frontend
npm install
npm run build
```

#### 1.3 Optimize Laravel untuk Production
```bash
cd ../backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 1.4 Compress Project
- Zip folder `backend/` menjadi `backend.zip`
- Zip folder `frontend/dist/` menjadi `frontend.zip`

### Step 2: Setup Database di Hostinger

#### 2.1 Buat Database MySQL
1. Login ke **Hostinger hPanel**
2. Pilih **Databases** → **MySQL Databases**
3. Klik **Create Database**
4. Isi detail:
   - **Database Name**: `u123456_mikrotik_db`
   - **Username**: `u123456_mikrotik_user`
   - **Password**: `[strong_password]`
5. Catat credentials untuk `.env`

#### 2.2 Import Database Structure
1. Buka **phpMyAdmin** dari hPanel
2. Pilih database yang baru dibuat
3. Import file SQL atau jalankan migrations

### Step 3: Upload Backend Laravel

#### 3.1 Upload via File Manager
1. Buka **File Manager** di hPanel
2. Navigate ke folder `public_html/`
3. Buat folder `api/` untuk backend
4. Upload dan extract `backend.zip` ke folder `api/`

#### 3.2 Setup Folder Structure
```
public_html/
├── api/                    # Laravel Backend
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   └── index.php
└── index.html             # Frontend (dari dist/)
```

#### 3.3 Konfigurasi .env
Buat file `public_html/api/.env` (karena tidak di-commit ke GitHub):
```env
APP_NAME="MikroTik Hotspot Management"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com/api

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# Database MySQL (Hostinger)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456_mikrotik_db
DB_USERNAME=u123456_mikrotik_user
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# CORS & Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# MikroTik Configuration (Optional)
MIKROTIK_HOST=192.168.1.1
MIKROTIK_PORT=8728
MIKROTIK_HTTP_PORT=80
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=

# Multi-tenant Configuration
TENANT_CACHE_TTL=3600
DEFAULT_TENANT_THEME=light
```

**🔑 Generate APP_KEY:**
```bash
php artisan key:generate --show
```
Copy output dan paste ke `APP_KEY=`

### Step 4: Setup Permissions & Folders

#### 4.1 Set Folder Permissions
Via File Manager, set permissions:
- `storage/` → **755**
- `storage/logs/` → **755**
- `storage/framework/` → **755**
- `storage/framework/cache/` → **755**
- `storage/framework/sessions/` → **755**
- `storage/framework/views/` → **755**
- `bootstrap/cache/` → **755**

#### 4.2 Create Required Directories
```bash
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p storage/app/public
```

### Step 5: Upload Frontend

#### 5.1 Upload Frontend Files
1. Extract `frontend.zip` 
2. Upload semua file dari `dist/` ke `public_html/`
3. Pastikan `index.html` ada di root `public_html/`

#### 5.2 Update Frontend Configuration
Edit `index.html` untuk API URL:
```html
<script>
window.API_BASE_URL = 'https://yourdomain.com/api';
</script>
```

### Step 6: Configure Web Server

#### 6.1 Create .htaccess for Laravel API
Buat file `public_html/api/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle Angular and Vue.js HTML5 mode
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
</IfModule>

# CORS Headers for API
<IfModule mod_headers.c>
    Header add Access-Control-Allow-Origin "https://yourdomain.com"
    Header add Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header add Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>
```

#### 6.2 Create .htaccess for Frontend
Buat file `public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # API Routes
    RewriteRule ^api/(.*)$ api/index.php [QSA,L]
    
    # Frontend SPA Routes
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteRule ^(.*)$ index.html [QSA,L]
</IfModule>
```

### Step 7: Database Migration & Seeding

#### 7.1 Via Terminal (jika tersedia)
```bash
cd public_html/api
php artisan migrate --force
php artisan db:seed --force
```

**✅ MIGRATIONS YANG AKAN DIJALANKAN:**
- `create_users_table` - User authentication
- `create_tenants_table` - Multi-tenant system
- `create_settings_table` - Application settings
- `create_members_table` - Member management
- `create_mikrotik_configs_table` - Router configurations
- `create_personal_access_tokens_table` - Sanctum authentication

**✅ SEEDERS YANG AKAN DIJALANKAN:**
- `UserSeeder` - Default admin user (admin/admin)
- `TenantSeeder` - Sample tenant data
- `SettingsSeeder` - Default application settings

#### 7.2 Via phpMyAdmin (alternatif)
1. Export database dari development
2. Import ke production database via phpMyAdmin

#### 7.3 Verify Database Setup
```bash
# Check tables created
php artisan tinker
>>> \DB::select('SHOW TABLES');

# Check default admin user
>>> \App\Models\User::first();
```

### Step 8: Testing & Verification

#### 8.1 Test Backend API
- Akses: `https://yourdomain.com/api`
- Should show Laravel welcome page

#### 8.2 Test API Endpoints
- Login: `POST https://yourdomain.com/api/auth/login`
- User: `GET https://yourdomain.com/api/user`

#### 8.3 Test Frontend
- Akses: `https://yourdomain.com`
- Should load React application

## 🔧 Troubleshooting

### Common Issues:

#### 1. 500 Internal Server Error
- Check `.env` configuration
- Verify database credentials
- Check folder permissions
- Review error logs in `storage/logs/`

#### 2. CORS Issues
- Update `CORS_ALLOWED_ORIGINS` in `.env`
- Check `.htaccess` CORS headers
- Verify `SANCTUM_STATEFUL_DOMAINS`

#### 3. Database Connection Error
- Verify database credentials
- Check database server status
- Ensure database exists

#### 4. File Permission Issues
```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

## 📊 Performance Optimization

### 1. Enable Caching
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Optimize Composer
```bash
composer install --optimize-autoloader --no-dev
```

### 3. Enable Gzip Compression
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## ✅ Verifikasi Backend Bersih di GitHub

**BACKEND REPOSITORY SUDAH PRODUCTION-READY:**

### 🚫 Files yang TIDAK di-commit (Aman):
- ❌ `backend/vendor/` - Dependencies (install via composer)
- ❌ `backend/.env` - Environment secrets (buat manual)
- ❌ `backend/storage/logs/` - Runtime logs (generated)
- ❌ `backend/node_modules/` - Node dependencies (install via npm)
- ❌ `backend/database.sqlite` - Development database (use MySQL)
- ❌ `backend/.phpunit.result.cache` - Test cache
- ❌ `backend/storage/framework/cache/` - Application cache
- ❌ `backend/storage/framework/sessions/` - Session files
- ❌ `backend/storage/framework/views/` - Compiled views

### ✅ Files yang DI-commit (Source Code):
- ✅ `backend/app/` - Application logic
- ✅ `backend/config/` - Configuration files
- ✅ `backend/database/migrations/` - Database structure
- ✅ `backend/database/seeders/` - Sample data
- ✅ `backend/routes/` - API routes
- ✅ `backend/composer.json` - Dependencies list
- ✅ `backend/.gitignore` - Laravel-specific ignores

**🎯 HASIL: Repository siap untuk production deployment!**

## 🔐 Security Checklist

- ✅ Set `APP_DEBUG=false`
- ✅ Use strong database passwords
- ✅ Enable SSL certificate
- ✅ Set proper file permissions
- ✅ Configure CORS properly
- ✅ Hide sensitive files with `.htaccess`
- ✅ Regular backup database
- ✅ No sensitive data in repository
- ✅ Environment variables properly configured

## 🎯 Final URLs

- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://yourdomain.com/api`
- **Admin Login**: `https://yourdomain.com/admin`

**🎉 Deployment ke Hostinger Shared Hosting selesai!**
