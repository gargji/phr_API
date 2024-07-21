const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.post('/insertProcedureRequestForm', (req,res)=>{
    console.log('Admission', req.body);
    var patientId= req.body.patientId;
    var hospitalId = req.body.hospitalID;
    var branchId = req.body.branchId;
    var languageId = req.body.languageId
    var guid=req.body.guid
    var Scheduleddate = req.body.data.Scheduleddate
    var convertedDate = new Date(Scheduleddate);
    let isoDate = convertedDate;
    var d = new Date(isoDate);
    let time = d.toLocaleTimeString('en-GB');
    let dateFor = d.toLocaleDateString('en-GB');
    let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
    var ExpectedLOS = req.body.data.ExpectedLOS
    var Location = req.body.data.Location
    var duration = req.body.data.duration
    var Physician = req.body.data.Physician.name
    var Specialty = req.body.data.Specialty
    var Procedure = req.body.data.Procedures.name
    var Laterality = req.body.data.Laterality
    var Proceduretype = req.body.data.Proceduretype
    var Surgerytype = req.body.data.Surgerytype
    var SpecialEquipments = req.body.data.SpecialEquipments
    var Anesthesia = req.body.data.Anesthesia.name
    var Anesthesiatype = req.body.data.Anesthesiatype
    var Notes = req.body.data.Notes
    var startTime=formatDate(req.body.data.StartTime)
    var timeduration=req.body.data.timeDuration
    var EndTime=formatDate(req.body.data.EndTime)
    var timeDurationType=req.body.data.timeDurationType.name
    // console.log('zxcvbnm,nbvcxz',startTime,EndTime);

    const command = `INSERT INTO transaction_procedure_request(patientId, hospitalId, branchId,formId, languageId, Scheduleddate, ExpectedLOS, Location, Physician, Specialty, Procedures, Laterality, Proceduretype, Surgerytype, SpecialEquipments, Anesthesia, Anesthesiatype, Notes, startTime,timeDuration,timeDurationType,EndTime,transactionTime) values
    ('${patientId}','${hospitalId}','${branchId}','${guid}','${languageId}','${databaseDate}','For ${ExpectedLOS} ${duration}','${Location}','${Physician}','${Specialty}','${Procedure}','${Laterality}','${Proceduretype}','${Surgerytype}','${SpecialEquipments}','${Anesthesia}','${Anesthesiatype}','${Notes}','${startTime}','${timeduration}','${timeDurationType}','${EndTime}',now());`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})


function formatDate(dateToBeFormatted){
  if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){

      var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
      date = new Date(date);
      // ("0" + (this.getMonth() + 1)).slice(-2)
      var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
      console.log(dateReturn);
      return dateReturn
  }
  else{
      return ''
  }
}
router.post('/insertprocedurerequstForprocedure',(req,res)=>{
    console.log(req.body);
     
  var procedureArayy=req.body.procedureArray
  var guid=req.body.guid
   
     
        let i = 0;
        (function loop(){
          if (i < procedureArayy.length) {
           var command = ''
           
             command = `insert into procedure_request_form( guid, procedur, leterality)
             VALUES ('${guid}','${procedureArayy[i].procedure.name}','${procedureArayy[i].literality}');`
     
            console.log(command);
            execCommand(command)
              .then(() => {
                i++; 
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else{
            res.json('success')
          }
        }())
  
      
   
   
     
   })


   router.post('/insertFollowUpForm', (req,res)=>{
    console.log(req.body);
    var patientId= req.body.patientId;
    var hospitalId = req.body.hospitalID;
    var branchId = req.body.branchId;
    var languageId = req.body.languageId
     var  duration=req.body.data.duration
     var  NextAppointment=req.body.data.NextAppointment
      var PRNinstruction=req.body.data.PRNinstruction
    
    var NextAppointmentDate = req.body.data.NextAppointmentDate
    var convertedDate = new Date(NextAppointmentDate);
    let isoDate = convertedDate;
    var d = new Date(isoDate);
    let time = d.toLocaleTimeString('en-GB');
    let dateFor = d.toLocaleDateString('en-GB');
    let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
    
    const command = `INSERT INTO transaction_follow_up(patientId, branchId, hospitalId, languageId, NextAppointmentDate, PRNinstruction, NextAppointment, transactiontime) values
    ('${patientId}','${branchId}','${hospitalId}','${languageId}','${databaseDate}','${PRNinstruction}','For ${NextAppointment} ${duration}',now());`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})

router.post('/gettranssctionFollowup',(req,res)=>{
console.log('amankumar',req.body);
  var hospitalId = req.body.hospitalId;
  var patientGuid = req.body.patientguid;
  var branchId = req.body.branchId
  console.log('');
  const command =`Select * from transaction_follow_up where hospitalId='${hospitalId}' AND branchId='${branchId}' AND patientId='${patientGuid}'`;

  console.log('vaibhav',command);

   execCommand(command)
   .then(result => res.json(result))
   .catch(err => logWriter(command, err));
})
router.post('/gettranssctionProcedureRequest',(req,res)=>{
console.log('xcvbnm',req.body);
  var hospitalId = req.body.hospitalId;
  var patientGuid = req.body.patientguid;
  var branchId = req.body.branchId
  console.log('');
  const command =`Select * from transaction_procedure_request where hospitalId='${hospitalId}' AND branchId='${branchId}' AND patientId='${patientGuid}'`;

  console.log('vaibhav',command);

   execCommand(command)
   .then(result => res.json(result))
   .catch(err => logWriter(command, err));
})
router.post('/getprocedurseen',(req,res)=>{
  console.log('amankumar',req.body);
    var formId = req.body.formId;
    const command =`Select * from procedure_request_form where guid='${formId}'`;
    console.log('vaibhav',command);
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
  })
module.exports=router