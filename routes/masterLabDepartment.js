const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');



router.post('/AddUpdatemaster_lab_department', (req,res)=>{
    console.log(req.body);
    var HospitalId = req.body.HospitalId
    var LanguageId = req.body.data.LanguageId
    var Department=req.body.data.Department
    var Description=req.body.data.Description
    var categories=req.body.data.categories
    var id = req.body.data.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_lab_department(HospitalId, Department,categories, Description, LanguageId, active) values('${HospitalId}','${Department}','${categories}','${Description}','${LanguageId}',1)`;
    }
    else{
         command =`update master_lab_department set Department='${Department}',LanguageId='${LanguageId}',categories='${categories}',Description='${Description}' where id='${id}'`;
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


router.post('/getmaster_lab_departmentData', (req,res)=>{
    let HospitalId=req.body.HospitalId
    const command = `SELECT * FROM master_lab_department`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
});
// router.get('/getActivemaster_lab_departmentData', (req,res)=>{
//     const command = `SELECT * FROM master_lab_department where active = '1'`;


//     execCommand(command)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err));
    
    
// });
router.post('/activedeactivemaster_lab_department', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_lab_department set active='${status}' where id='${id}';`;

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
router.post('/deletemaster_lab_department', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_lab_department where id=${id};`;
   

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    

})


module.exports =router;