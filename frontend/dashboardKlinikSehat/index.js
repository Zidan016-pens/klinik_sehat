let idPasien = null, namaPasien = null, keluhan = null, diagnosaPasien = null, hasilPemeriksaan = null, jenisPasien = null, harga = null

  document.addEventListener('DOMContentLoaded', function(){
    const tabel = document.getElementById("tabel");

    async function tampil() {
        try {
            const response = await fetch("http://139.228.64.11:3000/api/pasien");
            const pasienList = await response.json();  // Menambahkan await di sini

            pasienList.forEach(pasien => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pasien.namaPasien}</td>
                    <td><img src="data:image/jpeg;base64,${pasien.fotoPasien}" alt="${pasien.namaPasien}" width="100"; height="100"></td> <!-- Sesuaikan dengan path gambar yang benar -->
                    <td>${pasien.diagnosaPasien}</td>
                    <td>${pasien.keluhan}</td>
                    <td>${pasien.tanggalPeriksa}</td> 
                    <td>${pasien.harga}</td>
                    <td>${pasien.hasilPemeriksaan}</td> 
                    <td>${pasien.resepPemeriksaan}</td>
                    ${pasien.periksa ? 
                        `<td>
                        <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#exampleModal2" disabled>
                            sudah diperiksa
                        </button>
                        </td>` :
                        `
                        <td>
                        <button type="button" class="btn btn-sm btn-success btn-edit" data-toggle="modal" data-pasienid="${pasien.idPasien}" data-namaPasien="${pasien.namaPasien}" data-keluhan="${pasien.keluhan}" data-diagnosaPasien="${pasien.diagnosaPasien}" data-hasilP="${pasien.hasilPemeriksaan}" data-harga="${pasien.harga}" data-target="#exampleModal2">
                            Periksa
                        </button>
                        </td>`}
                `;
                tabel.appendChild(row);

                document.querySelectorAll('.btn-edit').forEach(btn=>{
                    btn.addEventListener('click', async function () {
                        idPasien = this.getAttribute('data-pasienId')
                        namaPasien = this.getAttribute('data-namaPasien')
                        keluhan = this.getAttribute('data-keluhan')
                        diagnosaPasien = this.getAttribute('data-diagnosaPasien')
                        hasilPemeriksaan = this.getAttribute('data-hasilP')
                        harga = parseFloat(this.getAttribute('data-harga'))
                    })
                })
            });
        } catch (e) {
            console.log('Terjadi kesalahan:', e);
        }
    }tampil();
})

document.getElementById("tambahPasien")
    .addEventListener('click', async function(){
        const namaPasien = document.getElementById('namaPasien').value;
        const foto = document.getElementById('foto').value
        const fotoPasien = foto ? foto : null;
        const diagnosaPasien = document.getElementById('diagnosa').value
        const keluhan = document.getElementById('keluhan').value
        const harga = parseFloat(document.getElementById('harga')).value
        const hasilP = document.getElementById('hasilPemeriksaan').value
        const resep = document.getElementById('resepObat').value

        let hasilPeriksa = null;
        
        if(hasilP == "Sehat"){
            hasilPeriksa = 1;
        }else{
            hasilPeriksa = 0;
        }

        try {
            const respone = await fetch("http://139.228.64.11:3000/api/tambahPasien", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    namaPasien : namaPasien,
                    fotoPasien : fotoPasien ? 1 : 0,
                    diagnosaPasien : diagnosaPasien,
                    keluhan : keluhan,
                    harga : harga,
                    hasilPemeriksaan: hasilP,
                    resepPemeriksaan: resep,
                    idKategori : hasilPeriksa,
                    periksa: false
                })
            })

            if(respone.ok){
                alert("berhasil menambahkan data");
            }else{
                console("tidak berhasil menambahkan data")
            }
        } catch (error) {
            console.log(`ada error : ${error}`)
        }
    })

    document.getElementById('btnPeriksa')
    .addEventListener('click', async function() {
        const bpjs = document.getElementById('jenisPasien').value; 
        let totalPembayaran = null;
        let jenisPasien = null;
        if (typeof harga === 'string') {
            harga = parseFloat(harga);
        }

        if (bpjs === "BPJS" || bpjs === "bpjs") {
            jenisPasien = true;
        } else {
            jenisPasien = false;
        }

        if (harga >= 500000 && jenisPasien === true) {
            totalPembayaran = harga * 0.6;
        } else if (harga < 500000 && jenisPasien === false) {
            totalPembayaran = harga * 0.1;
        } else {
            totalPembayaran = harga;  
        }

        try {
            // Kirim data pemeriksaan ke server
            const response = await fetch('http://139.228.64.11:3000/api/pemeriksaan', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idPasien: idPasien,
                    namaPasien: namaPasien,
                    keluhan: keluhan,
                    diagnosaPasien: diagnosaPasien,
                    hasilPemeriksaan: hasilPemeriksaan,
                    jenisPasien: jenisPasien, 
                    totalPembayaran: totalPembayaran
                })
            });
            if(response.ok){
                await setPeriksa();
            }else{
                alert("ada apa?")
            }
            
            
        } catch (error) {
            alert(`berhasil: ${error}`);
            await setPeriksa();
            console.log(`Ada masalah di jaringan: ${error}`);
        }
    });

async function setPeriksa() {
    try {
        await fetch(`http://139.228.64.11:3000/api/editStatus/${idPasien}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                periksa: 1  
            })
        });
    } catch (e) {
        console.log("Error mengubah status: ", e);
    }
}

