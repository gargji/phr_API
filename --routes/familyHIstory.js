const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')
router.post('/SaveFamilyHistart',(req,res)=>{
    console.log('req.body.AddAdmission1111111111');
    console.log(req.body.AddFamilyForm);
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
  var lockStatus='1'
   var problemname=req.body.AddFamilyForm.problemname.id;
    var  branchId=req.body.branchId
    console.log(hospitalId,branchId)
    
    var {id,name, relation, sex, birthdate, birthdate, Age, Alive, OnsetDate, Source, notes, problem}=req.body.AddFamilyForm;
    let date=new Date();
    OnsetDate=date.toISOString().split('T')[0];
    birthdate=date.toISOString().split('T')[0];
     if(id=='' || id=='0' || id==undefined || id==null){
    const command =`INSERT INTO  master_family_histary ( hospitalId, branchId, PatientId, name, relation, sex, birthdate, Age, Alive, OnsetDate, Source, notes, problem,lockStatus) values('${hospitalId}','${branchId}','${patientGuid}','${name}','${relation}','${sex}','${birthdate}','${Age}','${Alive}','${OnsetDate}','${Source}','${notes}','${problemname}','${lockStatus}')`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
     }
     else{
       
            const command =`Update master_family_histary set name='${name}', relation='${relation}', sex='${sex}', birthdate='${birthdate}',Age='${Age}', Alive='${Alive}', OnsetDate='${OnsetDate}',Source='${Source}', notes='${notes}' ,problem='${problemname}' where id='${id}';`;
                
            console.log(command);
                execCommand(command)
                .then(result => res.json('update'))
                .catch(err => logWriter(command, err));
            }
            
     
 })  
router.post('/Get_Family_history',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
    var  branchId=req.body.branchId
    console.log('cityname');
   
    const command =`Select *,(select term from description_snapshot where id=master_family_histary.problem)  as problemName from master_family_histary where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}'; `;
 
    console.log('vaibhav11111111111',command);
  
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/deleteTransaction_FamilyHistoryAPI',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
    var  branchId=req.body.branchId;
    var  id=req.body.id;
    
    console.log('cityname***************************');
   
    const command =`delete from master_family_histary where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}' AND id='${id}'`;
 
    console.log('vaibhav',command);
  
    execCommand(command)
    .then(result => res.json('delete'))
    .catch(err => logWriter(command, err));
})
router.post('/lockUnlocktransaction_familyhistary', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;
    console.log('vaaaaaaaaaaaaaaaaaa');

    const command =`Update master_family_histary set lockStatus='${status}' where id='${id}'`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    

})

module.exports=router;