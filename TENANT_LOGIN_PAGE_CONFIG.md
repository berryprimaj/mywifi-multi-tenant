# Panduan Konfigurasi Halaman Login Hotspot per Tenant

Dokumen ini menjelaskan bagaimana Anda dapat menyesuaikan tampilan dan branding halaman login hotspot untuk setiap tenant yang Anda kelola dalam sistem.

## Konsep Multi-Tenant untuk Halaman Login

Aplikasi ini dirancang untuk mendukung multi-tenant, yang berarti setiap "hotspot" atau lokasi dapat memiliki pengaturan halaman login yang unik (nama situs, logo, warna, pesan selamat datang). Ini dicapai dengan mengidentifikasi tenant melalui parameter URL.

### Bagaimana Cara Kerjanya?

1.  **Identifikasi Tenant via URL**: Ketika pengguna terhubung ke hotspot, router MikroTik (secara konseptual dalam konteks frontend ini) akan mengarahkan mereka ke URL halaman login Anda dengan menambahkan parameter `tenantId`.
    *   **Contoh URL**: `http://yourhotspotdomain.com/?tenantId=your-tenant-id`
2.  **Pemuatan Pengaturan**:
    *   Komponen `HotspotLogin` (halaman login hotspot) akan membaca `tenantId` dari parameter URL.
    *   `TenantContext` kemudian akan mengaktifkan tenant yang sesuai berdasarkan `tenantId` tersebut.
    *   `SettingsContext` akan secara otomatis memuat pengaturan tampilan (seperti `siteName`, `logo`, `primaryColor`, `backgroundImage`, `welcomeMessage`) yang terkait dengan tenant yang aktif dari penyimpanan lokal (localStorage).

Dengan demikian, setiap hotspot yang dikonfigurasi dengan `tenantId` yang berbeda akan menampilkan halaman login yang disesuaikan.

## Langkah-langkah Konfigurasi

Untuk mengatur tampilan halaman login untuk setiap tenant, Anda perlu menggunakan panel admin.

### 1. Buat dan Kelola Tenant

Pastikan Anda telah membuat tenant yang berbeda di sistem Anda:

*   Navigasi ke **Admin Panel** -> **Tenant Management** (`/admin/tenants`).
*   Di sini, Anda dapat **Add New Tenant** atau melihat tenant yang sudah ada. Catat `ID` dari setiap tenant, karena ini akan digunakan dalam URL.

### 2. Konfigurasi Pengaturan Hotspot per Tenant

Setelah Anda memiliki tenant, Anda dapat menyesuaikan pengaturan tampilan untuk masing-masing tenant:

*   Navigasi ke **Admin Panel** -> **Settings** (`/admin/settings`).
*   Di bagian atas sidebar, jika Anda adalah `super_admin`, Anda akan melihat dropdown **Active Tenant**. Pilih tenant yang ingin Anda konfigurasi pengaturannya.
*   Gulir ke bagian **Hotspot Login Appearance**.
*   **Site Name**: Nama yang akan ditampilkan di halaman login hotspot.
*   **Primary Color & Secondary Color**: Warna utama dan sekunder untuk gradien latar belakang atau elemen UI lainnya.
*   **Logo**: Unggah gambar logo untuk hotspot Anda.
*   **Background Image**: Unggah gambar latar belakang untuk halaman login. Jika tidak ada gambar, gradien warna akan digunakan.
*   **Welcome Message**: Pesan selamat datang yang akan ditampilkan di halaman login.
*   Setelah melakukan perubahan, klik tombol **Save All Settings** di bagian bawah halaman.

**Penting**: Setiap kali Anda memilih tenant yang berbeda dari dropdown "Active Tenant" di sidebar, pengaturan yang ditampilkan di halaman "Settings" akan berubah untuk mencerminkan tenant tersebut. Pastikan Anda menyimpan perubahan untuk setiap tenant secara terpisah.

### 3. Penerapan di MikroTik (Konseptual)

