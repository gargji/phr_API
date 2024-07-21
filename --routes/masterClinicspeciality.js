const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.get('/getTableDatamaster_clinical_speciality', (req,res)=>{
   
    const command = `SELECT * FROM master_clinical_speciality order by speciality,type`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
    
});
module.exports=router