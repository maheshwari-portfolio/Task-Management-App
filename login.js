document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Login successful!";
            window.location.href = "index.html";
        } else {
            message.textContent = data.message || "Login failed!";
        }
    } catch (error) {
        message.textContent = "Cannot connect to server!";
    }
});