const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')



router.post('/Save_AddAdmission_form',(req,res)=>{
    console.log('req.body.AddAdmission1111111111');
    console.log(req.body.AddAdmission);
    var hospitalId = req.body.hospitalId;
    var patientGuid=req.body.patientGuid;
    
    var  branchId=req.body.branchId
    var Hospital_Name=req.body.AddAdmission.Hospital_Name.id;
    var AdmissionReason=req.body.AddAdmission.AdmissionReason.id;
    var {id,Admissiondat,Dischargedate,AdmissionCategory,Status,Procedure,Sources,notess}=req.body.AddAdmission;
    let date=new Date();
    Admissiondat=date.toISOString().split('T')[0];
    Dischargedate=date.toISOString().split('T')[0];
    if(id=='' || id=='0' || id==undefined || id==null){

    
    const command =`INSERT INTO  master_ad_addmission (hospitalId, branchId, patientId, Hospital_Name, Admission_date, Discharge_date, Admission_Category, Admission_Reason, Status, Procedure_performed, Source, Notes) values('${hospitalId}','${branchId}','${patientGuid}','${Hospital_Name}','${Admissiondat}','${Dischargedate}','${AdmissionCategory}','${AdmissionReason}','${Status}','${Procedure}','${Sources}','${notess}')`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    }
    else{
        const command =`Update master_ad_addmission set Hospital_Name='${Hospital_Name}', Admission_date='${Admissiondat}', Discharge_date='${Dischargedate}', Admission_Category='${AdmissionCategory}', Admission_Reason='${AdmissionReason}', Status='${Status}',Procedure_performed='${Procedure}', Source='${Sources}' ,Notes='${notess}' where id='${id}';`;
                
        console.log(command);
            execCommand(command)
            .then(result => res.json('update'))
            .catch(err => logWriter(command, err));
        
    }

})  
router.post('/getmaster_HospitalNameAPI',(req,res)=>{
    console.log('req.body.AddAdmission111111111122222222222');
   
    var display_name = req.body.event; 
    // var  type = req.body.type;
    
    const command = `select * from masterclinichospital where name like '%${display_name}%' ;`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/AddAdmission_form',(req,res)=>{
    console.log('req.body.AddAdmission1111111111');
    console.log(req.body.AddPerformerForm);
    // var hospitalId = 'branch-01' 
    // var  branchId='branch-01'
    
    // var {}=req.body.AddAdmission;
    var {name,phone_no,emailId,address}=req.body.AddPerformerForm;
    const command =`INSERT INTO  masterclinichospital (name, phoneNo, emailId, Address) values('${name}','${phone_no}','${emailId}','${address}')`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
}) 
router.get('/GetMaster_Reationship',(req,res)=>{
   
   
   
    
    const command =`Select * from master_relationship`;
 
    
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
}) 
router.get('/get_AdmissionCategory',(req,res)=>{
  
   
   
    const command =`Select * from master_admission_category`;
 
    
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})


router.get('/Get_Source', (req,res)=>{
   
    console.log('Get_lateratility1');
    
     const command =`Select * from master_source`;
 
    
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
    
 })

router.post('/Get_Addmision_details',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
    var  branchId=req.body.branchId
    console.log('');
  
    const command =`Select *,(select name from masterclinichospital where id=master_ad_addmission.Hospital_Name)  as Hospital_NameValue ,(select term from description_snapshot where id=master_ad_addmission.Admission_Reason)  as Admission_ReasonName from master_ad_addmission where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}'`;
 
    console.log('vaibhav',command);
  
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/getAllergyNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/deleteTransaction_Addmisions',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
    var  branchId=req.body.branchId;
    var  ids=req.body.id;
    
   
   
    const command =`delete from master_ad_addmission where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}' AND id='${ids}' `;
 
    console.log('vaibhav',command);
  
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
    router.post('/lockUnlocktransaction_Addadmission', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_ad_addmission set lockStatus='${status}' where id='${id}';`;

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
router.post('/updateAllergynotesAPI', (req,res)=>{
    
    var convertedDate = new Date(req.body.date).toLocaleString('en-US');
    
    console.log(convertedDate);
console.log('update',req.body.data);

    var id =req.body.id;
    var notes=req.body.notes
   var date=req.body.date
    const command =`update allergy_notes set  notes='${notes}',date='${convertedDate}' where id=${id}`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    

})
router.post('/deleteAllergy_notes', (req,res)=>{
    const id =req.body.id;

    const command =`delete from allergy_notes where id=${id};`;

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
   
})
 router.post('/getmaster_problem',(req,res)=>{
    var text=req.body.text;
    console.log('Get_site',text);
    const command =`SELECT description_snapshot.id, description_snapshot.term FROM description_snapshot INNER JOIN extendedmapsnapshot_2 ON description_snapshot.conceptId = extendedmapsnapshot_2.referencedComponentId where  description_snapshot.typeId = '900000000000013009' and term like '%${text}%' and extendedmapsnapshot_2.active = '1' order by conceptId limit 50`;
 
  
     
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  
    
 })
 router.post('/AddAdmission_form',(req,res)=>{
    console.log('req.body.AddAdmission1111111111');
    console.log(req.body.AddPerformerForm);
    // var hospitalId = 'branch-01' 
    // var  branchId='branch-01'
    
    // var {}=req.body.AddAdmission;
    var {name,phone_no,emailId,address}=req.body.AddPerformerForm;
    const command =`INSERT INTO  masterclinichospital (name, phoneNo, emailId, Address) values('${name}','${phone_no}','${emailId}','${address}')`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

 module.exports =router;