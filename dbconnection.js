const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    database: 'inventory',
    user:'root',
<<<<<<< HEAD
    password:'Abc321',
=======
    password:'12345',
>>>>>>> a82821a309ad3b329c2c73d94f7286b5c185407c
});

connection.connect(function(err){
    if(err){
        console.error('Error Connecting');
        return;
    }
    console.log('connected to database successfully');
});

module.exports = connection;