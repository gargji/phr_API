const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.post('/InserttransactionAddmisionRequset', (req,res)=>{
    console.log('Admission',req.body);
    var patientId=req.body.patientId;
    var HospitalId=req.body.hospitalID;
    var BranchId=req.body.branchId;
  var langaugeId=req.body.languageId
var AdmissionDate=req.body.data.AdmissionDate
var convertedDate = new Date(AdmissionDate);
 let isoDate = convertedDate;
 var d = new Date(isoDate);
 let time=d.toLocaleTimeString('en-GB');
let dateFor = d.toLocaleDateString('en-GB');
let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
var ExpectedLOS=req.body.data.ExpectedLOS
var Bedcategory=req.body.data.Bedcategory
var duration=req.body.data.duration
var Physician=req.body.data.Physician.name
var Specialty=req.body.data.Specialty
var PhysicianGroup=req.body.data.PhysicianGroup.name
var Diagnosis=req.body.data.Diagnosis
var ReasonforAddmision=req.body.data.ReasonforAddmision
    const command = `INSERT INTO transaction_addmission_request(patientId, HospitalId, BranchId, AdmissionDate, ExpectedLOS, Bedcategory, Specialty, Physician, PhysicianGroup, Diagnosis, ReasonforAddmision, langaugeId) values
    ('${patientId}','${HospitalId}','${BranchId}','${databaseDate}','For ${ExpectedLOS} ${duration}','${Bedcategory}','${Specialty}','${Physician}','${PhysicianGroup}','${Diagnosis}','${ReasonforAddmision}','${langaugeId}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})

router.get('/getresonOFAdmissin',(req,res)=>{
  const command = `select * from admission_category;`;

  console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})

router.get('/master_procedure_anesthesia_type',(req,res)=>{
  const command = `select * from master_procedure_anesthesia_type;`;

  console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})

router.post('/Get_AdmisionRequest',(req,res)=>{
  // var display_name = req.body.event; 
  var hospitalId = req.body.hospitalId;
 var patientGuid=req.body.patientguid;
  var  branchId=req.body.branchId
  console.log('');

  const command =`Select * from transaction_addmission_request where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}'`;

  console.log('vaibhav',command);

   execCommand(command)
   .then(result => res.json(result))
   .catch(err => logWriter(command, err));
})

module.exports=router