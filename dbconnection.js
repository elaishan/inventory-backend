const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    database: 'inventory',
    user:'root',
<<<<<<< HEAD
    password:'Abc321',
=======
    password:'12345',
>>>>>>> e00ecf24e57b6d4a97811f14fa3aa87fb0671b98
});

connection.connect(function(err){
    if(err){
        console.error('Error Connecting');
        return;
    }
    console.log('connected to database successfully');
});

module.exports = connection;