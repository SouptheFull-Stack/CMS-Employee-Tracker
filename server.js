// Importing of packages needed for project
const inquirer = require("inquirer");
const express = require("express");
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;

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
const addEmployeePrompt = async () => [
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
    choices: await getRoleList(),
  },
  {
    type: "list",
    message: "Who is the employee's manager?",
    name: "managerName",
    choices: await getManagerList(),
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
async function promptUser() {
  const lel = await getManagerList();
  // console.log(lel);
  inquirer.prompt(prompts).then((response) => {
    switch (response.options) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add Employee":
        addEmployee();
      // break;
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

// call function to execute upon application start
promptUser();

// FUNCTION TO VIEW ALL THE EMPLOYEES AND THEIR DETAILS
// async function viewAllEmployees() {
//   try {
//     const employeesDb = `SELECT
//           employee.id as "ID",
//           employee.first_name as "First Name",
//           employee.last_name as "Last Name",
//           role.title as "Role",
//           department.name as "Department",
//           role.salary as "Salary"
//           employee.manager_id as "Manager"
//         FROM
//           employee
//         JOIN
//           role ON employee.role_id = role.id
//         JOIN
//           department ON role.department_id = department.id
//         LEFT JOIN
//           employee manager_id ON employee.manager_id = manager.id`;

//     const employees = await pool.query(employeesDb);

//     console.table(employees.rows); // Using console table to make the data neatly formatted
//     promptUser();
//   } catch (err) {
//     console.error(err);
//   }
// }

async function viewAllEmployees() {
  try {
    const employeesDb = `
      SELECT
        e.id as "ID",
        e.first_name as "First Name",
        e.last_name as "Last Name",
        r.title as "Role",
        d.name as "Department",
        r.salary as "Salary",
        CONCAT(manager_id.first_name, ' ', manager.last_name) as "Manager"
      FROM
        employee e
      JOIN
        role r ON e.role_id = r.id
      JOIN
        department d ON r.department_id = d.id
      LEFT JOIN
        employee m ON e.manager_id = m.id`;

    const employees = await pool.query(employeesDb);

    console.table(employees.rows);
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

// Using async functions so that the dynamically created data can fetch the sql data before we change it with user input
// async function getRoleList() {
//   try {
//     const roleData = await pool.query("SELECT role.title FROM role");

//     return roleData.rows.map((row) => ({ name: row.title, value: row.id }));
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// }

async function getRoleList() {
  try {
    const rolesDb = "SELECT role.title FROM role";

    const roles = await pool.query(rolesDb);

    console.table(roles.rows);
  } catch (err) {
    console.error(err);
    return;
  }
}

async function getManagerList() {
  try {
    const managerData = await pool.query(
      `SELECT employee.id AS "value", CONCAT(employee.first_name, ' ', employee.last_name) as "name" FROM employee WHERE manager_id IS NULL;`
    );
    return managerData.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

// need integer value for choices, and name which is what is displayed
const addEmployee = async () => {
  const prompts = await addEmployeePrompt();
  inquirer.prompt(prompts).then((response) => {
    const insertQuery = `INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)`;
    const values = [
      response.firstName,
      response.lastName,
      response.roleID,
      response.managerID,
    ];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Added successfully!");
        promptUser();
      }
    });
  });
};

// async function getRoleList() {
//   try {
//     const roleData = await pool.query("SELECT role.title FROM role");
//     return roleData.rows;
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function getManagerList() {
//   try {
//     const managerData = await pool.query(
//       `SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL`
//     );
//     return managerData.rows;
//   } catch (err) {
//     console.error(err);
//   }
// }

// function addEmployee() {
//   inquirer.prompt(addEmployeePrompt).then((response) => {
//     const { firstName, lastName, roleID, managerID } = response;
//     pool.query(
//       `INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)`,
//       [firstName, lastName, roleID, null],
//       (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         console.table(data.rows);
//       }
//     );
//   });
// }

// function addEmployee() {
//   async function getRoleList() {
//     try {
//       const roleData = await pool.query("SELECT role.title FROM role");
//       return roleData.rows;
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   async function getManagerList() {
//     try {
//       const managerData = await pool.query(
//         `SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL`
//       );
//       return managerData.rows;
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   inquirer.prompt(addEmployeePrompt).then((response) => {
//     const { firstName, lastName, roleID, managerID } = response;
//     pool.query(
//       `INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)`,
//       [firstName, lastName, roleID, null],
//       (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//       }
//     );
//   });
// }

// const addEmployeePrompt = [
//   {
//     message: "What is the employee's first name?",
//     name: "firstName",
//   },
//   {
//     message: "What is the employee's last name?",
//     name: "lastName",
//   },
//   {
//     type: "list",
//     message: "What is the employee's role?",
//     name: "roleName",
//     choices: getRoleList,
//   },
//   {
//     message: "Who is the employee's manager?",
//     name: "managerName",
//     choices: getManagerList,
//   },
// ];

// async function getRoleList() {
//   try {
//     const roleData = await pool.query("SELECT role.title FROM role");
//     return roleData.rows;
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function getManagerList() {
//   try {
//     const managerData = await pool.query(
//       `SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL`
//     );
//     return managerData.rows;
//   } catch (err) {
//     console.error(err);
//   }
// }

// function addEmployee() {
//   inquirer.prompt(addEmployeePrompt).then((response) => {
//     const { firstName, lastName, roleID, managerID } = response;
//     pool.query(
//       `INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)`,
//       [firstName, lastName, roleID, null],
//       (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//       }
//     );
//   });
// }

function updateEmployeeRole() {}

function viewAllRoles() {
  pool.query(
    `SELECT 
        role.title as "Role",
        role.salary as "Salary",
        department.name as "Department"
      FROM 
        role
      JOIN 
        department ON role.department_id = department.id`,
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(data.rows);
      promptUser();
    }
  );
}

function addRole() {}

// FUNCTION TO VIEW ALL DEPARTMENTS
function viewAllDepartments() {
  pool.query(
    `SELECT
          department.id as "ID",
          department.name as "Department"
      FROM
        department`,
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(data.rows);
      promptUser();
    }
  );
}

function addDepartment() {}
