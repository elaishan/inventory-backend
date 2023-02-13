const mysql2 = require('mysql2');
const connection = mysql2.createConnection({
    host: 'localhost',
    database: 'inventory',
    user:'root',
    password:'12345',
});
connection.connect(function(err){
    if(err){
        console.error('Error Connecting');
        return;
    }
    console.log('connected successfully');
});

module.exports = connection;