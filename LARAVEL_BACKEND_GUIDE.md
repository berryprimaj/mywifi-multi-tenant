# Panduan Implementasi Backend Laravel untuk Sistem Hotspot

Dokumen ini menguraikan komponen-komponen kunci yang perlu Anda bangun di sisi backend Laravel untuk mendukung fungsionalitas frontend React Anda. Tujuan utamanya adalah mengganti penyimpanan data lokal (localStorage) dengan database persisten dan mengaktifkan integrasi API nyata dengan MikroTik, Fonte WhatsApp, dan Google.

## 1. Persyaratan Dasar & Setup Proyek Laravel

Pastikan lingkungan pengembangan Anda memenuhi persyaratan Laravel dan Anda telah menginstal proyek Laravel dasar.

*   **Persyaratan Sistem**: PHP 8.1+, Composer, MySQL 8.0+ / MariaDB 10.4+.
*   **Instalasi Proyek Laravel**:
    ```bash
    composer create-project laravel/laravel hotspot-backend
    cd hotspot-backend
    ```
*   **Konfigurasi Lingkungan (`.env`)**:
    *   Sesuaikan `APP_URL` dengan URL backend Anda (misalnya, `http://localhost:8000` atau `https://yourdomain.com/api`).
    *   Konfigurasi koneksi database:
        ```env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=hotspot_db
        DB_USERNAME=root
        DB_PASSWORD=
        ```
    *   Jalankan `php artisan key:generate` untuk menghasilkan kunci aplikasi.
*   **CORS (Cross-Origin Resource Sharing)**:
    *   Karena frontend React akan berjalan di domain/port yang berbeda, Anda perlu mengkonfigurasi CORS di Laravel. Laravel sudah menyediakan middleware CORS. Pastikan `config/cors.php` dikonfigurasi untuk mengizinkan permintaan dari domain frontend Anda.
    *   Contoh `config/cors.php`:
        ```php
        'paths' => ['api/*', 'sanctum/csrf-cookie'],
        'allowed_methods' => ['*'],
        'allowed_origins' => ['http://localhost:3000', 'https://yourfrontenddomain.com'], // Sesuaikan dengan domain frontend Anda
        'allowed_origins_patterns' => [],
        'allowed_headers' => ['*'],
        'exposed_headers' => [],
        'max_age' => 0,
        'supports_credentials' => true,
        ```

## 2. Struktur Database (Migrasi & Model Eloquent)

Anda perlu membuat migrasi database dan model Eloquent untuk menyimpan semua data yang saat ini dikelola di frontend `localStorage`.

*   **Tabel `users` (untuk Admin)**:
    *   `id` (primary key)
    *   `username` (string, unique)
    *   `email` (string, unique)
    *   `password` (string)
    *   `role` (string, e.g., 'super_admin', 'administrator', 'owner', 'manager', 'staff', 'moderator', 'viewer')
    *   `tenant_id` (string, foreign key ke tabel `tenants`)
    *   `permissions` (json, untuk menyimpan izin spesifik jika diperlukan, atau bisa diatur via relasi ke tabel `roles`)
    *   `created_at`, `updated_at`
*   **Tabel `tenants`**:
    *   `id` (string, primary key, sesuai dengan ID tenant di frontend)
    *   `name` (string)
    *   `domain` (string, nullable)
    *   `created_at`, `updated_at`
    *   **Penting**: Pastikan `default-tenant` dengan ID `default-tenant` dan nama `Default Hotspot` (atau nama lain yang Anda inginkan) ada di database Anda sebagai tenant pertama. Ini bisa dilakukan melalui seeder atau migrasi data awal.
*   **Tabel `settings`**:
    *   `id` (primary key)
    *   `tenant_id` (string, foreign key ke tabel `tenants`)
    *   `key` (string, e.g., 'hotspot_appearance', 'admin_appearance', 'api_keys')
    *   `value` (json, menyimpan objek pengaturan lengkap untuk setiap kategori)
    *   `created_at`, `updated_at`
    *   *Alternatif*: Anda bisa membuat tabel terpisah untuk setiap jenis pengaturan (misalnya `hotspot_settings`, `admin_settings`, `api_keys`) jika struktur data lebih kompleks. Namun, untuk kesederhanaan awal, satu tabel `settings` dengan kolom `json` mungkin cukup.
