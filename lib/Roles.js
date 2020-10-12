const myModule = require('../server');

class Roles {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllRoles () {
        
       // displays all roles
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

    // create a role
    addRole(roleInfo) {
       
        this.connection.query(
            `INSERT INTO employees SET ?`, {
                title: roleInfo.title,
                salary: roleInfo.salary,
                department_id: roleInfo.department_id
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