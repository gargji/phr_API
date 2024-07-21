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
//   var lockStatus='1'


var unknowfamily_history=req.body.unknown_family

if(unknowfamily_history ==='Adopted' || unknowfamily_history==='Family History Unknow'  || unknowfamily_history==='Family History Unknow' || unknowfamily_history==='No Significant Family History'){

    var problemname=``;
}else{
    var problemname=req.body.AddFamilyForm.problemname.id;



}
    var  branchId=req.body.branchId;
    var relation=req.body.AddFamilyForm.relation;
    
    
    var {id,name, sex, Age, Alive, Source, notes,Adopted,ResolvedDate,Recordedby,Status}=req.body.AddFamilyForm;
    let date=new Date();
    var DateTimes = formatDate(req.body.AddFamilyForm.DateTimes);
    var OnsetDate = formatDate(req.body.AddFamilyForm.OnsetDate);
    var birthdate = formatDate(req.body.AddFamilyForm.birthdate);

     if(id=='' || id=='0' || id==undefined || id==null){
    const command =`INSERT INTO  master_family_histary ( hospitalId, branchId, PatientId, name, relation, sex, birthdate, Age, Alive, OnsetDate, Source, notes, problem,Adopted,ResolvedStatus,ResolvedDate,Recordedby,DateTimes,unknown_family) values('${hospitalId}','${branchId}','${patientGuid}','${name}','${relation}','${sex}','${birthdate}','${Age}','${Alive}','${OnsetDate}','${Source}','${notes}','${problemname}','${Adopted}','${Status}','${ResolvedDate}','${Recordedby}','${DateTimes}' ,'${unknowfamily_history}')`;


    execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
     }
     else{
            const command =`Update master_family_histary set name='${name}', relation='${relation}', sex='${sex}', birthdate='${birthdate}',Age='${Age}', Alive='${Alive}', OnsetDate='${OnsetDate}',Source='${Source}', notes='${notes}' ,problem='${problemname}' ,Adopted='${Adopted}',ResolvedStatus='${Status}',ResolvedDate='${ResolvedDate}',Recordedby='${Recordedby}',DateTimes='${DateTimes}' where id='${id}';`;
 
            execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
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
   
    // const command =`Select *,(select term from description_snapshot where id=master_family_histary.problem)  as problemName,(select name from master_relationshipfamily where id=master_family_histary.relation) as relationshipName from master_family_histary where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}'; `;
     const command=`SELECT mf.*, ds.term AS problemName, mrf.name AS relationshipName
     FROM master_family_histary mf
     LEFT JOIN description_snapshot ds ON ds.id = mf.problem
     LEFT JOIN master_relationshipfamily mrf ON mrf.id = mf.relation
     WHERE mf.hospitalId = '${hospitalId}'
       AND mf.branchId = '${branchId}'
       AND mf.PatientId = '${patientGuid}'`
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
router.get('/getrelationshipfamilydata',(req,res)=>{
    console.log('command');
    const command =`Select * from master_relationshipfamily`;
 console.log(command,'getrelationshipfamilydata');
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
}) 

function formatDate(dateToBeFormatted){
    if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
        var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
        date = new Date(date);
        var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
        console.log(dateReturn);
        return dateReturn
    }
    else{
        return ''
    }
  }
module.exports=router;