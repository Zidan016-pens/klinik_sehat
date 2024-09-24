const mysql = require('mysql2/promise.js');

const konekDB = mysql.createPool({
    host : '192.168.11.91',
    port : 3307,
    user : 'zidanih',
    password : 'paswd03',
    database : 'klinik_sehat2'
})

//halo mbak cobak ketik apa gitu wkwk 
//oke berati bisa bagi tugas ya mbak?
async function seleksi() {
    try{
        const test = await konekDB.getConnection();
        console.log("berhasil konek db abangku");
        test.release();
    }catch(e){
        console.log("ada error bosku :", e)
    }
}

if (require.main == module){
    seleksi();
}

module.exports = {
    konekDB, seleksi
};