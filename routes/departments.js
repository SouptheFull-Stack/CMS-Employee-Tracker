const express = require("express").Router();

function viewAllDepartments() {
  express.get("/api/departments", (req, res) => {
    pool.query(
      `SELECT 
          department.id as "ID",
          department.name as "Department"
      FROM 
        department`,
      (err, data) => {
        if (err) {
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

function addDepartment() {}

module.exports = Department;
