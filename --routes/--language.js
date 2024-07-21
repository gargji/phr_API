
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

router.get("/getActiveLanguage", (req, res) => {
    var sql =`select * from master_language where active = '1'`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json(rows);
      }
    });
  });


router.post('/selectlanguage', (req,res)=>{
    const {language_id}=req.body
    const command = `SELECT * FROM master_resource where language_id='${language_id}'`;
    console.log(command);

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

});
router.post('/getselectedLanguage', (req,res)=>{
    const langId=req.body.lang
    const command = `SELECT * FROM master_resource where language_id='${langId}'`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

    
});
router.get('/getLanguage', (req,res)=>{
    const command = `SELECT * FROM master_language`;

    console.log(command);

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    

    
});
router.post('/AddUpdateMasterLanguage', (req,res)=>{
    console.log(req.body);
   
    
    var language_name = req.body.language_name
    var language_id = req.body.language_id
    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
        command = `INSERT INTO master_language(language_name,language_id,active) values('${language_name}','${language_id}',1)`;
    }
    else{
         command = `update master_language set language_name='${language_name}',language_id='${language_id}' where id='${id}'`;
        returnmessage="U"
    }
    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));

    
});

router.post('/activedeactiveLanguage', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_language set active='${status}' where id='${id}';`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})
router.post('/deletetableLanguage', (req,res)=>{
    const id =req.body.id;


    const command =`delete from master_language where id=${id};`;
    console.log(command);

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err))


})



router.post("/getResourceData", (req, res) => {
    var languageCode = req.body.languageCode;
    var defaultLanguageCode = req.body.defaultLanguageCode
    var command =`select * from master_resource where language_id = '${languageCode}' or language_id = '${defaultLanguageCode}'`;
    db.query(command, (err, result)=>{
        if(err){
            logWriter(err);
        }
        else{
            res.json(result)
        }

        })
    })
  
module.exports =router;