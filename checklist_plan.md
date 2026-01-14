# Lab Checklist - Hotel Management System

This document tracks the progress of all labs in the Software Architecture course.

## Lab Status Overview

-  **Lab 1**: Requirements Elicitation & Modeling - **COMPLETED**
-  **Lab 2**: Layered Architecture Design - **COMPLETED**
-  **Lab 3**: Layered Architecture Implementation - **COMPLETED**
-  **Lab 4**: Microservices Decomposition & Communication - **COMPLETED**
-  **Lab 5**: Implementing a Microservice - **PENDING**
-  **Lab 6**: API Gateway Pattern - **PENDING**
-  **Lab 7**: Event-Driven Architecture (EDA) & Integration - **PENDING**
-  **Lab 8**: Deployment View & Quality Attribute Analysis (ATAM) - **PENDING**

---

## Lab 1: Requirements Elicitation & Modeling 

### Objectives
- [x] Identify and document Architecturally Significant Requirements (ASRs)
- [x] Define main Actors and Use Cases
- [x] Model system context using UML Use Case Diagrams

### Completed Tasks
- [x] Identified Actors: User, Administrator, Receptionist, Payment Gateway
- [x] Documented Functional Requirements (FRs) for:
  - [x] User (FR-01 to FR-05)
  - [x] Receptionist (FR-06 to FR-10)
  - [x] Administrator (FR-11 to FR-14)
  - [x] Wallet Management (FR-15 to FR-17)
- [x] Documented Non-Functional Requirements (NFRs):
  - [x] Performance (NFR-01)
  - [x] Security (NFR-02)
  - [x] Reliability/Availability (NFR-03)
- [x] Identified Architecturally Significant Requirements (ASRs):
  - [x] ASR-1: Scalability
  - [x] ASR-2: Security
  - [x] ASR-3: Modifiability
- [x] Created UML Use Case Diagram
- [x] Completed Lab Report 1

### Deliverables
-  SRS Documentation
-  UML Use Case Diagram (`Design/UML Use Case Diagram.png`)
-  Lab Report (`Documents/ClassN01_Group_7_Lab_report_1.docx`)

---

## Lab 2: Layered Architecture Design (Logical View) 

### Objectives
- [x] Understand Layered Architecture Pattern principles
- [x] Define four main layers and their responsibilities
- [x] Identify key components within each layer
- [x] Model logical view using UML Component Diagram

### Completed Tasks
- [x] Defined four architectural layers:
  - [x] Presentation Layer (UI)
  - [x] Business Logic Layer (Service)
  - [x] Persistence Layer (Data Access)
  - [x] Data Layer
- [x] Documented layer responsibilities and artifacts
- [x] Identified components for "Make a Reservation" feature:
  - [x] BookingController (Presentation)
  - [x] BookingService, PaymentService (Business Logic)
  - [x] BookingRepository (Persistence)
- [x] Defined interfaces between layers
- [x] Created UML Component Diagram
- [x] Documented data flow for "Check Room Availability"
- [x] Completed Lab Report 2

### Deliverables
-  Layer definitions and responsibilities
-  Component identification
-  Interface definitions
-  UML Component Diagram (`Design/Component Diagram Modeling.png`)
-  Lab Report (`Documents/ClassN01_Group_7_Lab_report_2.docx`)

---

## Lab 3: Layered Architecture Implementation (CRUD) 

### Objectives
- [x] Set up project with distinct packages/modules for three layers
- [x] Implement core CRUD operations
- [x] Ensure strict dependency flow: Controller → Service → Repository

### Completed Tasks
- [x] Created project structure:
  - [x] `SRC/Arch/` - Backend architecture
  - [x] `SRC/Arch/controllers/` - Presentation Layer
  - [x] `SRC/Arch/services/` - Business Logic Layer
  - [x] `SRC/Arch/repository/` - Persistence Layer
  - [x] `SRC/Arch/models/` - Data models
  - [x] `SRC/Arch/views/` - Response formatters
- [x] Implemented CRUD operations for:
  - [x] Rooms
  - [x] Bookings
  - [x] Users
  - [x] Payments
  - [x] Services
  - [x] Staff
  - [x] Check-ins/Check-outs
  - [x] Wallets
  - [x] Coupons
  - [x] Reports
