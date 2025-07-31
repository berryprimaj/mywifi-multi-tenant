# 🏗️ Arsitektur Aplikasi - Pembagian Peran

## � Struktur Proyek Terbaru

```
mywifi/
├── backend/                    # �🔧 Laravel Backend API
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers (13 controllers)
│   │   ├── Models/            # Eloquent Models (9 models)
│   │   ├── Services/          # Business Logic Services (3 services)
│   │   ├── Exports/           # Excel Export Classes
│   │   ├── Imports/           # Excel Import Classes
│   │   ├── Exceptions/        # Custom Exception Handlers
│   │   └── Http/Requests/     # Form Validation Classes
│   ├── config/                # Laravel Configuration
│   ├── database/              # Migrations & Seeders
│   ├── routes/api.php         # API Routes (87 endpoints)
│   ├── storage/               # File Storage & Logs
│   └── .env                   # Environment Configuration
│
├── frontend/                   # 🎨 React Frontend
│   ├── src/
│   │   ├── components/        # React Components
│   │   ├── pages/            # Page Components
│   │   ├── contexts/         # React Contexts
│   │   ├── types/            # TypeScript Types
│   │   └── integrations/     # External Integrations
│   ├── package.json          # Frontend Dependencies
│   └── vite.config.ts        # Vite Configuration
│
└── docs/                      # 📚 Documentation
    ├── ARSITEKTUR_APLIKASI.md
    ├── LARAVEL_BACKEND_GUIDE.md
    ├── API_CONFIGURATION_GUIDE.md
    └── README.md
```

## 🔧 Backend Laravel (Port 8000)
**Fungsi**: Server API & Database Management

### Yang Dilakukan Backend:
- **📊 Database Operations**: CRUD untuk semua data (users, members, settings, dll)
- **🔐 Authentication**: Login/logout, token management (Laravel Sanctum)
- **📡 API Endpoints**: 87 RESTful endpoints dalam format JSON
- **🔧 MikroTik Integration**: Real HTTP REST API komunikasi dengan router
- **📈 Analytics Processing**: Real-time statistics & dashboard analytics
- **🛡️ Enhanced Security**: Rate limiting, audit logs, password validation
- **📁 File Management**: Upload/download files, Excel import/export
- **⚡ Business Logic**: Semua logika bisnis aplikasi
- **🏢 Multi-tenant Support**: Isolasi data per tenant
- **📊 Real-time Monitoring**: Live bandwidth & user tracking

### Advanced Features Backend:
- **🔧 Real MikroTik API**: HTTP client untuk RouterOS
- **📊 Analytics Service**: Comprehensive dashboard analytics
- **🔐 Security Service**: Audit logging & suspicious activity detection
- **📁 Excel Service**: Import/export dengan validation
- **⚡ Caching**: 5-menit cache untuk performance

### Yang TIDAK Dilakukan Backend:
- ❌ Tidak menampilkan UI/interface
- ❌ Tidak ada halaman web untuk user
- ❌ Hanya menyediakan data via API

---

## 🎨 Frontend React (Port 5173)
**Fungsi**: User Interface & User Experience

### Yang Dilakukan Frontend:
- **🖥️ User Interface**: Modern React dengan TypeScript
- **📱 Responsive Design**: Tailwind CSS untuk semua device
- **🎯 User Interaction**: Form, button, navigation yang intuitif
- **📊 Data Visualization**: Charts dengan Recharts library
- **🔄 State Management**: React Context untuk global state
- **📡 API Calls**: Axios/Fetch untuk komunikasi dengan backend
- **🎨 Styling**: Tailwind CSS dengan custom components
- **🔔 Notifications**: React Hot Toast untuk user feedback
- **🚀 Performance**: Vite untuk fast development & build

