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
          "Delete an employee",
          "Delete department",
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
          updateEmployee();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Delete department":
          deleteDepartment();
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
  let query = `SELECT * FROM department`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllRoles = () => {
  let query = `SELECT * FROM role`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployees = () => {
  let query = `SELECT * FROM employee`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByManager = () => {
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
        query,
        [res.first_name, res.last_name, res.role, res.manager],
        (err, result) => {
          if (err) throw err;
          console.log(
            `Added Employee: First Name:${res.first_name} Last Name:${res.last_name} Role ID: ${res.role} Manager ID: ${res.manager}`
          );
          viewAllEmployees();
        }
      );
    });
};

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "employee",
//         message: "Which employee would you like to update?",
//         choices: "employee"
//       },
//       {
//         type: "input",
//         name: "role",
//         message: "What role ID will they be assigned?",
//       },
//     ])
//     .then((res) => {
//       const query = `
//       UPDATE employee SET role_id = ? WHERE id = ?
//     `;
//       db.query(query, [res.employee, res.role], (err, result) => {
//         if (err) throw err;
//         console.log(`Updated ${res.employee} role to ${res.role}`);
//         viewAllEmployees();
//       });
//     });
// };
const updateEmployee = () => {
  // Query the database to get a list of employees
  const getEmployeeListQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
    FROM employee
  `;

  db.query(getEmployeeListQuery, (err, employees) => {
    if (err) throw err;

    // Extract employee names and ids from the query result
    const choices = employees.map((employee) => ({
      name: employee.employee_name,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: choices,
        },
        {
          type: "input",
          name: "role",
          message: "What role ID will they be assigned?",
        },
      ])
      .then((res) => {
        const query = `
          UPDATE employee SET role_id = ? WHERE id = ?
        `;
        db.query(query, [res.role, res.employee], (err, result) => {
          if (err) throw err;
          // Retrieve the selected employee's name
          const selectedEmployee = employees.find(
            (employee) => employee.id === res.employee
          );
          console.log(
            `Updated employee ${selectedEmployee.employee_name} to role ${res.role}`
          );
          viewAllEmployees();
        });
      });
  });
};

const deleteEmployee = () => {
  // Query the database to get a list of employees
  const getEmployeeListQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
    FROM employee
  `;

  db.query(getEmployeeListQuery, (err, employees) => {
    if (err) throw err;

    // Extract employee names and ids from the query result
    const choices = employees.map((employee) => ({
      name: employee.employee_name,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: choices,
        },
      ])
      .then((res) => {
        const query = `
          DELETE FROM employee WHERE id = ?
        `;
        db.query(query, [res.employee], (err, result) => {
          if (err) throw err;
          // Retrieve the selected employee's name
          const selectedEmployee = employees.find(
            (employee) => employee.id === res.employee
          );
          console.log(
            `Deleted employee ${selectedEmployee.employee_name}`
          );
          viewAllEmployees();
        });
      });
  });
};

const deleteDepartment = () => {
  // Query the database to get a list of departments
  const getDepartmentListQuery = `
    SELECT id, name
    FROM department
  `;

  db.query(getDepartmentListQuery, (err, departments) => {
    if (err) throw err;

    // Extract department names and ids from the query result
    const choices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: choices,
        },
      ])
      .then((res) => {
        const query = `
          DELETE FROM department WHERE id = ?
        `;
        db.query(query, [res.department], (err, result) => {
          if (err) throw err;
          // Retrieve the selected department
          const selectedDepartment = departments.find(
            (department) => department.id === res.department
          );
          console.log(
            `Deleted department ${selectedDepartment.department_name}`
          );
          viewAllDepartments();
        });
      });
  });
};

// Quit the application
const quit = () => {
  if ("Quit") {
    console.log("Good bye!");
    process.exit();
  }
};
