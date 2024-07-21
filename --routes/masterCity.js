const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.get('/getTablemasterCity', (req,res)=>{
   
    const command = `select *,(select countryName from master_country1 where conceptId=master_city.country_id) as countryName,
    (select state_name from master_state where id=master_city.state_id) as stateName from master_city ;`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
    
});

router.post('/AddUpdateMasterCity', (req,res)=>{
    console.log(req.body);
    var city_name = req.body.city_name
    var language_id = req.body.language_id
    var country_id = req.body.country_id
    var state_id = req.body.state_id
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_city(city_name,language_id,country_id,state_id,active) values('${city_name}','${language_id}','${country_id}','${state_id}',1)`;
    }
    else{
         command =`update master_city set city_name='${city_name}',language_id='${language_id}',country_id='${country_id}',state_id='${state_id}' where id='${id}'`;
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
router.post('/activedeactiveMasterCity', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_city set active='${status}' where id='${id}';`;

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
router.post('/deleteMasterCity', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_city where id=${id};`;
   

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    

})

module.exports =router;