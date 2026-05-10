-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20),
    blood_group VARCHAR(10),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    class_name VARCHAR(50),
    roll_no VARCHAR(50),
    blood_group VARCHAR(10),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    subject VARCHAR(100),
    date DATE,
    status VARCHAR(20)
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    subject VARCHAR(100),
    marks INT,
    max_marks INT
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    subject VARCHAR(100),
    description TEXT,
    due_date DATE
);

CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    total_fee INT,
    paid_amount INT,
    status VARCHAR(50)
);

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    message TEXT,
    date DATE
);

-- Insert Sample Data
INSERT INTO users (name, email, password, role, blood_group, phone, address) VALUES
('Teacher Admin', 'teacher@school.com', 'password123', 'teacher', NULL, NULL, NULL),
('John Doe', 'john@school.com', 'password123', 'student', NULL, NULL, NULL),
('Jane Smith', 'jane@school.com', 'password123', 'student', NULL, NULL, NULL),
('Admin Teacher', 'teacher@gmail.com', '1234', 'teacher', 'O+', '9876543210', 'Chennai'),
('Abinandh', 'student@gmail.com', '1234', 'student', 'B+', '9123456780', 'Tiruppur');

INSERT INTO students (name, email, class_name, roll_no, blood_group, phone, address) VALUES
('John Doe', 'john@school.com', 'Class 10', '101', NULL, NULL, NULL),
('Jane Smith', 'jane@school.com', 'Class 10', '102', NULL, NULL, NULL),
('Abinandh', 'student@gmail.com', '10A', '12', 'B+', '9123456780', 'Tiruppur');

INSERT INTO attendance (student_id, subject, date, status) VALUES
(1, 'Math', '2024-05-01', 'Present'),
(2, 'Math', '2024-05-01', 'Absent');

INSERT INTO marks (student_id, subject, marks, max_marks) VALUES
(1, 'Math', 85, 100),
(2, 'Math', 90, 100);

INSERT INTO assignments (title, subject, description, due_date) VALUES
('Algebra Worksheet', 'Math', 'Complete exercises 1-10 on page 42.', '2024-05-15'),
('History Essay', 'History', 'Write a 500-word essay on the French Revolution.', '2024-05-20');

INSERT INTO fees (student_id, total_fee, paid_amount, status) VALUES
(1, 5000, 5000, 'Paid'),
(2, 5000, 2500, 'Partial');

INSERT INTO announcements (title, message, date) VALUES
('Midterm Exams Schedule', 'Midterm exams will begin on June 1st. Please check the notice board for details.', '2024-05-02'),
('Sports Day', 'Annual sports day will be held on May 25th. All students are encouraged to participate.', '2024-05-03');
