const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const pool = require('./db')
const cros = require('cors')

app.use(bodyParser.json());
app.use(cros({
    origin: 'http://139.228.64.11:3000', // Ganti dengan domain frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
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

//ambil semua user
app.get('/ambilUser', async (req, res)=>{
    try {
        const query = 'SELECT * FROM `user`'
        const [rows] = await pool.konekDB.execute(query)
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//ambil user bedasarkan userID
app.get('/ambilUserId/:userID', async (req, res)=>{
    try {
        const userID = req.params.userID
        const query = 'SELECT * FROM `user` WHERE userID = ?';
        [rows] = await pool.konekDB.execute(query, [userID]);  
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//ambil tabel pemeriksaan bedasarkan username
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

//Tambah User
app.post('/user/tambah', async (req, res) => {
    try {
        const {userID, passID, roleUser} = req.body;
        const sql = 'INSERT INTO `user`(`userID`, `passID`, `roleUser`) VALUES (?, ?, ?)'
        await pool.konekDB.execute(sql, [userID, passID, roleUser]);
        res.status(200).json({message : 'data berhasil di insert'})
    } catch (error) {
        res.status(500).json({ message: `Ada masalah bang: ${error.message}` });
    }
    
})

//Edit User
app.put('/editUser/:user', async (req, res) => {
    try {
        const user = req.params.user;
        const {userID , passID, roleUser } = req.body;
        const sql = 'UPDATE `user` SET `userID` = ?, `passID` = ?, `roleUser` = ? WHERE `userID` = ?';
        await pool.konekDB.execute(sql, [userID, passID, roleUser, user]);
        res.status(200).json({message : 'user berhasil diperbarui'});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//Delete User
app.delete('/deleteUser/:user', async (req, res) => {
    try{
        const userID = req.params.user;
        const sql ='DELETE FROM `user` WHERE userID = ?';
        await pool.konekDB.execute(sql, [userID]);
        res.status(200).json({message : 'user berhasil dihapus'});
    } catch(error) {
        res.status(500).send(error.message);
    }
})

app.post('/tambahPasien', async (req, res) =>{
    console.log(req.body);
    try {
        const {namaPasien, fotoPasien, keluhan, diagnosaPasien, harga, hasilPemeriksaan, resepPemeriksaan, idKategori, periksa} = req.body;
        const query = 'INSERT INTO `pasien`(`namaPasien`, `fotoPasien`, `diagnosaPasien`, `keluhan`, `harga`, `hasilPemeriksaan`, `resepPemeriksaan`, `idKategori`, `periksa`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'

        await pool.konekDB.execute(query, [namaPasien, fotoPasien, diagnosaPasien, keluhan, harga, hasilPemeriksaan, resepPemeriksaan, idKategori, periksa]);
        res.status(200).json({message : 'data berhasil di input'})
    } catch (error) {
        res.status(500).json(`ada masalah : ${error}`)
    }
})

app.put('/editPasien/:idPasien', async (req, res)=>{
    console.log(req.body);
    try{
        const idPasien = req.params.idPasien
        const {namaPasien, fotoPasien, keluhan, diagnosaPasien, harga, hasilPemeriksaan, resepPemeriksaan, idKategori} = req.body

        const query = 'UPDATE `pasien` SET `namaPasien`= ?,`fotoPasien`= ?, `diagnosaPasien`= ?, `keluhan`= ?, `harga`= ?,`hasilPemeriksaan`= ?,`resepPemeriksaan`= ?,`idKategori`= ? WHERE `idPasien` = ?'

        await pool.konekDB.execute(query, [namaPasien, fotoPasien, diagnosaPasien, keluhan, harga, hasilPemeriksaan, resepPemeriksaan, idKategori, idPasien])

        res.status(200).json({message : 'data berhasil diubah'})
    }catch(e){
        res.status(500).json({message : `ada error : ${e}`})
    }
})

app.put('/editStatus/:idPasien', async(req, res)=>{
    try {
        const idPasien = req.params.idPasien;
        const periksa = req.body ? 1 : 0
        const query = 'UPDATE `pasien` SET `periksa`= ? WHERE `idPasien` = ?'
        await pool.konekDB.execute(query, [periksa, idPasien])
        res.status(200).json({message : "berhasil"})
    } catch (error) {
        res.status(500).json({message : `gagal : ${error}`})
    }
   
})

app.get('/pasien', async (req, res) =>{
    try {
        const [row] = await pool.konekDB.query('SELECT * FROM `pasien`')
        res.status(200).json(row)
    } catch (error) {
        res.status(500).json({message : `ada masalah pemanggilan : ${error}`})
    }
})

app.get('/pasien/:idPasien', async (req, res) =>{
    try {
        const idPasien = req.params.idPasien
        const query = 'SELECT * FROM `pasien` WHERE `idPasien` = ? '
        const [row] = await pool.konekDB.execute(query, [idPasien])
        res.status(200).json(row)
    } catch (error) {
        res.status(500).json({message : `ada masalah pemanggilan : ${error}`})
    }
})

app.delete('/pasienDelete/:user', async (req, res) => {
    try{
        const idPasien = req.params.user;
        const sql ='DELETE IGNORE FROM `user` WHERE `idPasien` = ?';
        await pool.konekDB.execute(sql, [idPasien]);
        res.status(200).json({message : 'user berhasil dihapus'});
    } catch(error) {
        res.status(500).send(error.message);
    }
})

app.get('/pasienSakit/:idKategori', async (req, res)=>{
    try {
        const idKategori = req.params .idKategori
        const query = 'SELECT * FROM `pasien` WHERE `idKategori` = ?;'
        const [row] = await pool.konekDB.execute(query, [idKategori])
        res.status(200).json(row)
    } catch (error) {
        res.status(500).json({message : "ada kesalahan"})
    }
})

app.get('/pemeriksaan', async (req, res)=>{
    try{
        const [row] = await pool.konekDB.query('SELECT * FROM `pemeriksaan`');
        res.status(200).json(row)
    }catch(e){
        res.status(500).json({message : `ada masalah pemanggilan : ${e}`})
        console.log(`ada masalah pemanggilan : ${e}`)
    }
})

app.post('/pemeriksaan', async (req, res)=>{
    console.log(req.body)
    try {
        const {idPasien, namaPasien, keluhan, diagnosaPasien, hasilPemeriksaan, jenisPasien, totalPembayaran} = req.body
        const query = 'INSERT INTO `pemeriksaan`(`idPasien`, `namaPasien`, `keluhan`, `diagnosaPasien`, `hasilPemeriksaan`, `jenisPasien`, `totalPembayaran`) VALUES (?, ?, ?, ?, ?, ?, ?)'

        await pool.konekDB.execute(query, [idPasien, namaPasien, keluhan, diagnosaPasien, hasilPemeriksaan, jenisPasien, totalPembayaran])

        res.status(200).json({message : `data berhasil ditambahkan`})
    } catch (error) {
        res.status(500).json({message : `ada masalah pengiriman : ${error}`})
    }
})

//masuk di htmlnya sama jsnya berarti mbak
module.exports = app;
