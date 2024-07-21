const e = require('express');
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.get('/Getmaster_treatment', (req,res)=>{
    const command = `SELECT *,(select Type from master_treatment_type where id = master_treatment.typeId) as type FROM master_treatment`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
});
router.get('/Getmaster_treatment_type', (req,res)=>{
    const command = `SELECT * FROM master_treatment_type`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(result);
    //     }
    // });
    
});



router.post('/AddUpdatesMasterTreatment', (req,res)=>{
    console.log(req.body);
    var TreatmentName = req.body.TreatmentName
    var language_id = req.body.language_id
    var TypeId=req.body.TypeId
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_treatment(TreatmentName,language_id,TypeId,active) values('${TreatmentName}','${language_id}','${TypeId}','1')`;
    }
    else{
    
         command =`update master_treatment set TreatmentName='${TreatmentName}',language_id='${language_id}',TypeId='${TypeId}' where id='${id}'`;
        returnmessage="U"
    }

    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
   
    
});

router.post('/deletetable_master_treatment', (req,res)=>{
    var id =req.body.id;

    const command =`delete from master_treatment where id=${id};`;
    console.log(command);

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
router.post('/activedeactivemaster_treatment', (req,res)=>{
    var id =req.body.id;
    var active=req.body.active

    const command =`Update master_treatment set active='${active}' where id='${id}';`;
    console.log(command);

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

module.exports =router;
