const mysql = require('mysql2/promise.js');

const konekDB = mysql.createPool({
    host : '139.228.64.11',
    port : 3307,
    user : 'zidanih',
    password : 'paswd03',
    database : 'klinik_sehat'
})

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