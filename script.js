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
    runSearch();
  });

  const runSearch = () => {
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
            artistSearch();
            break;
  
          case 'View departments, roles, employees':
            multiSearch();
            break;
  
          case 'Update employee roles':
            rangeSearch();
            break;

          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };