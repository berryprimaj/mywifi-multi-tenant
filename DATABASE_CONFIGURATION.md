# 🗄️ Database Configuration Guide

Panduan konfigurasi database untuk berbagai environment deployment.

## 📋 Database Requirements per Platform

### 🌐 **Shared Hosting (Hostinger, cPanel, dll)**
- ✅ **Database**: MySQL (WAJIB)
- ❌ **SQLite**: Tidak didukung
- 🔧 **File .env**: Gunakan `.env.production`

### 🖥️ **VPS/Dedicated Server**
- ✅ **Database**: MySQL atau SQLite
- ✅ **Fleksibel**: Bisa pilih sesuai kebutuhan
- 🔧 **File .env**: Custom sesuai setup

### 💻 **Development Local**
- ✅ **Database**: SQLite (recommended)
- ✅ **Simple**: Tidak perlu setup MySQL
- 🔧 **File .env**: Gunakan `.env` default

## 🔧 File .env Configuration

### **Development (.env)**
```env
# SQLite untuk development
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# CORS untuk frontend local
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
```

### **Production (.env.production)**
```env
# MySQL untuk shared hosting
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456_mikrotik_db
DB_USERNAME=u123456_mikrotik_user
DB_PASSWORD=your_database_password

# CORS untuk domain production
CORS_ALLOWED_ORIGINS=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

## 🚀 Setup Instructions

### **1. Development Setup (SQLite)**
```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### **2. Production Setup (MySQL)**
```bash
# Upload files ke hosting
# Copy .env.production ke .env
cp .env.production .env

# Edit .env dengan database credentials dari hosting
nano .env

# Run migrations
php artisan migrate:fresh --seed
```

### **3. Hostinger Specific Setup**
1. **Buat Database MySQL** di hPanel
2. **Catat credentials**: database name, username, password
3. **Edit .env**:
   ```env
   DB_DATABASE=u123456_mikrotik_db
   DB_USERNAME=u123456_mikrotik_user
   DB_PASSWORD=your_password_from_hostinger
   ```
4. **Upload & migrate**

## ⚠️ Important Notes

### **Shared Hosting Limitations:**
- ❌ **No SQLite support** - File permission issues
- ✅ **MySQL only** - Provided by hosting
- ⚠️ **Limited CLI access** - Use web-based tools

### **Database Migration:**
- **Development → Production**: Export SQLite → Import to MySQL
- **Use phpMyAdmin** untuk import di shared hosting
- **Backup regularly** di production

### **File Locations:**
- ✅ **Correct**: `backend/.env` (Laravel location)
- ❌ **Wrong**: Root `.env` (removed)
- 📁 **Templates**: `backend/.env.production`

## 🔄 Migration Between Databases

### **SQLite → MySQL (Development → Production)**
```bash
# Export data dari SQLite
php artisan db:seed --class=ProductionSeeder

# Atau manual export via phpMyAdmin
# Import ke MySQL database di hosting
```

### **MySQL → SQLite (Production → Development)**
```bash
# Backup production data
mysqldump -u username -p database_name > backup.sql

# Import ke development (if needed)
# Usually not required for development
```

## 🎯 Quick Reference

| Environment | Database | File | CORS Origin |
|-------------|----------|------|-------------|
| **Development** | SQLite | `.env` | `localhost:5173` |
| **Shared Hosting** | MySQL | `.env.production` | `yourdomain.com` |
| **VPS** | MySQL/SQLite | Custom | Custom domain |

## ✅ Verification

### **Check Database Connection:**
```bash
php artisan tinker
DB::connection()->getPdo();
```

### **Check Migrations:**
```bash
php artisan migrate:status
```

### **Test API:**
```bash
curl http://yourdomain.com/api/tenants
```

**🎉 Database configuration sekarang sudah jelas dan terorganisir!**
