[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Node MySQL Connector

## Table of Contents

 • [Description](#description)

 • [Installation](#installation)

 • [Usage](#usage)

 • [Contributing](#contributing)

 • [Questions](#questions)

 • [License](#license)

## Description

This is a command-line interface for managing employee data in the ru_bootcamp MySQL database. It uses the following Node.js modules:

mysql2: used to connect to the MySQL database and perform CRUD (Create, Read, Update, Delete) operations on it.
fs: used to read/write files on the file system.
util: used to access utility functions provided by Node.js.
inquirer: used to create interactive command-line interfaces.

## Installation

Before running this application, you must have Node.js and MySQL installed on your machine. If you do not have them installed, please follow the installation instructions provided on their official websites.

To install the dependencies, run the following command in your terminal:
`npm install`

## Usage

To start the application, run the following command in your terminal:

`node app`

The application will prompt you to select a table (departments, employees, or roles) to view/edit. Depending on the table you choose, you will be able to perform the following actions:

Departments table: view all departments, add a new department.
Employees table: view all employees, add a new employee, update employee information, delete an employee.
Roles table: view all roles, add a new role.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository.

## Questions

If you have any questions about this program or would like to report a bug, please contact the author through GitHub:
[GitHub](https://github.com/tg1489/)
Alternatively, you may reach out and email me down below if you have any additional questions about the program.
[Email](mailto:tonyguarino1489@gmail.com)

## License

This application is licensed under the MIT License. See the LICENSE file for more information.
