const myModule = require('../server');

class Employees {
    constructor(connection) {
        this.connection = connection;
    }
    
    //query that views all employees
    viewAllEmployees () {
        this.connection.query(
            `SELECT emp1.id, emp1.first_name, emp1.last_name, title,     
            dept_name AS department,CONCAT(emp2.first_name,' ',emp2.last_name) AS manager
            FROM employees emp1
            LEFT JOIN roles ON emp1.role_id = roles.id
            LEFT JOIN depts ON roles.department_id = depts.id
            LEFT JOIN employees emp2 ON emp1.manager_id = emp2.id;`, function(err, res) {
            if(err){
                throw(err);
            }
            console.log("\n");
            console.table(res);
            myModule.selectTask();
        });
    };

    // query that creates a new employee
    addEmployee(answers) {
       
        this.connection.query(
            `INSERT INTO employees SET ?`, {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleID,
                manager_id: answers.managerID
            }, function(err, res) {
                if(err){
                    throw(err);
                }
                console.log(res.affectedRows + ' employee added!\n');
                myModule.selectTask();
            });
    };

    // query to update employee's role
    updateEmployeeRole(answers) {
        this.connection.query(
            `UPDATE employees SET role_id = ? WHERE id = ?`, 
            [ answers.role, answers.id ], function(err, res) {
                if(err){
                    throw(err);
                }
                console.log(res.affectedRows + ' role updated!\n');
                myModule.selectTask();
            });
    };
}

module.exports = Employees;