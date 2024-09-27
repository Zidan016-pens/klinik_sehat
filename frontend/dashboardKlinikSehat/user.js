document.addEventListener('DOMContentLoaded', function(){
    const tabel = document.getElementById('tabel');
    const btnEditUser = document.getElementById('editUser'); 
    const usernameBaru = document.getElementById('userID'); 
    const passBaru = document.getElementById('passID'); 
    const btnTambahUser = document.getElementById('tambahUser');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const roleUSer = document.getElementById('roleUSer');
    const roleUser = document.getElementById('jenisRole');
    let userID = null; 

    async function ambilUser(){
        try {
            const response = await fetch("http://139.228.64.11:3000/api/ambilUser");
            if (response.status === 200) {
                const userList = await response.json();
                userList.forEach(data => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${data.userID}</td>
                        <td>${data.roleUser}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-success btn-edit" data-userid="${data.userID}" data-toggle="modal" data-target="#exampleModal2">
                            Edit
                            </button>
                            <button type="button" class="btn btn-sm btn-danger btn-delete" data-userid="${data.userID}">
                            Delete
                            </button>
                        </td>
                    `;
                    tabel.appendChild(row);
                });

                document.querySelectorAll('.btn-edit').forEach(button => {
                    button.addEventListener('click', async function() {
                        const userId = this.getAttribute('data-userid');
                        userID = userId;
                    });
                });

                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', async function (){
                        const user = this.getAttribute('data-userid');
                        console.log(user);
                        try {
                            const response = await fetch(`http://139.228.64.11:3000/api/deleteUser/${user}`, {
                                method : "DELETE",
                                headers : {
                                    "Content-Type": "application/json",
                                }
                            });
                            if (response.ok) {
                                alert("data berhasil di hapus");
                                location.reload(); 
                            } else {
                                alert("Ada masalah saat menghapus data.");
                            }
                        } catch (e) {
                            alert(`Terjadi masalah pada server / jaringan : ${e}`);
                            console.log("Error: ", e);
                        }
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    
    btnEditUser.addEventListener('click', async () => {
        console.log("user : ", usernameBaru.value);
        console.log("pass :", passBaru.value);
        try {
            console.log("id btn", userID);
            const response = await fetch(`http://139.228.64.11:3000/api/editUser/${userID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userID: usernameBaru.value,
                    passID: passBaru.value,
                    roleUser: roleUser.value
                })
            });
            
            if (response.ok) {
                alert("Berhasil memperbarui data");
                location.reload();
            } else {
                alert(`Ada kesalahan saat input, status: ${response.status}`);
            }
        } catch (e) {
            alert(`Terjadi kesalahan saat memperbarui user ${userID}`);
            console.log("Terjadi kesalahan: ", e);
        }
    });

    btnTambahUser.addEventListener('click', async () => {
        try {
            const response = await fetch('http://139.228.64.11:3000/api/user/tambah', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userID: username.value,
                    passID: password.value,
                    roleUser: roleUSer.value
                })
            });
            
            if (response.ok) {
                alert("User berhasil ditambahkan");
                location.reload(); // Reload halaman setelah tambah
            } else {
                alert("Ada masalah saat input form tambah user");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    });

    ambilUser();
});


function getOtiritasi() {
    const getOT = localStorage.getItem('Otiritasi');
    if (getOT === null) {
        console.log("Otorisasi belum diketahui.");
        return false;
    }
    if (getOT === "false") {
        console.log("admin : ", getOT)
        alert("Maaf, anda bukan admin");
        return false;
    }

    if (getOT === "true") {
        console.log("Anda adalah admin", getOT);
        return true;
    }
}

window.onload = function() {
    const isAdmin = getOtiritasi();
    if(!isAdmin){
        window.location.href = 'index.html'
        return
    }
};