### Advanced Features Frontend:
- **📊 Real-time Dashboard**: Live analytics & monitoring
- **🎨 Modern UI Components**: Reusable component library
- **🔐 Protected Routes**: Authentication-based navigation
- **📱 Mobile Responsive**: Optimal di semua screen size
- **⚡ Fast Loading**: Optimized bundle dengan Vite

### Yang TIDAK Dilakukan Frontend:
- ❌ Tidak menyimpan data permanen
- ❌ Tidak ada koneksi langsung ke database
- ❌ Tidak ada business logic kompleks

---

## 🔄 Alur Komunikasi

```
User → Frontend React → Backend Laravel → Database
                    ↓
                MikroTik Router
```

### Contoh Skenario Login:
1. **User login** di Frontend React
2. Frontend **kirim request** ke Backend Laravel `/api/auth/login`
3. Backend **cek database**, **generate token**
4. Backend **kirim response** dengan token ke Frontend
5. Frontend **simpan token**, **redirect** ke dashboard

### Contoh Skenario Analytics:
1. **User buka dashboard** di Frontend React
2. Frontend **request analytics** ke `/api/analytics/dashboard`
3. Backend **query database**, **hitung statistik**, **apply caching**
4. Backend **return JSON data** dengan charts & metrics
5. Frontend **render charts** menggunakan Recharts

### Contoh Skenario MikroTik:
1. **User test koneksi** di Frontend React
2. Frontend **POST request** ke `/api/mikrotik/test-connection`
3. Backend **ambil settings**, **connect ke MikroTik router**
4. Backend **return status** koneksi dan info router
5. Frontend **tampilkan hasil** test koneksi

---

## 🎯 Analogi Sederhana

### Backend Laravel = Dapur Restoran + Manager
- **Memasak makanan** (process data)
- **Menyimpan bahan** (database)
- **Mengelola supplier** (MikroTik integration)
- **Analisis penjualan** (analytics)
- **Keamanan restoran** (security features)
- **Tidak terlihat customer**

### Frontend React = Pelayan & Meja Makan + Kasir
- **Menampilkan menu** (UI components)
- **Mengambil pesanan** (user input)
- **Menyajikan makanan** (display data)
- **Menampilkan grafik penjualan** (charts)
- **Interface pembayaran** (forms)

---

## 📊 Traffic & Data Flow

### Backend menangani:
- **Database queries** (SQLite dengan 9 models)
- **API traffic** (87 RESTful endpoints)
- **File uploads/downloads** (Excel import/export)
- **MikroTik communication** (HTTP REST API)
- **Analytics processing** (real-time calculations)
- **Security monitoring** (audit logs, rate limiting)
- **Caching** (5-menit cache untuk performance)

### Frontend menangani:
- **User interactions** (forms, buttons, navigation)
- **Page rendering** (React components dengan TypeScript)
- **Form submissions** (dengan validation feedback)
- **Data visualization** (Recharts untuk charts)
- **Navigation** (React Router dengan protected routes)
- **State management** (React Context)
- **Real-time updates** (polling untuk live data)

---

## 🚀 Teknologi Stack

### Backend Technologies:
- **Framework**: Laravel 11
- **Database**: SQLite
- **Authentication**: Laravel Sanctum
- **Excel**: Maatwebsite/Excel
- **HTTP Client**: Guzzle (untuk MikroTik)
- **Caching**: File-based cache

### Frontend Technologies:
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

---

## 🎯 Cara Menjalankan

### Backend (Terminal 1):
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

### Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

### Access URLs:
- **Backend API**: http://127.0.0.1:8000
- **Frontend App**: http://localhost:5173

---

## 🚀 Kesimpulan

**Backend Laravel** fokus pada **data, logic & integrations**
**Frontend React** fokus pada **tampilan, UX & visualizations**

Keduanya bekerja sama melalui **87 API endpoints** untuk menciptakan aplikasi enterprise-level yang lengkap dan powerful!

**🎉 Aplikasi ini sekarang production-ready dengan fitur advanced!** 👍
