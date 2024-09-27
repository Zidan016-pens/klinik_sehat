let idPasien = null;
let kategori = null;

document.addEventListener('DOMContentLoaded', function(){
    const tabel = document.getElementById("tabelPasien");

    async function tampil() {
        try {
            const response = await fetch("http://139.228.64.11:3000/api/pasien");
            const pasienList = await response.json(); 

            pasienList.forEach(pasien => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pasien.namaPasien}</td>
                    <td><img src="data:image/jpeg;base64,${pasien.fotoPasien}" alt="${pasien.namaPasien}" width="100"; height="100"></td> <!-- Sesuaikan dengan path gambar yang benar -->
                    <td>${pasien.diagnosaPasien}</td>
                    <td>${pasien.keluhan}</td>
                    <td>${pasien.tanggalPeriksa}</td> 
                    <td>${pasien.resepPemeriksaan}</td>
                    <td>${pasien.hasilPemeriksaan}</td> 
                    
                    <td>${pasien.harga}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning btn-edit" data-idPasien="${pasien.idPasien}" data-kategoriID="${pasien.idKategori}" data-toggle="modal" data-target="#exampleModal2">
                        Edit
                        </button>
                    </td>
                `;
                tabel.appendChild(row);

                document.querySelectorAll('.btn-edit').forEach(button => {
                    button.addEventListener('click', async function() {
                        const idpasien = this.getAttribute('data-idPasien');
                        const idKategori = this.getAttribute('data-kategoriID');
                        kategori = idKategori
                        idPasien = idpasien;
                        console.log(idPasien);
                    });
                })


            });
        } catch (e) {
            console.log('Terjadi kesalahan:', e);
        }
    }
    
    tampil();
})

document.getElementById('editPasien').
addEventListener('click', async function(){
    const namaPasien = document.getElementById('namaPasien').value;
    const foto = document.getElementById('foto').value
    const fotoPasien = foto ? foto : null;
    const diagnosaPasien = document.getElementById('diagnosa').value
    const keluhan = document.getElementById('keluhan').value
    const harga = document.getElementById('harga').value
    const hasilP = document.getElementById('hasilPemeriksaan').value
    const resep = document.getElementById('resepPemeriksaan').value

    let hasilPeriksa = null;

    if(hasilP == "Sehat"){
        hasilPeriksa = 1;
    }else{
        hasilPeriksa = 0;
    }
    
    try {
        const response = await fetch(`http://139.228.64.11:3000/api/editPasien/${idPasien}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                namaPasien: namaPasien,
                fotoPasien: fotoPasien ? 1 : 0,
                diagnosaPasien: diagnosaPasien,
                keluhan: keluhan,
                harga: harga,
                hasilPemeriksaan: hasilP,
                resepPemeriksaan: resep,
                idKategori: kategori
            })
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
        location.reload();
        alert("Data berhasil di-update");
    } catch (error) {
        console.error("Ada error:", error);
    }
    
})