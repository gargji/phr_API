const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');


router.get('/Addreferraltable', (req,res)=>{
    const command = `SELECT * FROM master_referral`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
//     db.query(command, (err, result) => {
//         if (err) {
//             res.json({ status: 'fail', error: err });
//         } else {
//             res.json(result);
//         }
//     });
});

router.post('/activedeactivereferral', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_referral set active='${status}' where id='${id}';`;
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
router.post('/deletemasterreferral', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_referral where id=${id};`;
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


router.post('/AddUpdatemasterReferral', (req,res)=>{
    console.log(req.body);
    var specific_source = req.body.specific_source
    var language_id = req.body.language_id
    var source = req.body.source
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_referral(specific_source,source,language_id,active) values('${specific_source}','${source}','${language_id}',1)`;
    }
    else{
        command =`update master_referral set specific_source='${specific_source}',source='${source}',language_id='${language_id}' where id='${id}'`;
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


module.exports =router;