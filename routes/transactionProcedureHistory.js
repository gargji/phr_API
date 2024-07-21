const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const { constants } = require('buffer');


router.post('/getTransactionProcedure_history', (req,res)=>{
    console.log('petgcdgf',req.body);
    var Patientguid=req.body.patientguid
    // const command = `Select *,(select term from description_snapshot where id=transaction_procedure_history.IndicationForProcedure) as IndicationForProcedureName,(select name from master_laterality where guid=transaction_procedure_history.Literality) as literalityName,(select clinicName from hosptal_registration where guid=transaction_procedure_history.ClinicHospital) as ClinicHospitalName,(select concat(firstname,' ',Lastname) from provider_personal_identifiers where guid=transaction_procedure_history.Performer) as PerformerName,(select shortname from master_source where id=transaction_procedure_history.Source) as SourceName,(select name from master_procedure_history where id=transaction_procedure_history.procedur) as ProcedureName from transaction_procedure_history where Patientguid='${Patientguid}'`;
  const command=`SELECT tph.*,
  ds.term AS IndicationForProcedureName,
  ml.name AS literalityName,
  hr.clinicName AS ClinicHospitalName,
  CONCAT(ppi.firstname, ' ', ppi.lastname) AS PerformerName,
  ms.shortname AS SourceName,
  mph.name AS ProcedureName
FROM transaction_procedure_history tph
LEFT JOIN description_snapshot ds ON ds.id = tph.IndicationForProcedure
LEFT JOIN master_laterality ml ON ml.guid = tph.Literality
LEFT JOIN hosptal_registration hr ON hr.guid = tph.ClinicHospital
LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = tph.Performer
LEFT JOIN master_source ms ON ms.id = tph.Source
LEFT JOIN master_procedure_history mph ON mph.id = tph.procedur
WHERE tph.Patientguid = '${Patientguid}';`
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
  var Performer=req.body.data.Performer.guid;
  var ClinicHospital=req.body.data.ClinicHospital.guid;
  var Source=req.body.data.Source;
  var Notes=req.body.data.Notes
  var recorded_date=req.body.data.recorded_date
  var recorded_by=req.body.data.recorded_by
    var id = req.body.data.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
        command = `INSERT INTO transaction_procedure_history(Patientguid,branchId,hospitalId,procedur,Literality,DatePerformed,IndicationForProcedure,Performer,ClinicHospital,Source,Notes,recorded_by,recorded_date,notes_date,transaction_time) values
        ('${Patientguid}','${branchId}','${hospitalId}','${procedur}','${Literality}','${DatePerformed}','${IndicationForProcedure}','${Performer}','${ClinicHospital}','${Source}','${Notes}','${recorded_by}','${recorded_date}',now(), now())`;
    }
    else{
         command = `update transaction_procedure_history set procedur='${procedur}',Literality='${Literality}',notes_date=now(),DatePerformed='${DatePerformed}',recorded_by='${recorded_by}',recorded_date='${recorded_date}',IndicationForProcedure='${IndicationForProcedure}',Performer='${Performer}',ClinicHospital='${ClinicHospital}',Source='${Source}',Notes='${Notes}',transaction_time=now() where id='${id}'`;
        returnmessage="U"
    }
   
    execCommand(command)
    .then(result =>
        {
            if(result){
                if(id=='' || id=='0' || id==undefined || id==null){
                    var Aid=result.insertId
                    command=`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${Patientguid}','${hospitalId}','${recorded_by}','${Notes}','${Aid}','ProcedureHistory',now())`
            
                }else{
                    var notes_date=req.body.data.notes_date
                    console.log('notesdate',notes_date);
                    command=`update allergy_notes set  notes='${Notes}',date=now() where date='${notes_date}'`
    
                }
            execCommand(command.replace(/null/g, ''))
          
            .then(result =>{
                console.log(command);
                console.log('success');
                res.json(returnmessage)
    
            })
            .catch(err => logWriter(command, err));
         
            }
            // console.log(result);
        })
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
    var Firstname=name.split(' ')[0]
    var Lastname=name.split(' ')[1]
    console.log(Firstname);
    var phone_no=req.body.data.phone_no;
    var email=req.body.data.email;
    var guid=newGuid()
var command=''
     command = `INSERT INTO provider_contact(provider_id,mobilePhone,emailId1) values('${guid}','${phone_no}','${email}');INSERT INTO provider_personal_identifiers(guid,firstname,Lastname) values('${guid}','${Firstname}','${Lastname}');`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})

function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
router.post('/InsertProcedureHistoryformToClinicHospital', (req,res)=>{
    console.log('aman',req.body);
    var name=req.body.data.name;
    var phone_no=req.body.data.phoneNo;
    var email=req.body.data.email;
  var Address=req.body.data.Address
  var guid=newGuid()

    const command = `INSERT INTO hosptal_registration(guid,clinicName,mobile,addressLine1,addressLine2) values('${guid}','${name}','${phone_no}','${Address}','${Address}')`;

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
    
    const command = `select guid,clinicName from hosptal_registration where clinicName like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/getproblemsProcedureHistoryData', (req,res)=>{
   const display_name = req.body.text
   console.log(display_name);
       const command1=`select AutoId, id, name as term, category, languageId from master_chief_complaints where name like '%${display_name}%' ;`
    const command = `SELECT description_snapshot.id, description_snapshot.term 
    FROM description_snapshot
    INNER JOIN extendedmapsnapshot_2
    ON description_snapshot.conceptId = extendedmapsnapshot_2.referencedComponentId where  description_snapshot.typeId = '900000000000013009' and term like '${display_name}%' and extendedmapsnapshot_2.active = '1' order by conceptId limit 50;`;
console.log(command);

    execCommand(command1)
    .then(result => {
        if(result.length==0){
            execCommand(command)
            .then(result => res.json(result))
            .catch(err => logWriter(command, err));
        } else{
            res.json(result)
        }
    })
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
    var notes = req.body.notes.replace('"','""').replace("'","''")
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
    
    const command = `select guid, concat(firstname,' ',Lastname) as FullName from provider_personal_identifiers where concat(firstname,Lastname)  like '%${display_name}%';`;

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