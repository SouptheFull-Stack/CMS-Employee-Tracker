// Importing of packages needed for project
const inquirer = require("inquirer");
const express = require("express");
const { Pool } = require("pg");
// const PORT = process.env.PORT || 3001; // Not sure if I need this for this assessment, testing with const PORT = 3001;

// Importing the feedback router
const api = require("./routes/index");

const PORT = 3001;

const app = express();

// The express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// We want to send all api pathed requests to the index.js file in routes and handled by the index modules
app.use("/api", api);

// Pool pg connection to database
const pool = new Pool(
  {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    database: "employee_management_db",
  },
  console.log(`Connected to the employee_management_database!`)
);

// More connection to database using pool
pool.connect();

// Main menu Inquirer prompts
const prompts = [
  {
    type: "list",
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

// Separate prompt array for creating employees
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
    type: "list",
    message: "What is the employee's role?",
    name: "roleName",
    // NEED TO FIGURE OUT HOW TO USE FETCHED DATA AS CHOICE ARRAY IN INQUIRER PROMPT
    choices: "fetchRoles();",
  },
  {
    message: "Who is the employee's manager?",
    name: "managerName",
  },
];

// DRAFT OF UPDATE EMPLOYEE INQUIRER PROMPT
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

// Function with Inquirer prompts
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

promptUser();

// FOR THIS PROJECT WE HAVE TO USE EXPRESS REQUESTS
// app.get('/api/employees', (req, res) => {
//     res.json(pool.query())
// };

// function viewAllRoles() {
//   pool.query(
//     `SELECT
//       role.title as "Role",
//       role.salary as "Salary",
//     FROM
//       employee
//     JOIN
//       role ON employee.role_id = role.id
//     JOIN
//       department ON role.department_id = department.id`,
//     function (err, { rows }) {
//       console.table(rows);
//     }
//   );
// }

//
//   BELOW IS PRACTISE, EARLY DRAFTS
//

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
