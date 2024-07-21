const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.post('/get_problem_detils',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientguid;
    var  branchId=req.body.branchId
    console.log('cityname');
   
    const command =`Select *,(select term from description_snapshot where id=transaction_problem.problem)  as problemName from transaction_problem where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}' and Resolve_status=0 and problemStatus=1`;
 
 
    console.log('vaibhav transaction_problem',command);
  
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/get_DIAGNOSIS',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientguid;
    var  branchId=req.body.branchId
    console.log('cityname');
   
    const command =`Select *,(select term from description_snapshot where id=transaction_problem.problem)  as problem from transaction_problem where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}' and Diagnosis=1`;
 
 
    console.log('vaibhav transaction_problem',command);
  
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
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

router.post('/insertALLNOtes',(req,res)=>{  
    console.log(req.body.data);

    var patientId = req.body.patientguid
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.userName
    var notes = req.body.notes
    var allergyId=req.body.id
    var categeory= req.body.categeory

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})


router.post('/lockUnlocktransaction_problemdata', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_problem set lockStatus='${status}' where id='${id}';`;
console.log(command)
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    

})

router.post('/deleteTransaction_Problem',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientguid;
    var  branchId=req.body.branchId;
    var  ids=req.body.id;
    
   
   
    const command =`delete from transaction_problem where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}' AND id='${ids}' `;
    // delete from master_appointment where HospitalId='1442f75b-2d1f-41a1-9680-4867476fab85' AND Branch_Id='1442f75b-2d1f-41a1-9680-4867476fab85' AND Patient_Id='b5f0bd19-496d-4ecf-894d-24a2cabe245f' AND id='6' 
    console.log('vaibhav',command);
  
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
//////////////////////////////API PROBLEM form

router.post('/getmaster_problem',(req,res)=>{
    var text=req.body.text;
    console.log('Get_site',text);
    const command =`SELECT description_snapshot.id, description_snapshot.term FROM description_snapshot INNER JOIN extendedmapsnapshot_2 ON description_snapshot.conceptId = extendedmapsnapshot_2.referencedComponentId where  description_snapshot.typeId = '900000000000013009' and term like '%${text}%' and extendedmapsnapshot_2.active = '1' order by conceptId limit 50`;
 
  
     
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
router.get('/getallergyCriticality', (req,res)=>{
    const command = `Select * from master_criticality`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.get('/Get_lateratility', (req,res)=>{
   
   console.log('Get_lateratility1');
   
    const command =`Select * from master_laterality`;

   
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
})

router.post('/save_TreatmentProblem',(req,res)=>{
    console.log('form',req.body.formtype);
    var patientguid=req.body.patientguid;
    var hospitalId = req.body.hospitalId ;
    var branchId =req.body.branchId ;
    // console.log(req.body.problemform);
    var problemname=req.body.problemform.problemname.id;
     var {id,Laterality,DateOfOnSet,last_resolution,Priority,Source,relatedperson,notes} = req.body.problemform;
    if(req.body.formtype=='problem'){
        var problemstataus='1'
    }else{
        var problemstataus='0'
    }if(req.body.formtype=='diagnosis'){
        var Diagnosis='1'

    }else{
        var Diagnosis='0'
    }
   
    // var allergeIntoleranceType=req.body.data.allergeIntoleranceType
    // console.log('date of resolution',DateOfOnSet,last_resolution,'fgveygfergh');
    if(DateOfOnSet==''&& last_resolution=='')
    {
        let date=new Date();
      DateOfOnSet=date.toISOString().split('T')[0].split('-');
      last_resolution=date.toISOString().split('T')[0].split('-');
        // console.log('if resolution',DateOfOnSet,last_resolution);
    }else
    if(DateOfOnSet==''&& last_resolution!='')
    {
        let date=new Date();
        DateOfOnSet=date.toISOString().split('T')[0].split('-');
        last_resolution=last_resolution.split('T')[0];
    }else 
    if(DateOfOnSet!=''&& last_resolution==''){
        let date=new Date();
        DateOfOnSet=DateOfOnSet.split('T')[0];
        last_resolution=date.toISOString().split('T')[0].split('-');
    }
    else{
        DateOfOnSet=DateOfOnSet.split('T')[0];
    last_resolution=last_resolution.split('T')[0];
    console.log('else date of ',DateOfOnSet,last_resolution,);
    }
    
    // console.log("DateOfOnSet",DateOfOnSet);
    // var doctorId='doc-21'
    // var  branchId='branch-01'
    // console.log(problemform);
   if(id=='' || id=='0' || id==undefined || id==null){
     const command =`INSERT INTO  transaction_problem( hospital_id, branch_id, patient_id, problem, laterality, onsetDate, resolutionDate, priority, source, notes,Diagnosis,problemStatus) values('${hospitalId}','${branchId}','${patientguid}','${problemname}','${Laterality}','${DateOfOnSet}','${last_resolution}','${Priority}','${Source}','${notes}','${Diagnosis}','${problemstataus}')`;

    // console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
   }
   else{
    const command =`Update transaction_problem set problem='${problemname}', laterality='${Laterality}', onsetDate='${DateOfOnSet}', resolutionDate='${last_resolution}',source='${Source}', notes='${notes}' where id='${id}';`;
        
    // console.log(command);
        execCommand(command)
        .then(result => res.json('update'))
        .catch(err => logWriter(command, err));
    }
    
   

})
router.post('/ResolvedStatuschangeProblem', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_problem set Resolve_status='${status}' where id='${id}';`;

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
router.post('/DiagnosisStatus', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_problem set Diagnosis='${status}' where id='${id}';`;

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
router.post('/ProblemStatus', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_problem set problemStatus='${status}' where id='${id}';`;

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

router.post('/getAllergyNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})


module.exports = router;