const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')

// router.post('/getOrderForSearch',(req,res)=>{
//     var text=req.body.text;
//     // //console.log('Getloinic',text);
//     const command =`SELECT * FROM loinc_main where ( long_common_name like '${text}%' or SHORTNAME like '${text}%') and status = 'ACTIVE'  and (classType = '1'  or classType = '2')`;
 
//   //console.log(command);
     
//     execCommand(command)
//     .then(result => {
//       res.json(result)
//     })
//     .catch(err => logWriter(command, err));
  
    
//  })
router.post('/getOrderForSearch',(req,res)=>{
    var text=req.body.text;
    //console.log('Getloinic',text);
    const command1=`select  TestNameLoinc as LONG_COMMON_NAME ,PanelType,DisplayName,id,Department From master_lab_test where (TestNameLoinc LIKE '${text}%' OR DisplayName LIKE '%${text}') UNION SELECT PanelName as LONG_COMMON_NAME,PanelType,DisplayName,id,department FROM master_lab_panel  where  (DisplayName LIKE '${text}%' OR PanelName LIKE '%${text}%');`
    execCommand(command1)
    .then(result => {
        res.json(result)
        //console.log(result);
    })
    .catch(err => logWriter(command1, err)); 
 })
//  router.post('/getPANELSAndOrder',(req,res)=>{

//   var loinicId=req.body.loinicId;
//   var returnData = []

//   const command =`SELECT * FROM panelsandforms where loinc = '${loinicId}'`;


   
//   execCommand(command)
//   .then(result => {


  

//       var i = 0;
//       (function loop(){
//         if(i < result.length){
//           var loincPanel = `select * from panelsandforms where ParentLoinc = '${result[i].ParentLoinc}' and loinc = '${result[i].ParentLoinc}';select * from panelsandforms where ParentLoinc = '${result[i].ParentLoinc}' and loinc <> '${result[i].ParentLoinc}';`;
//         //console.log(loincPanel);
//           execCommand(loincPanel)
//           .then(result => {
//             returnData.push(result)
//             i++;
//             loop();
//           })
//           .catch(err => logWriter(command, err));
//         }
//         else{
//           res.json(returnData)
//         }

//       }());
     

//   })
//   .catch(err => logWriter(command, err));

  
// })

 
router.post('/getPANELSAndOrder',(req,res)=>{
  // //console.log('hit for selection');
  var loinicId=req.body.id;
  var returnData = []
  // //console.log('Getloinic',text);
  const command =`SELECT * FROM master_lab_panels_test where panel_id = '${loinicId}'`;

execCommand(command)
.then(result => res.json(result))
.catch(err => logWriter(command, err));

  
})
router.post('/getAllOrder',(req,res)=>{
  var parentID=req.body.parentID;
  // //console.log('Getloinic',text);
  const command =`SELECT * FROM panelsandforms where ParentId = '${parentID}'`;

// //console.log(command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})
// router.post("/InsertLabOrder", (req, res) => {
//   //console.log(req.body);
//   var hospital_id = req.body.hospital_id;
//   var branchId = req.body.branchId;
//   var patientguid = req.body.patientguid;
//   var orderId = newGuid();

//   var d = new Date();
//   d.setMonth(d.getMonth() + 1);
//   let time = d.toLocaleTimeString("en-GB");
 
//   let dateFor = d.toLocaleDateString("en-GB");
//   let databaseDate = `${dateFor.split("/")[2]}-${dateFor.split("/")[1]}-${
//     dateFor.split("/")[0]
//   }`;

//   //console.log(databaseDate, time);
//   let labOrderDetails = req.body.orderplacedpanels;
//   let orderplacedonly = req.body.orderplacedOrder;
//   //console.log(orderplacedonly, "length");
//   //console.log(labOrderDetails, "length1");
 
//   let i = 0;
//   (function loop() {
//     if (i < labOrderDetails.length) {
//       var command = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName,Lab_Section_Display_Name,lab_section_full_Name,class, parentId, LoincNO,type,ParentName,orderId, TransactionTime,expiry)
//         VALUES ('${hospital_id}','${branchId}','${patientguid}','${labOrderDetails[i].LoincName}','${labOrderDetails[i].Lab_Section_Display_Name}','${labOrderDetails[i].lab_section_full_Name}','${labOrderDetails[i].class}','${labOrderDetails[i].ParentLoinc}','${labOrderDetails[i].Loinc}','Panel','${labOrderDetails[i].ParentName}','${orderId}', now(),'${databaseDate} ${time}');`;
//       execCommand(command)
//         .then(() => {
//           i++;
//           loop();
//         })
//         .catch((err) => logWriter(command, err));
//     } else {
     
//     }
  

//   var j = 0;

//   (function loop2() {
//     if (j < orderplacedonly.length) {
//       var command2 = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName,Lab_Section_Display_Name,lab_section_full_Name,class,parentId, LoincNO,type,ParentName,orderId,TransactionTime,expiry)
//  VALUES ('${hospital_id}','${branchId}','${patientguid}','${orderplacedonly[i].LONG_COMMON_NAME}','${orderplacedonly[i].Lab_Section_Display_Name}','${orderplacedonly[i].lab_section_full_Name}','${orderplacedonly[i].class}','${orderplacedonly[i].LOINC_NUM}','${orderplacedonly[i].LOINC_NUM}','Order','${orderplacedonly[i].LONG_COMMON_NAME}','${orderId}',now(),'${databaseDate} ${time}');`;

//       execCommand(command2)
//         .then(() => {
//           j++;
//           loop2();
//         })
//         .catch((err) => logWriter(command2, err));
//     } else {
//       res.json("success");
//     }
//   })();

// })();
// });

router.post("/InsertLabOrder", (req, res) => {
  debugger
  //console.log('labytre',req.body);
  var hospital_id = req.body.hospital_id;
  var branchId = req.body.branchId;
  var patientguid = req.body.patientguid;
  var orderId = newGuid();

  var d = new Date();
  d.setMonth(d.getMonth() + 1);
  let time = d.toLocaleTimeString("en-GB");
  let dateFor = d.toLocaleDateString("en-GB");
  let databaseDate = `${dateFor.split("/")[2]}-${dateFor.split("/")[1]}-${
    dateFor.split("/")[0]
  }`;

  //console.log(databaseDate, time);
  let labOrderDetails = req.body.orderplacedpanels;
  let orderplacedonly = req.body.orderplacedOrder;
  // //console.log(orderplacedonly, "length");
  // //console.log(labOrderDetails, "length1");

  let i = 0;
  (function loop() {
    if (i < labOrderDetails.length) {
      var command = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName,Lab_Section_Display_Name,lab_section_full_Name,class, parentId, LoincNO,type,ParentName,orderId, TransactionTime,expiry)
        VALUES ('${hospital_id}','${branchId}','${patientguid}','${labOrderDetails[i].TestNameLoinc}','${labOrderDetails[i].Department}','${labOrderDetails[i].Department}','${labOrderDetails[i].class}','${labOrderDetails[i].panel_id}','${labOrderDetails[i].LOINC_NUM}','Panel','${labOrderDetails[i].panelsName}','${orderId}', now(),'${databaseDate} ${time}');`;
      execCommand(command)
        .then(() => {
          i++;
          loop();
        })
        .catch((err) => logWriter(command, err));
    } else {
      var j = 0;
      (function loop2() {
        if (j < orderplacedonly.length) {
          var command2 = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName,Lab_Section_Display_Name,lab_section_full_Name,class,parentId, LoincNO,type,ParentName,orderId,TransactionTime,expiry)
            VALUES ('${hospital_id}','${branchId}','${patientguid}','${orderplacedonly[j].LONG_COMMON_NAME}','${orderplacedonly[j].Department}','${orderplacedonly[j].Department}','${orderplacedonly[j].class}','${orderplacedonly[j].id}','${orderplacedonly[j].id}','Order','${orderplacedonly[j].LONG_COMMON_NAME}','${orderId}',now(),'${databaseDate} ${time}');`;
          execCommand(command2)
            .then(() => {
              j++;
              loop2();
            })
            .catch((err) => logWriter(command2, err));
        } else {
          res.json("success"); // Send response here
        }
      })();
    }
  })();
});

