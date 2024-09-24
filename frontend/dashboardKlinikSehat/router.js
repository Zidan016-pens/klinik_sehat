// Middleware untuk memeriksa apakah pengguna sudah login
function checkAuth(req, res, next) {
    if (req.session.user && req.session.user.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Rute untuk halaman login
app.get('/login', (req, res) => {
    res.send('<form method="post" action="/login">\
                Username: <input type="text" name="username"/><br>\
                Password: <input type="password" name="password"/><br>\
                <input type="submit" value="Login"/>\
              </form>');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Gantilah proses autentikasi ini dengan yang sesuai dengan kebutuhan Anda
    if (username === 'admin' && password === 'password') {
        req.session.user = { loggedIn: true };
        res.redirect('/dashboard');
    } else {
        res.send('Login failed');
    }
});

// Rute untuk halaman dashboard, yang hanya bisa diakses jika sudah login
app.get('/dashboard', checkAuth, (req, res) => {
    res.send('Welcome to the dashboard');
});

// Rute untuk logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
