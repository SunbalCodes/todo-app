# Todo App

A full-stack **Todo Application** built with **React** for the frontend and **Node.js (Express)** for the backend. This application allows users to register, login, and manage their tasks efficiently with a secure authentication system.

## Features

### Frontend
- User authentication (Register, Login, Logout).
- Add, update, complete, and delete todos.
- Filtering of todos (All, Active, Completed).
- Fully responsive and styled using CSS.
- Client-side input validation for secure and seamless usage.

### Backend
- Secure user authentication using **JWT**.
- Error handling with centralized middleware.
- Validation for all user inputs.
- RESTful API for todos (CRUD operations).
- Secure practices implemented:
  - Rate limiting for auth routes.
  - Request sanitization to prevent malicious inputs.
  - Secure cookies for token management.
- MongoDB for data storage with Mongoose ODM.

---

## Folder Structure

### Backend
backend/ 
              ├── middleware/ 
                            ├── authMiddleware.js # Authorization and authentication logic │ 
                            ├── errorMiddleware.js # Centralized error handling │ 
              ├── models/ 
                            ├── User.js # Schema for user data 
                            ├── Todo.js # Schema for todos │ 
              ├── routes/ 
                            ├── auth.js # Routes for user authentication │ 
                            ├── todos.js # Routes for managing todos │ 
              ├── server.js # Main entry point for the backend 
              ├── .env # Environment variables for sensitive data
        
### Frontend
frontend/src/ 
              ├── components/  
                              ├── auth/ │ 
                                          ├── Login.js # Login page component │ 
                                          ├── Register.js # Registration page component 
                                          ├── Auth.css # CSS for authentication pages │ 
                              ├── TodoApp.js # Main Todo App component 
                              ├── TodoApp.css # CSS for Todo App
              ├── context/ │ 
                              ├── AuthContext.js # React Context for managing user state 
              ├── App.js # Main App component 
              ├── App.css # Global styles 
              ├── index.js # React app entry point



## Prerequisites

- **Node.js** (v14+ recommended)
- **MongoDB** (Local or Cloud-based Atlas cluster)
- **NPM**

---

## Setup and Installation

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend

---

## Usage
1) Register as a new user.
2) Login using your credentials.
3) Add new todos, mark them as completed, update their status, or delete them.
4) Filter todos by "Active" and "Completed" tasks.
5) Logout when done.

## Known Issues
1. Backend "path-to-regexp" Error
If the backend encounters a Missing parameter name error, ensure that: All incoming URLs are relative (e.g., /api/todos) and do not contain full URLs like https://.... Log and debug malformed requests using middleware. Review any proxy configurations that could misroute requests.
2. MongoDB Connection
Ensure the MONGO_URI in your .env file is correct and points to an accessible MongoDB instance.
