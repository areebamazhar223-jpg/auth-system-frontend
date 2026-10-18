const API_URL = "http://localhost:5000/api/auth";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

// Show success or error message
function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#16803c" : "#dc2626";
}

// Show / Hide Password
const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const passwordInput = document.getElementById("password");

        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";
        togglePassword.textContent = isHidden ? "Hide" : "Show";

        togglePassword.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );
    });
}

// Login form submission
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMessage("Please enter your email and password.");
        return;
    }

    try {
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";
        showMessage("");

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        if (!data.token) {
            throw new Error("Login response did not include a token.");
        }

        // Store JWT for the current browser tab session
        sessionStorage.setItem("authToken", data.token);

        showMessage(
            data.message || "Login successful!",
            true
        );

        // Dashboard redirect baad mein add karenge
        // window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);

        showMessage(
            error.message || "Unable to connect to the server."
        );
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Log In";
    }
});