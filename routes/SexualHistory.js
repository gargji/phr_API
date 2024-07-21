const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/AddUpdateTransactionSexualHistory', (req,res)=>{
     var Patientguid = req.body.patientguid
     var branchId=req.body.branchId;
     var hospitalId=req.body.hospitalId;
   var Sexually_active=req.body.data.Sexually_active;
   var Protection=req.body.data.Protection;
   var ProtectionMethod=req.body.data.ProtectionMethod?.id;
   var PartnerGender=req.body.data.PartnerGender;
   var MultiplePartners=req.body.data.MultiplePartners;
   var AnalSex=req.body.data.AnalSex;
   var Counselling=req.body.data.Counselling;
   var Notes=req.body.data.Notes
   var SOGI=req.body.data.SOGI
   var SexualOrientation=req.body.data.SexualOrientation
   var question1=req.body.data.question1
   var question2=req.body.data.question2
   var question3=req.body.data.question3
   var HighRiskbehaviour=req.body.data.HighRiskbehaviour
   var GenderIdentity=req.body.data.GenderIdentity
   var Recordedby=req.body.data.Recordedby
   var recorded_date=req.body.data.recorded_date
     var id = req.body.data.id
     var command ='';
     var returnmessage="S"
     if(id=='' || id=='0' || id==undefined || id==null){
       
       command = `INSERT INTO transaction_sexual_history(patientId,branchId,hospitalId,Sexually_active,Protection,ProtectionMethod,PartnerGender,MultiplePartners,AnalSex,Counselling,Notes,SOGI,SexualOrientation,question1,question2,question3,HighRiskbehaviour,GenderIdentity,Recordedby,recorded_date,notes_date,tranasactionTime) values ('${Patientguid}','${branchId}','${hospitalId}','${Sexually_active}','${Protection}','${ProtectionMethod}','${PartnerGender}','${MultiplePartners}','${AnalSex}','${Counselling}','${Notes}','${SOGI}','${SexualOrientation}','${question1}','${question2}','${question3}','${HighRiskbehaviour}','${GenderIdentity}','${Recordedby}','${recorded_date}',now(),now())`;
     }
     else{
          command = `update transaction_sexual_history set Sexually_active='${Sexually_active}',Protection='${Protection}',ProtectionMethod='${ProtectionMethod}',PartnerGender='${PartnerGender}',SOGI='${SOGI}',SexualOrientation='${SexualOrientation}',question1='${question1}',question2='${question2}',question3='${question3}',HighRiskbehaviour='${HighRiskbehaviour}',GenderIdentity='${GenderIdentity}',Recordedby='${Recordedby}',recorded_date='${recorded_date}',MultiplePartners='${MultiplePartners}',AnalSex='${AnalSex}',Counselling='${Counselling}',Notes='${Notes}',tranasactionTime=now() where id='${id}'`;
         returnmessage="U"
     }



   

     execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
     .then(result => {
      if(result){
          if(id=='' || id=='0' || id==undefined || id==null){
              var Aid=result.insertId
              command=`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${Patientguid}','${hospitalId}','${Recordedby}','${Notes}','${Aid}','SexualHistory',now())`
      
          }else{
              var notes_date=req.body.data.notes_date
              command=`update allergy_notes set  notes='${Notes}',date=now() where date='${notes_date}'`

          }
      execCommand(command.replace(/null/g, '')).then(result =>{
          console.log('success');
          res.json(returnmessage)

      })
      .catch(err => logWriter(command, err));
   
      }
  })

     .catch(err => logWriter(command, err));

 });
 router.post('/getTransactionSexual_history', (req,res)=>{
    // console.log('petgcdgf',req.body);
    var Patientguid=req.body.patientguid
    const command = `Select * ,(select name from master_protection_method where id=transaction_sexual_history.ProtectionMethod) as protection_method from transaction_sexual_history where patientId='${Patientguid}'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/deleteTransactionSexual_history', (req,res)=>{
    const id =req.body.id;

    const command =`delete from transaction_sexual_history where id=${id};`;

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
router.post('/lockUnlocktransaction_sexual_history', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_sexual_history set lockStatus='${status}' where id='${id}';`;

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
router.post('/insertSexualHistoryNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.patientId
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes
    var allergyId=req.body.data.id
    var categeory= 'SexualHistory'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/getSexualHistoryNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='SexualHistory'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.get("/GET_MasterSexual_orinetation", (req, res) => {
    var sql =`select * from sexual_orientation where active='1'`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json(rows);
      }
    });
  });


  router.get("/Getmaster_gender_identity", (req, res) => {
    var sql =`select * from master_gender_identity where active='1'`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json(rows);
      }
    });
  });
  router.post('/getProtectionMethod', (req,res)=>{
    console.log(req.body.text);
    var display_name = req.body.text

  
     var   command = `select * from master_protection_method where name like '${display_name}%';`;
    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

 module.exports=router