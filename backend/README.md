# Node.js Authentication API

A backend authentication system built with **Node.js, Express.js, and MongoDB**. This project implements user registration, email verification, login using JWT, protected profile access, and logout.

## Features

- User registration (Signup)
- Password hashing using bcrypt
- Email verification through Nodemailer
- Email verification token with expiration
- Resend verification email
- User login with JWT authentication
- Protected profile endpoint
- Logout endpoint
- Input validation and error handling
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Nodemailer
- dotenv
- Postman

## API Endpoints

Base URL: `http://localhost:5000/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| GET | `/verify-email` | Verify the user's email |
| POST | `/resend-verification` | Resend verification email |
| POST | `/login` | Log in and receive a JWT |
| GET | `/profile` | Get the authenticated user's profile |
| POST | `/logout` | Return the logout response |

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your actual repository URL and project folder.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend folder and configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
API_URL=http://localhost:5000
EMAIL_USER=your_sender_email
EMAIL_PASS=your_google_app_password
JWT_SECRET=your_random_secret
```

**Security:** Never upload your `.env` file or share passwords, email app passwords, database credentials, or JWT secrets publicly.

### 4. Start the server

Run the command from the backend folder:

```bash
node server.js
```

The server should start on port 5000, and MongoDB should connect successfully.

## Testing with Postman

### Signup

`POST /api/auth/signup`

```json
{
  "name": "API Test User",
  "email": "your_email@example.com",
  "password": "YourStrongPassword123!"
}
```

### Email Verification

Open the verification link received in your email. The server should confirm that the email has been verified.

### Login

`POST /api/auth/login`

```json
{
  "email": "your_email@example.com",
  "password": "YourStrongPassword123!"
}
```

A successful login returns a JWT token.

### Get Profile

`GET /api/auth/profile`

In Postman, select **Authorization → Bearer Token** and enter the JWT returned by the login endpoint.

### Logout

`POST /api/auth/logout`

The current endpoint returns a logout message. The client should discard its token. The current implementation does not revoke the JWT server-side.

## What I Learned

- Building REST APIs with Express.js
- Connecting Node.js to MongoDB
- Creating and validating user accounts
- Hashing passwords securely
- Sending email verification links
- Generating and verifying JWT tokens
- Protecting routes with authentication middleware
- Testing API endpoints with Postman
- Managing environment variables

## Future Improvements

- Server-side token revocation
- Password reset functionality
- Refresh token implementation
- Rate limiting and stronger security controls
- Automated API tests

## Author

**Areeba Mazhar**

GitHub: [areebamazhar223-jpg](https://github.com/areebamazhar223-jpg)
