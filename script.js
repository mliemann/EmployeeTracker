const mysql = require('mysql');
const Sequelize = require('sequelize');
require('dotenv').config();
const inquirer = require('inquirer');

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: 'localhost',
//       dialect: 'mysql',
//       port: 3306
//     }
//   );
const connection = mysql.createConnection({
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) throw err;
    start();
  });

  const start = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'Add departments, roles, employees',
          'View departments, roles, employees',
          'Update employee roles'
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'Add departments, roles, employees':
            create();
            break;
  
          case 'View departments, roles, employees':
            view();
            break;
  
          case 'Update departments, roles, employees':
            update();
            break;

          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };


  //Add Employees

const create = () => {
  // prompt for info about the item being put up for auction
  inquirer
  .prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add Department',
      'Add Roles',
      'Add Employees'
    ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Add Department':
          addDepartment();
          break;

        case 'Add Roles':
          addRole();
          break;

        case 'Add Employees':
          addEmployee();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// add department

const addDepartment = () => {
  inquirer
  .prompt([
    {
      name: 'id',
      type: 'input',
      message: 'What is the department ID?',
    },
    {
      name: 'department',
      type: 'input',
      message: 'What is the department name? ',
    },
  ])
  .then((answer) =>{
    if (answer.id == "" || answer.department == ""){
      console.log("Please fill the required fields")
      addDepartment()
    } else {
    connection.query(
      'INSERT INTO department SET ?',
      // QUESTION: What does the || 0 do?
      {
        id: answer.id,
        name: answer.department,
      },
      (err) => {
        if (err) throw err;
        console.log('Congratulations! Department Added');
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
    }
  });
};

//add role 
const addRole = () => {
  inquirer
  .prompt([
    {
      name: 'id',
      type: 'input',
      message: 'Required: What is the role ID?',
    },
    {
      name: 'title',
      type: 'input',
      message: 'Required: What is the role title? ',
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Required: What is the salary? ',
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'Required: What is the department ID? ',
    },
  ])
  .then((answer) =>{
    if (answer.id == "" || answer.title == "" || answer.salary == "" || answer.department_id == ""  ){
      console.log("Please fill the required fields")
      addRole()
    }else{
    connection.query(
      'INSERT INTO role SET ?',
      // QUESTION: What does the || 0 do?
      {
        id: answer.id,
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id,
      },
      (err) => {
        if (err) throw err;
        console.log('Congratulations!Role added.');
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
  }
  });
}

//add employee
const addEmployee = () => {
  inquirer
  .prompt([
    {
      name: 'id',
      type: 'input',
      message: 'Required: What is the department ID?',
    },
    {
      name: 'first_name',
      type: 'input',
      message: 'Required: What is the employee first name? ',
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Required: What is the employee last name?',
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Required: What is the employee role ID? ',
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Optional: What is the employee manager ID? Note: Leave Blank If No Manager',
    },
  ])
  .then((answer) =>{
    if (answer.id == "" || answer.first_name == "" || answer.last_name == ""|| answer.role_id == ""){
      console.log("Please fill the required fields")
      addEmployee()
    } else {
    connection.query(
      'INSERT INTO employee SET ?',
      // QUESTION: What does the || 0 do?
      {
        id: answer.id,
        first_name: answer.first_name,
        last_name: last_name,
        role_id: answer.role_id,
        manager_id: manager_id,
      },
      (err) => {
        if (err) throw err;
        console.log('Congratulations! Employee added.');
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
    }
  });
};

//View Employees

const view = () => {
  // prompt for info about the item being put up for auction
  inquirer
  .prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View Department',
      'View Role',
      'View Employee'
    ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View Department':
          viewDepartment();
          break;

        case 'View Role':
          viewRole();
          break;

        case 'View Employee':
          viewEmployee();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
    
};

//view employee
const viewEmployee = () => {
  inquirer
    .prompt({
      name: 'employee',
      type: 'input',
      message: 'Please input employee ID you would like to find',
    })
    .then((answer) => {
      const query = 'SELECT id, first_name, last_name, role_id, manager_id FROM employee WHERE ?';
      connection.query(query, { id: answer.employee }, (err, res) => {
        res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
          console.log(
            `Employee ID: ${id} || First Name: ${first_name} || Last Name: ${last_name} || Role ID: ${role_id}|| Manager ID: ${manager_id}`
          );
        });
        start();
      });
    });
};

//view department
const viewDepartment = () => {
  inquirer
    .prompt({
      name: 'department',
      type: 'input',
      message: 'Please input department ID you would like to find',
    })
    .then((answer) => {
      const query = 'SELECT id, name FROM department WHERE ?';
      connection.query(query, { id: answer.department }, (err, res) => {
        res.forEach(({ id, name }) => {
          console.log(
            `Department ID: ${id} || Department Name: ${name}`
          );
        });
        start();
      });
    });
};

//view role
const viewRole = () => {
  inquirer
    .prompt({
      name: 'role',
      type: 'input',
      message: 'Please input role ID you would like to find',
    })
    .then((answer) => {
      const query = 'SELECT id, title, salary, department_id FROM role WHERE ?';
      connection.query(query, { id: answer.role }, (err, res) => {
        res.forEach(({ id, title, salary, department_id }) => {
          console.log(
            `Role ID: ${id} || Title: ${title} || Salary: ${salary} ||Department ID: ${department_id}`
          );
        });
        start();
      });
    });
};


//Update fields

const update = () => {
  inquirer
  .prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Update Department',
      'Update Roles',
      'Update Employees'
    ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Update Department':
          updateDepartment();
          break;

        case 'Update Roles':
          updateRole();
          break;

        case 'Update Employees':
          updateEmployee();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
    
};

const updateDepartment = () => {
  inquirer
  .prompt([
    {
      name: 'updateid',
      type: 'input',
      message: 'Required: What is the department ID you would like to update?',
    },
    {
      name: 'id',
      type: 'input',
      message: 'What is the department ID?',
    },
    {
      name: 'department',
      type: 'input',
      message: 'What is the department name? ',
    },
  ])
  .then((answer) =>{
    if (answer.updateid == "" || answer.id == "" || answer.department == ""){
      console.log("Please fill the required fields")
      updateDepartment()
    } else {
    connection.query(
      'UPDATE department SET ? WHERE ?',
      [
        {
        id: answer.id,
        name: answer.department,
      },{
        id: answer.updateid,
      },
    ],
      (err) => {
        if (err) throw err;
        console.log('Congratulations! Department updated');
        start();
      }
    );
    }
  });
};

const updateRole = () => {
  inquirer
  .prompt([
    {
      name: 'updateid',
      type: 'input',
      message: 'Required: What is the role ID you would like to update?',
    },
    {
      name: 'id',
      type: 'input',
      message: 'Required: What is the role ID?',
    },
    {
      name: 'title',
      type: 'input',
      message: 'Required: What is the role title? ',
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Required: What is the salary? ',
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'Required: What is the department ID? ',
    },
  ])
  .then((answer) =>{
    if (answer.updateid == "" || answer.id == "" || answer.title == "" || answer.salary == "" || answer.department_id == ""  ){
      console.log("Please fill the required fields")
      updateRole()
    }else{
    connection.query(
      'UPDATE role SET ? WHERE ?',
      [
      {
        id: answer.id,
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id,
      },{
        id: answer.updateid,
      },
    ],
    
      (err) => {
        if (err) throw err;
        console.log('Congratulations!Role updated.');
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
  }
  });
};

const updateEmployee = () => {
  inquirer
  .prompt([
    {
      name: 'updateid',
      type: 'input',
      message: 'Required: What is the employee ID you would like to update?',
    },
    {
      name: 'id',
      type: 'input',
      message: 'Required: What is the department ID?',
    },
    {
      name: 'first_name',
      type: 'input',
      message: 'Required: What is the employee first name? ',
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Required: What is the employee last name?',
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Required: What is the employee role ID? ',
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Optional: What is the employee manager ID? Note: Leave Blank If No Manager',
    },
  ])
  .then((answer) =>{
    if (answer.updateid == "" ||answer.id == "" || answer.first_name == "" || answer.last_name == ""|| answer.role_id == ""){
      console.log("Please fill the required fields")
      updateEmployee()
    } else {
    connection.query(
      'UPDATE employee SET ? WHERE ?',
            [
              {
                id: answer.id,
                first_name: answer.first_name,
                last_name: last_name,
                role_id: answer.role_id,
                manager_id: manager_id,
              },
              {
                id: answer.updateid,
              },
            ],
      (err) => {
        if (err) throw err;
        console.log('Congratulations! Employee updated.');
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
    }
  });
};

