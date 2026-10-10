async function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        document.getElementById("message").textContent = data.message;

    } catch (error) {
        console.log(error);
        alert("Cannot connect to server");
    }
}