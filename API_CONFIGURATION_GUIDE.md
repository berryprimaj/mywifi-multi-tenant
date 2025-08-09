# Panduan Konfigurasi API

Dokumen ini merinci langkah-langkah yang diperlukan untuk mengkonfigurasi koneksi API ke MikroTik, Fonte WhatsApp, dan Integrasi Google untuk aplikasi Hotspot Management System Anda.

## 1. Konfigurasi Koneksi API MikroTik

Koneksi ke MikroTik Router dilakukan melalui API-nya. Pastikan router Anda dapat diakses dari server tempat aplikasi ini di-deploy.

### Langkah 1: Aktifkan Layanan API di MikroTik

1.  **Akses MikroTik Anda:** Gunakan Winbox atau SSH untuk terhubung ke router MikroTik Anda.
2.  **Buka IP Services:** Navigasi ke `IP` -> `Services`.
3.  **Aktifkan API:** Cari layanan `api` (biasanya di port `8728`) dan pastikan statusnya `enabled`. Jika tidak, klik dua kali dan centang `Enabled`.
4.  **Atur Allowed Addresses (Opsional tapi Direkomendasikan):** Untuk keamanan, Anda bisa membatasi IP mana saja yang boleh mengakses API. Tambahkan IP server Anda ke daftar `Allowed From`.

### Langkah 2: Buat Pengguna API Khusus di MikroTik

Sangat disarankan untuk membuat pengguna terpisah dengan hak akses yang diperlukan untuk API, daripada menggunakan akun admin utama.

1.  **Akses MikroTik Anda:** Gunakan Winbox atau SSH.
2.  **Buka Users:** Navigasi ke `System` -> `Users`.
3.  **Tambahkan Pengguna Baru:** Klik tombol `+` untuk menambahkan pengguna baru.
    *   **Name:** `hotspot-api` (atau nama lain yang Anda inginkan)
    *   **Password:** Masukkan kata sandi yang kuat dan unik.
    *   **Group:** Pilih `full` (untuk memastikan semua perintah API dapat dijalankan).
4.  **Terapkan Perubahan:** Klik `Apply` atau `OK`.

### Langkah 3: Konfigurasi Variabel Lingkungan di Aplikasi Laravel

Di file `.env` proyek Laravel Anda, tambahkan atau perbarui detail koneksi MikroTik:

```env
MIKROTIK_HOST=your_mikrotik_ip_address_or_ddns # Contoh: 192.168.1.1 atau your.ddns.net
MIKROTIK_PORT=8728
MIKROTIK_USERNAME=hotspot-api # Username yang Anda buat di Langkah 2
MIKROTIK_PASSWORD=your_secure_password # Password yang Anda buat di Langkah 2
```

*   **`MIKROTIK_HOST`**: Ini adalah alamat IP publik router MikroTik Anda atau nama domain DDNS jika Anda menggunakannya. Jika aplikasi di-deploy di jaringan lokal yang sama dengan MikroTik, bisa juga IP lokal MikroTik. **Fitur DDNS otomatis akan meresolusi domain menjadi IP address.** **IP publik dapat diambil dari PPP connections di MikroTik router Anda.**
*   **`MIKROTIK_PORT`**: Port API MikroTik, defaultnya 8728.
*   **`MIKROTIK_USERNAME`**: Username API yang Anda buat di MikroTik.
*   **`MIKROTIK_PASSWORD`**: Password untuk username API tersebut.

## 2. Konfigurasi Fonnte WhatsApp API

Aplikasi ini menggunakan Fonnte API untuk mengirim OTP via WhatsApp.

### Langkah 1: Dapatkan Kredensial Fonnte API Anda

