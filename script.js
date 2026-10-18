const API_URL = "http://localhost:5000/api/auth";

// Signup form
const signupForm = document.getElementById("signupForm");

// Login form
const loginForm = document.getElementById("loginForm");


// Show / Hide Password
const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const passwordInput = document.getElementById("password");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
            togglePassword.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
            togglePassword.setAttribute("aria-label", "Show password");
        }
    });
}


// Display messages
function showMessage(message, isSuccess = false) {
    const messageElement = document.getElementById("message");

    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? "green" : "red";
    }
}


// Signup API
if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const signupButton = document.getElementById("signupButton");

        // Validate password
        if (password.length < 8) {
            showMessage("Password must be at least 8 characters long.");
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        try {
            signupButton.disabled = true;
            signupButton.textContent = "Creating Account...";

            showMessage("");

            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed.");
            }

            showMessage(
                data.message || "Account created. Check your email for verification.",
                true
            );

            signupForm.reset();

        } catch (error) {
            console.error("Signup error:", error);

            showMessage(
                error.message || "Unable to connect to the server."
            );

        } finally {
            signupButton.disabled = false;
            signupButton.textContent = "Create Account";
        }
    });
}


// Login API
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const loginButton = document.getElementById("loginButton");

        try {
            loginButton.disabled = true;
            loginButton.textContent = "Logging In...";

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

            // Save token for authenticated API requests
            if (data.token) {
                sessionStorage.setItem("authToken", data.token);
            } else {
                throw new Error("Login succeeded, but no token was returned.");
            }

            showMessage(
                data.message || "Login successful!",
                true
            );

            // Redirect only after successful login
            // Change this to your actual dashboard filename later.
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
}