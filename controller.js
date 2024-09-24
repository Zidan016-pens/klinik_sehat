const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const pool = require('./db')
const cros = require('cors')

app.use(bodyParser.json());
app.use(cros());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res)=>{
    try {
        res.send("halo")
    } catch (error) {
        res.send(error);
    }
});

//login 
app.get('/login/:username/:password', async (req,res)=>{
    try {
        const username = req.params.username;
        const password = req.params.password;
        const query = 'SELECT * FROM `user` WHERE (userID = ? AND passID = ?)'
        const [rows] = await pool.konekDB.execute(query, [username, password]);
        if (rows.length > 0) {
            res.status(200).json({ message: 'Login berhasil', user: rows });
        } else {
            res.status(401).json({ message: 'Username atau password salah' });
        }    
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//ambil tabel pasien
app.get('/pasien', async (req, res)=>{
    try {
        const [rows] = await pool.konekDB.query('SELECT * FROM `pasien`')
        res.json(rows)
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//ambil tabel pemeriksaan 
app.get('/pemeriksaan/:username', async(req, res)=>{
    try {
        const pasien = req.params.username
        const query = 'SELECT * FROM `pemeriksaan` WHERE namaPasien = ?';
        const [rows] = await pool.konekDB.execute(query, [pasien])
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.get('/dashboard', async(req, res)=>{
    try{
        const query = 'SELECT p.namaPasien, p.keluhan, p.fotoPasien, p.daignosA AS diagnosaPasien, p.tanggalPeriksa, p.harga, p.hasilPemeriksaan, p.resepPemeriksaan, pr.keluhanPasien, pr.diagnosaPasien AS diagnosaPemeriksaan, pr.totalPembayaran FROM pasien p INNER JOIN pemeriksaan pr ON p.namaPasien = pr.namaPasien ;'
        const [rows] = await pool.konekDB.execute(query)
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(401).json({ message: 'Username atau password salah' });
        }  
    }catch(err){

    }
})

//server berjalan di port 3000
const port = process.env.PORT || 3000
app.listen(3000, '0.0.0.0',()=>{
    console.log("berjalan di : ip:3000")
});
