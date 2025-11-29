# FLYS Shift Scheduling & Attendance System

A full-stack micro-system for scheduling team shifts and tracking employee attendance with geolocation-based anomaly detection. Built as part of the Full-Stack Interview Assignment.

## 🚀 Features
* **Hybrid Database Architecture:** PostgreSQL for structured relational data (Shifts, Teams) and MongoDB for high-volume attendance logs.
* **Conflict Detection:** Server-side enforcement prevents overlapping shift assignments.
* **Anomaly Detection:** Automated flagging of Late Arrivals, Early Exits, and Location Mismatches upon clock-out.
* **Role-Based Access Control (RBAC):** Distinct capabilities for Admins (Scheduling) vs. Employees (View & Attendance).

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Databases:** PostgreSQL (via `pg`), MongoDB (via `mongoose`)
* **Frontend:** React, Tailwind CSS, Vite
* **Auth:** JWT (JSON Web Tokens) with Bcrypt

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* Node.js (v14+)
* PostgreSQL (Running on port 5432)
* MongoDB (Running locally or via Atlas)

### 2. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    npm install
    ```
2.  Create a `.env` file in the `/backend` directory:
    ```properties
    PORT=5000
    NODE_ENV=development
    
    # SQL Database
    DB_USER=postgres
    DB_PASSWORD=your_password  <-- CHANGE THIS
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=flys_shift_system
    
    # Mongo Database
    MONGO_URI=mongodb://localhost:27017/flys_attendance_logs
    
    # Security
    JWT_SECRET=super_secret_key_123
    JWT_EXPIRES_IN=1d
    ```
3.  **Create SQL Database:**
    Open your SQL terminal (psql or pgAdmin) and run:
    ```sql
    CREATE DATABASE flys_shift_system;
    ```
4.  **Seed Data:**
    Run these scripts to populate Tables and Logs:
    ```bash
    npm run seed:sql
    npm run seed:mongo
    ```

### 3. Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd ../frontend
    npm install
    ```
2.  Start the frontend:
    ```bash
    npm run dev
    ```

---

## 🏃‍♂️ How to Run

1.  **Start Backend:** `cd backend && npm run dev` (Runs on http://localhost:5000)
2.  **Start Frontend:** `cd frontend && npm run dev` (Runs on http://localhost:5173)

### 🧪 Test Credentials
| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `alice@flys.com` | `password123` | Create shifts, Assign employees |
| **Employee** | `bob@flys.com` | `password123` | View schedule, Clock In/Out |

---

## ⏱️ Timebox & Scope
* **Timebox Chosen:** ~16 Hours
* **Status:** All mandatory features completed.
    * ✅ SQL Schema & APIs (Employees, Shifts, Teams).
    * ✅ Assignment Rules (Conflict, Qualification, Team checks).
    * ✅ MongoDB Attendance Logging.
    * ✅ Anomaly Detection (Late, Early, Location).
    * ✅ Frontend (3 Screens + Auth).

---

## 💡 Architectural Choices & Trade-offs

### 1. Hybrid Database Approach
* **Choice:** I used **PostgreSQL** for core business entities (Employees, Shifts) and **MongoDB** for Attendance Logs.
* **Reasoning:** Relational data requires strict integrity (Foreign Keys), which SQL handles best. Attendance logs are unstructured, write-heavy time-series data, making MongoDB a better fit for scalability and flexibility (e.g., adding new anomaly types without schema migrations).
* **Trade-off:** Adds complexity to the backend configuration (maintaining two connections) and requires ensuring consistency manually if an employee is deleted.

### 2. Service Layer Pattern
* **Choice:** Business logic (like checking for overlaps) is isolated in `services/` rather than inside Controllers.
* **Reasoning:** Keeps Controllers "thin" (focused on HTTP) and makes the logic reusable and easier to unit test.

### 3. Anomaly Detection Strategy
* **Choice:** Anomalies are calculated **Synchronously** during the Clock-Out request.
* **Trade-off:** This provides immediate feedback but could slow down the HTTP response if calculations become complex. In a production system, I would move this to an **Asynchronous Job Queue** (like BullMQ) to process anomalies in the background.
