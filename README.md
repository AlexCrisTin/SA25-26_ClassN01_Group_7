# SA25-26_ClassN01_Group_7

Software Architecture Group 7

### Members:
- Tran Ngoc An - AlexCrisTin
- Le Manh Duc - duc198sl
- Nguyen Hung Thanh - HungThanh-web
- Pham The Thuy Hoang - hoangZenKo

# Hotel Management System

A hotel management system built with Layered Architecture, supporting room management, booking, payment, services, and administrative functions.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Usage Guide](#usage-guide)

## Overview

The Hotel Management System is a full-stack web application that enables:
- **Customers**: Register, login, view rooms, make bookings, process payments, manage bookings
- **Receptionist**: Manage bookings, check-in, check-out, manage service requests
- **Administrator**: Manage rooms, staff, users, services, reports and statistics

## Technologies Used

### Backend
- **Python 3.x**
- **Flask 3.1.2** - Web framework
- **MySQL** - Database
- **mysql-connector-python 9.5.0** - MySQL driver
- **flask-cors 6.0.2** - CORS support
- **python-dotenv 1.2.1** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **Fetch API** - HTTP requests

### Architecture
- **Layered Architecture** (Presentation, Business Logic, Persistence, Data)
- **RESTful API** design
- **Role-Based Access Control (RBAC)**

## Project Structure

```
SA25-26_ClassN01_Group_7/
├── Documents/              # Project documentation (plan, SRS, lab reports)
├── Design/                 # Architectural design documentation
│   ├── database_schema.sql # Database schema
│   └── *.png              # Diagrams (C4, UML, Component)
├── homework/              # Lab assignments
├── SRC/                   # Source code
│   ├── Arch/             # Backend (Architecture layer)
│   │   ├── app.py        # Flask application entry point
│   │   ├── db_config.py  # Database configuration
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── services/     # Business logic layer
│   │   ├── repository/   # Data access layer
│   │   ├── models/       # Data models
│   │   ├── views/        # Response formatters
│   │   ├── middleware/   # Authentication & authorization
│   │   └── utils/        # Utility functions
│   └── UI/               # Frontend
│       ├── index.html    # Landing page (root)
│       ├── auth/         # Authentication pages
│       │   ├── login.html
│       │   └── register.html
│       ├── public/       # Public pages (no login required)
│       │   ├── rooms.html
│       │   ├── room-detail.html
│       │   └── contact.html
│       ├── user/         # User features (login required)
│       │   ├── dashboard.html
│       │   ├── my-bookings.html
│       │   ├── payment.html
│       │   └── wallet.html
│       ├── admin/        # Admin & Staff panels
│       │   ├── admin.html
│       │   ├── admin-messages.html
│       │   └── receptionist.html
│       ├── css/          # Stylesheets
│       ├── js/           # JavaScript files
│       ├── images/       # Images
│       └── uploads/      # Uploaded files
├── requirements.txt       # Python dependencies
├── Changelog            # Version history
└── README.md            # This file
```

## Installation & Setup

### System Requirements
- Python 3.8+
- MySQL 5.7+ or MySQL 8.0+
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd SA25-26_ClassN01_Group_7
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Database Configuration
1. Create MySQL database:
```sql
CREATE DATABASE hotel_management;
```

2. Run schema creation script:
```bash
mysql -u root -p hotel_management < Design/database_schema.sql
```

3. Create `.env` file in `SRC/Arch/` directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_management
```

### Step 4: Run Backend Server
```bash
cd SRC/Arch
python app.py
```

Server will run at `http://localhost:5000`

If you cant connected to MySQL server on "localhost:3306" like this 'mysql.connector.errors.DatabaseError: 2003 (HY000): Can't connect to MySQL server on 'localhost:3306' (10061)'
You should check Task Manager and go to Services, search for MYSQL80 and start it

### Step 5: Open Frontend
Open `SRC/UI/index.html` in browser or use local server:
```bash
cd SRC/UI
python -m http.server 8000
```

Access `http://localhost:8000`

## Key Features

### For Customers (User)
- User registration and login
- View room list with filters
- View room details
- Make bookings with check-in/check-out date selection
- Payment via e-wallet or cash
- View and manage bookings
- Cancel bookings with reason
- Order additional services during stay
- View ordered services
- Dashboard showing currently used rooms

### For Receptionist
- Manage bookings (view, confirm, cancel)
- Check-in customers with automatic room assignment
- Check-out with total calculation (room + services)
- Manage service requests (view, update status)
- Search bookings by customer name
- Handle multiple rooms for the same customer

### For Administrator
- Room management (CRUD)
- Staff management (CRUD)
- User management (view, edit, delete)
- Hotel service management (CRUD)
- View reports and statistics
- Coupon/promotion management
- Upload room images

## API Endpoints

### Authentication
- `POST /api/users/register` - Register account
- `POST /api/users/login` - Login
- `GET /api/users/<user_id>` - Get user information

### Rooms
- `GET /api/rooms` - Get room list
- `GET /api/rooms/<room_id>` - Get room details
- `GET /api/rooms/search` - Search rooms
- `POST /api/rooms` - Create new room (Admin)
- `PUT /api/rooms/<room_id>` - Update room (Admin)
- `DELETE /api/rooms/<room_id>` - Delete room (Admin)

### Bookings
- `GET /api/bookings` - Get booking list
- `GET /api/bookings/<booking_id>` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/<booking_id>/confirm` - Confirm booking (Receptionist)
- `PUT /api/bookings/<booking_id>/cancel` - Cancel booking
- `GET /api/bookings/user/<user_id>` - Get user bookings

### Check-in/Check-out
- `POST /api/checkins` - Check-in customer (Receptionist)
- `POST /api/checkouts` - Check-out customer (Receptionist)
- `GET /api/checkouts/summary/<booking_id>` - Get checkout summary

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/booking/<booking_id>` - Get payment by booking

### Services
- `GET /api/services` - Get service list
- `POST /api/services/request` - Request service
- `GET /api/service-requests` - Get service request list (Receptionist)
- `PUT /api/service-requests/<request_id>` - Update service request status (Receptionist)

### Users Management (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/<user_id>` - Update user
- `DELETE /api/users/<user_id>` - Delete user

### Staff Management (Admin)
- `GET /api/staff` - Get staff list
- `POST /api/staff` - Add staff
- `PUT /api/staff/<staff_id>` - Update staff
- `DELETE /api/staff/<staff_id>` - Delete staff

### Reports (Admin)
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/occupancy` - Occupancy rate report

## Database Structure

The system uses MySQL with the following main tables:

- **users** - Users (customers, receptionist, administrator)
- **staff** - Staff members
- **rooms** - Hotel rooms
- **bookings** - Bookings
- **payments** - Payments
- **services** - Hotel services
- **service_requests** - Service requests
- **checkins** - Check-ins
- **checkouts** - Check-outs
- **wallets** - E-wallets
- **coupons** - Promotional codes
- **reports** - Reports

See detailed schema at `Design/database_schema.sql`

## Usage Guide

### Default Accounts
- **Administrator**: 
  - Username: `admin`
  - Password: `admin`
- **Receptionist**: 
  - Username: `reception`
  - Password: `reception`

### Booking Process
1. Register/Login account
2. View room list on "Rooms" page
3. Select room and view details
4. Choose check-in and check-out dates
5. Navigate to payment page
6. Select payment method (e-wallet or cash)
7. Complete booking
8. Receptionist confirms booking
9. Check-in when arriving at hotel
10. Order additional services (if needed)
11. Check-out and pay for services

### Administration Process
1. Login with Administrator account
2. Room management: Add, edit, delete rooms
3. Staff management: Add, edit, delete staff
4. User management: View, edit, delete users
5. Service management: Add, edit, delete services
6. View reports and statistics

## Notes

- Ensure MySQL server is running before starting backend
- Configure correct database information in `.env` file
- Default Flask port is 5000, can be changed in `app.py`
- Frontend needs to be served via HTTP server to avoid CORS errors

## License

This project is developed for educational purposes in the Software Architecture course.

## Contact

If you have questions or issues, please create an issue on the repository.
