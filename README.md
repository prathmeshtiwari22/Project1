# 📊 Finance Tracker – MERN Full-Stack Application

A complete **Finance Tracking Web Application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with full authentication, dashboard UI, transaction filtering, sorting, user profile system, and JWT-based security.

This system helps users manage **income**, **expenses**, and analyze their financial activity.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based Login & Signup  
- OTP verification for forgot password (if implemented)  
- Secure route protection  
- Token stored safely in localStorage  

### 📈 Dashboard
- Add new transactions (income / expense)  
- View all transactions  
- Modern UI with Material UI  
- Pagination support  

### 🔍 Filtering & Sorting
- Filter by:
  - Transaction Type (income / expense)
  - Date range
  - Amount range  
- Sorting by:
  - Date  
  - Amount  
  - Type  
- Sort order (ASC / DESC)  

### 👤 User Profile
- View profile details  
- Update profile (name, email, etc.)  
- Logout that clears JWT  

### 🎨 UI/UX
- Built using:
  - React + Vite  
  - Material UI (MUI)  
  - Lucide Icons  
- Fully responsive  
- Smooth animations and interactions  

### 🛠 Backend Features
- Express.js API  
- MongoDB & Mongoose schema validation  
- JWT authentication  
- Bcrypt password hashing  
- Secure protected routes  
- Aggregation filters  
- Pagination  

---

## 🧰 Tech Stack

### **Frontend**
- React.js (Vite)
- Material UI  
- Axios  
- React Router  
- Lucide Icons  

### **Backend**
- Node.js  
- Express.js  
- MongoDB / Mongoose  
- JWT  
- Bcrypt  
- dotenv  

---

## 📁 Folder Structure

│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── config/
│ ├── middleware/
│ └── server.js
│
└── frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── pages/
│ ├── App.jsx
│ └── main.jsx


---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
cd backend
npm install
--create env
MONGO_URI=your_mongodb_connection_url
JWT_SECRET=your_jwt_secret_key
PORT=6969
npm run dev
http://localhost:5000


