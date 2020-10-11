const myModule = require('../server');

class Departments {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllDepartments () {
        
        // return console.log("hi");
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
}

module.exports = Departments;