// Use the .env file to hide password
require("dotenv").config();

// Require the dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");

// Create the sql database connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.SQL_PASSWORD,
    database: "employees_db",
  },
  console.log("Now connected to employees_db database.")
);

// If there is an error when connecting to the database, throw the error
db.connect((err) => {
  if (err) throw err;
  beginPrompts();
});

const beginPrompts = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "title",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "View employees by manager",
          "View employees by department",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],
      },
    ])
    .then((res) => {
      const response = res.title;
      switch (response) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "View employees by manager":
          viewAllEmployeesByManager();
          break;
        case "View employees by department":
          viewAllEmployeesByDepartment();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          break;
        case "Quit":
          quit();
          break;
        default:
          viewAllDepartments();
      }
    });
};

const viewAllDepartments = () => {
  console.log("All Departments");
  let query = `SELECT * FROM department`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllRoles = () => {
  console.log("All Roles");
  let query = `SELECT * FROM role`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployees = () => {
  console.log("All Employees");
  let query = `SELECT * FROM employee`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByManager = () => {
  console.log("All Employees by manager");
  let query = `
   SELECT employee.first_name, employee.last_name, manager_id
   FROM employee 
   ORDER BY manager_id`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByDepartment = () => {
  console.log("All Employees by manager");
  let query = `
  SELECT employee.first_name, 
       employee.last_name, 
       department.name AS department_name
  FROM employee
  JOIN role ON employee.role_id = role.id
  JOIN department ON role.department_id = department.id
  ORDER BY department_name;
`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the department?",
      },
    ])
    .then((res) => {
      const query = `
    INSERT INTO department (name) 
    VALUES (?);
    `;
      db.query(query, [res.department_name], (err, result) => {
        if (err) throw err;
        console.log(`Added department: ${res.department_name}`);
        viewAllDepartments();
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "input",
        name: "department_ID",
        message: "What department ID will the employee be employed in?",
      },
    ])
    .then((res) => {
      const query = `
      INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);
    `;
      db.query(
        query,
        [res.role, res.salary, res.department_ID],
        (err, result) => {
          if (err) throw err;
          console.log(
            `Added Role: ${res.role} Salary: ${res.salary} Department ID: ${res.department_ID}`
          );
          viewAllRoles();
        }
      );
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "input",
        name: "role",
        message: "What is the employee's role ID?",
      },
      {
        type: "input",
        name: "manager",
        message: "Who is the employee's manager ID?",
      },
    ])
    .then((res) => {
      const query = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES (?, ?, ?, ?)
    `;
      db.query(
        query, [res.first_name, res.last_name, res.role, res.manager],
        (err, result) => {
          if (err) throw err;
          console.log(
            `Added Employee: First Name:${res.first_name} Last Name:${res.last_name} Role: ${res.role} Manager: ${res.manager}`
          );
          viewAllEmployees();
        }
      );
    });
};

const quit = () => {
  if ("Quit") {
    console.log("Good bye!");
    process.exit();
  }
};
