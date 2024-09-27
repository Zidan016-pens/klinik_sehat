function kirim() {
    fetch("http://localhost:3000/api/editUser/admin1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID: 'petugas1',
            passID: 'petugas1',
            roleUser: 'petugas'
        })
    }).then(res => {
        if (res.ok) { 
            console.log("berhasil input");
        } else {
            console.log("Error: ", res.status, res.statusText);
        }
    }).catch(e => {
        console.log("Server error: ", e);
    });
}

kirim();
