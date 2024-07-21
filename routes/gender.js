const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


//return only active

router.get("/getActiveGenderData", (req, res) => {
  var sql =`select * from gender where active = '1' order by sequence`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
});



//returns all
router.get('/getTableDatamasterGender', (req, res) => {

    const command = `SELECT * FROM gender`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


});

router.post('/AddUpdateMasterGender', (req,res)=>{
   
    
    var gender = req.body.gender
    var language_id = req.body.language_id
    var conceptId = req.body.conceptId
    var moduleId = req.body.moduleId
    var fsn_term=req.body.fsn_term
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO gender(gender,language_id,fsn_term,moduleId,conceptId,active) values('${gender}','${language_id}','${fsn_term}','${moduleId}','${conceptId}',1)`;
    }
    else{
         command = `update gender set gender='${gender}',fsn_term='${fsn_term}',conceptId='${conceptId}',language_id='${language_id}',moduleId='${moduleId}' where id='${id}'`;
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

router.post('/activedeactiveGender', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update gender set active='${status}' where id='${id}';`;
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
router.post('/deletetableGender', (req,res)=>{
    const id =req.body.id;


    const command =`delete from gender where id=${id};`;

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err))
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})



 module.exports =router;