const mysql = require('mysql2');
const inquirer = require('inquirer');
const Employees = require('./lib/Employees');
const Roles = require('./lib/Roles');
const Departments = require('./lib/Departments');
// const Departments = require('./lib/Departments');
// const Roles = require('./lib/Roles');
require('console.table');
var employeeArray = [];

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
            return updateEmployeeRole(); 
        } else {
            process.exit(1);
        }
    })
    .catch(err => {
        console.log(err);
    });
};

const newEmployeePrompts = async () => {
    
    var employees = await getEmployees();
    var updatedList = employees.map(i => {
        return {
            name: i.name,
            value: i.id
        }
    });
    updatedList.push({
        name: 'None',
        value: 0
    })
    
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
            choices: updatedList
        }
    ]).then(function(answers){
        const empData = new Employees(db);
        return empData.addEmployee(answers);
    })
};

const getEmployees = () => {
    return new Promise((resolve, reject) => {
        db.query(`
    SELECT id, CONCAT(first_name, ' ',last_name) AS name FROM employees`,
            function (err, res) {
                if (err) {
                    throw (err);
                }
                resolve(res)
            });
    });
}

const getRoles = () => {
    return new Promise((resolve, reject) => {
        db.query(`
    SELECT id, title FROM roles`,
            function (err, res) {
                if (err) {
                    throw (err);
                }
                resolve(res)
            });
    });
}

const updateEmployeeRole = async () => {
    var employees = await getEmployees();
    var updatedList = employees.map(i => {
        return {
            name: i.name,
            value: i.id
        }
    });

    var roles = await getRoles();
    var rolesList = roles.map(i => {
        return {
            name: i.title,
            value: i.id
        }
    });

    inquirer.prompt([
        {   
            type: 'list',
            message: "Select the employee you would like to update",
            name: 'id',
            choices: updatedList
        },
        {
            type: 'list',
            message: "Select their new role",
            name: 'role',
            choices: rolesList
        }
    ]).then(function(answers){
        const empData = new Employees(db);
        return empData.updateEmployeeRole(answers);
    })
}

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'squidr0x',
    database: 'workplace_db'
});

db.connect(err => {
    if (err) throw err;
})

selectTask();

module.exports = db;
exports.selectTask = selectTask;
