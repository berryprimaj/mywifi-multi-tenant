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

### Step 1: Persiapan File Project

#### 1.1 Build Frontend React
```bash
cd frontend
npm run build
```

#### 1.2 Siapkan Backend Laravel
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 1.3 Compress Project
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
Edit file `public_html/api/.env`:
```env
APP_NAME="MikroTik Hotspot Management"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com/api

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

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

SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# MikroTik Configuration (Optional)
MIKROTIK_HOST=192.168.1.1
MIKROTIK_PORT=8728
MIKROTIK_HTTP_PORT=80
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=
```

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

#### 7.2 Via phpMyAdmin (alternatif)
1. Export database dari development
2. Import ke production database via phpMyAdmin

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

## 🔐 Security Checklist

- ✅ Set `APP_DEBUG=false`
- ✅ Use strong database passwords
- ✅ Enable SSL certificate
- ✅ Set proper file permissions
- ✅ Configure CORS properly
- ✅ Hide sensitive files with `.htaccess`
- ✅ Regular backup database

## 🎯 Final URLs

- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://yourdomain.com/api`
- **Admin Login**: `https://yourdomain.com/admin`

**🎉 Deployment ke Hostinger Shared Hosting selesai!**
