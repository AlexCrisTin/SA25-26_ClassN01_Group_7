# Lab Checklist - Hotel Management System

This document tracks the progress of all labs in the Software Architecture course.

## Lab Status Overview

-  **Lab 1**: Requirements Elicitation & Modeling - **COMPLETED**
-  **Lab 2**: Layered Architecture Design - **COMPLETED**
-  **Lab 3**: Layered Architecture Implementation - **COMPLETED**
-  **Lab 4**: Microservices Decomposition & Communication - **COMPLETED**
-  **Lab 5**: Implementing a Microservice - **COMPLETED**
-  **Lab 6**: API Gateway Pattern - **COMPLETED**
-  **Lab 7**: Event-Driven Architecture (EDA) & Integration - **COMPLETED**
-  **Lab 8**: Deployment View & Quality Attribute Analysis (ATAM) - **COMPLETED**

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
- [x] Set up standalone Flask application for a microservice
- [x] Implement service logic and persistence
- [x] Expose Service Contract (REST API)
- [x] Test the service in isolation

### Completed Tasks
- [x] Chose Room Service as the microservice to implement
- [x] Created standalone project structure in `Documents/Lab 5/`
- [x] Set up Flask application with mysql-connector-python (MySQL)
- [x] Defined database schema for the microservice (`room_service_schema.sql`)
- [x] Implemented service logic:
  - [x] Repository layer (`repository/room_repository.py`)
  - [x] Service layer (`services/room_service.py`)
  - [x] Controller/API layer (`controllers/room_controller.py`)
  - [x] View layer (`views/room_view.py`)
- [x] Implemented REST API endpoints:
  - [x] GET /api/rooms - List all rooms
  - [x] GET /api/rooms/search - Search rooms (by type, status)
  - [x] GET /api/rooms/<id> - Get room details
  - [x] POST /api/rooms - Create new room
  - [x] PUT /api/rooms/<id> - Update room
  - [x] DELETE /api/rooms/<id> - Delete room
  - [x] GET /health - Health check endpoint
- [x] Configured dedicated port (5001) for the service
- [x] Created database configuration with separate database (`room_service`)
- [x] Documented service API contract (README.md)

### Tasks to Complete
- [x] Test service in isolation using Postman/cURL
- [x] Verify service independence (run alongside monolith)

### Technology Stack
- Python 3.x
- Flask 3.1.2
- mysql-connector-python 9.5.0 (MySQL database)
- flask-cors 6.0.2
- python-dotenv 1.2.1
- Postman / cURL for testing

### Deliverables
- Standalone Room Service microservice (`Documents/Lab 5/`)
- Database schema (`room_service_schema.sql`)
- Complete REST API implementation
- Service documentation (README.md)
- Requirements file (`requirements.txt`)

### Notes
- Service is completely independent from monolith
- Owns its data (separate database: `room_service`)
- Exposes RESTful API
- Runs on dedicated port 5001 (monolith runs on 5000)
- Uses same architectural pattern as monolith (Model → Repository → Service → Controller → View)
- Ready for API Gateway integration (Lab 6)

---

## Lab 6: API Gateway Pattern 

### Objectives
- [x] Understand API Gateway role in microservices
- [x] Implement reverse proxy/router using Flask
- [x] Configure Gateway to route requests to microservices
- [x] Implement basic security check (token validation)

### Completed Tasks
- [x] Created API Gateway project structure in `Documents/Lab 6/`
- [x] Installed Flask and requests library (`requirements.txt`)
- [x] Defined service configuration (URLs for backend services) in `gateway_config.py`
- [x] Implemented security stub (`auth.py`):
  - [x] Token validation function
  - [x] Admin/user role checking
- [x] Implemented routing logic (`app.py`):
  - [x] Route requests to appropriate microservices
  - [x] Forward headers and query parameters
  - [x] Handle service failures (503 errors)
- [x] Implemented cross-cutting concerns:
  - [x] Authentication/Authorization (stub)
  - [x] Request logging
  - [x] Error handling for upstream failures
- [x] Configured dedicated port for the gateway (5000)
- [x] Added health check endpoint (`GET /health`)

