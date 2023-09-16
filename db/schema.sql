-- Drop the database employees_db if it already exists
DROP DATABASE IF EXISTS employees_db;
-- Create a new database name employees_db
CREATE DATABASE employees_db;

-- Use the employees_db for the following actions
USE employees_db;

-- Create a table name department with 2 rows
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(30) NOT NULL
);

-- Create a table named role with 4 rows
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY(department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

-- Create a table name employee with 5 rows
CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT NULL,
  FOREIGN KEY(role_id)
  REFERENCES role(id)
  ON DELETE SET NULL
);