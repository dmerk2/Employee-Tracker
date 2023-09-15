INSERT INTO department(name)
VALUES ("Management"),
       ("Sales"),
       ("Tech"),
       ("Customer Service");

INSERT INTO role(title, salary, department_id)
VALUES ("Manager", 125233, 1),
       ("Engineer", 100824, 2),
       ("Technician", 90250, 3),
       ("Sales", 805000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 1),
       ("Peter", "Jones", 2, 2),
       ("Michael", "Doe", 3, 3),
       ("Max", "Vanguard", 4, 4),
       ("Stella", "Moonshine", 2, 5),
       ("Misty", "Hollow", 1, 6),
       ("Lily", "Cat", 4, 7);