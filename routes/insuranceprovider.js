const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');


router.get('/Addinsuranceprovider', (req,res)=>{
    const command = `SELECT * FROM insurance_provider`;

    console.log(command);
    
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

router.post('/activedeactiveinsuranceprovider', (req,res)=>{
    const id =req.body.id;
    const status=req.body.status;

    const command =`Update insurance_provider set active='${status}' where id='${id}';`;
    console.log(command);
     
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
})

router.post('/deleteinsuranceprovider', (req,res)=>{
    const id =req.body.id;

    const command =`delete from insurance_provider where id=${id};`;
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

router.post('/AddUpdatesmasterInsuranceProvider', (req,res)=>{
    console.log(req.body);
    var Insurance_providerName = req.body.data.Insurance_providerName
    var language_id = req.body.langid
    var Phone=req.body.data.Phone
    var email=req.body.data.email
    var address=req.body.data.address
    var id = req.body.data.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
        command = `INSERT INTO insurance_provider(Insurance_providerName,Phone,email,address,language_id,active) values('${Insurance_providerName}','${Phone}','${email}','${address}','${language_id}',1)`;
    }
    else{
         command =`update insurance_provider set Insurance_providerName='${Insurance_providerName}',Phone='${Phone}',email='${email}',address='${address}',language_id='${language_id}' where id='${id}'`;
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