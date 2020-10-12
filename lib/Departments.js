const myModule = require('../server');

class Departments {
    constructor(connection) {
        this.connection = connection;
    }
    // query to view all departments
    viewAllDepartments () {
        this.connection.query(
            `SELECT depts.dept_name AS department, depts.id AS department_id
            FROM depts;`, function(err, res) {
            if(err){
                throw(err);
            }
            console.log("\n");
            console.table(res);
            myModule.selectTask();
        });
        
    };
    // query to insert a new department
    addDepartment(department) {
        this.connection.query(
            `INSERT INTO depts SET ?`, {
                dept_name: department.name
            }, function(err, res) {
                if(err){
                    throw(err);
                }
                console.log(res.affectedRows + ' department added!\n');
                myModule.selectTask();
            });
    };
}

module.exports = Departments;