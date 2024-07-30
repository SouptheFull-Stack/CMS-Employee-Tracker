\c employee_management_db;

INSERT INTO department (name)
    VALUES 
        ('Management'),
        ('Human Resources'),
        ('IT'),
        ('Finance'),
        ('Legal');

INSERT INTO role (title, salary, department_id)
    VALUES
        ('Office Manager', 130000, 1),
        ('CEO', 160000, 1),
        ('Executive Assistant', 85000, 1),
        ('People and Culture Coordinator', 75000, 2),
        ('HR Lead', 105000, 2),
        ('Product Team Lead', 102000, 3),
        ('IT Support Officer', 80000, 3),
        ('Software Engineer', 105000, 3),
        ('Bookkeeper', 75000, 4),
        ('Accounts Manager', 90000, 4),
        ('Treasurer', 85000, 4),
        ('Lawyer', 130000, 5),
        ('Paralegal', 75000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) -- manager_id refers to the one manager of every employee in this context
    VALUES
        ('Sammy', 'Hinklebutt', 1, null),  
        ('Mitra', 'Whineyhat', 2, 1),
        ('Jacob', 'HappyCuy', 3, 1),
        ('Jack', 'Bog', 4, null),
        ('Matt', 'Bob', 5, null),
        ('Bailey', 'Bingo', 6, null),
        ('Liam', 'Trin', 7, 4),
        ('Poopy', 'Pinky', 8, 5);
        




        


    


