const express = require('express')
const router = express();
const db = require('./db')
const path = require('path')
const session = require('express-session')
const api = require('./controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.use(session({
    secret : 'secret-key',
    resave : false,
    saveUninitialized : false
}));

router.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, 'frontend/dashboardKlinikSehat/login.html'))
});

router.get('/', (req, res)=>{
    res.redirect('/login')
});


(async () => {
    try {
        await db.seleksi();
    } catch (error) {
        console.log('erro cak : ', error);
    }
})();

router.use(express.static(path.join(__dirname, 'frontend/dashboardKlinikSehat')))

function harusLogin(req, res, next){
    if(!req.session.user){
        return res.redirect('/login')
    }
    next();
}

router.use('/api', api);

router.get('/index', harusLogin, (req, res)=>{
    res.sendFile(path.join(__dirname, 'frontend/dashboardKlinikSehat/index.html'))
});

const port = process.env.PORT || 3000
router.listen(port, '0.0.0.0',()=>{
    console.log("berjalan di : ip:3000")
});