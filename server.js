// Importing of packages needed for project
const inquirer = require("inquirer");
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
      "View Employees By Manager",
      "View Employees By Department",
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

// Function with Inquirer prompts
async function promptUser() {
  // console.log(lel);
  inquirer.prompt(prompts).then((response) => {
    switch (response.options) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "View Employees By Manager":
        viewEmployeesByManager();
        break;
      case "View Employees by Department":
        viewEmployeesByDepartment();
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

// call function to execute upon application start
promptUser();

// FUNCTION TO VIEW ALL THE EMPLOYEES AND THEIR DETAILS
async function viewAllEmployees() {
  try {
    const employeesDb = `SELECT
          employee.id as "ID",
          employee.first_name as "First Name",
          employee.last_name as "Last Name",
          role.title as "Role",
          department.name as "Department",
          role.salary as "Salary",
          CONCAT(manager.first_name, ' ', manager.last_name) as "Manager"
        FROM
          employee
        JOIN
          role ON employee.role_id = role.id
        JOIN
          department ON role.department_id = department.id
        LEFT JOIN
          employee AS manager ON employee.manager_id = manager.id`;

    const employees = await pool.query(employeesDb);

    console.table(employees.rows); // Using console table to make the data neatly formatted
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

async function viewEmployeesByDepartment() {
  try {
    const departments = await pool.query(`SELECT id, name FROM department`);

    const departmentChoices = departments.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    const { department_id } = await inquirer.prompt([
      {
        type: "list",
        name: "department_id",
        message: "Pick a department: ",
        choices: departmentChoices,
      },
    ]);

    const employees = await pool.query(
      `
      SELECT
        employee.id as "ID",
        employee.first_name as "First Name",
        employee.last_name as "Last Name",
        role.title as "Role",
        role.salary as "Salary"
      FROM
        employee
      JOIN
        role ON employee.role_id = role.id
      JOIN
        department ON role.department_id = department.id
      WHERE
        employee.department_id = $1
    `,
      [department_id]
    );

    console.table(employees.rows);
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

async function viewEmployeesByManager() {
  try {
    const managers = await pool.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id IS NULL"
    );

    const managerChoices = managers.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    const { manager_id } = await inquirer.prompt([
      {
        type: "list",
        name: "manager_id",
        message: "Pick a manager: ",
        choices: managerChoices,
      },
    ]);

    const employees = await pool.query(
      `
      SELECT
        employee.id as "ID",
        employee.first_name as "First Name",
        employee.last_name as "Last Name",
        role.title as "Role",
        department.name as "Department",
        role.salary as "Salary"
      FROM
        employee
      JOIN
        role ON employee.role_id = role.id
      JOIN
        department ON role.department_id = department.id
      WHERE
        employee.manager_id = $1
    `,
      [manager_id]
    );

    console.table(employees.rows);
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

async function addEmployee() {
  try {
    // Fetch roles from the database
    const roles = await pool.query("SELECT id, title FROM role");

    // Map roles to choices for inquirer
    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const managers = await pool.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id IS NULL"
    );

    const managerChoices = managers.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    // Prompt user for employee details
    const employee = await inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "First name: ",
      },
      {
        type: "input",
        name: "last_name",
        message: "Last name: ",
      },
      {
        type: "list",
        name: "role_id",
        message: "What is their role? ",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is their manager? ",
        // if employee is manager then expect null manager id
        choices: [...managerChoices, { name: "None", value: null }],
      },
    ]);

    const result = await pool.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        employee.first_name,
        employee.last_name,
        employee.role_id,
        employee.manager_id,
      ]
    );

    console.table(result.rows);
    promptUser();
  } catch (err) {
    console.error("Error adding employee:", err.message || err);
  }
}

async function updateEmployeeRole() {
  try {
    const employees = await pool.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee"
    );

    const employeeChoices = employees.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    const roles = await pool.query("SELECT id, title FROM role");

    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role would you like to update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to assign to the selected employee?",
        choices: roleChoices,
      },
    ]);

    const result = await pool.query(
      "UPDATE employee SET role_id = $1 WHERE id = $2",
      [roleId, employeeId]
    );

    console.log("Employee's role updated successfully!");
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

async function viewAllRoles() {
  try {
    const roles = await pool.query(`SELECT 
      role.title as "Role",
      role.salary as "Salary",
      department.name as "Department"
    FROM 
      role
    JOIN 
      department ON role.department_id = department.id`);

    console.table(roles.rows);
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

async function addRole() {
  try {
    const departments = await pool.query("SELECT id, name FROM department");

    const departmentChoices = departments.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    const newRole = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Name of role: ",
      },
      {
        type: "input",
        name: "salary",
        message: "Salary: ",
      },
      {
        type: "list",
        name: "department_id",
        message: "What department does this belong to?",
        choices: departmentChoices,
      },
    ]);

    const result = await pool.query(
      "INSERT into role (title, salary, department_id) VALUES ($1, $2, $3)",
      [newRole.title, newRole.salary, newRole.department_id]
    );

    console.log("Role added successfully!");
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

// FUNCTION TO VIEW ALL DEPARTMENTS
async function viewAllDepartments() {
  try {
    const departments = await pool.query(
      `SELECT
            department.id as "ID",
            department.name as "Department"
        FROM
          department`
    );
    console.table(departments.rows);
    promptUser();
  } catch (err) {
    console.error(err);
  }
}

async function addDepartment() {
  try {
    const newDepartment = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Name of department: ",
      },
    ]);

    const result = await pool.query(
      "INSERT into department (name) VALUES ($1)",
      [newDepartment.name]
    );

    console.log("Department added successfully!");
    promptUser();
  } catch (err) {
    console.error(err);
  }
}
