# ⚽ Real-Time Football Match Tracker

![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A full-stack application that broadcasts live football match scores and events (goals, cards) to users in real-time. Built to demonstrate **Server-Sent Events (SSE)** for high-performance, one-way real-time communication, structured using **Clean Architecture** principles in Go.
## ⚙️ Installation & Setup

Follow these steps to get the **Football Match Tracker** running on your local machine.

### 📋 Prerequisites
Ensure you have the following installed on your system:
*   **[Go](https://go.dev/dl/)** (v1.21 or higher)
*   **[Node.js](https://nodejs.org/)** (v18 or higher)
*   **MongoDB** (Running locally on port `27017` or via MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/football-tracker.git
cd football-tracker
```
### 3. Prerequisites installs
```bash
https://github.com/gin-gonic/gin
go get go.mongodb.org/mongo-driver/v2/mongo
```
### 2. Backend setup
```bash
# From the root directory
go mod tidy
go run cmd/api/main.go
```
### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
## 🚀 Features
### 📢 User Experience (Public)
*   **Live Dashboard:** View all ongoing matches with real-time score updates without refreshing the page.
*   **Match Details:** Click into a match to see a live timeline of events (Goals, Cards, Fouls).
*   **Zero Latency:** Updates are pushed instantly from the server via Event Streams.

### 🛡️ Admin Dashboard (Private)
*   **Match Creation:** Schedule new matches between teams.
*   **Control Room:** Start matches and log events (Goals/Cards) with a single click.
*   **Stream Management:** Updates made in the admin panel are immediately broadcast to all connected users.

## 🛠️ Tech Stack

### Backend
*   **Language:** Go (Golang)
*   **Framework:** [Gin Web Framework](https://github.com/gin-gonic/gin)
*   **Database:** MongoDB
*   **Architecture:** Clean Architecture (Domain, Usecase, Repository, Delivery)
*   **Real-time:** Server-Sent Events (SSE)

### Frontend
*   **Library:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Routing:** React Router DOM

## 📂 Project Structure

The backend follows the Clean Architecture pattern to ensure decoupling and testability:

```text
football-tracker/
├── cmd/api/            # Application entry point
├── internal/
│   ├── domain/         # Business entities & interfaces (Core)
│   ├── usecase/        # Application business logic
│   ├── repository/     # Database implementations (MongoDB)
│   └── delivery/http/  # HTTP Handlers (Gin)
├── pkg/stream/         # SSE Manager implementation
└── frontend/           # React application
