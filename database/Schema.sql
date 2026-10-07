
use dashboard;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('Admin','Doctor','Receptionist') NOT NULL
);
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    availability_status ENUM('Available','Busy','On Leave') DEFAULT 'Available'
);
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    gender ENUM('Male','Female','Other'),
    age INT,
    phone VARCHAR(15),
    address VARCHAR(255),
    blood_group VARCHAR(5),
    admission_date DATE
);
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE,
    appointment_time TIME,
    status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
CREATE TABLE beds (
    bed_id INT AUTO_INCREMENT PRIMARY KEY,
    bed_number VARCHAR(20),
    ward VARCHAR(50),
    status ENUM('Available','Occupied') DEFAULT 'Available'
);
CREATE TABLE medicines (
    medicine_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(100),
    stock_quantity INT,
    expiry_date DATE
);
CREATE TABLE billing (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    amount DECIMAL(10,2),
    payment_status ENUM('Paid','Pending') DEFAULT 'Pending',
    bill_date DATE,

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
INSERT INTO users (username, password, role) VALUES
('admin','admin123','Admin'),
('drjohn','doctor123','Doctor'),
('reception','recep123','Receptionist');

INSERT INTO doctors (doctor_name, specialization, phone, email, availability_status) VALUES
('Dr. John','Cardiology','9876543210','john@hospital.com','Available'),
('Dr. Priya','Neurology','9876543211','priya@hospital.com','Busy'),
('Dr. Arun','Orthopedics','9876543212','arun@hospital.com','Available'),
('Dr. Meena','Pediatrics','9876543213','meena@hospital.com','On Leave'),
('Dr. Karthik','General Medicine','9876543214','karthik@hospital.com','Available'),
('Dr. Divya','Dermatology','9876543215','divya@hospital.com','Available'),
('Dr. Ravi','ENT','9876543216','ravi@hospital.com','Busy'),
('Dr. Sneha','Gynecology','9876543217','sneha@hospital.com','Available'),
('Dr. Kumar','Urology','9876543218','kumar@hospital.com','Available'),
('Dr. Nisha','Psychiatry','9876543219','nisha@hospital.com','Available');

INSERT INTO patients (patient_name, gender, age, phone, address, blood_group, admission_date) VALUES
('Ramesh','Male',45,'9876500001','Salem','B+','2026-01-10'),
('Priya','Female',30,'9876500002','Chennai','A+','2026-02-15'),
('Arun','Male',28,'9876500003','Coimbatore','O+','2026-03-05'),
('Divya','Female',35,'9876500004','Madurai','AB+','2026-04-12'),
('Kumar','Male',50,'9876500005','Trichy','A-','2026-05-20'),
('Meena','Female',40,'9876500006','Erode','B-','2026-06-18'),
('Suresh','Male',38,'9876500007','Namakkal','O-','2026-07-09'),
('Lakshmi','Female',26,'9876500008','Karur','A+','2026-08-01'),
('Vijay','Male',33,'9876500009','Salem','B+','2026-08-03'),
('Anitha','Female',29,'9876500010','Chennai','O+','2026-08-05');

INSERT INTO beds (bed_number, ward, status) VALUES
('B101','General','Available'),
('B102','General','Occupied'),
('B103','General','Available'),
('B201','ICU','Occupied'),
('B202','ICU','Available'),
('B203','ICU','Occupied'),
('B301','Private','Available'),
('B302','Private','Occupied'),
('B303','Private','Available'),
('B304','Private','Occupied');

INSERT INTO medicines (medicine_name, stock_quantity, expiry_date) VALUES
('Paracetamol',50,'2027-05-10'),
('Amoxicillin',8,'2026-12-15'),
('Insulin',25,'2027-01-20'),
('Vitamin C',100,'2028-03-18'),
('Cetirizine',5,'2026-10-12'),
('Metformin',30,'2027-06-11'),
('Aspirin',18,'2027-02-14'),
('Ibuprofen',9,'2026-11-01'),
('Omeprazole',40,'2027-08-25'),
('Azithromycin',12,'2027-09-15');

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES
(1,1,'2026-08-06','09:00:00','Completed'),
(2,2,'2026-08-06','09:30:00','Scheduled'),
(3,3,'2026-08-06','10:00:00','Completed'),
(4,4,'2026-08-06','10:30:00','Cancelled'),
(5,5,'2026-08-06','11:00:00','Scheduled'),
(6,6,'2026-08-07','09:00:00','Scheduled'),
(7,7,'2026-08-07','10:00:00','Scheduled'),
(8,8,'2026-08-08','11:00:00','Completed'),
(9,9,'2026-08-08','12:00:00','Completed'),
(10,10,'2026-08-09','01:00:00','Scheduled');

INSERT INTO billing (patient_id, amount, payment_status, bill_date) VALUES
(1,5000,'Paid','2026-01-10'),
(2,3500,'Paid','2026-02-15'),
(3,4200,'Pending','2026-03-05'),
(4,6000,'Paid','2026-04-12'),
(5,7500,'Paid','2026-05-20'),
(6,4800,'Pending','2026-06-18'),
(7,5200,'Paid','2026-07-09'),
(8,3900,'Paid','2026-08-01'),
(9,4500,'Pending','2026-08-03'),
(10,6800,'Paid','2026-08-05');

SELECT * FROM users;
SELECT * FROM doctors;
SELECT * FROM patients;
SELECT * FROM appointments;
SELECT * FROM beds;
SELECT * FROM medicines;
SELECT * FROM billing;