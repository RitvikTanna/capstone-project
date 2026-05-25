# Capstone Project - MERN Blog Application

A full-stack MERN Blog Application developed as a capstone project. The application provides secure authentication, role-based access, blog management, and protected APIs using JWT authentication.

## Features

### Authentication System
- User Registration
- User Login
- Logout Functionality
- JWT Authentication
- Protected Routes
- HTTP Only Cookies
- Password Encryption using bcrypt

### User Features
- Create Blogs
- Read Blogs
- Update Blogs
- Delete Blogs
- User Profile Management

### Security
- Password Hashing
- Token Verification Middleware
- Role-Based Authorization
- Cookie-Based Authentication

---

## Tech Stack

### Frontend
- React.js
- Axios
- Zustand
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs

### Database
- MongoDB Atlas

### Deployment
- Vercel

---

## Project Structure

```bash
capstone-project/

├── Frontened-react/
│
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── blog app backened/
│
│   ├── APIS/
│   ├── middlewares/
│   ├── services/
│   ├── models/
│   ├── server.js
│   ├── package.json
│
└── README.md
```

---

## Installation

Clone repository

```bash
git clone https://github.com/RitvikTanna/capstone-project.git
```

Move into project folder

```bash
cd capstone-project
```

Frontend Setup

```bash
cd Frontened-react

npm install

npm run dev
```

Backend Setup

```bash
cd "blog app backened"

npm install

npm start
```

---

## Environment Variables

Backend `.env`

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

NODE_ENV=production
```

Frontend `.env`

```env
VITE_API_URL=
```

---

## API Routes

### Login

```http
POST /common-api/login
```

Request Body

```json
{
  "email":"user@gmail.com",
  "password":"password123"
}
```

### Logout

```http
GET /common-api/logout
```

### Authentication Check

```http
GET /common-api/check-auth
```

### Change Password

```http
PUT /common-api/change-password
```

---

## Deployment

Frontend and backend deployed using Vercel.

Deployment Steps:

1. Push project to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy frontend and backend
5. Verify API routes

---

## Future Improvements

- Blog Search Feature
- Comment System
- Email Verification
- Password Reset
- Image Upload Support
- User Dashboard

---

## Author

**Ritvik Tanna**

Engineering Student | MERN Stack Developer | AI Enthusiast

---

## License

Developed for learning and educational purposes.
