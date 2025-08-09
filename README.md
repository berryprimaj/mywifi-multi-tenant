# MyWiFi Multi-Tenant Hotspot Management System

Sistem manajemen hotspot MikroTik multi-tenant yang lengkap dengan backend Laravel dan frontend React.

## 🚀 Fitur Utama

### 🔐 Multi-Tenant System
- Isolasi data per tenant
- Manajemen pengguna dan role per tenant
- Konfigurasi MikroTik terpisah per tenant

### 📱 Fonnte WhatsApp API Integration
- Verifikasi OTP via WhatsApp
- Konfigurasi OTP yang fleksibel (expiry, length, template)
- Multi-tenant OTP settings

### 🌐 MikroTik Integration
- **Host (IP Publik / DDNS)**: Support IP public dan DDNS otomatis
- Auto-resolve DDNS ke IP address
- Test koneksi real-time
- Monitoring status router
- Backup dan restore konfigurasi

### 🎨 Modern UI/UX
- Dark/Light theme
- Responsive design
- Real-time notifications
- Interactive dashboard

## 🏗️ Arsitektur

```
mywifi/
├── backend/                 # Laravel API Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Exceptions/
│   ├── database/
│   └── routes/
├── frontend/                # React TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   └── public/
└── docs/                    # Dokumentasi
```

## 🛠️ Tech Stack

### Backend
- **Laravel 10** - PHP Framework
- **SQLite** - Database (development)
- **MySQL** - Database (production)
- **Laravel Sanctum** - Authentication
- **MikroTik API** - Router integration

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📋 Prerequisites

- PHP 8.1+
- Node.js 18+
- Composer
- MikroTik Router dengan API enabled
- **MySQL 5.7+** (untuk production)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/berryprimaj/mywifi-multi-tenant.git
cd mywifi-multi-tenant
```

### 2. Backend Setup

#### Development (SQLite)
```bash
cd backend
composer install
cp .env.example .env
# Edit .env: DB_CONNECTION=sqlite
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

#### Production (MySQL)
```bash
cd backend
composer install
cp .env.example .env
# Edit .env: DB_CONNECTION=mysql dan konfigurasi MySQL
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

## ⚙️ Konfigurasi

### Environment Variables

#### Development (SQLite)
```env
# Backend (.env)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

#### Production (MySQL)
```env
# Backend (.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mywifi_production
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

### Database Setup

#### SQLite (Development)
- Otomatis dibuat saat `php artisan migrate`
- File: `backend/database/database.sqlite`

#### MySQL (Production)
```sql
CREATE DATABASE mywifi_production;
CREATE USER 'mywifi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mywifi_production.* TO 'mywifi_user'@'localhost';
FLUSH PRIVILEGES;
```

### MikroTik Configuration
1. Enable API di MikroTik
2. Set API port (default: 8728)
3. Buat user dengan permission API
4. Konfigurasi firewall untuk allow API access

## 🔧 Fitur Host (IP Publik / DDNS)

Sistem secara otomatis mendeteksi dan resolve:

### IP Public
```
Host: 203.194.112.34
→ Langsung gunakan IP
```

### DDNS
```
Host: mikrotik.ddns.net
→ Auto-resolve ke IP address
→ Test DDNS untuk verifikasi
```

## 📱 Fonnte WhatsApp OTP

### Konfigurasi OTP
- **Toggle Enable/Disable** OTP verification
- **OTP Expiry**: Durasi masa berlaku (detik)
- **OTP Length**: Panjang kode OTP
- **Message Template**: Template pesan dengan variables `{otp}`, `{expiry}`, `{site_name}`

### Multi-Tenant
- Setiap tenant memiliki konfigurasi OTP terpisah
- API key dan device ID per tenant
- Phone number untuk WhatsApp

## 🚀 Deployment

### Production Checklist
- [ ] Set environment variables
- [ ] Configure MySQL database
- [ ] Set up web server (Nginx/Apache)
- [ ] Configure SSL certificates
- [ ] Set up backup system
- [ ] Configure logging

### Database Migration
```bash
# Backup SQLite (jika ada)
cp backend/database/database.sqlite backend/database/backup.sqlite

# Setup MySQL
# Edit .env dengan konfigurasi MySQL
php artisan migrate:fresh --seed
```

### Hosting Platforms
- **Aapanel**: [DEPLOYMENT_AAPANEL.md](DEPLOYMENT_AAPANEL.md)
- **Hostinger**: [DEPLOYMENT_HOSTINGER.md](DEPLOYMENT_HOSTINGER.md)

## 📚 Dokumentasi

- [Arsitektur Aplikasi](ARSITEKTUR_APLIKASI.md)
- [Konfigurasi Environment](ENVIRONMENT_CONFIGURATION.md)
- [Konfigurasi Database](DATABASE_CONFIGURATION.md)
- [Konfigurasi API](API_CONFIGURATION_GUIDE.md)
- [Konfigurasi Tenant Login](TENANT_LOGIN_PAGE_CONFIG.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Untuk bantuan dan pertanyaan:
- Buat issue di GitHub
- Dokumentasi lengkap tersedia di folder `docs/`

## 🔄 Changelog

### v1.0.0
- ✅ Multi-tenant system
- ✅ Fonnte WhatsApp API integration
- ✅ MikroTik DDNS auto-resolution
- ✅ Modern React UI
- ✅ Laravel backend API
- ✅ OTP verification system
- ✅ Real-time notifications
- ✅ Dark/Light theme
- ✅ Responsive design
- ✅ SQLite (development) & MySQL (production) support

---

**MyWiFi Multi-Tenant** - Solusi lengkap untuk manajemen hotspot MikroTik multi-tenant 🚀