*   **Tabel `roles`**:
    *   `id` (string, primary key)
    *   `name` (string)
    *   `value` (string, unique, e.g., 'super_admin')
    *   `description` (text)
    *   `permissions` (json, array of strings, e.g., `['users.view', 'settings.edit']`)
    *   `password_expiry_days` (integer, nullable)
    *   `created_at`, `updated_at`
    *   **Penting**: Pastikan peran-peran default seperti `super_admin`, `administrator`, `owner`, `manager`, `staff`, `moderator`, `viewer` juga di-seed ke database.
*   **Tabel `members`**:
    *   `id` (primary key)
    *   `username` (string, unique)
    *   `name` (string)
    *   `email` (string)
    *   `department` (string)
    *   `password` (string)
    *   `status` (string, 'active'/'inactive')
    *   `last_login` (datetime, nullable)
    *   `data_usage` (string)
    *   `session_time` (string)
    *   `tenant_id` (string, foreign key ke tabel `tenants`)
    *   `created_at`, `updated_at`
*   **Tabel `social_users`**:
    *   `id` (primary key)
    *   `name` (string)
    *   `email` (string, nullable)
    *   `ip` (string)
    *   `whatsapp` (string, nullable)
    *   `provider` (string, 'Google'/'WhatsApp')
    *   `connected_at` (datetime)
    *   `session` (string)
    *   `data_usage` (string)
    *   `status` (string, 'online'/'offline')
    *   `tenant_id` (string, foreign key ke tabel `tenants`)
    *   `created_at`, `updated_at`
*   **Tabel `mikrotik_interfaces`**:
    *   `id` (primary key)
    *   `tenant_id` (string, foreign key ke tabel `tenants`)
    *   `name` (string)
    *   `mac` (string)
    *   `type` (string, 'Ethernet'/'Wireless')
    *   `ip` (string)
    *   `status` (string, 'running'/'disabled')
    *   `rx` (string)
    *   `tx` (string)
    *   `created_at`, `updated_at`
*   **Tabel `mikrotik_profiles`**:
    *   `id` (primary key)
    *   `tenant_id` (string, foreign key ke tabel `tenants`)
    *   `name` (string)
    *   `session_timeout` (string)
    *   `idle_timeout` (string)
    *   `shared_users` (integer)
    *   `rate_limit` (string)
    *   `status` (string, 'active'/'inactive')
    *   `created_at`, `updated_at`

## 3. Autentikasi & Otorisasi Admin (Laravel Sanctum)

Gunakan Laravel Sanctum untuk autentikasi API stateless yang aman antara frontend React dan backend Laravel.

*   **Instalasi Sanctum**:
    ```bash
    composer require laravel/sanctum
    php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
    php artisan migrate
    ```
*   **Konfigurasi Model User**: Pastikan model `User` Anda menggunakan trait `HasApiTokens`.
*   **API Login Endpoint**:
    *   Buat controller (misalnya `AuthController`) dengan metode `login` yang menerima `username` dan `password`.
    *   Verifikasi kredensial, buat token Sanctum, dan kembalikan token bersama data pengguna (termasuk `role` dan `tenantId`).
    *   Contoh rute: `POST /api/auth/login`
*   **API Logout Endpoint**:
    *   Metode `logout` untuk mencabut token pengguna.
    *   Contoh rute: `POST /api/auth/logout` (dilindungi oleh middleware `auth:sanctum`)
*   **Mendapatkan Data Pengguna Terautentikasi**:
    *   Endpoint untuk mendapatkan data pengguna yang sedang login.
    *   Contoh rute: `GET /api/user` (dilindungi oleh middleware `auth:sanctum`)
