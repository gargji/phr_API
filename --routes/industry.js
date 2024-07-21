const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');



router.post('/AddUpdatemasterIndustry', (req,res)=>{
    var industryName = req.body.industryName
    var language_id = req.body.language_id
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_industry(industryName,language_id,active) values('${industryName}','${language_id}',1)`;
    }
    else{
         command =`update master_industry set industryName='${industryName}',language_id='${language_id}' where id='${id}'`;
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


router.get('/getMasterIndustryData', (req,res)=>{
    const command = `SELECT * FROM master_industry`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
});
router.get('/getActiveIndustryData', (req,res)=>{
    const command = `SELECT * FROM master_industry where active = '1'`;


    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
});
router.post('/activedeactiveindustry', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_industry set active='${status}' where id='${id}';`;

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
router.post('/deletemasterindustry', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_industry where id=${id};`;
   

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    

})


module.exports =router;