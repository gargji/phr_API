const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const con = require('../config/db');


router.get('/masterSourceActiveOnly', (req, res) => {
    const command = `select * from master_referral where active = '1' group by source;select * from master_referral where active = '1';`
    console.log(command);
    db.query(command, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.json(result);
        }
    });
})  



module.exports =router;