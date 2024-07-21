const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.get('/GetMasterEncounterVisit', (req,res)=>{


    const command = `Select * from master_visit_class`;
console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/master_sensitivity', (req,res)=>{


    const command = `Select * from master_sensitivity`;
console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/mater_encounter_proirity', (req,res)=>{


    const command = `Select * from mater_encounter_proirity`;
console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.get('/master_service_type', (req,res)=>{


    const command = `Select * from master_service_type`;
console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.post('/CreateEncounter', (req,res)=>{
    console.log(req.body)
    var patientId=req.body.patientguid
    var branchId=req.body.branchId
    var hospitalId=req.body.hospitalId
    var VisitType = req.body.formData.VisitType.id
    var VisitClass = req.body.formData.VisitClass
    var Servicetype = req.body.formData.Servicetype
    var Facility = req.body.formData.Facility
    var BillingFacility = req.body.formData.BillingFacility
    var PhysicalLocation = req.body.formData.PhysicalLocation.id
    var Sensitivity = req.body.formData.Sensitivity
    var DateofService = req.body.formData.DateofService
    console.log('req.body.appointmentData',req.body.appointmentData);
    var appointmentId=req.body.appointmentData
   
    var convertedDate = new Date(req.body.formData.DateofService);
 let isoDate = convertedDate;
 var d = new Date(isoDate);
 let time=d.toLocaleTimeString('en-GB');
// console.log("================================================",d.toLocaleDateString('en-GB') ,d.toLocaleTimeString('en-GB')); // dd/mm/yyyy
let dateFor = d.toLocaleDateString('en-GB');
let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
    var Provider = req.body.formData.Provider.guid
    var Referringprovider = req.body.formData.Referringprovider.id
    var Translator = req.body.formData.Translator.id
    var Chaperone = req.body.formData.Chaperone.id
    var Reasonforvisit = req.body.formData.Reasonforvisit.id
    var ConsultationMode = req.body.formData.ConsultationMode
    var Priority = req.body.formData.Priority
    var Encounter_No = 'EN'+Math.random() * 100;
    var id = req.body.formData.id;
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO transaction_encounter(patientId,branchId,hospitalId,VisitType,appointmentId, VisitClass, Servicetype, Facility, BillingFacility, PhysicalLocation, Sensitivity,
             DateofService, Provider, Referringprovider, Translator, Chaperone, Reasonforvisit, ConsultationMode, Priority, Encounter_No,transactionTime)
         values('${patientId}','${branchId}','${hospitalId}','${VisitType}','${appointmentId}','${VisitClass}',
         '${Servicetype}','${Facility}','${BillingFacility}','${PhysicalLocation}','${Sensitivity}','${databaseDate}','${Provider}','${Referringprovider}','${Translator}','${Chaperone}','${Reasonforvisit}','${ConsultationMode}','${Priority}','${Encounter_No}',now())`;
    }
    else{
    
         command =`update transaction_encounter set VisitType='${VisitType}',VisitClass='${VisitClass}',Servicetype='${Servicetype}',Facility='${Facility}',BillingFacility='${BillingFacility}',PhysicalLocation='${PhysicalLocation}'
         ,Sensitivity='${Sensitivity}',DateofService='${databaseDate}',Provider='${Provider}',Referringprovider='${Referringprovider}',Translator='${Translator}', Chaperone='${Chaperone}',Reasonforvisit='${Reasonforvisit}',ConsultationMode='${ConsultationMode}',Priority='${Priority}',Encounter_No='${Encounter_No}',transactionTime=now() where id='${id}'`;
        returnmessage="U"
    }

    execCommand(command.replace(/null/g, '').replace(/undefined/g,''))
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
   
    
});
router.post('/getTransaction_Encounter', (req,res)=>{

    var patientId=req.body.patientguid
    var branchId=req.body.branchId
    var hospitalId=req.body.hospitalId


    // const command = `Select *,(select visit_type from master_visit_type where id=transaction_encounter.VisitType)as visistypeName,(select name from master_refering_provider where id=transaction_encounter.Referringprovider)as ReferringproviderName,(select name from master_chepron where id=transaction_encounter.Chaperone) as chepronName,
    // (select name from master_translators where id= transaction_encounter.Translator) as TranslatorName,
    // (select term from description_snapshot where id=transaction_encounter.Reasonforvisit) as problemList from transaction_encounter where patientId='${patientId}' AND branchId='${branchId}' AND hospitalId='${hospitalId}'`;
const command=`SELECT transaction_encounter.*,
CONCAT(transactionTime, ' Dr ', Provider) AS EncounterName,
master_visit_type.visit_type AS visitTypeName,
master_refering_provider.name AS ReferringproviderName,
master_chepron.name AS chepronName,
master_translators.name AS TranslatorName,
description_snapshot.term AS problemList
FROM transaction_encounter
LEFT JOIN master_visit_type ON master_visit_type.id = transaction_encounter.VisitType
LEFT JOIN master_refering_provider ON master_refering_provider.id = transaction_encounter.Referringprovider
LEFT JOIN master_chepron ON master_chepron.id = transaction_encounter.Chaperone
LEFT JOIN master_translators ON master_translators.id = transaction_encounter.Translator
LEFT JOIN description_snapshot ON description_snapshot.id = transaction_encounter.Reasonforvisit
WHERE transaction_encounter.patientId = '${patientId}'
AND transaction_encounter.branchId = '${branchId}'
AND transaction_encounter.hospitalId = '${hospitalId}' order by id desc;`
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/Insertmaster_Refering_provider', (req,res)=>{
    console.log('aman',req.body);
    var name=req.body.data.name;
    var phone_no=req.body.data.phone_no;
    var email=req.body.data.email;
    var type=req.body.data.type

    const command = `INSERT INTO master_Refering_provider(name,phoneNo,email,type) values('${name}','${phone_no}','${email}','${type}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/InsertMasterTranslators', (req,res)=>{
    console.log('aman',req.body);
    var name=req.body.data.name;
    var phone_no=req.body.data.phone_no;
    var email=req.body.data.email;

    const command = `INSERT INTO master_translators(name,phoneNo,email) values('${name}','${phone_no}','${email}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/InsertMasterChepron', (req,res)=>{
    console.log('aman',req.body);
    var name=req.body.data.name;
    var phone_no=req.body.data.phone_no;
    var email=req.body.data.email;

    const command = `INSERT INTO master_chepron(name,phoneNo,email) values('${name}','${phone_no}','${email}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/get_masterRefferingProvider', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `SELECT *, CONCAT(firstname, ' ', middlename, ' ', lastname) AS DisplayName
    FROM provider_personal_identifiers
    WHERE CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
}) 
router.post('/deleteTransEncounter', (req,res)=>{
    // console.log(req.body);
    const id = req.body.id
    
    const command = `delete from transaction_encounter where id='${id}';`;
    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    
    
}) 

router.post('/get_masterRefferingProviderInternal', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `SELECT *, CONCAT(firstname, ' ', middlename, ' ', lastname) AS name
    FROM provider_personal_identifiers
    WHERE CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/get_masterRefferingProviderExternal', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from master_refering_provider where name like '%${display_name}%' AND type='External';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
 
router.post('/get_masterTranslators', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from master_translators where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
}) 
router.post('/get_masterChepron', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from master_chepron where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
}) 
router.post('/GetVisitType', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    
    const command = `select * from master_visit_type where visit_type like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})  

module.exports=router;