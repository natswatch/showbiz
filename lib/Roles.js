const myModule = require('../server');

class Roles {
    constructor(connection) {
        this.connection = connection;
    }
    
    // query that displays all roles
    viewAllRoles () {
        this.connection.query(
            `SELECT roles.title AS job_title, roles.id AS role_id, depts.dept_name AS department, roles.salary 
            FROM roles 
            LEFT JOIN depts ON roles.department_id = depts.id;`, function(err, res) {
            if(err){
                throw(err);
            }
            console.log("\n")
            console.table(res);
            myModule.selectTask();
        });
        
    };

    // query to insert a new role
    addRole(roleInfo) {
        this.connection.query(
            `INSERT INTO roles SET ?`, {
                title: roleInfo.name,
                salary: roleInfo.salary,
                department_id: roleInfo.department
            }, function(err, res) {
                if(err){
                    throw(err);
                }
                console.log(res.affectedRows + ' role added!\n');
                myModule.selectTask();
            });
    };
}

module.exports = Roles;