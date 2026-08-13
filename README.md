# Hospital Dashboard

## 📌 Project Overview

Hospital Dashboard is a web-based hospital management and monitoring system designed to manage important hospital activities through a centralized dashboard.

The system helps hospital staff manage patients, doctors, appointments, beds, medicines, users, and billing information efficiently.

---

## 🎯 Objectives

- Manage hospital users and their roles.
- Maintain patient information.
- Manage doctor details and availability.
- Schedule and manage appointments.
- Monitor bed availability.
- Manage medicine stock and expiry dates.
- Manage patient billing and payment status.
- Provide dashboard statistics for better monitoring.

---

## 🚀 Functional Modules

### 1. User Management
- Manage Admin, Doctor, and Receptionist users.
- View registered users.
- Add new users.

### 2. Patient Management
- Manage patient information.
- Store patient details and admission information.

### 3. Doctor Management
- Manage doctor details.
- Store specialization and availability status.

### 4. Appointment Management
- Create and view appointments.
- Connect patients with doctors.
- Manage appointment status.

### 5. Bed Management
- Manage hospital beds.
- Track ward and bed numbers.
- Monitor Available and Occupied beds.

### 6. Medicine Management
- Manage medicine details.
- Track stock quantity.
- Store medicine expiry dates.

### 7. Billing Management
- Manage patient bills.
- Store billing amount and bill date.
- Track Paid and Pending payment status.

### 8. Dashboard
- Display important hospital statistics.
- Show patient, appointment, doctor, bed, medicine, and billing information.

---

## 🛠️ Technical Stack

### Frontend
- React
- JavaScript
- Vite

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- REST API
- Maven

### Database
- MySQL

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub

---

## 🏗️ Project Structure

```text
Dashboard/
│
├── backend/
│   └── hospitaldashboard/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/hospital/dashboard/
│       │   │   │       ├── controller/
│       │   │   │       ├── entity/
│       │   │   │       ├── repository/
│       │   │   │       └── service/
│       │   │   └── resources/
│       │   └── test/
│       └── pom.xml
│
├── database/
│   └── schema.sql
│
├── docs/
│   └── diagrams/
│
├── frontend/
│
└── README.md