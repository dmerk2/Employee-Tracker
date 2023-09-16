-- Seed the department table with the name of the departments
INSERT INTO department(name)
VALUES ("Management"),
       ("Sales"),
       ("Tech"),
       ("Customer Service");

-- Seed the role table
INSERT INTO role(title, salary, department_id)
VALUES ("Manager", 125233, 1),
       ("Engineer", 100824, 2),
       ("Technician", 90250, 3),
       ("Sales", 805000, 4);

-- Seed the employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 2),
       ("Peter", "Jones", 2, 3),
       ("Michael", "Doe", 3, 5),
       ("Max", "Vanguard", 4, 5),
       ("Stella", "Moonshine", 2, 2),
       ("Misty", "Hollow", 1, null),
       ("Lily", "Cat", 4, 2);