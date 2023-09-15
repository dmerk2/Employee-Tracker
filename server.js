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
          break;
        case "Add a role":
          break;
        case "Add an employee":
          break;
        case "Update an employee role":
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

const viewAllDepartments = () => {
  console.log("All Departments");
  let sql = `SELECT * FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllRoles = () => {
  console.log("All Roles");
  let sql = `SELECT * FROM role`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployees = () => {
  console.log("All Employees");
  let sql = `SELECT * FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByManager = () => {
  console.log("All Employees by manager");
  let sql = `
   SELECT employee.first_name, employee.last_name, manager_id
   FROM employee 
   ORDER BY manager_id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByDepartment = () => {
  console.log("All Employees by manager");
  let sql = `
  SELECT employee.first_name, 
       employee.last_name, 
       department.name AS department_name
  FROM employee
  JOIN role ON employee.role_id = role.id
  JOIN department ON role.department_id = department.id;
`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const quit = () => {
  if ("Quit") {
    console.log("Good bye!");
    process.exit();
  }
};
