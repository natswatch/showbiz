const mysql = require('mysql2');
const inquirer = require('inquirer');
const Employees = require('./lib/Employees');
const Roles = require('./lib/Roles');
const Departments = require('./lib/Departments');
// const Departments = require('./lib/Departments');
// const Roles = require('./lib/Roles');
require('console.table');

console.log(`
                          _                                                
               /         //                 /      _/_       /             
 , , , __ _   /<   ,_   //  __,  _, _    __/  __,  /   __,  /   __,  (   _ 
(_(_/_(_)/ (_/ |__/|_)_(/_ (_/(_(__(/_  (_/_ (_/(_(__ (_/(_/_) (_/(_/_)_(/_
                  /|                                                       
                 (/                                                        

`);

const selectTask = () => {
    return inquirer.prompt ({
        type: 'list',
        pageSize: 15,
        message: 'What would you like to do?',
        name: 'option',
        choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Add an Employee',
            'Add a Role',
            'Add a Department',
            'Update an Employee Role',
            'ExiT'
        ]
    })
    .then (({ option }) => {

        if (option === 'View All Employees') {
            const empData = new Employees(db);
            return empData.viewAllEmployees();
        } else if (option === 'View All Roles') {
            const roleData = new Roles(db);
            return roleData.viewAllRoles();
        } else if (option === 'View All Departments') {
            const deptData = new Departments(db);
            return deptData.viewAllDepartments();
        } else if (option === 'Add an Employee') {
            return newEmployeePrompts();
        } else if (option === 'Add a Role') {
            return inquirer.prompt(newRolePrompts);
        } else if (option === 'Add a Department') {
            return inquirer.prompt(newDepartmentPrompt);
        } else if (option === 'Update an Employee Role') {
            return inquirer.prompt(updateEmployeePrompt); 
        } else {
            return;
        }
    })
    .catch(err => {
        console.log(err);
    });
};

const newEmployeePrompts = () => {
     inquirer.prompt([
        {   
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstName',
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('Please enter the first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName',
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log('Please enter the last name');
                    return false;
                }
            }
        },
        {
            type: 'list',
            message: "Select Employee's role:",
            name: 'roleID',
            choices: [
                { 
                    name: 'Salesperson',
                    value: 1
                },
                { 
                    name: 'Sales Lead',
                    value: 2
                }, 
                { 
                    name: 'Software Engineer',
                    value: 3
                }, 
                { 
                    name: 'Lead Engineer',
                    value: 4
                }, 
                { 
                    name: 'Accountant',
                    value: 5
                },
                { 
                    name: 'Lawyer',
                    value: 6
                },
                { 
                    name: 'Legal Team Lead',
                    value: 7
                }] 
        },
        {
            type: 'list',
            message: "Select Employee's Manager:",
            name: 'managerID',
            choices: [
                { 
                    name: 'None',
                    value: null
                 },
                 { 
                    name: 'John Doe',
                    value: 1
                 },
                 { 
                    name: 'Mike Chan',
                    value: 2
                 },
                 { 
                    name: 'Ashley Rodriguez',
                    value: 3
                 },
                 { 
                    name: 'Kevin Tupik',
                    value: 4
                 },
                 { 
                    name: 'Malia Brown',
                    value: 5
                 },
                 { 
                    name: 'Sarah Lourd',
                    value: 6
                 },
                 { 
                    name: 'Tom Allen',
                    value: 7
                 },
                 { 
                    name: 'Christian Eckonridge',
                    value: 8
                 }]
        }
    ]).then(function(answers){
        const empData = new Employees(db);
        return empData.addEmployee(answers);
    })
};





const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'squidr0x',
    database: 'workplace_db'
});


db.connect(err => {
if (err) throw err;
console.log('connected as id ' + db.threadId);
})


selectTask();

module.exports = db;
exports.selectTask = selectTask;


// sql for getting ALL employees 
// SELECT emp1.id, emp1.first_name, emp1.last_name, title, dept_name AS department,CONCAT(emp2.first_name,' ',emp2.last_name) AS manager
// FROM employees emp1
// LEFT JOIN roles ON emp1.role_id = roles.id
// LEFT JOIN departments ON emp1.role_id = departments.id
// LEFT JOIN employees emp2 ON emp1.manager_id = emp2.id;