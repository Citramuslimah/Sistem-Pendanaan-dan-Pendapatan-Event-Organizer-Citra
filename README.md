# Sistem Pendanaan dan Pendapatan Event Organizer Perusahaan Citra

Sistem Pendanaan dan Pendapatan Event Organizer Citra adalah aplikasi berbasis web untuk membantu pengelolaan data operasional Event Organizer, mulai dari pencatatan acara hingga pengelolaan pendanaan dan pendapatan. Aplikasi ini dirancang agar pengelolaan data kegiatan menjadi lebih terstruktur, praktis, dan terintegrasi.

Frontend dikembangkan menggunakan HTML, CSS, dan JavaScript, sedangkan Supabase digunakan sebagai layanan autentikasi dan basis data PostgreSQL.
🌐 Demo Website: https://citramuslimah.github.io/Sistem-Pendanaan-dan-Pendapatan-Event-Organizer-Citra/

## Identitas tugas

<table>
  <thead>
    <tr>
      <th align="center">Keterangan</th>
      <th align="center">Detail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Nama</td>
      <td>Citra Muslimah Iffat</td>
    </tr>
    <tr>
      <td>NIM</td>
      <td>12030124120054</td>
    </tr>
    <tr>
      <td>Mata Kuliah</td>
      <td>Pengkodean dan Pemograman</td>
    </tr>
    <tr>
      <td>Kelas</td>
      <td>D</td>
    </tr>
    <tr>
      <td>Dosen Pengampu</td>
      <td>Dr. Totok Dewayanto, S.E., M.Si., Akt.</td>
    </tr>
  </tbody>
</table>

### Disusun untuk memenuhi Tugas Project UTS Pengkodean dan Pemograman.

## Akun Demo

Gunakan informasi berikut sebagai panduan untuk menyiapkan akses demonstrasi aplikasi Event Organizer.

<table>
  <thead>
    <tr>
      <th align="center">Username / Email</th>
      <th align="center">Password</th>
      <th align="center">Supabase Publishable Key</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>citramuslimah21@gmail.com</td>
      <td>eventcitra123</td>
      <td>sb_publishable_Tdp39woJz_Od39qgukwztA_zYdn4OAo</td>
    </tr>
  </tbody>
</table>

Catatan akses: Pastikan akun demo telah terdaftar di Supabase Authentication dan konfigurasi aplikasi mengarah ke proyek Supabase yang benar. Jangan membagikan kata sandi akun pribadi atau secret key melalui repository publik. Gunakan akun khusus demonstrasi dengan hak akses yang sesuai.

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
