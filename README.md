# 🚀 MikroTik Hotspot Management System

Sistem manajemen hotspot MikroTik dengan arsitektur modern menggunakan Laravel backend dan React frontend.

## 📁 Struktur Proyek

```
mywifi/
├── backend/                    # Laravel Backend API
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   ├── Services/          # Business Logic Services
│   │   ├── Exports/           # Excel Export Classes
│   │   ├── Imports/           # Excel Import Classes
│   │   └── Exceptions/        # Custom Exception Handlers
│   ├── config/                # Laravel Configuration
│   ├── database/              # Migrations & Seeders
│   ├── routes/                # API Routes
│   ├── storage/               # File Storage & Logs
│   └── .env                   # Environment Configuration
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React Components
│   │   ├── pages/            # Page Components
│   │   ├── contexts/         # React Contexts
│   │   ├── types/            # TypeScript Types
│   │   └── integrations/     # External Integrations
│   ├── public/               # Static Assets
│   ├── package.json          # Frontend Dependencies
│   └── vite.config.ts        # Vite Configuration
│
└── docs/                      # Documentation Files
    ├── ARSITEKTUR_APLIKASI.md
    ├── LARAVEL_BACKEND_GUIDE.md
    └── API_CONFIGURATION_GUIDE.md
```

## 🚀 Quick Start

### Backend (Laravel)
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

### Frontend (React)
```bash
cd frontend
npm run dev
```

## 🔗 Access URLs

- **Backend API**: http://127.0.0.1:8000
- **Frontend App**: http://localhost:5173
- **API Documentation**: http://127.0.0.1:8000/api

## 🔑 Default Credentials

- **Username**: admin
- **Password**: admin
- **Role**: Super Administrator

## ✨ Features

### 🔧 Backend Features
- ✅ RESTful API dengan Laravel
- ✅ Authentication dengan Sanctum
- ✅ Real MikroTik Integration
- ✅ Advanced Analytics
- ✅ Excel Import/Export
- ✅ Enhanced Security (Rate Limiting, Audit Logs)
- ✅ File Upload Management
- ✅ Multi-tenant Support

### 🎨 Frontend Features
- ✅ Modern React dengan TypeScript
- ✅ Responsive Design dengan Tailwind CSS
- ✅ Real-time Dashboard
- ✅ Admin Panel
- ✅ Hotspot Login Portal
- ✅ Charts & Analytics Visualization

## 📊 Tech Stack

### Backend
- **Framework**: Laravel 11
- **Database**: SQLite
- **Authentication**: Laravel Sanctum
- **Excel**: Maatwebsite/Excel
- **HTTP Client**: Guzzle

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🛡️ Security Features

- Rate Limiting
- Audit Logging
- Password Strength Validation
- Suspicious Activity Detection
- Account Locking
- CORS Protection

## 📈 Analytics Features

- Real-time Statistics
- User Growth Charts
- Bandwidth Usage Monitoring
- Device Type Distribution
- Peak Hours Analysis
- Revenue Tracking

## 🔧 MikroTik Integration

- Router Status Monitoring
- Network Interface Management
- Hotspot Profile Configuration
- Backup & Restore
- Connection Testing

## 📁 Import/Export

- Excel Member Import
- CSV Template Download
- Bulk Data Export
- Data Validation

## 🚀 Production Ready

Aplikasi ini sudah siap untuk deployment production dengan fitur enterprise-level!
