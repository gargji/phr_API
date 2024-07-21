const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/AddUpdateTransactionSexualHistory', (req,res)=>{
    console.log("aman",req.body.data);
     console.log('save',req.body);
     var Patientguid = req.body.patientguid
     var branchId=req.body.branchId;
     var hospitalId=req.body.hospitalId;
   var Sexually_active=req.body.data.Sexually_active;
   var Protection=req.body.data.Protection;
   var ProtectionMethod=req.body.data.ProtectionMethod;
   var PartnerGender=req.body.data.PartnerGender;
   var MultiplePartners=req.body.data.MultiplePartners;
   var AnalSex=req.body.data.AnalSex;
   var Counselling=req.body.data.Counselling;
   var Notes=req.body.data.Notes
     var id = req.body.data.id
     var command ='';
     var returnmessage="S"
     if(id=='' || id=='0' || id==undefined || id==null){
         command = `INSERT INTO transaction_sexual_history(patientId,branchId,hospitalId,Sexually_active,Protection,ProtectionMethod,PartnerGender,MultiplePartners,AnalSex,Counselling,Notes,tranasactionTime) values
         ('${Patientguid}','${branchId}','${hospitalId}','${Sexually_active}','${Protection}','${ProtectionMethod}','${PartnerGender}','${MultiplePartners}','${AnalSex}','${Counselling}','${Notes}', now())`;
     }
     else{
          command = `update transaction_sexual_history set Sexually_active='${Sexually_active}',Protection='${Protection}',ProtectionMethod='${ProtectionMethod}',PartnerGender='${PartnerGender}',MultiplePartners='${MultiplePartners}',AnalSex='${AnalSex}',Counselling='${Counselling}',Notes='${Notes}',tranasactionTime=now() where id='${id}'`;
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
 router.post('/getTransactionSexual_history', (req,res)=>{
    // console.log('petgcdgf',req.body);
    var Patientguid=req.body.patientguid
    const command = `Select *  from transaction_sexual_history where patientId='${Patientguid}'`;

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
 module.exports=router