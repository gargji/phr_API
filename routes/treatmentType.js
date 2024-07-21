const e = require('express');
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

//  all treatmenttype  table get in Treatment.js file



router.post('/AddUpdatesmaster_treatment_type', (req,res)=>{
    console.log(req.body);
    var type = req.body.type;
    var language_id = req.body.language_id;
    var id = req.body.id;
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_treatment_type(type,language_id,active) values('${type}','${language_id}','1')`;
    }
    else{
    
         command =`update master_treatment_type set type='${type}',language_id='${language_id}' where id='${id}'`;
        returnmessage="U"
    }

    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
   
    
});

router.post('/deletetable_master_treatment_type', (req,res)=>{
    var id =req.body.id;

    const command =`delete from master_treatment_type where id=${id};`;
    console.log(command);

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
router.post('/activedeactivemaster_treatment_type', (req,res)=>{
    var id =req.body.id;
    var active=req.body.active

    const command =`Update master_treatment_type set active='${active}' where id='${id}';`;
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
