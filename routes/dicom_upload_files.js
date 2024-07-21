const express = require("express");
const router = express.Router();
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // console.log("file2", req.files);
    let destinationPath = file.originalname;
    if (!fs.existsSync(destinationPath.split('/').splice(0, destinationPath.split('/').length-1).join('/'))) {
      await fs.mkdir(destinationPath.split('/').splice(0, destinationPath.split('/').length-1).join('/'), { recursive: true }, (err) => {
        cb(null, destinationPath.split('/').splice(0, destinationPath.split('/').length-1).join('/'));
      });
    } else {
      cb(null, destinationPath.split('/').splice(0, destinationPath.split('/').length-1).join('/'));
    }
  },

  filename: function (req, file, cb) {
    let originalname = file.originalname;
    cb(null, originalname.split('/').splice(-1)[0]);
  },
});
const upload = multer({ storage: storage, preservePath: true });

router.post("/UPLOAD_DICOM_FILES_MULTER", function (req, res) {
  upload.array("DICOM_FILES")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("err", err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("err2", err);
    } else {
      res.json("success")
    }
  });
});

router.post("/UPLOAD_DICOM_FILES_PATH", (req, res) => {
  let {uploadFilesPathUnique,uploadDetails} = req.body;
  if(uploadFilesPathUnique.length>0){
    for (let i = 0; i < uploadFilesPathUnique.length; i++) {
     
      let sql = `INSERT INTO dcm_directory_path (patient_id, patient_name,medical_test_date, medical_test,  directory_path, upload_date) 
      VALUES ('${uploadDetails[0]}','${uploadDetails[1]}','${uploadDetails[2]}','${uploadDetails[3]}','${uploadFilesPathUnique[i]}', now());`
    
      execCommand(command)
      .then((result) => {
        if(i == uploadFilesPathUnique.length-1){
          res.json('File Path Inserted Into Database')
        }
      })
      .catch(err => logWriter(command, err));

    } 
  }
});

// getPatientFordashBoard
router.post("/getPatientFordashBoard", async (req, res) => {
  var hospitalId = req.body.HospitalId
  var branchId = req.body.BranchId
  var patientID=req.body.PatientId
  console.log('hit for patient');
  let command = `SELECT mp.*,patientcontact.*,
  DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), mp.dateOfBirth)), '%Y') + 0 AS age,
  patientcontact.emailId1 as email_id,
  g.gender as sex,
  bg.bloodGroup,  mcc.Country
FROM master_patient AS mp LEFT JOIN patientcontact ON mp.guid = patientcontact.patient_id LEFT JOIN master_country_code1 AS mcc ON patientcontact.country = mcc.countrycode LEFT JOIN
  blood_group AS bg ON mp.bloodGroup = bg.conceptId
  LEFT JOIN
  gender AS g ON mp.sex = g.conceptId WHERE
  mp.guid = '${patientID}'
  AND mp.hospitalId = '${hospitalId}'
  AND mp.branchId = '${branchId}';`;
// console.log(command,'asssssssssssssssssssssssssssssssssssssssssssssss');
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});


router.post("/PATIENT_DETAILS", async (req, res) => {
  var hospitalId = req.body.hospitalId
  var branchId = req.body.branchId
  console.log('hit for patient');
  let command = `SELECT 
  mp.*,
  CONCAT(prefix, ' ', completeName) AS CompleteNames,
  DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), mp.dateOfBirth)), '%Y') + 0 AS age,
  (SELECT maritalStatus FROM merital_status WHERE conceptId = mp.maritalStatus) AS maritalStatusName,
  (SELECT emailId1 FROM patientcontact WHERE patient_id = mp.guid) AS email_id,
  (SELECT gender FROM gender WHERE conceptId = mp.sex) AS sex,
  (SELECT bloodGroup FROM blood_group WHERE conceptId = mp.bloodGroup) AS bloodGroup,
  (
    SELECT count(distinct orderid)
    FROM transaction_lab_order 
    WHERE PatientID = mp.guid and class='Labs' group by PatientID
) AS countLab,
(
  SELECT count(distinct orderid)
  FROM transaction_lab_order 
  WHERE PatientID = mp.guid and class='RAD' group by PatientID
) AS countRad,
(
  SELECT count(distinct orderid)
  FROM transaction_lab_order 
  WHERE PatientID = mp.guid and Lab_Section_Display_Name='Pulmonary' group by PatientID
) AS countPulmonary,
(
  SELECT disposition_name
  FROM transaction_disposition 
  WHERE patient_id = mp.guid order by id desc limit 1) AS disposition,
  
(
   
  SELECT count(distinct orderid)
  FROM transaction_lab_order 
  WHERE PatientID = mp.guid and Lab_Section_Display_Name='Cardiology' group by PatientID
) AS countCardiology
FROM master_patient AS mp
WHERE hospitalId = '${hospitalId}' AND branchId = '${branchId}';`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});



// router.post("/PATIENT_DETAILS", async (req, res) => {
//   var hospitalId = req.body.hospitalId
//   var branchId = req.body.branchId
//   console.log('hit for patient');
//   let command = `SELECT *, (select gender from gender where conceptId = master_patient.sex)as sex, (select bloodGroup from blood_group where conceptId = master_patient.bloodGroup)as bloodGroup FROM master_patient where hospitalId = '${hospitalId}' and branchId = '${branchId}'`;
//   execCommand(command)
//   .then(result => res.json(result))
//   .catch(err => logWriter(command, err));
// });


router.post("/getSocialHistoryTabData", async (req, res) => {
  var hospitalId = req.body.hospitalId
  var branchId = req.body.branchId;
  var patientId = req.body.patientId;

  
  let command = `select * from transaction_alcohol_and_substances_use where patientId = '${patientId}' and HospitalId = '${hospitalId}' and branchId = '${branchId}';
  SELECT * ,(select name from master_smoking_status where id=transaction_tobacco_use.Smoking_Status) as smokingStatusName FROM transaction_tobacco_use where patientId = '${patientId}' and hospital_Id = '${hospitalId}' and branchId = '${branchId}';
  SELECT * FROM transaction_sexual_history where patientId = '${patientId}' and hospitalId = '${hospitalId}' and branchId = '${branchId}';`;
console.log(command,'---------------------------');
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});


router.get('/GET_MEDICAL_TEST_LIST',(req, res)=>{

    let command = `SELECT * FROM master_medical_test WHERE category = 'DICOM'`
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/GET_PATIENT_MEDICAL_TEST_LIST',(req, res)=>{
  let {patientID} = req.body
  let command = `SELECT * FROM dcm_directory_path WHERE patient_id ='${patientID}'`
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})

router.post('/getPatientSearch',(req,res)=>{
  var text=req.body.text;
  // console.log('Getloinic',text);
  const command =`SELECT *,concat(displayName,' ','DOB',' ',dateOfBirth,' P',id) as patient FROM master_patient where  displayName like '${text}%' or completeName like '${text}%' or firstName like '${text}%' or id like '${text}%';`;

console.log(command);
   
  execCommand(command)
  .then(result => {
    res.json(result)
  })
  .catch(err => logWriter(command, err));

  
})


module.exports = router;
