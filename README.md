# Agent Management & Task Distribution System

A full-stack MERN application that allows administrators to manage agents, upload CSV/XLS/XLSX files, preview task records, and distribute tasks evenly among agents using a round-robin algorithm.

## Features

* Admin Authentication (JWT + HTTP-only Cookies)
* Agent Management
* CSV/XLS/XLSX File Upload
* Task Preview Before Distribution
* Automatic Round-Robin Task Assignment
* MongoDB Persistence
* Modern Next.js Dashboard UI

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* Multer
* XLSX
* CSV Parser

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/champati-v/Agent-Task-Management.git
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

## Run Backend

```bash
npm run dev
```

Backend will start on:

```txt
http://localhost:5000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Run Frontend

```bash
npm run dev
```

Frontend will start on:

```txt
http://localhost:3000
```

---

# Application Flow

1. Login as Admin --> (Use Email: admin@gmail.com and Password: 123456)
2. Create Agents
3. Upload CSV/XLS/XLSX File
4. Preview Parsed Records
5. Confirm Distribution
6. Tasks are Assigned Using Round Robin
7. View Distributed Tasks

---

# Task Distribution Logic

Tasks are distributed evenly among all available agents using a round-robin algorithm.

Example:

```txt
Agents: A, B, C

Task1 → A
Task2 → B
Task3 → C
Task4 → A
Task5 → B
Task6 → C
```

If no agents exist, task distribution is blocked.

---

# Accepted File Formats

* .csv
* .xls
* .xlsx

Required Columns:

```txt
FirstName
Phone
Notes
```

---

# Default Ports

| Service  | Port |
| -------- | ---- |
| Frontend | 3000 |
| Backend  | 5000 |

---