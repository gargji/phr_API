const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

router.post('/getOrderForSearch',(req,res)=>{
    var text=req.body.text;
    console.log('Getloinic',text);
    const command =`SELECT * FROM loinc_main INNER JOIN loincuniversal ON loinc_main.LOINC_NUM = loincuniversal.LOINC_NUM where (classtype = '1' or classtype = '2') and DisplayName like '${text}%' or shortname like '${text}%' or loinc_main.LONG_COMMON_NAME like '${text}%';`;
 
  // console.log(command);
     
    execCommand(command)
    .then(result => {
      res.json(result)
    })
    .catch(err => logWriter(command, err));
  
    
 })
 router.post('/getPANELSAndOrder',(req,res)=>{
  console.log('hit for selection');
  var loinicId=req.body.loinicId;
  var returnData = []
  // console.log('Getloinic',text);
  const command =`SELECT * FROM panelsandforms where loinc = '${loinicId}'`;

// console.log(command);
   
  execCommand(command)
  .then(result => {


    // if (result.length > 0) {

      var i = 0;
      (function loop(){
        if(i < result.length){
          var loincPanel = `select * from panelsandforms where ParentLoinc = '${result[i].ParentLoinc}' and loinc = '${result[i].ParentLoinc}';select * from panelsandforms where ParentLoinc = '${result[i].ParentLoinc}' and loinc <> '${result[i].ParentLoinc}';`;
          execCommand(loincPanel)
          .then(result => {
            returnData.push(result)
            i++;
            loop();
          })
          .catch(err => logWriter(command, err));
        }
        else{
          res.json(returnData)
        }

      }());
      // for (var i = 0; i < result.length; i++) {
       
        // }
        // console.log(returnData);
    // }

  })
  .catch(err => logWriter(command, err));

  
})
router.post('/getAllOrder',(req,res)=>{
  var parentID=req.body.parentID;
  // console.log('Getloinic',text);
  const command =`SELECT * FROM panelsandforms where ParentId = '${parentID}'`;

// console.log(command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})
router.post('/InsertLabOrder',(req,res)=>{
  // console.log(req.body);
  var hospital_id=req.body.hospital_id
  var branchId=req.body.branchId
  var patientguid=req.body.patientguid

    var labOrderDetails=req.body.orderplaced
console.log(labOrderDetails,'length');

   let i = 0;
   (function loop(){
     if (i < labOrderDetails.length) {
      var command = ''
      if(labOrderDetails[i].PanelType==undefined){
        command = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName, parentId, LoincNO,type, TransactionTime)
        VALUES ('${hospital_id}','${branchId}','${patientguid}','${labOrderDetails[i].label}','${labOrderDetails[i].parentId}','${labOrderDetails[i].LoincNO}','Panel', now());`

      }
      else{
        // console.log('for orders');
        command = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName, LoincNO,type, TransactionTime)
        VALUES ('${hospital_id}','${branchId}','${patientguid}','${labOrderDetails[i].LONG_COMMON_NAME}','${labOrderDetails[i].LOINC_NUM}','Order', now());`
      }
 
       execCommand(command)
         .then(() => {
           i++; 
           loop()
         })
         .catch(err => logWriter(command, err));
     }
     else{
       res.json('success')
     }
   }())

// // console.log(command);
   
//   execCommand(command)
//   .then(result => res.json(result))
//   .catch(err => logWriter(command, err));

})

router.post('/getDiagnosisforOrder',(req,res)=>{
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  // console.log('Getloinic',text);
  const command =`select id, (select term from description_snapshot where id=transaction_problem.problem)  as Diagnosis from transaction_problem where hospital_id='${hospital_id}' AND branch_id='${branch_id}' AND patient_id='${patient_id}' and Diagnosis=1`;

console.log('orderfor________',command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})
router.post('/getTransactionLabOrder',(req,res)=>{
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  // console.log('Getloinic',text);
  const command =`select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' and Diagnosis=1`;

console.log('orderfor________',command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})

module.exports = router;