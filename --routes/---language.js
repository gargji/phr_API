
const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');


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
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
});

router.post("/getResourceData", (req, res) => {
  var languageCode = req.body.languageCode;
  var defaultLanguageCode = req.body.defaultLanguageCode
  var sql =`select * from master_resource where language_id = '${languageCode}' or language_id = '${defaultLanguageCode}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
});



router.post("/GET_Form_Label_Only_DATA", (req, res) => {
    var language_id=req.body.lang_id;
    var form_id=req.body.form_id;
    var sql =`select label_value, label_code from master_resource WHERE form_id = '${form_id}' AND language_id='${language_id}' order by label_code`; // form_id == 'm001'
    execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));
  });
  
  
  router.post("/GET_MASTER_RESOURCE_DATA", (req, res) => {
    var language_id=req.body.language_id;
    var form_id=req.body.formCode;
    var sql =`select * from master_resource WHERE form_id = '${form_id}' AND language_id='${language_id}' order by label_code`; // form_id == 'm001'
    execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));
  });
  
  router.post("/Edit_Form_Resorce_Data", (req, res) => {
    var finalChangeArray=req.body.finalChangeArray;
    var AddMasterresorceform=req.body.AddMasterresorceform
  
    var sql=''
   if(finalChangeArray.length>0){
    for (let i = 0; i < finalChangeArray.length; i++) {
        
      let concatsql = `UPDATE master_resource set label_value = '${finalChangeArray[i].value}'  WHERE  form_id = '${AddMasterresorceform.formCode}' AND language_id='${AddMasterresorceform.language_id}' AND  label_code ='${finalChangeArray[i].label_code}';`;
      sql = sql + '' + concatsql;
    }
   if(i==finalChangeArray.length-1){
    console.log("sql2",sql);
    execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));
   }
    
  }
    });
  
  

module.exports =router;