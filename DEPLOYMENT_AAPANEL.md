# 🖥️ Deployment ke aaPanel VPS

Panduan lengkap untuk deploy MikroTik Hotspot Management System ke VPS dengan aaPanel.

## 📋 Persyaratan

### VPS Requirements:
- ✅ **Ubuntu 20.04+** atau **CentOS 7+**
- ✅ **RAM minimum 1GB** (recommended 2GB+)
- ✅ **Storage 20GB+**
- ✅ **Root access**

### Software Stack:
- ✅ **aaPanel** (Web control panel)
- ✅ **Nginx** (Web server)
- ✅ **PHP 8.1+** (Laravel requirement)
- ✅ **MySQL 8.0+** (Database)
- ✅ **Node.js 18+** (untuk build frontend)
- ✅ **Composer** (PHP dependency manager)

## 🚀 Langkah-langkah Deployment

### Step 1: Install aaPanel

#### 1.1 Connect ke VPS
```bash
ssh root@your-vps-ip
```

#### 1.2 Install aaPanel
```bash
# Ubuntu/Debian
wget -O install.sh http://www.aapanel.com/script/install-ubuntu_6.0_en.sh && sudo bash install.sh aapanel

# CentOS
yum install -y wget && wget -O install.sh http://www.aapanel.com/script/install_6.0_en.sh && bash install.sh aapanel
```

#### 1.3 Setup aaPanel
1. Catat URL, username, dan password yang muncul
2. Akses aaPanel via browser: `http://your-vps-ip:8888`
3. Login dengan credentials yang diberikan

### Step 2: Install Software Stack

#### 2.1 Install LNMP Stack
Di aaPanel Dashboard:
1. **App Store** → **Runtime Environment**
2. Install:
   - **Nginx 1.22+**
   - **MySQL 8.0+**
   - **PHP 8.1** (dengan extensions: mysqli, pdo_mysql, openssl, mbstring, tokenizer, xml, ctype, json, bcmath, fileinfo, zip)
   - **phpMyAdmin** (untuk database management)

#### 2.2 Install Node.js
```bash
# Via aaPanel Terminal atau SSH
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2.3 Install Composer
```bash
# Download dan install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# Verify installation
composer --version
```

### Step 3: Setup Database

#### 3.1 Create Database via aaPanel
1. **Database** → **Add Database**
2. Database info:
   - **Database Name**: `mikrotik_hotspot`
   - **Username**: `mikrotik_user`
   - **Password**: `[strong_password]`
3. Catat credentials untuk `.env`

#### 3.2 Configure MySQL (Optional)
```sql
-- Optimize MySQL for Laravel
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
```

### Step 4: Setup Domain & SSL

#### 4.1 Add Website
1. **Website** → **Add Site**
2. Domain: `yourdomain.com`
3. Document Root: `/www/wwwroot/yourdomain.com`
4. PHP Version: **8.1**

#### 4.2 Setup SSL Certificate
1. **Website** → **yourdomain.com** → **SSL**
2. Pilih **Let's Encrypt** (gratis)
3. Apply SSL certificate
4. Enable **Force HTTPS**

### Step 5: Deploy Backend Laravel

#### 5.1 Upload Project Files
```bash
# Via SSH atau aaPanel File Manager
cd /www/wwwroot/yourdomain.com

# Clone atau upload project
git clone https://github.com/your-repo/mikrotik-hotspot.git .
# atau upload via File Manager

# Set proper ownership
chown -R www:www /www/wwwroot/yourdomain.com
```

#### 5.2 Install Backend Dependencies
```bash
cd /www/wwwroot/yourdomain.com/backend
composer install --optimize-autoloader --no-dev
```

#### 5.3 Configure Environment
```bash
# Copy dan edit .env
cp .env.example .env
nano .env
```

Edit `.env` file:
```env
APP_NAME="MikroTik Hotspot Management"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=mikrotik_hotspot
DB_USERNAME=mikrotik_user
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

# MikroTik Configuration
MIKROTIK_HOST=192.168.1.1
MIKROTIK_PORT=8728
MIKROTIK_HTTP_PORT=80
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=
```

#### 5.4 Generate Application Key
```bash
php artisan key:generate
```

#### 5.5 Set Permissions
```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chown -R www:www storage/
chown -R www:www bootstrap/cache/
```

#### 5.6 Run Migrations & Seeders
```bash
php artisan migrate --force
php artisan db:seed --force
```

#### 5.7 Optimize Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 6: Deploy Frontend React

#### 6.1 Build Frontend
```bash
cd /www/wwwroot/yourdomain.com/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