### Tasks to Complete
- [x] Test Gateway functionality:
  - [x] Unauthorized access (401)
  - [x] Authorized access (200)
  - [x] Forbidden access for non-admin (403)
  - [x] Service unavailable handling (503)
- [x] Document Gateway configuration and usage
- [x] Add request logging (optional)

### Technology Stack
- Python 3.x
- Flask 3.1.2
- requests 2.32.5
- flask-cors 6.0.2
- Microservices from Lab 5

### Deliverables
- API Gateway project (`Documents/Lab 6/`)
- Routing configuration (`gateway_config.py`)
- Auth stub (`auth.py`)
- Gateway implementation (`app.py`)
- Requirements file (`requirements.txt`)

### Notes
- Gateway runs on port 5000
- Backend services run on different ports (5001, 5002, etc.)
- Gateway acts as single entry point
- Handles security before routing

---

## Lab 7: Event-Driven Architecture (EDA) & Integration 

### Objectives
- [x] Understand Producers, Consumers, and Message Brokers
- [x] Install and set up RabbitMQ message broker
- [x] Implement Order Service (Event Producer)
- [x] Implement Notification Service (Event Consumer)
- [x] Demonstrate decoupled nature of services

### Tasks to Complete
- [x] Install RabbitMQ (Docker recommended)
- [x] Install Pika library (Python RabbitMQ client)
- [x] Set up RabbitMQ connection configuration
- [x] Implement Producer Service:
  - [x] Connect to RabbitMQ
  - [x] Declare queue
  - [x] Publish events (e.g., OrderPlacedEvent)
  - [x] Handle connection errors
- [x] Implement Consumer Service:
  - [x] Connect to RabbitMQ
  - [x] Register callback function
  - [x] Start consuming messages
  - [x] Process events (e.g., send email notification)
  - [x] Acknowledge messages
- [x] Test asynchronous decoupling:
  - [x] Start consumer service
  - [x] Run producer service
  - [x] Verify events are processed asynchronously
  - [x] Test fault tolerance (consumer down scenario)
- [x] Document event structure and queue names

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
- [x] Create UML Deployment Diagram
- [x] Conduct simplified ATAM analysis
- [x] Compare Monolithic vs Microservices architecture
- [x] Identify architectural trade-offs

### Tasks to Complete
- [x] Create UML Deployment Diagram:
  - [x] Identify nodes (Client Device, Load Balancer, Application Cluster)
  - [x] Place artifacts (API Gateway, Services, Message Broker)
  - [x] Place data stores (Databases for each service)
  - [x] Draw associations (communication links)
- [x] Define Quality Attribute Scenarios:
  - [x] Scalability Scenario (e.g., 10x traffic spike)
  - [x] Availability Scenario (e.g., service failure)
- [x] Evaluate architectures against scenarios:
  - [x] Monolithic (Layered) approach
  - [x] Microservices approach
- [x] Create comparison table:
  - [x] Scalability analysis
  - [x] Availability analysis
  - [x] Performance considerations
  - [x] Complexity considerations
- [x] Identify trade-offs:
  - [x] Benefits of Microservices
  - [x] Drawbacks of Microservices
  - [x] When to use each approach
- [x] Document findings and recommendations
- [x] Complete Lab Report 8

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

**Completed**: 8/8 labs (100%)

**Remaining**: 0/8 labs (0%)

### Next Steps
1. ~~Finish Lab 5: Test Room Service in isolation~~ Done
2. ~~Finish Lab 6: Test Gateway + document configuration~~ Done
3. ~~Complete Lab 7: Implement Event-Driven Architecture~~ Done
4. ~~Complete Lab 8: Create deployment diagram and ATAM analysis~~ Done

---

## Notes

- All completed labs have corresponding reports in `Documents/` folder
- Design diagrams are stored in `Design/` folder
- Current implementation uses Layered Architecture (monolithic)
- Lab 4 designed the microservices architecture but implementation is pending
- Lab 5-8 will transition from monolithic to microservices architecture

---

*Last Updated: Based on current project state*
