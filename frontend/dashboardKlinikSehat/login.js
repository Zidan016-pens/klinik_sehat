const btn = document.getElementById('btnLogin');
const usernameInput = document.getElementById('exampleInputEmail');
const passwordInput = document.getElementById('exampleInputPassword');

function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === "" || password === "") {
        alert("Username dan password tidak boleh kosong");
        return;
    }

    fetch(`http://139.228.64.11:3000/api/login/${username}/${password}`, {
        method: "GET"
    })
    .then(response => {
        if (response.status === 200) {
            return response.json(); 
            
        } else {
            alert("Gagal login, password/username salah");
            return null;
        }
    })
    .then(admin => {
        if (admin) {
            const roleUser = admin.user[0]?.roleUser;
            alert(roleUser)
            if (roleUser === 'Admin') {
                localStorage.setItem('Otiritasi', "true");
            } else {
                localStorage.setItem('Otiritasi', "false");
            }
            window.location.href = 'index.html';
        }
    })
    .catch(err => {
        alert("Terjadi error pada server: " + err.message);
        console.log(err.message);
    });
}

btn.addEventListener('click', login);
