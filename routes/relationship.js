
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

  router.get("/getActiveRelationShipData", (req, res) => {
    var command =`select * from master_relationship where active = '1'`;
    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  });
  router.get("/GetAllRelationshipData", (req, res) => {
    var command =`select * from master_relationship`;
    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  });


  router.post("/DeleteRelationshipData", (req, res) => {
    var id = req.body.id;
   
    var command = `delete from master_relationship where id=${id}`;
    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));

  })

  router.post('/AddUpdatemasterRelationship', (req,res)=>{
    console.log(req.body);
    var relationship = req.body.relationship
    var language_id = req.body.language_id
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_relationship(relationship,language_id,active) values('${relationship}','${language_id}',1)`;
    }
    else{
        command =`update master_relationship set relationship='${relationship}',language_id='${language_id}' where id='${id}'`;
        returnmessage="U"
    }

    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
    
    
});
  
  router.post("/activeDeactiveRelationship", (req, res) => {
    var id = req.body.id;
    var status=req.body.status;
  var command = `UPDATE master_relationship set  active='${status}'  WHERE id='${id}'`;
  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
  });
  
  

module.exports = router;