router.post('/getDiagnosisforOrder',(req,res)=>{
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  // //console.log('Getloinic',text);
  const command =`select id,problem, (select term from description_snapshot where id=transaction_problem.problem)  as Diagnosis from transaction_problem where hospital_id='${hospital_id}' AND branch_id='${branch_id}' AND patient_id='${patient_id}' and Diagnosis=1`;

// //console.log('orderfor________',command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})
router.post('/getTransactionLabOrder',(req,res)=>{
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  // //console.log('Getloinic',text);
  const command =`SELECT * FROM transaction_lab_order WHERE hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' GROUP BY ParentName, orderId ORDER BY id DESC;`;
//console.log('orderfor________',command);
   
  execCommand(command) 
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})


router.post('/getUnmappedLabOrders',(req,res)=>{
 //console.log('hit');
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientguid
  // //console.log('Getloinic',text);
  const command =`select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' group by ParentName,orderId ORDER BY id DESC;`;

//console.log('order',command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})
router.post('/getMappedorderWithDiagnosis',(req,res)=>{
  //console.log('hit');


   var hospital_id=req.body.hospitalId;
   var branch_id=req.body.branchId
   var patient_id=req.body.patientID


   var labOrderDetails=req.body.orderData
   
      let i = 0;
      (function loop(){
        if (i < labOrderDetails.length) {
         var command = ''
         
           command = `insert into order_diagnosis_mapping(patientId, hospitalId, barnchId, diagnosisId, laborderLoinc, transactionTime)
           VALUES ('${patient_id}','${hospital_id}','${branch_id}','${labOrderDetails[i].diagnosis}','${labOrderDetails[i].labOrder}', now());update transaction_lab_order set mapping=1 where id='${labOrderDetails[i].id}'`
   
          
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

    
 
 
   
 })
 function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
router.post('/getTransactionLabOrderForImportResutls',(req,res)=>{
  //console.log(req.body);
  var orderId=req.body.data.orderId
  var parentId=req.body.data.parentId
  // //console.log('Getloinic',text);
  const command =`select * ,(select EXAMPLE_UCUM_UNITS from ucum_units where LOINC_NUM=transaction_lab_order.LoincNO) as units ,(select ReferancerRange from panels_new where Loinc=transaction_lab_order.LoincNO) as ranges ,(select max from max_min_laborder where Loinc=transaction_lab_order.LoincNO) as max1,(select min from max_min_laborder where Loinc=transaction_lab_order.LoincNO) as min1 from transaction_lab_order where parentId='${parentId}' AND orderId='${orderId}';`;

// //console.log('orderfor________',command);
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})

router.post('/ResultUpdate', (req,res)=>{
  // //console.log('----------',req.body);
var resultedData=req.body.resultData
 
     
  let i = 0;
      (function loop(){
        if (i < resultedData.length) {
         var command = ''
           command = `update transaction_lab_order set Results='${resultedData[i].Results}',intrepretation='${resultedData[i].intrepretation}',max='${resultedData[i].max}',min='${resultedData[i].min}',notes='${resultedData[i].notes}',resultDate=now(),ResultStatus=1 where orderId='${resultedData[i].orderId}' AND parentId='${resultedData[i].parentId}' AND LoincNO='${resultedData[i].LoincNO}';`
   //console.log(command);
          
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
     
 
 })

 router.post('/ResultUpdateRadilogy', (req,res)=>{
  //console.log('----------',req.body);
var InterpretationSign=req.body.resultData.InterpretationSign
 var radilogyResults=req.body.resultData.radilogyResults

     var dateAndTime=formatDate(req.body.resultData.dateAndTime)
     let isoDate = dateAndTime;
 var d = new Date(isoDate);

 let time = d.toLocaleTimeString('en-GB');
 var rowdata=req.body.rowdata
      
        const   command = `update transaction_lab_order set Results='${radilogyResults}',intrepretation='${InterpretationSign}',resultDate='${dateAndTime} ${time}',ResultStatus=1 where orderId='${rowdata.orderId}' AND parentId='${rowdata.parentId}' AND LoincNO='${rowdata.LoincNO}';`
   //console.log(command);
   execCommand(command) 
   .then(result => res.json('success'))
   .catch(err => logWriter(command, err));
      
  })


 router.post('/getTransactionLabOrderwithFavorites',(req,res)=>{
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  // //console.log('Getloinic',text);
  const command =`select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' AND favorites=1 group by ParentName,orderId;`;
//console.log('orderfor________',command);
   
  execCommand(command) 
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})


router.get('/getmaster_interpreatation',(req,res)=>{
  //console.log(req.body);

  const command =`select *  from master_interpreatation;`;
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})

router.post('/ResultSignByDoctors', (req,res)=>{
  //console.log('-----REq-----',req.body);
var resultedData=req.body.resultData
 var Reviewer=req.body.formData.Reviewer;
 var InterpretationSign=req.body.formData.InterpretationSign
 var InternalComments=req.body.formData.InternalComments
  let i = 0;
      (function loop(){
        if (i < resultedData.length) {
         var command = ''
           command = `update transaction_lab_order set sign=1, Reviewer='${Reviewer}',InterpretationSign='${InterpretationSign}',InternalComments='${InternalComments}' where orderId='${resultedData[i].orderId}' AND parentId='${resultedData[i].parentId}' AND LoincNO='${resultedData[i].LoincNO}';`
   //console.log(command);
          
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
     
 
 })
 router.post('/InsertPdfPath', (req,res)=>{
  // //console.log('-----REq-----',req.body);
let fullPath=req.body.fullpath.replace(/\\/g,'/')
// //console.log("fullPath",fullPath);
var uploadFileRowData=req.body.uploadFileRowData
        
        var   command = `update transaction_lab_order set pdfPath='${fullPath}',pdfStatus='1' where orderId='${uploadFileRowData.orderId}' AND parentId='${uploadFileRowData.parentId}' AND LoincNO='${uploadFileRowData.LoincNO}';`
   //console.log(command);
          
   execCommand(command)
   .then(result => res.json('success'))
   .catch(err => logWriter(command, err));
    
     
 
 })


router.get('/getMaster_Frequencyorder', (req,res)=>{
  const command =`Select * from master_frequency`;
   execCommand(command)
   .then(result => res.json(result))
   .catch(err => logWriter(command, err));
})

router.post('/UpdateLabOrder', (req,res)=>{
  //console.log('-----REq-----',req.body);
var FormData=req.body.formData
var uploadFileRowData=req.body.ORDERdata
var convertedDate = new Date(req.body.formData.Time_Stamp);
//  //console.log('+++++++=======>',convertedDate)

 let isoDate = convertedDate;
 var d = new Date(isoDate);
 let time=d.toLocaleTimeString('en-GB');
// //console.log("================================================",d.toLocaleDateString('en-GB') ,d.toLocaleTimeString('en-GB')); // dd/mm/yyyy
let dateFor = d.toLocaleDateString('en-GB');
let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}` 
        var   command = `update transaction_lab_order set Priority='${FormData.Priority}',Frequency='${FormData.Frequency}',Time_Stamp='${databaseDate} ${time}',LabName='${FormData.LabName}',Indication='${FormData.Indication.term}',NotesToLab='${FormData.NotesToLab}' where orderId='${uploadFileRowData.orderId}' AND parentId='${uploadFileRowData.parentId}' AND LoincNO='${uploadFileRowData.LoincNO}';`
   //console.log(command);
          
   execCommand(command)
   .then(result => res.json('success'))
   .catch(err => logWriter(command, err));
    
     
 
 })
 router.post('/DeleteLabOrder', (req,res)=>{
  //console.log('-----REq-----',req.body);
var resultedData=req.body.data
 
  let i = 0;
      (function loop(){
        if (i < resultedData.length) {
         var command = ''
           command = `Delete from transaction_lab_order  where orderId='${resultedData[i].orderId}' AND parentId='${resultedData[i].parentId}' AND LoincNO='${resultedData[i].LoincNO}';`
   //console.log(command);
          
          execCommand(command)
            .then(() => {
              i++; 
              loop()
            })
            .catch(err => logWriter(command, err));
        }
        else{
          res.json('Delete')
        }
      }())
     
 
 })

 router.post('/favoriteslaborder', (req,res)=>{
  //console.log('-----REq-----',req.body);
var resultedData=req.body.data
 
  let i = 0;
      (function loop(){
        if (i < resultedData.length) {
         var command = ''
           command = `update loincuniversal set favorites='1'  where LOINC_NUM='${resultedData[i].LoincNO}';`
   //console.log(command);
          
          execCommand(command)
            .then(() => {
              i++; 
              loop()
            })
            .catch(err => logWriter(command, err));
        }
        else{
          res.json('favorites')
        }
      }())
     
 
 })


 router.get('/getLabClass',(req,res)=>{
  //console.log(req.body);

  const command =`SELECT  *  FROM loincuniversal  group by class;SELECT  *  FROM loincuniversal where class='Labs' group by Lab_Section_Display_Name;SELECT  *  FROM loincuniversal where class='RAD' group by Lab_Section_Display_Name;SELECT  *  FROM loincuniversal where class='Systems' group by Lab_Section_Display_Name;SELECT  *  FROM loincuniversal where class='Communication' group by Lab_Section_Display_Name;`;
   
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

  
})

router.post('/getTransactionLabOrderLABS',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='Microbiology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Biochemistry' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='DRUG/Toxicology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Blood Bank' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Immunology/Serology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Hematology /Flowcytometry' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Histo/Cytopathology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Molecular Pathology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Other' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Clinical Pathology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'   AND Lab_Section_Display_Name='Fertility' group by ParentName,orderId;;`;

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})

router.post('/getTransactionLabOrderLABSForTrackBoards',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'  AND class='Labs'  group by ParentName,orderId;select *  from  transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' and class='Labs' group by Lab_Section_Display_Name;`;

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})

router.post('/getTransactionLabOrderRADsForTrackBoards',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'  AND class='RAD';select *  from  transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' and class='RAD' group by Lab_Section_Display_Name;`;

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.post('/getTransactionLabOrderSystemForTrackBoards',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'  AND class='Systems';select *  from  transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' and class='Systems' group by Lab_Section_Display_Name;`;

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.post('/getTransactionLabOrderForConsultationTrackBoards',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'  AND class='Communication';select *  from  transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}' and class='Communication' group by Lab_Section_Display_Name;`;

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})

router.post('/getTransactionLabOrderRADs',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='MR' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='MG' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='CT' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='XR' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='RF' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='Image guided procedures' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='NM' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='PT' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='DXA' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='US' group by ParentName,orderId;`;

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})

router.post('/getTransactionLabOrderSystems',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='OBGYN' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='Pulmonary' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='Cardiology' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='Eye' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='GI' group by ParentName,orderId;
  select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'    AND Lab_Section_Display_Name='Neurology' group by ParentName,orderId;`;
//console.log('fgtry',command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.post('/getTransactionLabOrderConsultations',(req,res)=>{
  //console.log(req.body);
 
  var hospital_id=req.body.hospitalId;
  var branch_id=req.body.branchId
  var patient_id=req.body.patientID
 
  const command = `select * from transaction_lab_order where hospitalId='${hospital_id}' AND BranchID='${branch_id}' AND PatientID='${patient_id}'  AND class='Communication'  AND Lab_Section_Display_Name='Consultations' group by ParentName,orderId;`;
  //console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})

router.get('/getQuickOrderData',(req,res)=>{
  // //console.log(req.body);
 
  // var hospital_id=req.body.hospitalId;
  // var branch_id=req.body.branchId
  // var patient_id=req.body.patientID
 
  const command = `select * from loincuniversal where quickOrder='1' AND class='Labs' group by quickOrder_header;select * from loincuniversal where quickOrder='1' AND class='Labs';`;
  //console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})

router.get('/getQuickOrderDataRAD',(req,res)=>{
  // //console.log(req.body);
 
  // var hospital_id=req.body.hospitalId;
  // var branch_id=req.body.branchId
  // var patient_id=req.body.patientID
 
  const command = `select * from loincuniversal where quickOrder='1' AND class='RAD' group by quickOrder_header;select * from loincuniversal where quickOrder='1' AND class='RAD';`;
  //console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.get('/getQuickOrderDataSystem',(req,res)=>{
  // //console.log(req.body);
 
  // var hospital_id=req.body.hospitalId;
  // var branch_id=req.body.branchId
  // var patient_id=req.body.patientID
 
  const command = `select * from loincuniversal where quickOrder='1' AND class='Systems' group by quickOrder_header;select * from loincuniversal where quickOrder='1' AND class='Systems';`;
  //console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.get('/getQuickOrderDataCommunications',(req,res)=>{
  // //console.log(req.body);
 
  // var hospital_id=req.body.hospitalId;
  // var branch_id=req.body.branchId
  // var patient_id=req.body.patientID
 
  const command = `select * from loincuniversal where quickOrder='1' AND class='Communication' group by quickOrder_header;select * from loincuniversal where quickOrder='1' AND class='Communication';`;
  //console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.get('/getQuickOrderDatafavorites',(req,res)=>{
  // //console.log(req.body);
 
  // var hospital_id=req.body.hospitalId;
  // var branch_id=req.body.branchId
  // var patient_id=req.body.patientID
 
  const command = `select * from loincuniversal where favorites='1';`;
  //console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));

  
})
router.post("/QuickLabOrder", (req, res) => {
  //console.log(req.body);
  var hospital_id = req.body.hospital_id;
  var branchId = req.body.branchId;
  var patientguid = req.body.patientguid;
  var orderId = newGuid();

  var d = new Date();
  d.setMonth(d.getMonth() + 1);
  let time = d.toLocaleTimeString("en-GB");
  let dateFor = d.toLocaleDateString("en-GB");
  let databaseDate = `${dateFor.split("/")[2]}-${dateFor.split("/")[1]}-${dateFor.split("/")[0]}`;

  //console.log(databaseDate, time);

  let labOrderDetails
  let orderplacedonly
  if(req.body.orderplaced?.length>1){
    labOrderDetails= req.body.orderplaced;
  }else{
    orderplacedonly = req.body.orderplaced;
  }

  // //console.log(orderplacedonly.length, "length");
  //console.log(labOrderDetails, "length1");

  let i = 1;
  (function loop() {
    if (i < labOrderDetails?.length) {
      var command = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName,Lab_Section_Display_Name,lab_section_full_Name,class, parentId, LoincNO,type,ParentName,orderId, TransactionTime,expiry)
        VALUES ('${hospital_id}','${branchId}','${patientguid}','${labOrderDetails[i].TestNameLoinc}','${labOrderDetails[i].TestNameLoinc}','${labOrderDetails[i].DisplayName}','${labOrderDetails[i].class}','${labOrderDetails[i].panel_id}','${labOrderDetails[i].panelsName}','Panel','${labOrderDetails[i].panelsName}','${orderId}', now(),'${databaseDate} ${time}');`;
      execCommand(command)
        .then(() => {
          i++;
          loop();
        })
        .catch((err) => logWriter(command, err));
    } else {
      var j = 0;
      (function loop2() {
        //console.log(orderplacedonly?.length);
        if (j < orderplacedonly?.length) {
          var command2 = `insert into transaction_lab_order(hospitalId, BranchID, PatientID, labOrderName,Lab_Section_Display_Name,lab_section_full_Name,class,parentId, LoincNO,type,ParentName,orderId,TransactionTime,expiry)
            VALUES ('${hospital_id}','${branchId}','${patientguid}','${orderplacedonly[j].TestNameLoinc}','${orderplacedonly[j].Department}','${orderplacedonly[j].Department}','${orderplacedonly[j].class}','${orderplacedonly[j].LOINC_NUM}','${orderplacedonly[j].LOINC_NUM}','Order','${orderplacedonly[j].TestNameLoinc}','${orderId}',now(),'${databaseDate} ${time}');`;
          //console.log(command2);
            execCommand(command2)
            .then(() => {
              j++;
              loop2();
            })
            .catch((err) => logWriter(command2, err));
        } else {
          res.json("success"); // Send response here
        }
      })();
    }
  })();
});

function formatDate(dateToBeFormatted){
  if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
      var convertedDate = new Date(dateToBeFormatted)
      let isoDate = convertedDate;
      var d = new Date(isoDate);
      let time = d.toLocaleTimeString('en-GB');
      let timeWithoutSeconds = time.slice(0, 5);
      let timeWithoutSecondsFormatted = timeWithoutSeconds.split(':').join('');
     let dateFor = d.toLocaleDateString('en-GB');
     let databaseDate = `${dateFor.split('/')[0]}-${dateFor.split('/')[1]}-${dateFor.split('/')[2]}`
      return databaseDate
  }
  else{
      return ''
  }
}

router.post('/Insert_master_lab_service', (req, res) => {

  //console.log(req.body, 'ssssssssss');
  const adress=req.body.adress
  const select_option = req.body.value?.selectedOption;
  const supliernames = req.body.value?.labName;
  const company_name = req.body.value?.company_name?.id;
  const adress_types = req.body.value?.adress_type;
  const adressline1 = req.body.value?.adressline1;
  const adressline2 = req.body.value?.adressline2;
  const countryname_id = req.body.value?.Country.countrycode;
  const countr_id = req.body.value.Country?.Country;
  const state_name = req.body.value?.states_name;
  const district_name = req.body.value?.District;
  const postal_code = req.body.value?.Postal_Code?.postalcode;
  const postal_code_id = req.body.value?.Postal_Code.id;
  const tax_id = req.body.value?.taxid;
  const pannumber = req.body.value?.pannumber;
  const jobpostion = req.body.value?.jobpostion;
  const email = req.body.value?.emailid;
  const workphone = req.body.value?.Work_Phone;
  const workcode = req.body.value?.workcode;
  const fax = req.body.value?.fax;
  const mobile = req.body.value?.mobile;
  const mobilecode = req.body.value?.mobilecode;
  const websitename = req.body.value?.websitename;
  const title_id = req.body.value?.title_id;
  const tags = req.body.value?.tags;
  const id = req.body.value?.id;
   var hospital_id=req.body.hospitalData.guid
   var branchId   =req.body.hospitalData.branchId
   var typeService=req.body.typeService
   var command = '';
  if(id=='' || id==null || id==undefined){
    const returnmessage = "S";

 

    let i = 0;
   command = `INSERT INTO master_lab_service(typeService,hospitalId,branch_id,selectedoption, labName, company_name, adress_type, adressline1, adressline2, countrycode, state_name,District, postal_code, taxid,pannumber,jobpostion, emailid, work_phone, work_code, fax, mobile, mobilecode, websitename, title_id, tags,Country,postal_id)VALUES ('${typeService}','${hospital_id}','${branchId}','${select_option}','${supliernames}', '${company_name}','${adress_types}','${adressline1}','${adressline2}','${countryname_id}','${state_name}','${district_name}','${postal_code}','${tax_id}','${pannumber}','${jobpostion}','${email}','${workphone}','${workcode}','${fax}','${mobile}','${mobilecode}','${websitename}','${title_id}','${tags}','${countr_id}','${postal_code_id}')`;
//console.log(command);
  execCommand(command)
  
    .then(result => {

      if (result) {
        let i = 0;
        (function loop() {
          if (i < adress.length) {
		      const contactname = adress[i]?.contactname;
            const countryname = adress[i]?.Country;
            const statename = adress[i]?.states_name;
            const districts = adress[i]?.District;
            const postal = adress[i]?.postal_Code;
            const email = adress[i]?.email;
            const phone = adress[i]?.phone;
            const mobile = adress[i]?.mobile;
            const country_code = adress[i]?.countrycode;
            const postal_id = adress[i]?.postal_id;
            const street1 = adress[i]?.street;
            const street2 = adress[i]?.street2;

            // const form_status=adress[i]?.formStatus


		  
             command = `INSERT INTO master_lab_contact(contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${result?.insertId}','${country_code}','${postal_id}','${street1}','${street2}')`;
            //console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('S')
          }
        }())
      }
    })
  }else{


    let i = 0;
   command =`UPDATE master_lab_service SET selectedoption='${select_option}', labName='${supliernames}', company_name='${company_name}', adress_type='${adress_types}', 
      adressline1='${adressline1}', adressline2='${adressline2}', countrycode='${countryname_id}', state_name='${state_name}',District='${district_name}', postal_code='${postal_code}', 
      taxid='${tax_id}', pannumber='${pannumber}', jobpostion='${jobpostion}', emailid='${email}', work_phone='${workphone}', work_code='${workcode}', fax='${fax}', mobile='${mobile}', 
      mobilecode='${mobilecode}', websitename='${websitename}', title_id='${title_id}', tags='${tags}', Country='${countr_id}', postal_id='${postal_code_id}' WHERE id='${id}'`;
////console.log(command);
  execCommand(command)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          
          if (i < adress.length) {

            const contactname = adress[i]?.contactname;
            const countryname = adress[i]?.Country;
            const statename = adress[i]?.states_name;
            const districts = adress[i]?.District;
            const postal = adress[i]?.postal_Code;
            const email = adress[i]?.email;
            const phone = adress[i]?.phone;
            const mobile = adress[i]?.mobile;
            const country_code = adress[i]?.countrycode;
            const postal_id = adress[i]?.postal_id;
            const street1 = adress[i]?.street;
            const street2 = adress[i]?.street2;
            const adress_form=adress[i]?.formStatus
           const  suplier_id_id=adress[i]?.suplier_id

            if(adress_form !==undefined){
               command = `INSERT INTO master_lab_contact (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${id}','${country_code}','${postal_id}','${street1}','${street2}')`;

              execCommand(command)
            }if(suplier_id_id !==undefined) {

              command=`delete from master_lab_contact where id='${adress[i].id}' `
              execCommand(command)

               command = `INSERT INTO master_lab_contact (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${adress[i].suplier_id}','${country_code}','${postal_id}','${street1}','${street2}')`;
              // const command = `UPDATE master_lab_contact SET contactname='${contactname}', Country='${countryname}',states_name='${statename}',District='${districts}',postal_Code='${postal}',email='${email}',phone='${phone}',mobile='${mobile}',suplier_id='${id_suplier_id}',countrycode='${country_code}',postal_id='${postal_id}',street='${street1}',street2='${street2}' WHERE id='${multiple_id_contact}';`;
              ////console.log(command);
              execCommand(command)
              .then(() => {


                i++;
                loop()
              })  
              .then(result => res.json('U'))

              .catch(err => logWriter(command, err));

          }
        }
        else{
          res.json('U')
        }
        }())
        
      }
    })

  }

  });

  router.post('/activestatus_customizedlab', (req,res)=>{
  

    var id=req.body.id;
    var status=req.body.status;
  
    const command =`Update master_lab_service set active='${status}' where id='${id}';`;
  
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
   
  
  })
  router.post('/get_master_lab_serviceapi', (req, res) => {
    var hospital_id=req.body.hospitalData.guid
   var branchId   =req.body.hospitalData.branchId
   var typeService=req.body.typeService
    const command = `SELECT * FROM master_lab_service WHERE ( hospitalId = '${hospital_id}' AND  branch_id = '${branchId}' AND typeService = '${typeService}') OR (hospitalId = '' AND branch_id = '' AND typeService = '${typeService}');`;
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });

  router.post('/get_master_lab_serviceforpanelsapi', (req, res) => {
    var hospital_id=req.body.hospitalData.guid
   var branchId   =req.body.hospitalData.branchId
  
    const command = `select * from master_lab_service where hospitalId='${hospital_id}' AND branch_id='${branchId}'`;
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });
  router.post('/getallmaster_lab_contact', (req, res) => {
    id=req.body.id
   
    const command = `select *  from  master_lab_contact  where suplier_id='${id}';`;
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });
  router.post('/labServicnameAPI', (req, res) => {
    ////console.log(req.body);
    text=req.body.text
   
    const command = `select *  from  master_lab_service  where labName like '${text}%'`;
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });
  router.post('/labucum_unitsAPI', (req, res) => {
    //console.log(req.body);
    text=req.body.text
   
    const command = `select *  from  ucum_units  where EXAMPLE_UNITS like '${text}%' group by EXAMPLE_UNITS`;
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });
  router.post('/searchLoinname',(req,res)=>{
  
    let name=req.body.text
  
    const command = `SELECT loincuniversal.LOINC_NUM, loincuniversal.LONG_COMMON_NAME FROM loincuniversal WHERE   (LONG_COMMON_NAME LIKE '${name}%' OR LOINC_NUM LIKE '%${name}%');`;
  
    // const command=`select  loincuniversal.id,loincuniversal.LONG_COMMON_NAME as names FROM loincuniversal  where class='Communication' and LONG_COMMON_NAME  LIKE'%${name}%'  ;SELECT master_procedure_history.id, master_procedure_history.name as names FROM master_procedure_history  where name LIKE '%${name}%';`
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    })
    router.post('/saveLABservice_api' ,(req, res) => {
      //console.log(req.body);
      var hospital_id=req.body.hospitalData.guid
      var branchId  =req.body.hospitalData.branchId
      var Service_Labid = req.body.formtotalvalue?.Service_Labname.id
      var Service_Labname = req.body.formtotalvalue?.Service_Labname.labName
      var categeory_names = req.body.formtotalvalue.categeory_name
      var Units = req.body.formtotalvalue.Units?.LOINC_NUM
      var AccountId = req.body.formtotalvalue.AccountId
      var Department = req.body.formtotalvalue.Department
      var currency = req.body.formtotalvalue.currency.id
      var currencyId = req.body.formtotalvalue.currency.id
      var display_localname = req.body.formtotalvalue.display_localname
      var local_code = req.body.formtotalvalue.local_code
      var TestNameLoinc = req.body.formtotalvalue.TestNameLoinc.LONG_COMMON_NAME
      var TestNameLoincID = req.body.formtotalvalue.TestNameLoinc.LOINC_NUM
      var CPTCode = req.body.formtotalvalue.CPTCode
      // var language_id = req.body.formtotalvalue.language_id
      // var country_name = req.body.formtotalvalue.country_name
      // var state_id = req.body.formtotalvalue.state_id
      var sales_price = req.body.formtotalvalue.sales_price
      var cost = req.body.formtotalvalue.cost
      var taxes = req.body.formtotalvalue.taxes.id
      var hsn_code = req.body.formtotalvalue.hsn_code
      var Description = req.body.formtotalvalue.Description
      var SasDescription = req.body.formtotalvalue.SasDescription
      var ReferenceRangeCustom = req.body.formtotalvalue.ReferenceRangeCustom
      var ReferenceRangeMin = req.body.formtotalvalue.ReferenceRangeMin
      var ReferenceRangeMax = req.body.formtotalvalue.ReferenceRangeMax
      var SpecimenVolume = req.body.formtotalvalue.SpecimenVolume
      var SpecimenSystem = req.body.formtotalvalue.SpecimenSystem
      var Specimencondtions = req.body.formtotalvalue.Specimencondtions
      var AOE=req.body.AoeForm.AoELab
      var id=req.body.formtotalvalue.id
      if(id=='' || id==null || id==undefined){
        const command=`insert into master_lab_test (Service_lab_id,Service_Labname, hospital_id, branch_id,LOINC_NUM, Service_catogeory, labAccount_id, Department, TestNameLoinc, DisplayName, LocalCode, CPTCode, Description, sales_price, cost, taxes, hsn_code, SasDescription, currency, ReferenceRangeCustom, ReferenceRangeMin, ReferenceRangeMax, SpecimenVolume, SpecimenSystem, Specimencondtions,Units,tranaction_time)
        values('${Service_Labid}','${Service_Labname}','${hospital_id}','${branchId}','${TestNameLoincID}','${categeory_names}','${AccountId}','${Department}','${TestNameLoinc}','${display_localname}','${local_code}','${CPTCode}','${Description}','${sales_price}','${cost}','${taxes}','${hsn_code}','${SasDescription}','${currency}','${ReferenceRangeCustom}','${ReferenceRangeMin}','${ReferenceRangeMax}','${SpecimenVolume}','${SpecimenSystem}','${Specimencondtions}','${Units}',now())`
      
        execCommand(command)
        .then(result =>{
          //console.log(AOE);
          if(result){
            var i=0;
            (function loop(){
              if(i<AOE.length){
                var command2 = `Insert into master_lab_Aoe (labTest_id, AOEQuestion, AOEoption, AOEInstruction, LOINC_NUM) values('${result.insertId}','${AOE[i].AOEQuestion}','${AOE[i].AOEoption}','${AOE[i].AOEInstruction}','${TestNameLoincID}')`;
              //console.log(command2);
                execCommand(command2)
                .then(() => {
                  i++;
                  loop();
                })
                .catch((err) => logWriter(command2, err));
            } else {
              res.json("success"); // Send response here
            }
              
              
            })()
          }
        })
        .catch(err => logWriter(command, err));
      }else{
        const command=`Update master_lab_test set Service_Labname='${Service_Labname}',LOINC_NUM='${TestNameLoincID}',Service_catogeory='${categeory_names}',labAccount_id= '${AccountId}',Department='${Department}',TestNameLoinc='${TestNameLoinc}',DisplayName='${display_localname}',LocalCode='${local_code}',CPTCode='${CPTCode}',Description='${Description}',
        sales_price='${sales_price}',cost='${cost}',taxes='${taxes}',hsn_code='${hsn_code}',SasDescription='${SasDescription}',currency='${currency}',ReferenceRangeCustom='${ReferenceRangeCustom}',ReferenceRangeMin='${ReferenceRangeMin}',ReferenceRangeMax='${ReferenceRangeMax}',SpecimenVolume='${SpecimenVolume}',SpecimenSystem='${SpecimenSystem}',Specimencondtions='${Specimencondtions}',Units='${Units}', tranaction_time=now() where id='${id}'`
      
        execCommand(command)
        .then(result =>{
          // //console.log(AOE);
          const deltecommand=`delete from master_lab_Aoe where labTest_id='${id}'`
          //console.log(deltecommand);
          execCommand(deltecommand)
          .then(result =>{
            if(result){
              var i=0;
              (function loop(){
                if(i<AOE.length){
                  var command2 = `Insert into master_lab_Aoe (labTest_id, AOEQuestion, AOEoption, AOEInstruction, LOINC_NUM) values('${id}','${AOE[i].AOEQuestion}','${AOE[i].AOEoption}','${AOE[i].AOEInstruction}','${TestNameLoincID}')`;
                //console.log(command2);
                  execCommand(command2)
                  .then(() => {
                    i++;
                    loop();
                  })
                  .catch((err) => logWriter(command2, err));
              } else {
                res.json("success"); // Send response here
              }
                
                
              })()
            }
          })
          .catch(err => logWriter(deltecommand, err));
        })
        .catch(err => logWriter(command, err));
      }
    
      
      
  });
  router.post('/getLabtestthroughLabService',(req,res)=>{
  
    let id=req.body.labId
  
    const command = `Select *,(select taxname from master_invoice_taxes where id=master_lab_test.taxes) as tax,(select EXAMPLE_UNITS from ucum_units where LOINC_NUM=master_lab_test.Units) as Unit ,(select currency from master_currency_exchange_rate where id=master_lab_test.currency) as currences from master_lab_test where Service_lab_id='${id}'`;
  
    // const command=`select  loincuniversal.id,loincuniversal.LONG_COMMON_NAME as names FROM loincuniversal  where class='Communication' and LONG_COMMON_NAME  LIKE'%${name}%'  ;SELECT master_procedure_history.id, master_procedure_history.name as names FROM master_procedure_history  where name LIKE '%${name}%';`
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    })
    router.post('/getmaster_lab_aoe',(req,res)=>{
  
      let id=req.body.testid
    
      const command = `Select * from master_lab_aoe where labTest_id='${id}'`
      // const command=`select  loincuniversal.id,loincuniversal.LONG_COMMON_NAME as names FROM loincuniversal  where class='Communication' and LONG_COMMON_NAME  LIKE'%${name}%'  ;SELECT master_procedure_history.id, master_procedure_history.name as names FROM master_procedure_history  where name LIKE '%${name}%';`
    
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
      })
    
  router.post('/satuscahnegeLabtest', (req,res)=>{

    var id=req.body.id;
    var status=req.body.status;
  
    const command =`Update master_lab_test set active='${status}' where id='${id}'`;
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })
  router.post('/getmaster_lab_departmentDataForLAbimage', (req,res)=>{
    //console.log(req.body);
    let HospitalId=req.body.hospitaldata.guid
    const command = `SELECT * FROM master_lab_department WHERE active='1' AND (HospitalId='${HospitalId}' OR HospitalId IS NULL) group by categories`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
});
router.post('/getmaster_lab_departmentDataFForAddtest', (req,res)=>{
  var HospitalId=req.body.hospitaldata?.guid
  var typeService=req.body.typeService
  if(typeService=='ImagingSystem'){
    typeService='ImagingSystem'
  }else{
    typeService='Labs'
  }
  const command = `SELECT * FROM master_lab_department where active='1'  AND categories='${typeService}' AND (HospitalId='${HospitalId}' OR HospitalId IS NULL);`;
//console.log('ghty',command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  
  
});
router.post('/GetsubDepatmentForQuickOrder', (req,res)=>{
  let HospitalId=req.body.hospitaldata.guid
  // var cateories=req.body.cateories

  const command = `SELECT * FROM master_lab_department where active='1'  AND (HospitalId='${HospitalId}' OR HospitalId IS NULL);`;
//console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  
  
});
router.post('/AddtoQuickOrderAPI', (req,res)=>{
//console.log(req.body);
var id=req.body.seletedOrderOrpanels.id
var header=req.body.rowData.headername
var command=''
if(req.body.seletedOrderOrpanels.PanelType=='Panel'){
  command = `Update master_lab_panel set quickOrder='1' ,quickOrder_header='${header}' where id='${id}'`;
}else{
  command = `Update master_lab_test set quickOrder='1' ,quickOrder_header='${header}' where id='${id}'`;
}
   
//console.log(command);
  execCommand(command)
  .then(result => res.json('Success'))
  .catch(err => logWriter(command, err));
  
  
});
router.post('/getQuickOrderAPI', (req,res)=>{
  let HospitalId=req.body.hospitalData.guid
  let branch_id=req.body.hospitalData.branchId
  // var cateories=req.body.cateories

  const command = `SELECT quickOrder_header, MAX(id) as id, MAX(PanelType) as PanelType
  FROM (
      SELECT quickOrder_header, id, PanelType
      FROM master_lab_test
      WHERE quickOrder = '1' AND hospital_id = '${HospitalId}' AND branch_id = '${branch_id}'
      GROUP BY quickOrder_header
  
      UNION
  
      SELECT quickOrder_header, id, PanelType
      FROM master_lab_panel
      WHERE quickOrder = '1' AND hospital_id = '${HospitalId}' AND branch_id = '${branch_id}'
      GROUP BY quickOrder_header
  ) AS combined_results
  GROUP BY quickOrder_header;
   SELECT DisplayName,PanelType,id,quickOrder_header from master_lab_test where quickOrder='1' AND hospital_id='${HospitalId}' AND branch_id='${branch_id}'   UNION 
   SELECT DisplayName,PanelType,id,quickOrder_header from master_lab_panel where quickOrder='1' AND hospital_id='${HospitalId}' AND branch_id='${branch_id}'`;
//console.log('Asdfhj344',command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  
  
});
router.post('/getOrderForQUickSearchAPI', (req,res)=>{
  let HospitalId=req.body.hospitalData.guid
  var branch_id=req.body.hospitalData.branchId
  var text=req.body.text
  var DiagnosticServiceId=req.body.DiagnosticServiceId
  var DefaultLabId=req.body.DefaultLabId

  const command = `select Department,TestNameLoinc,DisplayName,Service_lab_id,id,PanelType from master_lab_test where hospital_id='${HospitalId}' AND branch_id='${branch_id}'  AND (Service_lab_id='${DefaultLabId}' OR  Service_lab_id='${DiagnosticServiceId}') Like (TestNameLoinc LIKE '${text}%' OR DisplayName LIKE '${text}%') UNION
  select department as Department,PanelName as TestNameLoinc,DisplayName,Service_lab_id,id,PanelType from master_lab_panel where hospital_id='${HospitalId}' AND branch_id='${branch_id}' AND (Service_lab_id='${DefaultLabId}' OR  Service_lab_id='${DiagnosticServiceId}') Like (PanelName LIKE '${text}%' OR DisplayName LIKE '${text}%')`;
//console.log(command);
  execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command2, err));
    

 
  
});
router.post('/deletelabServiceAPI', (req,res)=>{
 
  var id=req.body.id

  const command = `Delete from master_lab_service where id='${id}'`;
//console.log(command);
  execCommand(command)
  .then(result => res.json('Delete'))
  .catch(err => logWriter(command, err));
  
  
});
router.post('/DeletelabtestAPI', (req,res)=>{
 
  var id=req.body.id

  const command = `Delete from master_lab_test where id='${id}'`;
//console.log(command);
  execCommand(command)
  .then(result => {
    if(result){
    const commandAOE=`Delete from  master_lab_aoe where labTest_id='${id}'`
    execCommand(command)
    .then(result => {res.json('Delete')
    
  })
  .catch(err => logWriter(commandAOE, err));
  }else{
    
  }
})
  .catch(err => logWriter(command, err));
  
  
});

router.post('/saerchTestNameAPI',(req,res)=>{
//console.log(req.body);
  var hospital_id=req.body.hospitalId
  var branch_id=req.body.branchId
  var text=req.body.text
  var servicingLab=req.body.servicingLab.id
  let command=`select * from master_lab_test where DisplayName like '${text}%' And hospital_id='${hospital_id}' AND  branch_id='${branch_id}' AND Service_lab_id='${servicingLab}'`
  //console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})
router.post('/serchTestnameForCreatepanels',(req,res)=>{
  //console.log(req.body);
    var hospital_id=req.body.hospitalId
    var branch_id=req.body.branchId
    var text=req.body.text
    var servicingLab=req.body.servicingLab.id
    let command=`select * from master_lab_test where DisplayName like '${text}%' or TestNameLoinc like '${text}%' And hospital_id='${hospital_id}' AND  branch_id='${branch_id}' AND Service_lab_id='${servicingLab}'`
    //console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  })
router.post('/savepanels', (req, res) => {
  //console.log(req.body);
  var servicelabID = req.body.formvalue.Service_Labname
  var display_localname = req.body.formvalue.display_localname
  var Service_Labname = req.body.formvalue.Service_Labname
  var local_code = req.body.formvalue.local_code
  var PanelName = req.body.formvalue.PanelName
  var Description = req.body.formvalue.Description
  var sales_price = req.body.formvalue.sales_price
  var cost = req.body.formvalue.cost
  var taxes = req.body.formvalue.taxes.id
  var currency = req.body.formvalue.currency.id
  var hsn_code = req.body.formvalue.hsn_code
  var SasDescription = req.body.formvalue.SasDescription
  var id = req.body.formvalue.id
  var branch_id=req.body.branchId
  var hospitalId=req.body.hospitalId
  var department=req.body.formvalue.Department
  var respone='success'
  var command=``
  if(id==null || id==undefined && id==''){
     command = `Insert into  master_lab_panel(branch_id,hospital_id,Service_lab_id,Service_Labname,PanelName, DisplayName, LocalCode, Description, Sale_price, Cost, taxes, HSNSAC_code, HSNsac, Currency,transaction_time,department) 
    values('${branch_id}','${hospitalId}','${servicelabID}','${Service_Labname}','${PanelName}','${display_localname}','${local_code}','${Description}','${sales_price}','${cost}','${taxes}','${hsn_code}','${SasDescription}','${currency}',now(),'${department}')`
    //console.log(command);

  }else{
    
    command=`update master_lab_panel set Service_Labname='${Service_Labname}',PanelName='${PanelName}',DisplayName='${display_localname}',LocalCode='${local_code}',Description='${Description}',Sale_price='${sales_price}',Cost='${cost}',taxes='${taxes}',HSNSAC_code='${hsn_code}',Currency='${currency}',department='${department}',transaction_time=now() where id='${id}'`
    respone='update'
  }

  execCommand(command)
    .then(result => res.json(respone))
    .catch(err => logWriter(command, err));
})
  router.post('/getAllpanels',(req,res)=>{
    //console.log(req.body);
    var hospital_id=req.body.hospitalId
    var branch_id=req.body.branchId
      var command=`select *,(select labName from master_lab_service where id=master_lab_panel.Service_lab_id) as Service_Lab,(select taxname from master_invoice_taxes where id=master_lab_panel.taxes) as tax,(select currency from master_currency_exchange_rate where id=master_lab_panel.currency) as currences from master_lab_panel where   hospital_id='${hospital_id}' AND branch_id='${branch_id}'`
      //console.log(command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
    })

    router.post('/Savemaster_lab_panels_testAPI' ,(req, res) => {
      //console.log(req.body);
      var hospital_id=req.body.hospitalData.guid
      var branchId  =req.body.hospitalData.branchId
      var Service_Labid = req.body.formtotalvalue?.Service_Labname.id
      var Service_Labname = req.body.formtotalvalue?.Service_Labname.labName
      var display_localname = req.body.formtotalvalue.TestNameLoinc.DisplayName
      var local_code = req.body.formtotalvalue.local_code
      var TestNameLoinc = req.body.formtotalvalue.TestNameLoinc.TestNameLoinc
      var Department=req.body.formtotalvalue.Department
      var TestNameLoincID = req.body.formtotalvalue.TestNameLoinc.LOINC_NUM
      var id=req.body.formtotalvalue.i
      var panelId=req.body.panelstestData.id
      var panelsName=req.body.panelstestData.DisplayName
      var id= req.body.formtotalvalue.id
      var command=``
      if(id==undefined || id==null || id == ''){
        command=`insert into master_lab_panels_test (Service_lab_id,Service_Labname, hospital_id, branch_id,LOINC_NUM,TestNameLoinc, DisplayName,tranaction_time,panel_id,panelsName,Department)
        values('${Service_Labid}','${Service_Labname}','${hospital_id}','${branchId}','${TestNameLoincID}','${TestNameLoinc}','${display_localname}',now(),'${panelId}','${panelsName}','${Department}')`
     
      }else{
        command=`Update master_lab_panels_test set TestNameLoinc='${TestNameLoinc}' ,DisplayName='${display_localname}' where id='${id}'`
      }
     
        execCommand(command)
        .then(result =>res.json('success'))
        .catch(err => logWriter(command, err));
     
      
      
  });

  router.post('/getmasterlabtestPanels',(req,res)=>{
  
    let id=req.body.panelsId
  
    const command = `Select *,(select taxname from master_invoice_taxes where id=master_lab_panels_test.taxes) as tax,(select EXAMPLE_UNITS from ucum_units where LOINC_NUM=master_lab_panels_test.Units) as Unit ,(select Department from master_lab_department where id=master_lab_panels_test.Department) as DepartmentName,(select currency from master_currency_exchange_rate where id=master_lab_panels_test.currency) as currences from master_lab_panels_test where panel_id='${id}'`;
  
    // const command=`select  loincuniversal.id,loincuniversal.LONG_COMMON_NAME as names FROM loincuniversal  where class='Communication' and LONG_COMMON_NAME  LIKE'%${name}%'  ;SELECT master_procedure_history.id, master_procedure_history.name as names FROM master_procedure_history  where name LIKE '%${name}%';`
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    })
    router.post('/satuschangeLabPanelstest', (req,res)=>{

      var id=req.body.id;
      var status=req.body.status;
    
      const command =`Update master_lab_panels_test set active='${status}' where id='${id}'`;
    
      execCommand(command)
      
      .catch(err => logWriter(command, err));
     
    
    })
    router.post('/satuscahnegeLabpANEL', (req,res)=>{
      var id=req.body.id;
      var status=req.body.status;
      const command =`Update master_lab_panel set active='${status}' where id='${id}'`;
      execCommand(command)
      .then(result => res.json('Delete'))
      .catch(err => logWriter(command, err));

    
    })
    router.post('/DeletelabtestAPI', (req,res)=>{
 
      var id=req.body.id
    
      const command = `Delete from master_lab_panels_test where id='${id}'`;
    //console.log(command);
      execCommand(command)
      .then(result => res.json('Delete'))
      .catch(err => logWriter(command, err));
    
    })
      
      
    router.post('/DeletelabPanelAPI', (req,res)=>{
 
      var id=req.body.id
    
      const command = `Delete from master_lab_panel where id='${id}'`;
    //console.log(command);
      execCommand(command)
      .then(result => res.json('Delete'))
      .catch(err => logWriter(command, err));
    
    }) 
    router.post('/saveHeadeOfQuickOrderAPI', (req,res)=>{
 //console.log(req.body);
 var headerValue=req.body.headerValue
 var hospital_id=req.body.hospitalData.guid
 var branchId=req.body.hospitalData.branchId
      const command = `Insert into quick_order_header (headername,hospital_id,branch_id) values('${headerValue}','${hospital_id}','${branchId}')`;
    //console.log(command);
      execCommand(command)
      .then(result => res.json('success'))
      .catch(err => logWriter(command, err));
    
    }) 
    router.post('/getQuickOrderWithHeader', (req,res)=>{
      //console.log(req.body);
     
      var hospital_id=req.body.hospitalData.guid
      var branchId=req.body.hospitalData.branchId
      var labserviceId=req.body.labserviceId
      var DiagnosticServiceId=req.body.DiagnosticServiceId
      const command = `SELECT * FROM quick_order_header WHERE hospital_id = '${hospital_id}' AND branch_id = '${branchId}';
      
      SELECT DisplayName,PanelType,id FROM master_lab_panel where hospital_id= '${hospital_id}' AND branch_id='${branchId}' AND Service_lab_id='${labserviceId}'
      UNION
      SELECT DisplayName,PanelType,id FROM master_lab_test  where hospital_id= '${hospital_id}' AND branch_id='${branchId}' AND Service_lab_id='${labserviceId}'`;        
       //console.log('headervalue',command);
           execCommand(command)
           .then(result => res.json(result))
           .catch(err => logWriter(command, err));
         
         }) 
         router.post('/setDefaultlabAPI', (req,res)=>{
          //console.log(req.body);
          var hospital_id=req.body.Hospital_data.guid
          var branch_id=req.body.Hospital_data.branchId
          var labServicesId =req.body.labServices
          const command = `select count(*) as count from hospital_preferance where Hospital_id='${hospital_id}'  AND branch_id='${branch_id}' AND type = 'Lab'`
          execCommand(command)
          .then(result => {
            //console.log(result[0].count);
            if(result[0].count==0){
             var  command2 = `Insert into hospital_preferance (Hospital_id, branch_id, default_id, type) values('${hospital_id}','${branch_id}','${labServicesId}','Lab');`
            
            }else{
               command2 = `Update hospital_preferance set  default_id='${labServicesId}' where Hospital_id='${hospital_id}'  AND branch_id='${branch_id}' AND type='Lab';`

            }
            execCommand(command2)
            .then(result=>res.json({msg:'success',LabID:labServicesId}))
            .catch(err => logWriter(command2, err));
          })
          .catch(err => logWriter(command, err));
        
        }) 
        router.post('/setDefaultImagesAPI', (req,res)=>{
          //console.log(req.body);
          var hospital_id=req.body.Hospital_data.guid
          var branch_id=req.body.Hospital_data.branchId
          var labServicesId =req.body.labServices
          const command = `select count(*) as count from hospital_preferance where Hospital_id='${hospital_id}'  AND branch_id='${branch_id}' AND type = 'ImagingSystem'`
          execCommand(command)
          .then(result => {
            //console.log(result[0].count);
            if(result[0].count==0){
             var  command2 = `Insert into hospital_preferance (Hospital_id, branch_id, default_id, type) values('${hospital_id}','${branch_id}','${labServicesId}','ImagingSystem');`
            
            }else{
               command2 = `Update hospital_preferance set  default_id='${labServicesId}' where Hospital_id='${hospital_id}'  AND branch_id='${branch_id}' AND type='ImagingSystem';`

            }
            execCommand(command2)
            .then(result=>res.json({msg:'success',LabID:labServicesId}))
            .catch(err => logWriter(command2, err));
          })
          .catch(err => logWriter(command, err));
        
        })
        router.post('/get_master_lab_serviceapi', (req, res) => {
          var hospital_id=req.body.hospitalData.guid
         var branchId   =req.body.hospitalData.branchId
         var typeService=req.body.typeService
          const command = `select * from master_lab_service where hospitalId='${hospital_id}' AND branch_id='${branchId}' AND typeService='${typeService}'`;
        
        
          execCommand(command)
        
            .then(result => res.json(result))
            .catch(err => logWriter(command, err));
        });
        router.post('/getlabandImegesfordefaultChooses', (req, res) => {
          var hospital_id=req.body.hospitalId
          var branchId =req.body.branchId
          const command = `select * from hospital_preferance where Hospital_id='${hospital_id}' AND branch_id='${branchId}' AND type='Lab';select * from hospital_preferance where Hospital_id='${hospital_id}' AND branch_id='${branchId}' AND type='ImagingSystem';`;
        
          //console.log(command,'kumargh')
          execCommand(command)
        
            .then(result => res.json(result))
            .catch(err => logWriter(command, err));
        });
module.exports = router;