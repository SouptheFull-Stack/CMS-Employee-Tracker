// Importing of packages needed for project
const inquirer = require("inquirer");
const express = require("express");
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool(
  {
    user: "postgres", // Need to enter your own user and password for this to work
    password: "postgres",
    host: "localhost",
    database: "employee_management_db",
  },
  console.log(`Connected to the employee_management_database!`)
);

pool.connect();

const prompts = [
  {
    type: "list",
    // prefix: "(Use arrow keys)",
    message: "What would you like to do?",
    name: "options",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

const addEmployeePrompt = [
  {
    message: "What is the employee's first name?",
    name: "firstName",
  },
  {
    message: "What is the employee's last name?",
    name: "lastName",
  },
  {
    message: "What is the employee's role ID?",
    name: "roleID",
  },
  {
    message: "What is the employee's manager ID?",
    name: "managerID",
  },
];

// const updateEmployeePrompt = [
//   {
//     type: "list",
//     message: "What would you like to update?",
//     name: "updates",
//     choices: [
//         "First Name",
//         "Last Name",
//         "Role ID",
//         "Manager ID"
//     ],
//   },
// ];

// pool.query("SELECT * FROM employee", function (err, { rows }) {
//   console.log(rows);
// });

function promptUser() {
  inquirer.prompt(prompts).then((response) => {
    switch (response.options) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewAllDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Quit":
        pool.end();
        console.log("Good riddance!");
    }
  });
}

function viewAllEmployees() {
  // Why doesn't it display as a table? Do I have to do that? found console.table which auto formats.
  pool.query(
    "SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', FROM employee JOIN role ON employee.role_id = role.id",
    function (err, ) => {
      if (err) {
        console.log(err);
      }
      else {
      console.table(rows);
      }
    }
  );
}

function addEmployee() {
  inquirer.prompt(addEmployeePrompt).then((response) => {
    pool.query(
      "INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)",
      [
        response.firstName,
        response.lastName,
        response.roleID,
        response.managerID,
      ],
      console.table(rows)
    );
  });
}

promptUser();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

//     if (response.options === "View All Employees") {
//       pool.query =
//         ("SELECT * FROM employee",
//         function (err, { rows }) {
//           console.log(rows);
//         });
//     }
//   });
// }

// if (response.options === "Add Employee") {
//   pool.query = "";
// }
// if (response.options === "Update Employee Role") {
//   pool.query = "";
// }
// if (response.options === "View All Roles") {
//   pool.query = "";
// }
// if (response.options === "Add Role") {
//   pool.query = "";
// }
// if (response.options === "View All Departments") {
//   pool.query = "";
// }
// if (response.options === "Add Department") {
//   pool.query = "";
// }
// if (response.options === "Quit") {
//   pool.query = "";
// }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
