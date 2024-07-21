const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/getTransactionProcedure_history', (req,res)=>{
    console.log('petgcdgf',req.body);
    var Patientguid=req.body.patientguid
    const command = `Select *,(select term from description_snapshot where id=transaction_procedure_history.IndicationForProcedure) as IndicationForProcedureName,(select name from master_laterality where guid=transaction_procedure_history.Literality) as literalityName,(select name from masterclinichospital where id=transaction_procedure_history.ClinicHospital) as ClinicHospitalName,(select name from master_performer where id=transaction_procedure_history.Performer) as PerformerName,(select name from master_source where id=transaction_procedure_history.Source) as SourceName,(select name from master_procedure_history where id=transaction_procedure_history.procedur) as ProcedureName from transaction_procedure_history where Patientguid='${Patientguid}'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/AddUpdateTransactionProcedureHistory', (req,res)=>{
   console.log("aman",req.body.data);
    console.log('save',req.body);
    var Patientguid = req.body.patientguid
    var branchId=req.body.branchId;
    var hospitalId=req.body.hospitalId;
  var procedur=req.body.data.procedur.id;
  var Literality=req.body.data.Literality;
  var DatePerformed=req.body.data.DatePerformed;
  var IndicationForProcedure=req.body.data.IndicationForProcedure;
  var Performer=req.body.data.Performer.id;
  var ClinicHospital=req.body.data.ClinicHospital.id;
  var Source=req.body.data.Source;
  var Notes=req.body.data.Notes
    var id = req.body.data.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
        command = `INSERT INTO transaction_procedure_history(Patientguid,branchId,hospitalId,procedur,Literality,DatePerformed,IndicationForProcedure,Performer,ClinicHospital,Source,Notes,transaction_time) values
        ('${Patientguid}','${branchId}','${hospitalId}','${procedur}','${Literality}','${DatePerformed}','${IndicationForProcedure}','${Performer}','${ClinicHospital}','${Source}','${Notes}', now())`;
    }
    else{
         command = `update transaction_procedure_history set procedur='${procedur}',Literality='${Literality}',DatePerformed='${DatePerformed}',IndicationForProcedure='${IndicationForProcedure}',Performer='${Performer}',ClinicHospital='${ClinicHospital}',Source='${Source}',Notes='${Notes}',transaction_time=now() where id='${id}'`;
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
router.post('/InsertPerformer', (req,res)=>{
    console.log('aman',req.body);
    var name=req.body.data.name;
    var phone_no=req.body.data.phone_no;
    var email=req.body.data.email;

    const command = `INSERT INTO master_performer(name,phone_no,Email) values('${name}','${phone_no}','${email}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/InsertProcedureHistoryformToClinicHospital', (req,res)=>{
    console.log('aman',req.body);
    var name=req.body.data.name;
    var phone_no=req.body.data.phoneNo;
    var email=req.body.data.email;
  var Address=req.body.data.Address

    const command = `INSERT INTO masterclinichospital(name,phoneNo,Address,emailId) values('${name}','${phone_no}','${Address}','${email}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/get_master_procedure_history', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from master_procedure_history where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/get_masterclinichospital', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from masterclinichospital where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/getproblemsProcedureHistoryData', (req,res)=>{
   const display_name = req.body.text
   console.log(display_name);
    const command = `SELECT description_snapshot.id, description_snapshot.term
    FROM description_snapshot
    INNER JOIN extendedmapsnapshot_2
    ON description_snapshot.conceptId = extendedmapsnapshot_2.referencedComponentId where  description_snapshot.typeId = '900000000000013009' and term like '${display_name}%' and extendedmapsnapshot_2.active = '1' order by conceptId limit 50;`;
console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.post('/getAllergyNotesToProcedureHistory', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='ProcedureHistory'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/insertProcedurHistoryNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.Patientguid
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes
    var allergyId=req.body.data.id
    var categeory= 'ProcedureHistory'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_performer', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from master_performer where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/deleteTransaction_procedure_history', (req,res)=>{
    const id =req.body.id;

    const command =`delete from transaction_procedure_history where id=${id};`;

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

router.post('/lockUnlocktransaction_ProcedureHistory', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_procedure_history set lockStatus='${status}' where id='${id}';`;

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
module.exports=router