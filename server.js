const mysql = require('mysql2');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
host: 'localhost',
port: 3306,
// Your MySQL username
user: 'root',
// Your MySQL password
password: 'squidr0x',
database: 'ice_creamDB'
});


connection.connect(err => {
if (err) throw err;
console.log('connected as id ' + connection.threadId);
afterConnection();
})

// sql for getting ALL employees 
// SELECT emp1.id, emp1.first_name, emp1.last_name, title, dept_name AS department,CONCAT(emp2.first_name,' ',emp2.last_name) AS manager
// FROM employees emp1
// LEFT JOIN roles ON emp1.role_id = roles.id
// LEFT JOIN departments ON emp1.role_id = departments.id
// LEFT JOIN employees emp2 ON emp1.manager_id = emp2.id;