- [x] Database configuration (`SRC/Arch/db_config.py`)
- [x] Flask application setup (`SRC/Arch/app.py`)
- [x] Middleware for authentication (`SRC/Arch/middleware/auth.py`)
- [x] Frontend implementation (`SRC/UI/`)

### Deliverables
-  Complete layered architecture implementation
-  All CRUD operations functional
-  Database schema (`Design/database_schema.sql`)
-  Working application

---

## Lab 4: Microservices Decomposition & Communication 

### Objectives
- [x] Understand Microservice Decomposition principles
- [x] Define Service Contracts (API Endpoints)
- [x] Design High-Level Communication Strategy
- [x] Model system using C4 Model (Level 1: System Context)

### Completed Tasks
- [x] Identified microservices by business capability:
  - [x] Room Service
  - [x] User Service
  - [x] Booking Service
  - [x] Hotel Service
  - [x] Payment Service
  - [x] Coupon Service
  - [x] CheckIn Service
  - [x] Staff Service
  - [x] Report Service
  - [x] Wallet Service
- [x] Defined Service Contracts (API Endpoints) for all services
- [x] Documented communication strategy (Synchronous vs Asynchronous)
- [x] Created C4 Model Level 1 diagram
- [x] Identified external dependencies:
  - [x] Payment Gateway
  - [x] Email Service
  - [x] SMS Service (Optional)
- [x] Completed Lab Report 4

### Deliverables
-  Microservices decomposition table
-  Service API contracts documentation
-  Communication strategy documentation
-  C4 Model Level 1 diagram (`Design/C4lv1.png`)
-  Lab Report (`Documents/ClassN01_Group_7_Lab_report_4.docx`)

---

## Lab 5: Implementing a Microservice 

### Objectives
- [ ] Set up standalone Flask application for a microservice
- [ ] Implement service logic and persistence
- [ ] Expose Service Contract (REST API)
- [ ] Test the service in isolation

### Tasks to Complete
- [ ] Choose a microservice to implement (e.g., Room Service, Booking Service)
- [ ] Create standalone project structure
- [ ] Set up Flask application with SQLAlchemy
- [ ] Define database schema for the microservice
- [ ] Implement service logic:
  - [ ] Repository layer
  - [ ] Service layer
  - [ ] Controller/API layer
- [ ] Implement REST API endpoints:
  - [ ] GET /api/{resource} - List/Search
  - [ ] GET /api/{resource}/{id} - Get details
  - [ ] POST /api/{resource} - Create (if applicable)
  - [ ] PUT /api/{resource}/{id} - Update (if applicable)
  - [ ] DELETE /api/{resource}/{id} - Delete (if applicable)
- [ ] Configure dedicated port for the service
- [ ] Test service in isolation using Postman/cURL
- [ ] Document service API contract

### Technology Stack
- Python 3.x
- Flask
- SQLAlchemy / Flask-SQLAlchemy
- SQLite or MySQL (dedicated database for service)
- Postman / cURL for testing

### Notes
- Service should be completely independent
- Own its data (separate database)
- Expose RESTful API
- Run on dedicated port (e.g., 5001, 5002, etc.)

---

## Lab 6: API Gateway Pattern 

### Objectives
- [ ] Understand API Gateway role in microservices
- [ ] Implement reverse proxy/router using Flask
- [ ] Configure Gateway to route requests to microservices
- [ ] Implement basic security check (token validation)

### Tasks to Complete
- [ ] Create API Gateway project structure
- [ ] Install Flask and requests library
- [ ] Define service configuration (URLs for backend services)
- [ ] Implement security stub:
  - [ ] Token validation function
  - [ ] Admin/user role checking
- [ ] Implement routing logic:
  - [ ] Route requests to appropriate microservices
  - [ ] Forward headers and query parameters
  - [ ] Handle service failures (503 errors)
- [ ] Implement cross-cutting concerns:
  - [ ] Authentication/Authorization
  - [ ] Request logging
  - [ ] Error handling
- [ ] Test Gateway functionality:
  - [ ] Unauthorized access (401)
  - [ ] Authorized access (200)
  - [ ] Forbidden access for non-admin (403)
  - [ ] Service unavailable handling (503)
- [ ] Document Gateway configuration

