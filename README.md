# Sistem Pendanaan dan Pendapatan Event Organizer Perusahaan Citra

Aplikasi CRUD sederhana untuk kategori, acara, pendanaan, dan pendapatan. Frontend terhubung langsung ke Supabase; tidak perlu menjalankan server Node.js untuk membuka aplikasi.

## Struktur

```text
frontend/
  index.html
  styles.css
  auth.css
  config.js
  app.js
backend/
  app.js
  schema.sql
```

## Menjalankan

1. Buat project Supabase, buka **SQL Editor**, lalu jalankan isi `backend/schema.sql`. Policy memberi akses CRUD hanya kepada pengguna yang sudah login.
2. Buka **Settings > API Keys** di Supabase dan salin **publishable key** (`sb_publishable_...`). Jangan gunakan secret key di frontend.
3. Buka `frontend/index.html` langsung di browser. Masukkan publishable key pada layar koneksi. URL project sudah terisi; jika project berbeda, ubah URL pada layar tersebut.
4. Buat atau undang akun melalui **Authentication > Users** di Supabase, lalu masuk dengan email dan kata sandi. Konfigurasi project dan sesi login disimpan pada browser ini agar pembukaan berikutnya langsung tersambung.

Frontend memuat Supabase JS dari CDN, sehingga browser perlu koneksi internet. Semua pengguna Supabase yang berhasil login pada project ini dapat mengelola seluruh data empat tabel. Jangan pernah memasukkan secret/service-role key pada halaman frontend.
