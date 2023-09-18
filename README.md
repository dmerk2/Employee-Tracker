# Employee-Tracker

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" width="100">
</div>

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Walkthrough Video](#walkthrough-video)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Description

- **View All Departments, Roles, and Employees:** Upon starting the application, users are presented with options to view all existing departments, roles, and employees.

- **View Department Information:** Choosing to view departments displays a formatted table containing department names and their corresponding IDs.

- **View Role Details:** Selecting the 'View Roles' option provides job title, role ID, associated department, and salary information for each role.

- **View Employee Information:** Opting to view employees presents a table with comprehensive employee data, including IDs, names, job titles, departments, salaries, and their respective managers.

- **Add New Department:** Users are prompted to enter the name of a new department, which is then seamlessly added to the database.

- **Add New Role:** Users can add a new role by providing details like name, salary, and associated department.

- **Add New Employee:** When selecting to add an employee, users input first name, last name, role, and manager information, successfully integrating the new employee into the system.

- **Update Employee Role:** Users can choose to update an employee's role. They select an employee and specify the new role, and this information is promptly updated in the database.

- **Update Employee Managers:** This application feature allows users to update the manager of an employee, providing flexibility in organizational structure.

- **View Employees by Manager:** Users can view employees based on their respective managers, enabling a hierarchical view of the organization.

- **View Employees by Department:** This functionality allows users to see a list of employees categorized by department.

- **Delete Departments, Roles, and Employees:** Users have the ability to delete records, providing comprehensive control over the system's data.

- **Calculate Total Department Budget:** The application calculates the total combined salaries of all employees within a specific department, aiding in budget planning and allocation.

## Installation

Clone the repository to your local machine

```sh
1. git clone https://github.com/dmerk2/Employee-Tracker.git
```

Install dependencies and start the local server

```sh
2. npm i && node server.js
```

Enter password for mysql db in server.js

Log into mysql on local machine than enter password

```sh
3. mysql -u root -p
```

Add the schema.sql to create the database structure

```sh
4. SOURCE schema.sql;
```

Add the seeds.sql to populate the database

```sh
5. SOURCE seeds.sql;
```

## Walkthrough Video

Click the lightning bolt [⚡](https://watch.screencastify.com/v/rd5bwgJrwA3vss2g7tPJ) to view the Employee Tracker in action!

## Usage

<video width="500" height="300" controls>
  <source src="./assets/preview.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## License

This project is licensed under the terms of the **[MIT License](https://opensource.org/licenses/MIT)**

## Contributing

Daniel Merkin

## Tests

N/A

## Questions

If you have any questions or suggestions about this project, please feel free to contact me:

- GitHub: [@dmerk2](https://github.com/dmerk2)
- Email: dan.merkin@gmail.com
