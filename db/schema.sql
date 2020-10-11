DROP DATABASE IF EXISTS workplace_db;
CREATE DATABASE workplace_db;
USE workplace_db;

CREATE TABLE roles(
    id INTEGER(11) AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INTEGER, 
    PRIMARY KEY (id)
);

CREATE TABLE employees(
    id INTEGER(50) AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE depts(
    id INTEGER(20) AUTO_INCREMENT,
    dept_name VARCHAR(30),
    PRIMARY KEY (id)
);