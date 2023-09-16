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
          "Update an employees manager",
          "Delete an employee",
          "Delete a department",
          "Delete a role",
          "Quit",
        ],
      },
    ])
    // Dependent on the user input, run the function for the according case
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
        case "Update an employees manager":
          updateEmployeeManager();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
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
  let query = `
    SELECT r.id, r.title AS role, r.salary, d.name AS department
    FROM role r
    LEFT JOIN department d ON r.department_id = d.id
  `;

  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployees = () => {
  let query = `
  SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department, 
  CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d ON r.department_id = d.id;
  `;

  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByManager = () => {
  let query = `
  SELECT e.first_name AS employee_first_name, e.last_name AS employee_last_name, 
  CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  ORDER BY e.manager_id;
   `;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    beginPrompts();
  });
};

const viewAllEmployeesByDepartment = () => {
  let query = `
  SELECT e.first_name, 
       e.last_name, 
       department.name AS department
  FROM employee e
  JOIN role ON e.role_id = role.id
  JOIN department ON role.department_id = department.id;
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
  const getDepartmentList = `
    SELECT id, name
    FROM department
  `;

  db.query(getDepartmentList, (err, departments) => {
    if (err) throw err;

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

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
          type: "list",
          name: "department_ID",
          message: "What department will the employee be employed in?",
          choices: departmentChoices,
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
              `Added Role: ${res.role} Salary: ${res.salary} Department: ${
                departmentChoices.find(
                  (department) => department.value === res.department_ID
                ).name
              }`
            );
            viewAllRoles();
          }
        );
      });
  });
};

const addEmployee = () => {
  const getManagerList = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name
    FROM employee
    WHERE id IN (
      SELECT DISTINCT manager_id
      FROM employee
      WHERE manager_id IS NOT NULL
    );
  `;

  const getRoleList = `
    SELECT id, title
    FROM role;
  `;

  db.query(getManagerList, (err, managers) => {
    if (err) throw err;

    db.query(getRoleList, (err, roles) => {
      if (err) throw err;

      const managerChoices = managers.map((manager) => ({
        name: manager.manager_name,
        value: manager.id,
      }));

      // Add the "None" option
      managerChoices.push({ name: "None", value: null });

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

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
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roleChoices,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managerChoices,
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
                `Added Employee: First Name: ${res.first_name} Last Name: ${
                  res.last_name
                } Role: ${
                  roleChoices.find((role) => role.value === res.role).name
                } Manager: ${
                  managerChoices.find(
                    (manager) => manager.value === res.manager
                  ).name
                }`
              );

              viewAllEmployees();
            }
          );
        });
    });
  });
};

const updateEmployee = () => {
  // Query the database to get a list of employees
  const getEmployeeList = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
    FROM employee
  `;

  const getRoleList = `
    SELECT id, title
    FROM role;
  `;

  db.query(getEmployeeList, (err, employees) => {
    if (err) throw err;

    db.query(getRoleList, (err, roles) => {
      if (err) throw err;

      const employeeChoices = employees.map((employee) => ({
        name: employee.employee_name,
        value: employee.id,
      }));

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "role",
            message: "What role will they be assigned?",
            choices: roleChoices,
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
            // Retrieve the selected role's title
            const selectedRole = roles.find((role) => role.id === res.role);
            console.log(
              `Updated employee ${selectedEmployee.employee_name} to role ${selectedRole.title}`
            );
            viewAllEmployees();
          });
        });
    });
  });
};

const updateEmployeeManager = () => {
  const getManagerListQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name
    FROM employee
    WHERE id IN (
      SELECT DISTINCT manager_id
      FROM employee
      WHERE manager_id IS NOT NULL
    );
  `;

  const getEmployeeListQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
    FROM employee
    WHERE manager_id IS NOT NULL
  `;

  db.query(getManagerListQuery, (err, managers) => {
    if (err) throw err;

    const managerChoices = managers.map((manager) => ({
      name: manager.manager_name,
      value: manager.id,
    }));

    db.query(getEmployeeListQuery, (err, employees) => {
      if (err) throw err;

      const employeeChoices = employees.map((employee) => ({
        name: employee.employee_name,
        value: employee.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "newManager",
            message: "Select the new manager for the employee:",
            choices: managerChoices,
          },
        ])
        .then((res) => {
          const query = `
            UPDATE employee SET manager_id = ? WHERE id = ?
          `;
          db.query(query, [res.newManager, res.employee], (err, result) => {
            if (err) throw err;
            // Retrieve the selected employee's name
            const selectedEmployee = employees.find(
              (employee) => employee.id === res.employee
            );
            const selectedManager = managers.find(
              (manager) => manager.id === res.newManager
            );

            console.log(
              `Updated ${selectedEmployee.employee_name}'s manager to ${selectedManager.manager_name}`
            );
            viewAllEmployees();
          });
        });
    });
  });
};

const deleteEmployee = () => {
  // Query the database to get a list of employees
  const getEmployeeList = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
    FROM employee
  `;

  db.query(getEmployeeList, (err, employees) => {
    if (err) throw err;

    // Extract employee names and ids from the query result
    const employeeChoices = employees.map((employee) => ({
      name: employee.employee_name,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employeeChoices,
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
          console.log(`Deleted employee ${selectedEmployee.employee_name}`);
          viewAllEmployees();
        });
      });
  });
};

const deleteRole = () => {
  // Query the database to get a list of employees
  const getRoleList = `
    SELECT id, title
    FROM role
  `;

  db.query(getRoleList, (err, roles) => {
    if (err) throw err;

    // Extract employee names and ids from the query result
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: roleChoices,
        },
      ])
      .then((res) => {
        const query = `
          DELETE FROM role WHERE id = ?
        `;
        db.query(query, [res.role], (err, result) => {
          if (err) throw err;
          // Retrieve the selected role's
          const selectedRole = roles.find((role) => role.id === res.role);
          console.log(`Deleted role ${selectedRole.role_title}`);
          viewAllRoles();
        });
      });
  });
};

const deleteDepartment = () => {
  // Query the database to get a list of departments
  const getDepartmentList = `
    SELECT id, name
    FROM department
  `;

  db.query(getDepartmentList, (err, departments) => {
    if (err) throw err;

    // Extract department names and ids from the query result
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: departmentChoices,
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
