
document.addEventListener('DOMContentLoaded', function(){
    const tabel = document.getElementById("tabel");
async function tampil() {
    try {
        const response = await fetch("http://192.168.11.91:3000/dashboard");
        const pasienList = await response.json();  // Menambahkan await di sini

        pasienList.forEach(pasien => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pasien.namaPasien}</td>
                <td>${pasien.keluhan}</td>
                <td><img src="data:image/jpeg;base64,${pasien.fotoPasien}" alt="${pasien.namaPasien}" width="100"></td> <!-- Sesuaikan dengan path gambar yang benar -->
                <td>${pasien.diagnosaPasien}</td> 
                <td>${pasien.hasilPemeriksaan}</td>
                <td>${pasien.tanggalPeriksa}</td> 
                <td>${pasien.jenisPasien}</td>
                <td>${pasien.totalPembayaran}</td>
            `;
            tabel.appendChild(row);
        });
    } catch (e) {
        console.log('Terjadi kesalahan:', e);
    }
}
tampil();
})