*   **Manajemen Peran & Izin**:
    *   Implementasikan logika peran dan izin di backend. Anda bisa menggunakan paket seperti [Spatie/Laravel-Permission](https://spatie.be/docs/laravel-permission/v5/introduction) atau membangun sistem kustom.
    *   Pastikan setiap admin memiliki `role` dan `tenant_id` yang sesuai.
    *   Middleware atau Policy untuk membatasi akses ke endpoint API berdasarkan peran dan tenant.
    *   **Penting**: Pastikan akun admin default (`username: admin`, `password: admin`, `role: super_admin`, `tenant_id: default-tenant`) di-seed ke database sebagai bagian dari instalasi awal.

## 4. API Endpoints (RESTful)

Buat endpoint API RESTful untuk setiap bagian Admin Panel. Semua endpoint ini harus dilindungi oleh middleware autentikasi (misalnya `auth:sanctum`) dan otorisasi (berdasarkan peran/izin).

*   **Admin & Peran**:
    *   `GET /api/admins`: Mendapatkan daftar admin (filter berdasarkan `tenant_id` jika bukan super_admin).
    *   `POST /api/admins`: Menambah admin baru.
    *   `PUT /api/admins/{id}`: Memperbarui admin.
    *   `DELETE /api/admins/{id}`: Menghapus admin.
    *   `GET /api/roles`: Mendapatkan daftar peran.
    *   `PUT /api/roles/{id}`: Memperbarui peran.
    *   `DELETE /api/roles/{id}`: Menghapus peran (dengan validasi jika peran sedang digunakan).
    *   `GET /api/password-settings`: Mendapatkan pengaturan keamanan kata sandi global.
    *   `POST /api/password-settings`: Memperbarui pengaturan keamanan kata sandi global.
*   **Tenant Management**:
    *   `GET /api/tenants`: Mendapatkan daftar tenant.
    *   `POST /api/tenants`: Menambah tenant baru.
    *   `PUT /api/tenants/{id}`: Memperbarui tenant.
    *   `DELETE /api/tenants/{id}`: Menghapus tenant.
*   **Pengaturan (Settings)**:
    *   `GET /api/settings/{tenantId}`: Mendapatkan semua pengaturan untuk tenant tertentu.
    *   `POST /api/settings/{tenantId}`: Menyimpan semua pengaturan untuk tenant tertentu.
*   **Manajemen Anggota (Members)**:
    *   `GET /api/members`: Mendapatkan daftar anggota (filter berdasarkan `tenant_id`).
    *   `POST /api/members`: Menambah anggota baru.
    *   `PUT /api/members/{id}`: Memperbarui anggota.
    *   `DELETE /api/members/{id}`: Menghapus anggota.
    *   `POST /api/members/import`: Mengunggah file Excel untuk impor anggota.
    *   `GET /api/members/export`: Mengekspor data anggota ke Excel/CSV.
*   **Pengguna Sosial (Social Users)**:
    *   `GET /api/social-users`: Mendapatkan daftar pengguna sosial (filter berdasarkan `tenant_id`).
    *   `PUT /api/social-users/{id}`: Memperbarui pengguna sosial.
    *   `DELETE /api/social-users/{id}`: Menghapus pengguna sosial.
    *   `POST /api/social-users/delete-range`: Menghapus pengguna sosial berdasarkan rentang tanggal.
    *   `GET /api/social-users/export`: Mengekspor data pengguna sosial.
*   **Konfigurasi Router (MikroTik)**:
    *   `GET /api/mikrotik/status/{tenantId}`: Mendapatkan status router (uptime, active users, bandwidth, CPU, memory, dll.).
    *   `POST /api/mikrotik/test-connection/{tenantId}`: Menguji koneksi ke MikroTik.
    *   `POST /api/mikrotik/backup/{tenantId}`: Melakukan backup konfigurasi MikroTik.
    *   `POST /api/mikrotik/restart-hotspot/{tenantId}`: Merestart layanan hotspot.
    *   `POST /api/mikrotik/reboot/{tenantId}`: Melakukan reboot router.
    *   `GET /api/mikrotik/interfaces/{tenantId}`: Mendapatkan daftar antarmuka jaringan.
    *   `POST /api/mikrotik/interfaces/{tenantId}`: Menambah antarmuka.
    *   `PUT /api/mikrotik/interfaces/{tenantId}/{name}`: Memperbarui antarmuka.
    *   `DELETE /api/mikrotik/interfaces/{tenantId}/{name}`: Menghapus antarmuka.
    *   `GET /api/mikrotik/profiles/{tenantId}`: Mendapatkan daftar profil hotspot.
    *   `POST /api/mikrotik/profiles/{tenantId}`: Menambah profil hotspot.
    *   `PUT /api/mikrotik/profiles/{tenantId}/{name}`: Memperbarui profil hotspot.
    *   `DELETE /api/mikrotik/profiles/{tenantId}/{name}`: Menghapus profil hotspot.
*   **Dashboard Data**:
    *   `GET /api/dashboard/stats/{tenantId}`: Mendapatkan statistik ringkasan.
    *   `GET /api/dashboard/activity/{tenantId}`: Mendapatkan aktivitas terbaru.
    *   `GET /api/dashboard/user-activity-chart/{tenantId}`: Data untuk grafik aktivitas pengguna.
    *   `GET /api/dashboard/daily-sessions-chart/{tenantId}`: Data untuk grafik sesi harian.

## 5. Integrasi Pihak Ketiga

Untuk integrasi dengan MikroTik, Fonte WhatsApp, dan Google, Anda akan menggunakan library PHP di Laravel.

*   **MikroTik API**:
    *   Gunakan library PHP untuk MikroTik API (misalnya, `routeros/php-routeros-api` atau `laravie/mikrotik`).
    *   Implementasikan logika koneksi dan perintah API di service atau repository layer.
    *   Detail konfigurasi kredensial ada di `API_CONFIGURATION_GUIDE.md`.
*   **Fonte WhatsApp API**:
    *   Gunakan Guzzle HTTP Client untuk membuat permintaan ke API Fonte.id.
    *   Detail konfigurasi kredensial ada di `API_CONFIGURATION_GUIDE.md`.
*   **Google OAuth**:
    *   Gunakan Laravel Socialite (`laravel/socialite`) untuk mengelola alur OAuth 2.0 dengan Google.
    *   Buat rute redirect dan callback.
    *   Detail konfigurasi kredensial ada di `API_CONFIGURATION_GUIDE.md`.

## 6. Penyimpanan File (Logo & Gambar Latar Belakang)

Untuk mengelola unggahan logo dan gambar latar belakang, gunakan sistem file Laravel.

*   **Konfigurasi Disk**: Pastikan disk `public` dikonfigurasi dengan benar di `config/filesystems.php`.
*   **Unggah File**: Gunakan `Storage::putFileAs()` untuk menyimpan file yang diunggah ke direktori yang sesuai (misalnya, `public/uploads/logos`, `public/uploads/backgrounds`).
*   **Akses File**: File yang disimpan di disk `public` dapat diakses melalui URL publik setelah menjalankan `php artisan storage:link`.

## 7. Validasi & Penanganan Kesalahan

*   **Validasi Permintaan**: Selalu validasi semua input yang masuk dari frontend menggunakan Laravel Request Validation.
*   **Penanganan Kesalahan API**: Berikan respons JSON yang konsisten untuk kesalahan (misalnya, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).

## 8. Catatan Penting

*   **Keamanan**: Selalu prioritaskan keamanan. Gunakan hashing untuk kata sandi, validasi input yang ketat, dan terapkan otorisasi yang tepat.
*   **Pengujian**: Tulis unit dan fitur tes untuk endpoint API Anda untuk memastikan fungsionalitas yang benar dan mencegah regresi.
*   **Dokumentasi API**: Pertimbangkan untuk mendokumentasikan API Anda menggunakan alat seperti Swagger/OpenAPI (misalnya, dengan paket `darkaonline/l5-swagger`).
*   **Optimasi**: Untuk aplikasi skala besar, pertimbangkan caching, queue, dan optimasi database.

Panduan ini memberikan kerangka kerja untuk membangun backend Laravel Anda. Setiap bagian memerlukan implementasi yang cermat sesuai dengan kebutuhan spesifik dan praktik terbaik Laravel.

Selamat membangun!