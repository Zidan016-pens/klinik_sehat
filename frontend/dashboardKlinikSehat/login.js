const btn = document.getElementById('btnLogin');
const usernameInput = document.getElementById('exampleInputEmail')
const passwordInput = document.getElementById('exampleInputPassword')

function login(){
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username == "" && password == ""){
        alert("username dan password tidak boleh kosong")
        return
    } 

    fetch(`http://192.168.11.91:3000/login/${username}/${password}`,{
        method : "GET"
    })
    .then(respone => {
        if (respone.status === 200){
            window.location.href = 'index.html'
        }else if(respone.status === 401){
            alert("gagal login password/username salah");
        }
    })
    .catch(err =>{
        alert("terjadi error pada server ", err)
        console.log(err.message);
    })
}
btn.addEventListener('click', login)
