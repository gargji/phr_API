const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');


router.get('/Selectmaster_laterality', (req,res)=>{
    const command = `SELECT * FROM master_laterality`;

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

router.post('/activedeactiveMaster_laterality', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_laterality set active='${status}' where id='${id}';`;
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
router.post('/deleteMaster_laterality', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_laterality where id=${id};`;
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


router.post('/AddUpdateMaster_laterality', (req,res)=>{
    console.log(req.body);
    var module_id = '900000000000207008'
    var refeset_id='TMP-5ceutl'
    var language_id = req.body.language_id
    var name = req.body.name
    var id = req.body.id
   var guid=req.body.guid
   var referenced_component_id=req.body.referenced_component_id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_laterality(guid,module_id,name,refeset_id,language_id,referenced_component_id,active) values('${guid}','${module_id}','${name}','${refeset_id}','${language_id}','${referenced_component_id}',1)`;
    }
    else{
        command =`update master_laterality set guid='${guid}',module_id='${module_id}',name='${name}',refeset_id='${refeset_id}',referenced_component_id='${referenced_component_id}',language_id='${language_id}' where id='${id}'`;
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

module.exports=router;