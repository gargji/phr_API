const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.get('/getActiveOccupationData', (req,res)=>{
   
    const command = `SELECT * FROM master_occupation where active ='1'`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
    
});
router.get('/getTableDatamasterOccupation', (req,res)=>{
   
    const command = `SELECT * FROM master_occupation`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
    
});

router.post('/AddUpdateMasterOccupation', (req,res)=>{
    //console.log(req.body);
   
    
    var occupation = req.body.occupation
    var language_id = req.body.language_id
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_occupation(occupation,language_id,active) values('${occupation}','${language_id}',1)`;
    }
    else{
         command = `update master_occupation set occupation='${occupation}',language_id='${language_id}' where id='${id}'`;
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

router.post('/activedeactiveOccupation', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_occupation set active='${status}' where id='${id}';`;
    //console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         //console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})
router.post('/deletetableOccupation', (req,res)=>{
    const id =req.body.id;


    const command =`delete from master_occupation where id=${id};`;
    //console.log(command);

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err))
    // db.query(command,(err,result)=>{
    //     if(err){
    //         //console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})



 module.exports =router;