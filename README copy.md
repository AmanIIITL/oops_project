# Smart Vending Machine System

A full-stack application for managing a Smart Vending Machine, featuring user authentication, product management, shopping cart, and transaction history.

## Features

### Customer Features
- Account creation and login
- Wallet management (add/view balance)
- Browse available products
- Add products to cart
- Checkout and complete purchases
- View transaction history
- Download purchase receipts as PDF

### Admin Features
- Secure admin login
- Manage product inventory
- View all transactions
- View customer accounts

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.2
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL database
- iText PDF for receipt generation

### Frontend
- React 18
- Material UI for responsive design
- React Router for navigation
- Axios for API communication
- JWT for authentication

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- PostgreSQL 12 or higher
- Maven

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a database named `smartvms`:
   ```sql
   CREATE DATABASE smartvms;
   ```
3. The default credentials are:
   - Username: `postgres`
   - Password: `postgres`
   
   If you use different credentials, update them in `backend/src/main/resources/application.yml`

## Running the Application

### Option 1: Using Scripts (Recommended)

#### On Windows:
```
run.bat
```

#### On macOS/Linux:
```bash
chmod +x run.sh
./run.sh
```

### Option 2: Manual Setup

#### Backend:
```bash
cd backend
mvn spring-boot:run
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

## Default Admin Credentials

- Username: admin123
- Password: aman

## API Documentation

The REST API endpoints follow this structure:

- Authentication: `/api/auth/**`
- Products: `/api/products/**`
- Transactions: `/api/transactions/**`
- Users: `/api/users/**`

## License

This project is licensed under the MIT License - see the LICENSE file for details. 