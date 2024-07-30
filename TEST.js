// NEED TO FETCH DATA FIRST
// THEN PROMPT USER
// THEN DISPLAY DATA IN PROMPTS
// THEN SAVE DATA FROM DATA PROMPTS

function addEmployee() {
  async function getRoleList() {
    try {
      const roleData = await pool.query("SELECT role.title FROM role");
      return roleData.rows;
    } catch (err) {
      console.error(err);
    }
  }
  async function getManagerList() {
    try {
      const managerData = await pool.query(
        `SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL`
      );
      return managerData.rows;
    } catch (err) {
      console.error(err);
    }
  }
  inquirer.prompt(addEmployeePrompt).then((response) => {
    const { firstName, lastName, roleID, managerID } = response;
    pool.query(
      `INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)`,
      [firstName, lastName, roleID, null],
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  });
}

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
    choices: getRoleList,
  },
  {
    message: "Who is the employee's manager?",
    name: "managerName",
    choices: getManagerList,
  },
];

async function getRoleList() {
  try {
    const roleData = await pool.query("SELECT role.title FROM role");
    return roleData.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getManagerList() {
  try {
    const managerData = await pool.query(
      `SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL`
    );
    return managerData.rows;
  } catch (err) {
    console.error(err);
  }
}

function addEmployee() {
  inquirer.prompt(addEmployeePrompt).then((response) => {
    const { firstName, lastName, roleID, managerID } = response;
    pool.query(
      `INSERT INTO employee (first_name, last_name, role_ID, manager_ID) VALUES ($1, $2, $3, $4)`,
      [firstName, lastName, roleID, null],
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  });
}

// observe and cry later
// app.get("/api/employees", (req, res) => {
//   pool.query(
//     `SELECT
//         employee.id as "ID",
//         employee.first_name as "First Name",
//         employee.last_name as "Last Name",
//         role.title as "Role",
//         role.salary as "Salary",
//         department.name as "Department"
//       FROM
//         employee
//       JOIN
//         role ON employee.role_id = role.id
//       JOIN
//         department ON role.department_id = department.id`,
//     (err, data) => {
//       if (err) {
//         // FIX THIS UP LOOKS REALLY WEIRD (error callback function)
//         console.error(`Error retrieving employee data: ${err}`);
//         res.status(500).json({ error: "An error occured" });
//         return; // returning so application stops when error occurs
//       }
//       console.table(data.rows); // Using console table to make the data neatly formatted
//       res.json(data.rows);
//       promptUser();
//     }
//   );
// });

// REQUEST VERSION DO NOT USE
// function addEmployee() {
//   inquirer.prompt(addEmployeePrompt).then((response) => {
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

// async function getManagerList() {
//   await pool.query("SELECT * FROM manager");
// }

// function addEmployee() {
//   function getNames() {
//     const query = {
//       text: "SELECT role.id, role.title",
//       rowMode: "array",
//     };

//     const res = pool.query(query);
//     //console.log(res.fields.map(field => field.name)) // ['first_name', 'last_name']
//     //console.log(res.rows[0]) // ['Brian', 'Carlson']
//     return res.rows;
//   }
//   inquirer
//     .prompt([
//       {
//         message: "What is the employee's first name?",
//         name: "firstName",
//       },
//       {
//         message: "What is the employee's last name?",
//         name: "lastName",
//       },
//       {
//         //type: "list",
//         message: "What is the employee's role?",
//         name: "roleName",
//         // NEED TO FIGURE OUT HOW TO USE FETCHED DATA AS CHOICE ARRAY IN INQUIRER PROMPT
//         //choices: [getNames],
//       },
//       {
//         message: "Who is the employee's manager?",
//         name: "managerName",
//         choices: getManagerList(),
//       },
//     ])
//     .then((answers) => {
//       pool.query(
//         `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${answers.roleName}, null)`,
//         (err, data) => {
//           if (err) {
//             // FIX THIS UP LOOKS REALLY WEIRD (error callback function)
//             console.error(`Error retrieving employee data: ${err}`);
//             return; // returning so application stops when error occurs
//           }
//           console.table(data.rows); // Using console table to make the data neatly formatted
//         }
//       );
//     });
// }

// role_ID, manager_ID

// IGNORE FOR REVIEW ONLY (MISTAKE)
// function viewAllRoles() {
//   app.get("/api/roles", (req, res) => {
//     pool.query(
//       `SELECT
//           role.title as "Role",
//           role.salary as "Salary",
//           department.name as "Department"
//         FROM
//           role
//         JOIN
//           department ON role.department_id = department.id`,
//       (err, data) => {
//         if (err) {
//           // FIX THIS UP LOOKS REALLY WEIRD
//           console.error(err);
//           res.status(500).json({ error: "An error occured" });
//           return;
//         }
//         console.table(data.rows);
//         res.json(data.rows);
//       }
//     );
//   });
//   userPrompt();
// }

// const viewAllEmployees = () => {
//   fetch("/api/employees", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.table(data);
//     })
//     .catch((error) => {
//       console.error(`Error occured: ${error}`);
//     });
// };

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
