document.addEventListener('DOMContentLoaded', async function(){
    const tabel = document.getElementById('tabelPasien');

    try {
        const response = await fetch(`http://139.228.64.11:3000/api/pasienSakit/1`);
        const pemeriksaanList = await response.json();
        pemeriksaanList.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.namaPasien}</td>
                <td>${data.keluhan}</td>
                <td><img src="data:image/jpeg;base64,${data.fotoPasien}" alt="${data.namaPasien}" width="100" height="100"></td>
                <td>${data.diagnosaPasien}</td>
                <td>${data.resepPemeriksaan}</td>
                <td>${data.hasilPemeriksaan}</td>
                <td>${data.tanggalPeriksa}</td>
            `;
            tabel.appendChild(row);
        });
    } catch (e) {
        console.log('Terjadi kesalahan:', e);
    }
});
