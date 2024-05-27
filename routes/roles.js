const roles = require("express").Router();

// FUNCTION TO FETCH THE ROLE DATA
function viewAllRoles() {
  roles.get("/api/roles", (req, res) => {
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
          // FIX THIS UP LOOKS REALLY WEIRD
          console.error(err);
          res.status(500).json({ error: "An error occured" });
          return;
        }
        console.table(data.rows);
        res.json(data.rows);
      }
    );
  });
}

function addRole() {}

function updateEmployeeRole() {}

module.exports = roles;
