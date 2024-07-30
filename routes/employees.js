// const emp = require("express").Router();
// const { Pool } = require("pg");

// // Pool pg connection to database
// const pool = new Pool(
//   {
//     user: "postgres",
//     password: "postgres",
//     host: "localhost",
//     database: "employee_management_db",
//   },
//   console.log(`Connected to the employee_management_database!`)
// );

// // More connection to database using pool
// pool.connect();

// viewAllEmployees();

// // function addEmployee() {
// //   inquirer.prompt(addEmployeePrompt).then((response) => {
// //     emp.post("/api/employees", (req, res) => {
// //       pool.query(
// //         "INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)",
// //         [
// //           response.firstName,
// //           response.lastName,
// //           response.roleID,
// //           response.managerID,
// //         ]
// //       );
// //     });
// //   });
// // }

// module.exports = emp;
