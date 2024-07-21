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
    var {id,location,model_number,manufacture,Expire_date,source,notes,Model_Name,serial_name,serial_number,recordedby,datetime} = req.body.implantsForm 
    var indication=req.body.implantsForm.indication.id;
    var device=req.body.implantsForm.device.id;
    // let date=new Date();
    // date_of_Implantation=date.toISOString().split('T')[0];
    // manufacture_date=date.toISOString().split('T')[0];
    // Expire_date=date.toISOString().split('T')[0];
    var date_of_Implantation = formatDateTime(req.body.implantsForm.date_of_Implantation);
    var manufacture_date = formatDateTime(req.body.implantsForm.manufacture_date);
    var Expire_date = formatDate(req.body.implantsForm.Expire_date);
    // 
    console.log(req.body.implantsForm);
    if(id=='' || id=='0' || id==undefined || id==null){
    const command =`INSERT INTO  transaction_implants(hospital_id, branch_id,patient_id, device, date_of_Implantation, indication, location, model_number, manufacture, manufacture_date, Expire_date, source, notes,serial_name,serial_number,recordedby,datetime,transaction_time) values('${hospitalId}','${branchId}','${patientguid}','${device}','${date_of_Implantation}','${indication}','${location}','${model_number}','${manufacture}','${manufacture_date}','${Expire_date}','${source}','${notes}','${serial_name}','${serial_number}','${recordedby}','${date_of_Implantation}',now())`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('update'))
    .catch(err => logWriter(command, err));
    }
    else{
        const command =`Update transaction_implants set device='${device}', indication='${indication}', location='${location}', model_number='${model_number}',date_of_Implantation='${date_of_Implantation}', manufacture_date='${manufacture_date}', Expire_date='${Expire_date}',source='${source}', notes='${notes}',serial_name='${serial_name}',recordedby='${recordedby}',datetime='${datetime}',transaction_time='${date_of_Implantation}' where id='${id}';`;
        
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
    // const command =`Select * ,(Select name from master_implantdevice where id=transaction_implants.device)  as deviceName,(Select term from description_snapshot where id=transaction_implants.indication) as indicationName from transaction_implants where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}'`;
    // console.log('vaibhav transaction_problem',command);
    const command=`SELECT ti.*,
    mid.name AS deviceName,
    ds.term AS indicationName
FROM transaction_implants ti
JOIN master_implantdevice mid ON mid.id = ti.device
JOIN description_snapshot ds ON ds.id = ti.indication
WHERE ti.hospital_id = '${hospitalId}'
AND ti.branch_id = '${branchId}'
AND ti.patient_id = '${patientGuid}';`
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

    const command =`delete from transaction_implants where   id='${ids}'`;
 
    console.log('vaibhav',command);
  
    execCommand(command)
    .then(result => res.json('deleted'))
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
function formatDate(dateToBeFormatted){
    if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
        var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
        date = new Date(date);
        var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
        console.log(dateReturn);
        return dateReturn
    }
    else{
        return ''
    }
  }
  function formatDateTime(dateToBeFormatted){
    if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
        var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
        date = new Date(date);
        var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`
        console.log(dateReturn);
        return dateReturn
    }
    else{
        return ''
    }
  }
module.exports =router;