Dalam implementasi nyata dengan MikroTik, Anda akan mengonfigurasi `Hotspot Server Profile` untuk mengarahkan pengguna ke URL halaman login Anda dengan `tenantId` yang sesuai.

Contoh konfigurasi di MikroTik (ini adalah contoh konseptual, sintaks mungkin sedikit berbeda tergantung versi RouterOS Anda):

```
/ip hotspot profile
add name="hotspot-profile-cafe" \
    html-directory=hotspot \
    login-by=http-chap,cookie \
    radius=hotspot-radius \
    # URL halaman login Anda dengan tenantId
    http-redirect="http://yourhotspotdomain.com/?tenantId=tenant-cafe-id"

/ip hotspot
add name="hotspot-cafe" \
    interface=bridge-hotspot-cafe \
    profile=hotspot-profile-cafe
```

Ganti `yourhotspotdomain.com` dengan domain atau IP publik aplikasi frontend Anda, dan `tenant-cafe-id` dengan ID tenant yang sebenarnya dari panel admin Anda.

Dengan konfigurasi ini, ketika pengguna terhubung ke hotspot yang terkait dengan `hotspot-cafe`, mereka akan diarahkan ke halaman login yang disesuaikan untuk tenant "Cafe" tersebut.

## 🎯 Status Implementasi Terbaru

### ✅ **SEMUA FITUR SUDAH LENGKAP & TERINTEGRASI:**

#### **Frontend Implementation:**
- [x] **TenantContext** dengan localStorage & backend integration
- [x] **HotspotLogin component** dengan tenant support
- [x] **URL parameter reading** untuk tenantId
- [x] **Settings per tenant** dengan backend persistence
- [x] **Admin interface** untuk tenant management
- [x] **TypeScript integration** dengan full type safety
- [x] **Real-time sync** dengan backend API

#### **Backend Implementation:**
- [x] **Database persistence** - SQLite dengan migrations
- [x] **Tenant Model** dengan relasi lengkap
- [x] **TenantController** - Full CRUD operations
- [x] **Domain-based resolution** - Real-time tenant detection
- [x] **Security & validation** - Request validation & middleware
- [x] **Audit logging** - Complete activity tracking
- [x] **API endpoints** - 7 endpoints untuk tenant management

#### **Advanced Features:**
- [x] **Multi-domain support** - Domain & subdomain resolution
- [x] **Tenant middleware** - Automatic tenant resolution
- [x] **Caching strategy** - 5-minute tenant cache
- [x] **Error handling** - Comprehensive error management
- [x] **Database seeding** - Default & demo tenants

### 🚀 **API Endpoints Tersedia:**

```
GET    /api/tenants                    - List all tenants
POST   /api/tenants                    - Create new tenant
GET    /api/tenants/{id}               - Get specific tenant
PUT    /api/tenants/{id}               - Update tenant
DELETE /api/tenants/{id}               - Delete tenant
GET    /api/tenant/resolve?domain=...  - Resolve tenant by domain
PUT    /api/tenants/{id}/settings      - Update tenant settings
```

### 🔧 **Cara Penggunaan:**

#### **1. Via Admin Panel:**
- Login ke admin panel
- Navigasi ke **Tenant Management**
- CRUD operations untuk tenant
- Konfigurasi domain & subdomain

#### **2. Via URL Parameter:**
```
http://yourdomain.com/?tenantId=tenant-123
```

#### **3. Via Domain Resolution:**
```
http://cafe.yourdomain.com  (subdomain)
http://cafe-domain.com      (custom domain)
```

### 🎉 **IMPLEMENTASI 100% LENGKAP!**

Sistem multi-tenant sekarang sudah production-ready dengan:
- ✅ Frontend & Backend terintegrasi penuh
- ✅ Database persistence & caching
- ✅ Security & validation
- ✅ Domain-based tenant resolution
- ✅ Real-time synchronization
- ✅ Audit logging & error handling

**Aplikasi siap untuk deployment dan penggunaan production!** 🚀