
# Authentication System — Frontend

A responsive authentication interface built with HTML, CSS, and JavaScript, connected to a Node.js and Express.js backend.

## Features

- User registration form
- User login form
- Email and password inputs
- Confirm password validation
- Show and hide password
- API integration using Fetch
- JWT token storage for the browser session
- Success and error messages
- Responsive design for mobile and desktop

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Fetch API
- Node.js and Express.js backend

## Project Structure

```text
frontend/
├── login.html
├── login.css
├── login.js
├── signup.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

## Run Locally

1. Clone or download this repository.
2. Start the authentication backend on `http://localhost:5000`.
3. Open `signup.html` or `login.html` in your browser.
4. Register an account and verify your email if required by the backend.
5. Log in using your registered credentials.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Log in a user |

## Security Notes

- Never commit passwords, `.env` files, or secret keys.
- The backend must validate credentials and verify JWTs.
- `localhost` works only with a backend running on your own computer.
- JWT storage in `sessionStorage` is for this demo; production applications need an appropriate security review.

## Future Improvements

- Email verification screen
- Password reset
- Protected dashboard
- Better form accessibility and validation
