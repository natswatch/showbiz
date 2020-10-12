const mysql = require('mysql2');
const inquirer = require('inquirer');
const Employees = require('./lib/Employees');
const Roles = require('./lib/Roles');
const Departments = require('./lib/Departments');
require('console.table');

console.log(`
                          _                                                
               /         //                 /      _/_       /             
 , , , __ _   /<   ,_   //  __,  _, _    __/  __,  /   __,  /   __,  (   _ 
(_(_/_(_)/ (_/ |__/|_)_(/_ (_/(_(__(/_  (_/_ (_/(_(__ (_/(_/_) (_/(_/_)_(/_
                  /|                                                       
                 (/                                                        

`);

// main menu prompts
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
            return newRolePrompts();

        } else if (option === 'Add a Department') {
            return newDepartmentPrompt();

        } else if (option === 'Update an Employee Role') {
            return updateEmployeeRole(); 

        } else {
            return;
        }
    })
    .catch(err => {
        console.log(err);
    });
};

// new prompts when user selects to add a new employee
const newEmployeePrompts = async () => {
    
    // function awaits on promise which checks for 
    // an updated list of employees
    var employees = await getEmployees();
    var updatedList = employees.map(i => {
        return {
            name: i.name,
            value: i.id
        }
    });
    //adds NONE to the list of choices when 
    //prompted to select a manager
    updatedList.push({
        name: 'None',
        value: 0
    })

    var roles = await getRoles();
    var rolesList = roles.map(i => {
        return {
            name: i.title,
            value: i.id
        }
    });
    
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
            choices: rolesList 
        },
        {
            type: 'list',
            message: "Select Employee's Manager:",
            name: 'managerID',
            choices: updatedList
        }
    ]).then(function(answers){
        // class instance to use function from Employees.js
        const empData = new Employees(db);
        return empData.addEmployee(answers);
    })
};

// new prompts when user selects to add a new role
const newRolePrompts = async () => {
    
    var departments = await getDepartments();
    var deptsList = departments.map(i => {
        return {
            name: i.dept_name,
            value: i.id
        }
    })
    inquirer.prompt ([
        {
            type: 'input',
            message: "What is the name of the role you'd like to add?",
            name: 'name'
        },
        {
            type: 'input',
            message: "Please enter the salary",
            name: 'salary'
        },
        {
            type: 'list',
            message: "Which is this new role's department?",
            name: 'department',
            choices: deptsList
        }
    ]).then(function(answers){
        const empData = new Roles(db);
        return empData.addRole(answers);
    })
}

// new prompts when user selects to add a new department
const newDepartmentPrompt =() => {
    inquirer.prompt ([
        {
            type: 'input',
            message: "What is the name of the department you'd like to add?",
            name: 'name'
        }
    ]).then(function(answer){
        const deptData = new Departments(db);
        return deptData.addDepartment(answer);
    })
}


// new prompts when employee selects to update an employee's role
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

// checks for an up-to-date list of employees
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

// checks for an up-to-date list of roles
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

// checks for an up-to-date list of departments
const getDepartments = () => {
    return new Promise((resolve, reject) => {
        db.query(`
    SELECT depts.* FROM depts`,
            function (err, res) {
                if (err) {
                    throw (err);
                }
                resolve(res)
            });
    });
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
