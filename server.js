const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const logsModules = require('./logsModules');

const app = express();
const port = 8081;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const logsFile = path.join(__dirname, 'logs.txt');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

router.get('/api/employees', (req, res) => {
  logsModules.writeLog(req, res, 200);
  connection.query('SELECT * FROM employees', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

router.post('/api/employees', (req, res) => {
  logsModules.writeLog(req, res, 200);
  const { name, age, address, salary } = req.body;
  const sql = 'INSERT INTO employees (Name, Age, Address, Salary) VALUES (?, ?, ?, ?)';
  const values = [name, age, address, salary];
  const employee = { name, age, address, salary };

  connection.query('INSERT INTO employees SET ?', employee, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Employee created!', id: result.insertId });
  });
});

router.put('/api/employees/:id', (req, res) => {
  logsModules.writeLog(req, res, 200);
  const { id } = req.params;
  const { name, age, address, salary } = req.body;
  const employee = { name, age, address, salary };

  connection.query('UPDATE employees SET ? WHERE id = ?', [employee, id], (err) => {
    if (err) throw err;
    res.json({ message: `Employee with ID ${id} updated!` });
  });
});

router.delete('/api/employees/:id', (req, res) => {
  logsModules.writeLog(req, res, 200);
  const { id } = req.params;

  connection.query('DELETE FROM employees WHERE id = ?', id, (err) => {
    if (err) throw err;
    res.json({ message: `Employee with ID ${id} deleted!` });
  });
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
