const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');



router.get('/getstates', (req,res)=>{
    const command = `SELECT *, (select countryName from master_country1 where conceptId = a.country_id) as countries FROM master_state a order by state_name`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json(result);
    //     }                                    
    // })
})


router.post('/AddUpdatemasterState', (req,res)=>{
    console.log(req.body);
    var state_name =req.body.state_name
    var language_id = req.body.language_id
    var country_id = req.body.country_id
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_state(state_name,country_id,language_id,active) values('${state_name}','${country_id}','${language_id}',1)`;
    }
    else{
        command =`update master_state set state_name='${state_name}',country_id='${country_id}',language_id='${language_id}' where id='${id}'`;
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


router.post('/delete_tableMasterState', (req,res)=>{
    const id =req.body;
    console.log(id.id);

    const command =`delete from master_state where id=${id.id};`;
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
router.post('/activedeactiveMasterState', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;
    const command =`Update master_state set active='${status}' where id='${id}';`;
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