#### 6.2 Setup Frontend Files
```bash
# Copy built files to web root
cp -r dist/* /www/wwwroot/yourdomain.com/public/

# Update API base URL in built files
sed -i 's|http://localhost:8000|https://yourdomain.com|g' /www/wwwroot/yourdomain.com/public/assets/*.js
```

### Step 7: Configure Nginx

#### 7.1 Setup Nginx Configuration
Di aaPanel: **Website** → **yourdomain.com** → **Config**

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    root /www/wwwroot/yourdomain.com/public;
    index index.html index.php;
    
    # SSL Configuration (auto-generated by aaPanel)
    ssl_certificate /www/server/panel/vhost/cert/yourdomain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/yourdomain.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # API Routes
    location /api {
        alias /www/wwwroot/yourdomain.com/backend/public;
        try_files $uri $uri/ @api;
        
        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/tmp/php-cgi-81.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }
    
    location @api {
        rewrite /api/(.*)$ /api/index.php?/$1 last;
    }
    
    # Frontend SPA Routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security
    location ~ /\.ht {
        deny all;
    }
    
    location ~ /\.env {
        deny all;
    }
}
```

#### 7.2 Test Nginx Configuration
```bash
nginx -t
systemctl reload nginx
```

### Step 8: Setup Process Management (Optional)

#### 8.1 Install Supervisor
```bash
apt-get install supervisor
```

#### 8.2 Configure Queue Worker
Create `/etc/supervisor/conf.d/laravel-worker.conf`:
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /www/wwwroot/yourdomain.com/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www
numprocs=1
redirect_stderr=true
stdout_logfile=/www/wwwroot/yourdomain.com/backend/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
supervisorctl reread
supervisorctl update
supervisorctl start laravel-worker:*
```

### Step 9: Setup Monitoring & Backup

#### 9.1 Setup Log Rotation
```bash
# Create logrotate config
cat > /etc/logrotate.d/laravel << EOF
/www/wwwroot/yourdomain.com/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 www www
}
EOF
```

#### 9.2 Setup Database Backup
```bash
# Create backup script
cat > /root/backup-db.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u mikrotik_user -p'your_password' mikrotik_hotspot > /root/backups/db_backup_$DATE.sql
find /root/backups -name "db_backup_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-db.sh

# Add to crontab
echo "0 2 * * * /root/backup-db.sh" | crontab -
```

### Step 10: Testing & Verification

#### 10.1 Test Backend API
```bash
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

#### 10.2 Test Frontend
- Akses: `https://yourdomain.com`
- Should load React application

#### 10.3 Monitor Logs
```bash
# Laravel logs
tail -f /www/wwwroot/yourdomain.com/backend/storage/logs/laravel.log

# Nginx logs
tail -f /www/wwwlogs/yourdomain.com.log
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. PHP Extensions Missing
```bash
# Install required PHP extensions
apt-get install php8.1-mysql php8.1-mbstring php8.1-xml php8.1-zip php8.1-bcmath php8.1-curl
```

#### 2. Permission Issues
```bash
chown -R www:www /www/wwwroot/yourdomain.com
chmod -R 755 /www/wwwroot/yourdomain.com/backend/storage
```

#### 3. Database Connection Issues
- Check MySQL service: `systemctl status mysql`
- Verify credentials in `.env`
- Test connection: `mysql -u mikrotik_user -p`

## 📊 Performance Optimization

### 1. Enable OPcache
Edit `/www/server/php/81/etc/php.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### 2. Configure Redis (Optional)
```bash
# Install Redis
apt-get install redis-server

# Update .env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 3. Enable Gzip Compression
Add to Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## 🔐 Security Hardening

### 1. Firewall Configuration
```bash
# Install UFW
apt-get install ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 8888  # aaPanel
ufw enable
```

### 2. Fail2Ban
```bash
# Install Fail2Ban
apt-get install fail2ban

# Configure for Nginx
cat > /etc/fail2ban/jail.local << EOF
[nginx-http-auth]
enabled = true
port = http,https
logpath = /www/wwwlogs/*.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /www/wwwlogs/*.log
maxretry = 10
EOF

systemctl restart fail2ban
```

## 🎯 Final URLs

- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://yourdomain.com/api`
- **aaPanel**: `https://yourdomain.com:8888`
- **phpMyAdmin**: `https://yourdomain.com/phpmyadmin`

**🎉 Deployment ke aaPanel VPS selesai!**
