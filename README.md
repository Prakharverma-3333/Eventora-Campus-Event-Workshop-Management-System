# 🎟️ Eventora — Campus Event & Workshop Management System

Eventora is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for discovering, booking, and managing campus events, workshops, hackathons, and cultural fests.

---

## ✨ Key Features

### 👤 Student / User Features
* **Event Discovery:** Browse upcoming campus events with category filtering (Coding, Tech, Cultural, Music, Workshops, Sports, Gaming, Hackathons, Dance, Drama, Debate).
* **Email OTP Verification:** Secure seat booking with one-time password verification sent to email.
* **My Bookings Dashboard:** Track real-time status of pending, confirmed, and cancelled tickets.
* **Easy Cancellations:** Cancel active bookings with instant seat restoration.

### 🛡️ Admin Features
* **Admin Dashboard:** Real-time analytics showing total events, approved bookings, pending requests, and revenue metrics.
* **Event Management:** Create and delete events with custom categories, capacities, ticket prices, dates, and cover images.
* **Booking Approvals:** Approve paid bookings (`Approve as Paid`), confirm free bookings (`Confirm Seat`), or reject requests.
* **Automatic Seat Management:** Dynamic seat count deduction on booking and automatic refund/restoration on cancellation or rejection.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), React Router DOM, Axios, TailwindCSS, React Icons
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Token (JWT), bcryptjs, Nodemailer
* **Process Management:** Concurrently (Runs client & server in a single terminal)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 2. Installation
Clone the repository and install all dependencies (root, server, and client) with a single command:

```bash
git clone https://github.com/your-username/event-application.git
cd event-application

# Install root, server, and client dependencies at once
npm run install:all
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the `server/` directory (you can copy `server/.env.example` as a template):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventora
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

## 📦 Database Seeding

Populate the database with sample events, categories, and test user accounts:

```bash
npm run seed
```

---

## 🔑 Default Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@eventora.com` | `password123` |
| **Secondary Admin** | `admin1@eventora.com` | `password123` |
| **Student / User** | `user@eventora.com` | `password123` |

---

## 💻 Running the Application

Run both the backend server and frontend client concurrently with a single command from the root directory:

```bash
npm run dev
# OR
npm start
```

* **Frontend App:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 📜 Available NPM Scripts

From the root directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` / `npm start` | Runs **both** server & client concurrently |
| `npm run install:all` | Installs dependencies for root, server, and client |
| `npm run seed` | Runs MongoDB database seed script |
| `npm run server` | Runs only the backend server |
| `npm run client` | Runs only the frontend Vite client |
| `npm run client:build` | Builds the frontend for production |

---

## 👤 Author

**Made by Prakhar Verma**
