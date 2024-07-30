SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL

SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
AS 
    manager 
FROM 
    employee 
LEFT JOIN 
    role on employee.role_id = role.id 
LEFT JOIN 
    department on role.department_id = department.id 
LEFT JOIN 
employee manager on manager.id = employee.manager_id;


SELECT 
      employee.id as "ID",
      employee.first_name as "First Name",
      employee.last_name as "Last Name",
      role.title as "Role",
      department.name as "Department",
      role.salary as "Salary",
      employee.manager_id as "Manager"
    FROM
      employee
    JOIN
      role ON employee.role_id = role.id
    JOIN
      department ON role.department_id = department.id

      

