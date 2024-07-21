const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.post('/Inserttransaction_referals_to_doctors', (req,res)=>{
    console.log('aman',req.body);

    var patientId=req.body.patientId;
    var hospitalId=req.body.hospitalID;
    var BranchId=req.body.branchId;
  var LanguageId=req.body.languageId
var Referredby=req.body.data.Referredby?.DisplayName
 var ReferDate=req.body.data.ReferDate
var Encounter=req.body.data.Encounter
var ReferById=req.body.data.Referredby.Id
var orderId=req.body.order?.orderId
var LoincNO=req.body.order?.parentId
var Referralto=req.body.data.Referralto
if(Referralto=='Internal'){
  var Physician=req.body.data.Physician.Id
}else{
  console.log('Internal',req.body.data.Physician)
  var Physician=req.body.data.Physician?.id
}

var Specialty=req.body.data.Specialty
var ReasonforRefer=req.body.data.ReasonforRefer
var Priority=req.body.data.Priority
var Diagnosis=req.body.data.Diagnosis
var ReferType=req.body.data.ReferType
var fullpathArray=[]
fullpathArray=req.body.fullpathArray

var id = req.body.data.id
    // console.log('idfg',id);
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
     command = `INSERT INTO transaction_referals_to_doctors(patientId, hospitalId, BranchId, ReferType,LanguageId,EncounterId, Referredby,ReferById, Referralto, Physician, Specialty, ReasonforRefer, Priority, Diagnosis,transaction_time,ReferDate,LoincNO,orderId) values
    ('${patientId}','${hospitalId}','${BranchId}','${ReferType}','${LanguageId}','${Encounter}','${Referredby}','${ReferById}','${Referralto}','${Physician}','${Specialty}','${ReasonforRefer}','${Priority}','${Diagnosis}',now(),'${ReferDate}','${LoincNO}','${orderId}')`;

    console.log(command);
    execCommand(command)
    .then(result =>{
      console.log(result.insertId);
      let i = 0;
      console.log(fullpathArray);
      (function loop(){
     
        if (i < fullpathArray.length) {
         var commandpath = ''
         commandpath = `insert into transaction_referals_document_path(referals_id, patient_id, hospitalId, branchId, doc_path,fileName) values('${result.insertId}','${patientId}','${hospitalId}','${BranchId}','${fullpathArray[i]?.fullpath.replace(/\\/g,'/')}','${fullpathArray[i]?.fileName}')`
   console.log(commandpath);
          
          execCommand(commandpath)
            .then(() => {
              i++; 
              loop()
            })
            .catch(err => logWriter(commandpath, err));
        }
        else{
          res.json(returnmessage)
        }
      }())
      
    } )
   
    .catch(err => logWriter(command, err));
    } else{
      command = `update transaction_referals_to_doctors set Referredby='${Referredby}',EncounterId='${Encounter}',ReferById='${ReferById}',Referralto='${Referralto}',Physician='${Physician}',Priority='${Priority}',Specialty='${Specialty}',ReasonforRefer='${ReasonforRefer}',ReferDate= '${ReferDate}',Diagnosis='${Diagnosis}',transaction_time=now() where id='${id}'`;
     returnmessage="U"
     console.log(command);
     execCommand(command)
     .then(result =>
       res.json(returnmessage))
     .catch(err => logWriter(command, err));
 }
   
    
    
})
router.post('/getTransactionReferral', (req,res)=>{
  console.log('petgcdgf',req.body);
  var Patientguid=req.body.patientguid
  const command = `SELECT t.*, GROUP_CONCAT(ds.term) AS DiagnosisName,mcs.speciality AS specialityname,CONCAT(ppi.providertitle, ' ', ppi.firstname, ' ', ppi.Lastname) AS physican,ppi.gender as PhysicianSex,ppi.dateOfBirth as PhysicianDOB, CONCAT(te.transactionTime, ' Dr ', te.Provider) AS EncounterName,CONCAT('Dr', ' ', mrp.name) AS physicanname  FROM transaction_referals_to_doctors t 
  LEFT JOIN description_snapshot ds ON FIND_IN_SET(ds.id, REPLACE(t.Diagnosis, ',', ',')) > 0 
  LEFT JOIN master_clinical_speciality mcs ON mcs.id = t.Specialty 
  LEFT JOIN transaction_encounter te ON te.id = t.EncounterId
  LEFT JOIN provider_personal_identifiers ppi ON ppi.Id = t.Physician
  LEFT JOIN master_refering_provider mrp ON mrp.id = t.Physician
   WHERE t.patientId = '${Patientguid}' AND t.ReferType='referOut' GROUP BY t.id;
  SELECT  t.*, GROUP_CONCAT(ds.term) AS DiagnosisName,mcs.speciality AS specialityname, CONCAT(ppi.providertitle, ' ', ppi.firstname, ' ', ppi.Lastname) AS physicanname,ppi.gender as PhysicianSex,ppi.dateOfBirth as PhysicianDOB,CONCAT(te.transactionTime, ' Dr ', te.Provider) AS EncounterName FROM 
  transaction_referals_to_doctors t LEFT JOIN description_snapshot ds ON FIND_IN_SET(ds.id, REPLACE(t.Diagnosis, ',', ',')) > 0 
  LEFT JOIN master_clinical_speciality mcs ON mcs.id = t.Specialty 
  LEFT JOIN provider_personal_identifiers ppi ON ppi.Id = t.Physician
  LEFT JOIN master_refering_provider mrp ON mrp.id = t.Physician
  LEFT JOIN transaction_encounter te ON te.id = t.EncounterId
   WHERE  t.patientId = '${Patientguid}' AND t.ReferType='referIn' GROUP BY t.id;`;
 console.log('referalcomand',command)
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  
  
})
router.post('/deletetransaction_referals_to_doctors', (req,res)=>{
  const id =req.body.id;

  const command =`delete from transaction_referals_to_doctors where id=${id};`;

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
router.post('/getReferalDocpathPtient', (req,res)=>{
  const id =req.body.id;

  const command =`select * from transaction_referals_document_path where referals_id=${id};`;

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  // db.query(command,(err,result)=>{
  //     if(err){
  //         console.log(err);
  //     }else{
  //         res.json('deleted')
  //     }                                    
  // })

})

router.post('/saveResponseReferals', (req,res)=>{
  console.log(req.body);
  const id =req.body.showReferalsData.id;
  var ResponseDate=req.body.ResponseDate
  var ResponseNotes=req.body.ResponseNotes

  const command =`update   transaction_referals_to_doctors set Response_status='Reviewed' ,Response_date='${ResponseDate}',response_notes='${ResponseNotes}'  where id=${id};`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
  // db.query(command,(err,result)=>{
  //     if(err){
  //         console.log(err);
  //     }else{
  //         res.json('deleted')
  //     }                                    
  // })

})
router.post('/getrefratlsDatawithorder', (req,res)=>{
  console.log('petgcdgf',req.body);
  var LoincNO=req.body.rowdata.LoincNO

  var orderId=req.body.rowdata.orderId

  var Patientguid=req.body.rowdata.PatientID
  const command = `SELECT t.*, GROUP_CONCAT(ds.term) AS DiagnosisName,mcs.speciality AS specialityname,CONCAT(ppi.providertitle, ' ', ppi.firstname, ' ', ppi.Lastname) AS physican,ppi.gender as PhysicianSex,ppi.dateOfBirth as PhysicianDOB, CONCAT(te.transactionTime, ' Dr ', te.Provider) AS EncounterName,CONCAT('Dr', ' ', mrp.name) AS physicanname  FROM transaction_referals_to_doctors t 
  LEFT JOIN description_snapshot ds ON FIND_IN_SET(ds.id, REPLACE(t.Diagnosis, ',', ',')) > 0 
  LEFT JOIN master_clinical_speciality mcs ON mcs.id = t.Specialty 
  LEFT JOIN transaction_encounter te ON te.id = t.EncounterId
  LEFT JOIN provider_personal_identifiers ppi ON ppi.Id = t.Physician
  LEFT JOIN master_refering_provider mrp ON mrp.id = t.Physician
   WHERE t.patientId = '${Patientguid}' AND t.LoincNO='${LoincNO}' And t.orderId='${orderId}'`
   console.log(command);
   execCommand(command)
   .then(result => res.json(result))
   .catch(err => logWriter(command, err));
   // db.query(command,(err,result)=>{
   //     if(err){
   //         console.log(err);
   //     }else{
   //         res.json('deleted')
   //     }                                    
   // })
 
 })
router.post('/signResponseReferals', (req,res)=>{
  console.log(req.body);
  const id =req.body.showReferalsData.id;
  

  const command =`update   transaction_referals_to_doctors set signResponse='1'  where id=${id};`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
  // db.query(command,(err,result)=>{
  //     if(err){
  //         console.log(err);
  //     }else{
  //         res.json('deleted')
  //     }                                    
  // })

})

module.exports=router