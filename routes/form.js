const e = require('express');
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.get('/getmasterform', (req,res)=>{
    const command = `SELECT * FROM master_form`;

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

router.post('/AddUpdatesMasterForm', (req,res)=>{
    console.log(req.body);
    var formname = req.body.formname
    var language_id = req.body.language_id
    var formCode=req.body.formCode
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_form(formname,language_id,formCode,active) values('${formname}','${language_id}','${formCode}','1')`;
    }
    else{
         command =`update master_form set formname='${formname}',language_id='${language_id}',formCode='${formCode}' where id='${id}'`;
        returnmessage="U"
    }

    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(returnmessage);
    //     }
    // });
    
});

router.post('/deletetableform', (req,res)=>{
    var id =req.body.id;

    const command =`delete from master_form where id=${id};`;

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})
router.post('/activedeactiveForm', (req,res)=>{
    var id =req.body.id;
    var status=req.body.status

    const command =`Update master_form set active='${status}' where id='${id}';`;
    console.log(command);

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})

module.exports =router;
