var mysql = require('mysql');
const { database } = require('./controller/keys');
const { promisify } = require('util');

// Data base
const connection = mysql.createConnection(database);

connection.connect((err) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            ('DATABASE CONNECTION WAS CLOSED');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        } else {
            throw err
        }
    } else {
        console.log('DB is connected');
    }

    return;
})

connection.query = promisify(connection.query)

module.exports = connection;