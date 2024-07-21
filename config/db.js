const mysql =require('mysql');

const mysqlSetting ={
    // host: '127.0.0.1',
    host:'localhost',
    user:'root',
    password:'',
    port: 3306,
    database:'hospital7',
    multipleStatements:true,
    dateStrings:true
};

const con =mysql.createPool(mysqlSetting);

module.exports =con;



