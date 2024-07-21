const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/getmaster_device',(req,res)=>{
    console.log('req.body.AddAdmission111111111122222222222');
   
    var display_name = req.body.text; 
    // var  type = req.body.type;
    
    const command = `select * from master_implantdevice where name like '%${display_name}%' `;   

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/getmaster_Indication',(req,res)=>{
    
   
    var display_name = req.body.text; 
  
    
    const command = `select * from master_indication where name like '%${display_name}%' ;`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/save_implantsForm',(req,res)=>{
   

    var hospitalId = req.body.hospitalId 
    var  branchId=req.body.branchId
    var patientguid=req.body.patientguid
    console.log('Get_lateratility1',hospitalId,branchId,patientguid);
    var {id,date_of_Implantation,location,model_number,manufacture,manufacture_date,Expire_date,source,notes} = req.body.implantsForm 
    var indication=req.body.implantsForm.indication.id;
    var device=req.body.implantsForm.device.id;
    let date=new Date();
    date_of_Implantation=date.toISOString().split('T')[0];
    manufacture_date=date.toISOString().split('T')[0];
    Expire_date=date.toISOString().split('T')[0];
    // Expire_date=date.toISOString().split('T')[0];

    console.log(req.body.implantsForm);
    if(id=='' || id=='0' || id==undefined || id==null){
    const command =`INSERT INTO  transaction_implants(hospital_id, branch_id,patient_id, device, date_of_Implantation, indication, location, model_number, manufacture, manufacture_date, Expire_date, source, notes,  transaction_time) values('${hospitalId}','${branchId}','${patientguid}','${device}','${date_of_Implantation}','${indication}','${location}','${model_number}','${manufacture}','${manufacture_date}','${Expire_date}','${source}','${notes}',now())`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));location
    }
    else{
        const command =`Update transaction_implants set device='${device}', indication='${indication}', location='${location}', model_number='${model_number}',date_of_Implantation='${date_of_Implantation}', manufacture_date='${manufacture_date}', Expire_date='${Expire_date}',source='${source}', notes='${notes}' where id='${id}';`;
        
    console.log(command);
        execCommand(command)
        .then(result => res.json('update'))
        .catch(err => logWriter(command, err));
    }
})


router.post('/Get_Implants',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientguid;
    var  branchId=req.body.branchId
    console.log('cityname');
   
    const command =`Select * ,(Select name from master_implantdevice where id=transaction_implants.device)  as deviceName,(Select name from master_indication where id=transaction_implants.indication) as indicationName from transaction_implants where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}'`;
 
    console.log('vaibhav transaction_problem',command);
  
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
///////////////////implants api/////////////////////
router.post('/deleteTransaction_ImplantAPI',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
    var  branchId=req.body.branchId;
    var  ids=req.body.id;
    
    console.log('cityname*** ************************');

    const command =`delete from transaction_implants where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}' AND id='${ids}' `;
 
    console.log('vaibhav',command);
  
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})


router.post('/lockUnlocktransaction_Implants', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_implants set lockStatus='${status}' where id='${id}';`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
   

}) 

module.exports =router;