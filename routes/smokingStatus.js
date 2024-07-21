const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');



router.get('/getActiveSmokingStatus', (req,res)=>{
    const command = `SELECT * FROM master_smoking_status`;

    console.log('11111111111111111111',command);
    
    db.query(command, (err, result) => {
        if (err) {
            res.json({ status: 'fail', error: err });
        } else {
            res.json(result);
        }
    });
    
});

router.get('/Smokingstatus', (req,res)=>{
    const command = `SELECT * FROM master_smoking_status`;

    console.log(command);
    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
});

router.post('/AddUpdatesmokingstatus', (req,res)=>{
    console.log('vaibhav',req.body);
    var SmokingStatus = req.body.name
    var languageId = req.body.language_id
    var conceptid = req.body.conceptId
    var moduleid = req.body.moduleId
    var id = req.body.id
    
    console.log('vaibhav',id,SmokingStatus,languageId,conceptid,moduleid);
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){   
        command = `INSERT INTO master_smoking_status(name,languageid,referencedComponentId,active) values('${SmokingStatus}','${languageId}','${conceptid}',1)`;
        
    }
    else{
         command =`update master_smoking_status set name='${SmokingStatus}',languageid='${languageId}',referencedComponentId='${conceptid}' where id='${id}'`;
         
        //  update master_smoking_status set name='undefined',languageid='null',referencedComponentId='131212' where id='33c991c4-1d15-4704-9a7f-f54d4acf5e58'
        returnmessage="U"
    }
    console.log(command);
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

router.post('/deletetablesmokingstatus', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_smoking_status where id=${id};`;
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


router.post('/activedeactivesmokingstatus', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;
    const command =`Update master_smoking_status set active='${status}' where id='${id}';`;
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