\c employee_management_db;

INSERT INTO department (name)
    VALUES 
        ('Management'),
        ('Human Resources'),
        ('IT'),
        ('Finance'),
        ('Administration');

INSERT INTO role (title, salary, department_id)
    VALUES
        ('Office Manager', 130000, 1),
        ('People and Culture Coordinator', 65000, 2),
        ('Product Team Lead', 102000, 3),
        ('Bookkeeper', 75000, 4),
        ('Operations Manager', 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) -- manager_id refers to the one manager of every employee in this context
    VALUES
        ('Sammy', 'Hinklebutt', 1, null),  
        ('Mitra', 'Whineyhat', 2, 1),
        ('Jacob', 'HappyCuy', 3, 1);
        


    


