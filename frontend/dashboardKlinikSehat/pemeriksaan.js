

document.addEventListener('DOMContentLoaded', async function(){
    const tabel = document.getElementById('tabelRiwayat')
    try{
        const respone = await fetch(`http://139.228.64.11:3000/api/pemeriksaan`);
        const pemeriksaanList = await respone.json()

        pemeriksaanList.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.namaPasien}</td>
                ${data.jenisPasien? 
                    `<td>Umum</td>` :
                    `<td>BPJS</td>`
                }               
                <td>${data.keluhan}</td>
                <td>${data.diagnosaPasien}</td>
                <td>${data.hasilPemeriksaan}</td>
                <td>${data.totalPembayaran}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-secondary disabled">
                    Telah Diperiksa
                    </button>
                </td>
            `
            tabel.appendChild(row)
        });

    }catch(e){

    }
})