### Technology Stack
- Python 3.x
- Flask
- requests library
- Microservices from Lab 5

### Notes
- Gateway should run on port 5000
- Backend services should run on different ports (5001, 5002, etc.)
- Gateway acts as single entry point
- Handles security before routing

---

## Lab 7: Event-Driven Architecture (EDA) & Integration 

### Objectives
- [ ] Understand Producers, Consumers, and Message Brokers
- [ ] Install and set up RabbitMQ message broker
- [ ] Implement Order Service (Event Producer)
- [ ] Implement Notification Service (Event Consumer)
- [ ] Demonstrate decoupled nature of services

### Tasks to Complete
- [ ] Install RabbitMQ (Docker recommended)
- [ ] Install Pika library (Python RabbitMQ client)
- [ ] Set up RabbitMQ connection configuration
- [ ] Implement Producer Service:
  - [ ] Connect to RabbitMQ
  - [ ] Declare queue
  - [ ] Publish events (e.g., OrderPlacedEvent)
  - [ ] Handle connection errors
- [ ] Implement Consumer Service:
  - [ ] Connect to RabbitMQ
  - [ ] Register callback function
  - [ ] Start consuming messages
  - [ ] Process events (e.g., send email notification)
  - [ ] Acknowledge messages
- [ ] Test asynchronous decoupling:
  - [ ] Start consumer service
  - [ ] Run producer service
  - [ ] Verify events are processed asynchronously
  - [ ] Test fault tolerance (consumer down scenario)
- [ ] Document event structure and queue names

### Technology Stack
- Python 3.x
- Pika (RabbitMQ client)
- RabbitMQ (Message Broker)
- Docker (for RabbitMQ setup)

### Notes
- Use asynchronous communication for non-critical operations
- Events should be JSON formatted
- Consumer should handle errors gracefully
- Demonstrate that producer is not blocked by consumer processing time

---

## Lab 8: Deployment View & Quality Attribute Analysis (ATAM) 

### Objectives
- [ ] Create UML Deployment Diagram
- [ ] Conduct simplified ATAM analysis
- [ ] Compare Monolithic vs Microservices architecture
- [ ] Identify architectural trade-offs

### Tasks to Complete
- [ ] Create UML Deployment Diagram:
  - [ ] Identify nodes (Client Device, Load Balancer, Application Cluster)
  - [ ] Place artifacts (API Gateway, Services, Message Broker)
  - [ ] Place data stores (Databases for each service)
  - [ ] Draw associations (communication links)
- [ ] Define Quality Attribute Scenarios:
  - [ ] Scalability Scenario (e.g., 10x traffic spike)
  - [ ] Availability Scenario (e.g., service failure)
- [ ] Evaluate architectures against scenarios:
  - [ ] Monolithic (Layered) approach
  - [ ] Microservices approach
- [ ] Create comparison table:
  - [ ] Scalability analysis
  - [ ] Availability analysis
  - [ ] Performance considerations
  - [ ] Complexity considerations
- [ ] Identify trade-offs:
  - [ ] Benefits of Microservices
  - [ ] Drawbacks of Microservices
  - [ ] When to use each approach
- [ ] Document findings and recommendations
- [ ] Complete Lab Report 8

### Technology Stack
- draw.io (Diagrams.net) for UML Deployment Diagram
- Documentation tool (Markdown/Word) for ATAM analysis

### Notes
- Focus on Scalability and Availability quality attributes
- Compare trade-offs explicitly
- Provide clear recommendations
- Document deployment considerations

---

## Overall Progress

**Completed**: 4/8 labs (50%)

**Remaining**: 4/8 labs (50%)

### Next Steps
1. Complete Lab 5: Implement at least one microservice
2. Complete Lab 6: Implement API Gateway
3. Complete Lab 7: Implement Event-Driven Architecture
4. Complete Lab 8: Create deployment diagram and ATAM analysis

---

## Notes

- All completed labs have corresponding reports in `Documents/` folder
- Design diagrams are stored in `Design/` folder
- Current implementation uses Layered Architecture (monolithic)
- Lab 4 designed the microservices architecture but implementation is pending
- Lab 5-8 will transition from monolithic to microservices architecture

---

*Last Updated: Based on current project state*
