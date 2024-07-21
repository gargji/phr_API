const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

router.get('/getmaster_currency', (req,res)=>{
   
    const command = `SELECT * FROM master_currency`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
           
    //         res.json(result);
    //     }
    // });
    
});



module.exports=router;