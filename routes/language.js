
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
router.get('/getcommunicationdata', (req,res)=>{
    const command = `SELECT * FROM master_communication`;

    console.log(command);

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    

    
});
router.get('/getCountryphonecode', (req,res)=>{
    const command = `SELECT * FROM master_country_code1`;

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

router.get("/GET_LANGUAGE_CHANGE_DATA", (req, res) => {

    var command = `select * from master_language;`;
    db.query(command, (err, result) => {
        if (err) {
            logWriter(err);
        }
        else {
            res.json(result)
        }

    })
})
router.get("/GET_MASTER_FORM_DATA", (req, res) => {

    var command = `select * from master_form;`;
    db.query(command, (err, result) => {
        if (err) {
            logWriter(err);
        }
        else {
            res.json(result)
        }

    })
})
router.post("/GET_Form_Label_Only_DATA", (req, res) => {
    var form_id = req.body.form_id;
    var lang_id = req.body.lang_id;
    var command = `select * from master_resource where form_id = '${form_id}' and language_id = '${lang_id}'`
    db.query(command, (err, result) => {
        if (err) {
            logWriter(err);
        }
        else {
            res.json(result)
        }

    })
})
router.post("/GET_MASTER_RESOURCE_DATA", (req, res) => {
    console.log(req.body);
    var form_id = req.body.formCode;
    var lang_id = req.body.language_id;
    var command = `select * from master_resource where form_id = '${form_id}' and language_id = '${lang_id}'`
    db.query(command, (err, result) => {
        if (err) {
            logWriter(err);
        }
        else {
            res.json(result)
        }

    })
})
router.post("/Edit_Form_Resorce_Data", (req, res) => {
    console.log(req.body.finalChangeArray);
    var finalChangeArray = req.body.finalChangeArray;
    console.log(req.body.AddMasterresorceform);
    var lang_id = req.body.AddMasterresorceform.language_id;
    var form_id = req.body.AddMasterresorceform.formCode;
    var i = 0;
    (function loop(){
        if(i < finalChangeArray.length){
            var upDateQuery = `update master_resource set label_value = '${finalChangeArray[i].value}' where language_id = '${lang_id}' and form_id = '${form_id}' and label_code = '${finalChangeArray[i].label_code}'`
            console.log(upDateQuery);
            db.query(upDateQuery, (err, result) => {
                if (err) {
                    logWriter(err);
                }
                else {
                    if(result.affectedRows == 0){
                        var insert_Query = `insert into master_resource (label_value, language_id, form_id, label_code) values('${finalChangeArray[i].value}', '${lang_id}', '${form_id}', '${finalChangeArray[i].label_code}')`
                        console.log(insert_Query);
                        execCommand(insert_Query)
                        .then(result =>{
                            i++;
                            loop();
                            
                        })
                        .catch(err => logWriter(insert_Query, err))
                    }
                    else{
                        i++;
                        loop();
                    }
                }
        
            })
           
            
        }
        else{
            // console.log('bahar bhago');
            res.json('success')
        }
    }())
})



  
module.exports =router;