1.  **Kunjungi Fonnte.com:** Buka situs web [https://fonnte.com](https://fonnte.com).
2.  **Daftar/Login:** Buat akun atau masuk ke akun Anda.
3.  **Dapatkan API Key, Device ID, dan Nomor Telepon:** Di dashboard Fonnte.com, Anda akan menemukan:
    - **API Key**: Kunci API untuk autentikasi
    - **Device ID**: ID perangkat WhatsApp (format: `device_xxxxx`)
    - **Nomor Telepon**: Nomor WhatsApp yang terdaftar (format: `+6281234567890`)
    
    Pastikan perangkat WhatsApp Anda sudah terhubung dan aktif di Fonnte.com.

### Langkah 2: Konfigurasi Variabel Lingkungan di Aplikasi Laravel

Di file `.env` proyek Laravel Anda, tambahkan atau perbarui kredensial Fonnte API Anda:

```env
FONTE_API_KEY=your_fonte_api_key_here
FONTE_DEVICE_ID=device_123456789
FONTE_PHONE_NUMBER=+6281234567890
```

*   **`FONTE_API_KEY`**: Kunci API yang Anda dapatkan dari Fonnte.com.
*   **`FONTE_DEVICE_ID`**: ID perangkat WhatsApp Anda yang terdaftar di Fonnte.com (bukan nomor telepon).
*   **`FONTE_PHONE_NUMBER`**: Nomor telepon WhatsApp yang terdaftar di Fonnte.com.

## 3. Konfigurasi DDNS (Dynamic DNS)

### Fitur DDNS Otomatis

Aplikasi ini mendukung DDNS (Dynamic DNS) untuk koneksi MikroTik. Fitur ini memungkinkan Anda menggunakan nama domain DDNS sebagai pengganti IP address statis.

#### Cara Kerja DDNS:
1. **Input Domain**: Masukkan nama domain DDNS Anda (misal: `your-router.ddns.net`)
2. **Resolusi Otomatis**: Sistem akan otomatis meresolusi domain menjadi IP address
3. **Test DDNS**: Gunakan tombol "Test DDNS" untuk memverifikasi resolusi
4. **Koneksi Real-time**: Setiap request ke MikroTik akan menggunakan IP yang ter-resolve

#### Contoh Konfigurasi DDNS:
```env
# Menggunakan DDNS
MIKROTIK_HOST=your-router.ddns.net

# Atau menggunakan IP statis
MIKROTIK_HOST=123.45.67.89
```

#### Testing DDNS:
- Klik tombol "Test DDNS" di form Router Config
- Sistem akan menampilkan hasil resolusi: `your-router.ddns.net → 123.45.67.89`
- Jika gagal, akan muncul pesan error yang informatif

### Deteksi IP Publik dari PPP

Aplikasi dapat mendeteksi IP publik secara otomatis dari PPP (Point-to-Point Protocol) connections di MikroTik router Anda.

#### Cara Kerja:
1. **PPP Detection**: Sistem mengambil data dari `/ppp/active` endpoint
2. **IP Extraction**: Mengekstrak IP publik dari field `caller-id`
3. **Real-time Display**: Menampilkan IP publik di halaman Router Config
4. **Auto-refresh**: IP publik diperbarui secara otomatis

#### Fitur IP Publik:
- ✅ **Auto Detection**: Mendeteksi IP publik dari PPP connections
- ✅ **Multiple IPs**: Mendukung multiple PPP connections
- ✅ **Real-time Status**: Menampilkan status koneksi dan uptime
- ✅ **Copy to Clipboard**: Mudah copy IP untuk konfigurasi

#### Contoh Output:
```
Connection: ovpn-bahagia
Service: ovpn
Public IP: 101.128.100.230
Uptime: 4d 19:10:41
```

## 4. Konfigurasi Integrasi Google (OAuth)

Integrasi Google memungkinkan pengguna login ke hotspot menggunakan akun Google mereka.

### Langkah 1: Buat Proyek dan Kredensial OAuth di Google Cloud Console

1.  **Kunjungi Google Cloud Console:** Buka [https://console.developers.google.com](https://console.developers.google.com).
2.  **Buat Proyek Baru:** Jika Anda belum memiliki proyek, buat proyek baru.
3.  **Aktifkan Google People API:**
    *   Di menu navigasi, pilih `APIs & Services` -> `Library`.
    *   Cari `Google People API` dan aktifkan.
4.  **Buat Layar Persetujuan OAuth (OAuth Consent Screen):**
    *   Di menu navigasi, pilih `APIs & Services` -> `OAuth consent screen`.
    *   Pilih `External` dan klik `CREATE`.
    *   Isi informasi yang diperlukan (Nama Aplikasi, Email Dukungan Pengguna, dll.).
    *   Tambahkan `Scopes` yang diperlukan, minimal `.../auth/userinfo.email` dan `.../auth/userinfo.profile`.
    *   Tambahkan `Test users` jika Anda masih dalam tahap pengembangan.
5.  **Buat Kredensial ID Klien OAuth:**
    *   Di menu navigasi, pilih `APIs & Services` -> `Credentials`.
    *   Klik `CREATE CREDENTIALS` -> `OAuth client ID`.
    *   Pilih `Web application` sebagai Application type.
    *   **Name:** Berikan nama yang deskriptif (misalnya, "Hotspot Google Login").
    *   **Authorized JavaScript origins:** Biarkan kosong atau tambahkan URL frontend Anda jika Anda menggunakan domain yang berbeda untuk frontend (misalnya, `http://localhost:3000` jika Anda menguji frontend secara terpisah).
    *   **Authorized redirect URIs:** **Ini sangat penting!** Tambahkan URL callback yang akan digunakan oleh aplikasi Laravel Anda. Ini harus sesuai dengan `GOOGLE_REDIRECT_URI` di file `.env` Anda.
        *   Contoh: `https://yourdomain.com/auth/google/callback`
        *   Jika Anda menguji secara lokal dengan Laravel, bisa jadi `http://localhost:8000/auth/google/callback`.
    *   Klik `CREATE`.
6.  **Catat Client ID dan Client Secret:** Setelah kredensial dibuat, Anda akan melihat `Client ID` dan `Client Secret` Anda. Catat keduanya.

### Langkah 2: Konfigurasi Variabel Lingkungan di Aplikasi Laravel

Di file `.env` proyek Laravel Anda, tambahkan atau perbarui kredensial Google OAuth Anda:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback # HARUS SAMA DENGAN YANG DI GOOGLE CLOUD CONSOLE
```

*   **`GOOGLE_CLIENT_ID`**: ID Klien yang Anda dapatkan dari Google Cloud Console.
*   **`GOOGLE_CLIENT_SECRET`**: Rahasia Klien yang Anda dapatkan dari Google Cloud Console.
*   **`GOOGLE_REDIRECT_URI`**: URL lengkap ke endpoint callback Google di aplikasi Laravel Anda. **Pastikan ini cocok persis** dengan yang Anda masukkan di Google Cloud Console.

---

Setelah Anda menyelesaikan konfigurasi ini, pastikan untuk menjalankan `php artisan config:clear` dan `php artisan cache:clear` di server Laravel Anda untuk memastikan variabel lingkungan yang baru dimuat.

Jika Anda memiliki pertanyaan lebih lanjut atau mengalami masalah selama proses ini, jangan ragu untuk bertanya!