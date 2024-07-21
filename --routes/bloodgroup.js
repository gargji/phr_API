const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');



router.get('/getActiveBloodGroup', (req,res)=>{
    const command = `SELECT * FROM blood_group where active = '1'`;

    
    db.query(command, (err, result) => {
        if (err) {
            res.json({ status: 'fail', error: err });
        } else {
            res.json(result);
        }
    });
    
});

router.get('/bloodgrouptable', (req,res)=>{
    const command = `SELECT * FROM blood_group`;


    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

    
});
router.post('/activedeactivebloood', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update blood_group set active='${status}' where id='${id}';`;

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

router.post('/AddUpdatetmasterbloodgroup', (req,res)=>{
    
   
    var bloodGroup = req.body.bloodGroup
    var language_id = req.body.language_id
    var conceptId = req.body.conceptId
    var moduleId = req.body.moduleId
    var fsn_term=req.body.fsn_term
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO blood_group(bloodGroup,language_id,fsn_term,moduleId,conceptId,active) values('${bloodGroup}','${language_id}','${fsn_term}','${moduleId}','${conceptId}',1)`;  
    }
    else{
         command =`update blood_group set bloodGroup='${bloodGroup}',fsn_term='${fsn_term}',language_id='${language_id}',conceptId='${conceptId}',moduleId='${moduleId}' where id='${id}'`;
        returnmessage="U"
    }
    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
    // db.query(command, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(returnmessage);
    //     }
    // });

    })


router.post('/deletebloodgroup', (req,res)=>{
    const id =req.body.id;

    const command =`delete from blood_group where id=${id};`;

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



module.exports =router;