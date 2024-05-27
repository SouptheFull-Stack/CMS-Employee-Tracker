const emp = require("express").Router();
const { Pool } = require("pg");

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

// FUNCTION TO VIEW ALL THE EMPLOYEES AND THEIR DETAILS
function viewAllEmployees() {
  emp.get("/api/employees", (req, res) => {
    Pool.query(
      `SELECT 
        employee.id as "ID",
        employee.first_name as "First Name",
        employee.last_name as "Last Name",
        role.title as "Role",
        role.salary as "Salary",
        department.name as "Department" 
      FROM 
        employee 
      JOIN 
        role ON employee.role_id = role.id
      JOIN 
        department ON role.department_id = department.id`,
      (err, data) => {
        if (err) {
          // FIX THIS UP LOOKS REALLY WEIRD (error callback function)
          console.error(`Error retrieving employee data: ${err}`);
          res.status(500).json({ error: "An error occured" });
          return; // returning so application stops when error occurs
        }
        console.table(data.rows); // Using console table to make the data neatly formatted
        res.json(data.rows);
      }
    );
  });
  promptUser();
}

viewAllEmployees();

// function addEmployee() {
//   inquirer.prompt(addEmployeePrompt).then((response) => {
//     emp.post("/api/employees", (req, res) => {
//       pool.query(
//         "INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)",
//         [
//           response.firstName,
//           response.lastName,
//           response.roleID,
//           response.managerID,
//         ]
//       );
//     });
//   });
// }

module.exports = emp;
