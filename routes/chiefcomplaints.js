
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

router.post('/insertChiefComplaints', (req, res) => {
    console.log(req.body);
   var patientID=req.body.patientId
   var HospitalId=req.body.hospitalID
var  branchId=req.body.branchId
var    ChiefComplaint=req.body.data.ChiefComplaint.name
var ChiefComplaintId=req.body.data.ChiefComplaint.id
var duration=req.body.data.duration
var days =req.body.data.days
    const command = `insert into transaction_chief_complaints (patientId, HospitalId, branchId, ChiefComplaint,ChiefComplaintId, duration) values('${patientID}','${HospitalId}','${branchId}', '${ChiefComplaint}','${ChiefComplaintId}', '${duration} ${days}')`;
    console.log(command);
    db.query(command, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/getmasterChiefComplaitdata',(req,res)=>{
   
   
    var display_name = req.body.text; 
    // var  type = req.body.type;
    
    const command = `select * from master_chief_complaints where name like '%${display_name}%' ;`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/masterChiefComplaintsDefaultdata',(req,res)=>{

    
    const command = `select * from master_chief_complaints where category='default';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/getTransactionChiefComplaints',(req,res)=>{

    var Patientguid=req.body.patientguid
    const command = `select * from transaction_chief_complaints where patientId='${Patientguid}';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/DeleteChiefComplaints',(req,res)=>{

    var id=req.body.data.id
    const command = `delete  from transaction_chief_complaints where id='${id}';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
})

module.exports=router