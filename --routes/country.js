const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.get('/getTablemastercountry', (req,res)=>{
   
    const command = `SELECT * FROM master_country1`;

    
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

router.post('/AddUpdateMasterCountry', (req,res)=>{
   
    
    var countryName = req.body.countryName
    var language_id = req.body.language_id
    var conceptId = req.body.conceptId
    var moduleId = req.body.moduleId
    var fsn_term=req.body.fsn_term
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_country1(countryName,language_id,fsn_term,moduleId,conceptId,active) values('${countryName}','${language_id}','${fsn_term}','${moduleId}','${conceptId}',1)`;
    }
    else{
         command = `update master_country1 set countryName='${countryName}',fsn_term='${fsn_term}',conceptId='${conceptId}',language_id='${language_id}',moduleId='${moduleId}' where id='${id}'`;
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


    






router.get('/isinputfield', (req,res)=>{
    const command = `SELECT * FROM master_demographics`;
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

router.post('/activedeactivecountry', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_country1 set active='${status}' where id='${id}';`;
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
router.post('/deletetablecountry', (req,res)=>{
    const id =req.body.id;
    const command =`delete from master_country1 where id=${id};`;
    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err))
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})





module.exports =router;