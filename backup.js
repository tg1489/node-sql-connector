const mysql = require('mysql2');
const fs = require('fs');
const util = require('util');
const inquirer = require('inquirer');
const { type } = require('os');
const e = require('express');


// Connect to database
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'rootpassword',
    database: 'ru_bootcamp'
});


 // Test the connection to the database
 db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
})

// Business logic
inquirer.prompt([
    {
        type: 'list',
        name: 'table',
        message: 'What table would you like to view?',
        choices: ['departments', 'employees', 'roles']
    }
]).then((answer) => {
    const { table } = answer;
    
    // Departments Table
        if (table === 'departments') {
            
            const queryPromise = new Promise((resolve, reject) => {
                db.query(`SELECT * FROM ${table}`, (err, results, fields) => {
                    console.table(results)
                    resolve(results)
                })
            })//queryPromise end 
            .then(() => {
                // Add a department 
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'departments',
                        message: 'Would you like to edit the departments table?',
                        choices: ['yes', 'no']
                    }
                        ]) .then((answer2) => {
                                 if (answer2.departments === 'no') {
                                    // Close the connection when you're done
                                    db.end((err) => {
                                        if (err) throw err;
                                         console.log('Connection closed.');
                                          });
                                     return;
                                 } else {
                                     inquirer.prompt([
                                         {
                                             type: 'list',
                                             name: 'departmentsAction',
                                             message: 'Would you like to add a new department name?',
                                             choices: ['yes', 'no']
                                         }
                                     ]).then((answer3) => {
                                            if (answer3.departmentsAction === 'no') {
                                                // Close the connection when you're done
                                                db.end((err) => {
                                                    if (err) throw err;
                                                     console.log('Connection closed.');
                                                      });
                                                return;
                                            } else {
                                                // Add new department input value
                                                inquirer.prompt([
                                                    {
                                                        type: 'input',
                                                        name: 'addDepartment',
                                                        message: 'Please write the name of the new department you would like added.'
                                                    }
                                                ]).then((answer4) => {
                                                        const addDepartment = answer4.addDepartment;
                                                        const endPromise = new Promise((resolve, reject) => {
                                                            db.query(`INSERT INTO departments (name) VALUES ('${addDepartment}')`, (results) => {
                                                                resolve(results)
                                                            });
                                                            
                                                            }).then(() => {
                                                        // Close the connection when you're done
                                                           db.end((err) => {
                                                              if (err) throw err;
                                                               console.log('Department successfully added. Connection closed.');
                                                                });
                                                            })
                                                        
                                            }).catch(err => console.error(err))
                                        }}).catch(err => console.error(err))
                                    }
                                }).catch(err => console.error(err))
                            }).catch(err => console.error(err))
                    } // end of departments table if statement
    
        // Roles Table
        if (table === 'roles') {
            const queryPromise = new Promise((resolve, reject) => {
                db.query(
                         `SELECT r.id AS Role ID, r.job_title AS Role, d.name AS Department, r.salary AS Salary
                          FROM roles r INNER JOIN departments d 
                          ON r.id = d.id;`, (err, results) => {
                                 console.table(results)
                                 resolve(results)
                         })
                    }).then((answer5) => {
                             inquirer.prompt([
                                 {
                                     type: 'list',
                                     name: 'rolesAction',
                                     message: 'Would you like to add a new role?',
                                     choices: ['yes', 'no']
                                 }
                             ]).then((answer6) => {
                                     if (answer6.rolesAction === 'no') {
                                        // Close the connection when you're done
                                        db.end((err) => {
                                            if (err) throw err;
                                             console.log('Connection closed.');
                                              });
                                         return;
                                     } else {
                                         inquirer.prompt([
                                             {
                                                 type: 'input',
                                                 name: 'roleName',
                                                 message: 'What is the name of the role?'
                                             },
                                             {
                                                 type: 'input',
                                                 name: 'salary',
                                                 message: 'What is the salary for this role?'
                                             },
                                             {
                                                 type: 'input',
                                                 name: 'departmentName',
                                                 message: 'What department is this role assigned to?'
                                             }
                                         ]).then((answer7) => {
                                            const { roleName, salary, departmentName } = answer7;
                                           
                                            db.beginTransaction()
                                            .then(() => {
                                              return db.query(`INSERT INTO roles (job_title, salary) VALUES (?, ?)`, [roleName, salary]);
                                            })
                                            .then(() => {
                                              return db.query(`INSERT INTO departments (name) VALUES (?)`, [departmentName]);
                                            })
                                            .then(() => {
                                              return db.commit();
                                            })
                                            .then(() => {
                                              console.log('New role added. Connection closed.');
                                              db.end();
                                            })
                                            .catch((err) => {
                                              db.rollback();
                                              console.log(`Error occurred during transaction. Rolling back: ${err}`);
                                              db.end();
                                            });
                                           
                                            }).catch(err => console.error(err))
                                            
                    }}).catch(err => console.error(err))    
                                    })}
                                
        ////////////////////////////////////                      
        if (table === 'employees') {

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeQuestion',
                    message: 'Would you like to add to or update the Employees table?',
                    choices: ['add', 'update']
                }
            ])
            .then((answer8) => {
                if (answer8.employeeQuestion === 'add') {
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'What is the first name of the new employee?'
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'What is the last name of the new employee?'
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'What is their starting salary?'
                        }
                    ]).then((answer9) => {
                        const { firstName, lastName, salary } = answer9;
                        
                            db.query(`
                            
                            INSERT INTO employees (first_name, last_name, salary) 
                            VALUES ('${firstName}', '${lastName}', ${salary});
            
                                `)
                    }).then((answer10) => {
                        console.log(answer10);
                        // Close the connection when you're done
                        db.end((err) => {
                            if (err) throw err;
                             console.log('New employee added. Connection closed.');
                              });
                    })
                } else {
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: 'What is the full name of the employee you would like to edit?'
                        },
                        {
                            type: 'input',
                            name: 'role',
                            message: 'What is their new role?'
                        }
                    ]).then((answer11) => {
                        let { role } = answer11;
                        const nameArray = answer11.name.split(' ');
                        const firstName = nameArray[0];
                        const lastName = nameArray.slice(1).join(' ');
                        
                        db.query(`
                        SELECT id
                        FROM employees
                        WHERE first_name LIKE '%${firstName}%'
                        AND last_name LIKE '%${lastName}%'
                      `, (err, results) => {
                        if (err) {
                          console.error(err);
                          reject(err);
                        }else {
                            const id = results[0].id;
                            
                            switch (role) {
                                case 'Manager':
                                  role = 2;
                                  break;
                                case 'Engineer':
                                  role = 3;
                                  break;
                                case 'Salesperson':
                                  role = 4;
                                  break;
                                case 'Marketing Coordinator':
                                  role = 5;
                                  break;
                                default:
                                  console.log('Please choose a valid role.');
                                  break;
                              }

                              
                              
                            db.query(`

                            UPDATE employees
                            SET role_id = ${role}
                            WHERE id = ${id};
                            `, (err, result) => {
                              if (err) {
                                console.error(err);
                                
                              } else {
                                console.log(`Successfully updated job title of ${firstName} ${lastName}.`);
                                
                              }
                            })
                        }})
                    })}}
                )} 
        }).catch(err => console.error(err))
                            
          