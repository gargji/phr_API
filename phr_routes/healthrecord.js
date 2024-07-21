const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const { request } = require('express');
const con = require('../config/db');
const multer = require("multer");
const Globals = require('../config/configs');
const nodemailer = require('nodemailer');



// 

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aman@dnavigation.com',
    pass: 'oucbjwkqkmvyuvhv'
  }
});

var mailOptions = {
  from: 'Healaxy <aman@dnavigation.com>',
  to: '',
  subject: '',
  html: ``,
  attachments: []
};



// 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var path = Globals.baseurl + file.originalname
    path = path.substring(0, path.lastIndexOf("\\"));

    cb(null, path)
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.split('.')[1]
    console.log(ext);
    cb(null, `${file.originalname}`);
    console.log(file.originalname, "this is file name")
    return
    // const file_extention=file.originalname.split('.')[1]
    // console.log(file_extention)

  },
});

//   var upload = multer({ dest: "uploads/" });
var upload = multer({ storage: storage })
// var upload =multer({dest:"\\\\192.168.1.123\\ngdata\\kazyplayimages\\profile_img\\"})

//   var upload = multer({ storage: storage });

router.post("/file", upload.single("file"), function (req, res, next) {
  // console.log(req.file);
  const file = req.file;
  if (file) {
    res.json(req.file);
  } else throw "error";
});


// multer
router.post('/phr_patient', (req, res) => {
  var patientID = req.body.patientID

  // const command = `Select *, (select term from description_snapshot where id=transation_meditation.Indication) as IndicationName, (select name from master_dosepriority where id=transation_meditation.DosePriority) as DosePriorityName, (select name from master_drug where identifier=transation_meditation.ClinicalDrug) as ClinicalDrugName,(select name from master_frequencymedication where guid=transation_meditation.Frequency) as FrequencyName from transation_meditation where patientId='${patientID}'`;
  // const command= `Select *,tm.id as Id  ,ds.term as IndicationName,md.name as DosePriorityName,mdrung.name as ClinicalDrugName,mfm.name as FrequencyName
  // from transation_meditation tm
  // left join description_snapshot ds on ds.id = tm.Indication
  // left join master_dosepriority md on md.id = tm.DosePriority
  // left join master_drug mdrung on mdrung.identifier = tm.ClinicalDrug
  // left join master_frequencymedication mfm on mfm.guid = tm.Frequency
  // where tm.patientId='${patientID}'`

  const command = `    SELECT tm.*,
    ds.term AS IndicationName,

    md.name AS ClinicalDrugName,
    mfm.name AS FrequencyName,
    mpi.name as Instructions
          FROM transation_meditation tm
            LEFT JOIN description_snapshot ds ON ds.id = tm.Indication
        
                 LEFT JOIN master_drug md ON md.identifier = tm.ClinicalDrug
               LEFT JOIN master_frequencymedication mfm ON mfm.guid = tm.Frequency
               left JOIN master_patientinstruction mpi on mpi.id=tm.Instructionsforpatient
            WHERE tm.patientId = '${patientID}' and medication_stop !='1'and lockStatus='0' ;`

  // and lockStatus='0'
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/phr_patient_problem', (req, res) => {
  // console.log(req.body,"phr patient problem")
  var patientID = req.body.patientID
  // const command = `SELECT  id, onsetDate, problem,notes,(select term from description_snapshot where id=transaction_problem.problem)  as problem_name FROM transaction_problem where patient_id='${patientID}' ORDER BY onsetDate DESC; `
  // const command = `SELECT  * ,(select term from description_snapshot where id=transaction_problem.problem)  as problem_name FROM transaction_problem where patient_id='${patientID}' `;
  const command = `SELECT  ts.id, ts.onsetDate, ts.problem,ts.notes,ds.term as problem_name FROM transaction_problem ts
    inner join description_snapshot ds on ts.problem=ds.id  where patient_id='${patientID}'and lockStatus='0'  ORDER BY onsetDate DESC ;`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/phr_vitals', (req, res) => {
  var patientID = req.body.patientID
  const command = `Select * ,(select name from master_site where id=transaction_vitals.BP_Site)  as Sitename from transaction_vitals where PatientId='${patientID}' order by id desc`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/phr_allergies', (req, res) => {
  var patientID = req.body.patientID

  // table chnaged

  // const command = `SELECT  * ,(select display_name from master_allergens_new where id=transaction_allergies.AllergyId)  as AllergyName,(select name from master_allergy_intolerance_type where id=transaction_allergies.AllergyIntoleranceType)
  //   as Allergytype, (select name from master_severity where guid=transaction_allergies.Severity)
  //    as Severity_Name FROM transaction_allergies where patientguid='${patientID}' and lockStatus='0'  `;

  const command = `SELECT  * ,(select name from master_allergens_new where auto_id=transaction_allergies.AllergyId)  as 
    AllergyName,(select name from master_allergy_intolerance_type where id=transaction_allergies.AllergyIntoleranceType)  as Allergytype, (select name from master_severity where guid=transaction_allergies.Severity) 
    as Severity_Name FROM transaction_allergies where patientguid='${patientID}' and lockStatus='0' `


  // change for master allrgen table 
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

// for get allergen type
router.post('/phr_allergiestype', (req, res) => {
  var patientID = req.body.patientID

  const command = `select* from master_allergy_intolerance_type where active='1'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/phr_Immunizations', (req, res) => {
  var patientID = req.body.patientID
  const command = `SELECT a.uploaded_by, a.id ,Vaccine,Date_Administerd,Notes,FullVaccineName FROM master_immunisation a,master_vaccine_cvx b where b.CVXCode=a.Vaccine and a.patient_id='${patientID}' and lockStatus='0';`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/phr_planofcare', (req, res) => {
  var patientID = req.body.patientID
  const command = `Select * from transaction_vitals where patientId='${patientID}' order by id desc`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


// router.post('/phr_Immunizations', (req, res) => {
//     var patientID = req.body.patientID
//     const command = `SELECT a.Vaccine,a.Date_Administerd,b.name FROM master_immunisation a,master_vaccine b where b.id=a.Vaccine and a.patient_id='${patientID}';`

//     execCommand(command)
//         .then(result => res.json(result))
//         .catch(err => logWriter(command, err));
// });
router.post('/master_drug', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `SELECT identifier, name FROM master_drug where name like '%${text}%'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});



router.post('/submit_madiactiondata', (req, res) => {
  console.log(req.body);
  var patientID = req.body.patientID
  var medicationdata = req.body.medicationinsert.medication_insert.identifier;
  var patiend_reason = req.body.medicationinsert.Patient_reason.problem
  console.log(patiend_reason)
  // var medicationdata = req.body.medicationinsert;
  var Frequencydata = req.body.medicationinsert.Frequency_name.guid;
  var Patientinstration = req.body.medicationinsert.Patient_instration.name;
  // var dosepriority = req.body.medicationinsert.dose_priority; 
  var hospital_ID = req.body.hospital_ID
  var Branch_ID = req.body.Branch_ID
  var startnew_date = req.body.medicationinsert.start_date;
  var note = req.body.medicationinsert.note;
  var dose = req.body.medicationinsert.dose
  var dose_unit = req.body.medicationinsert.dose_unit.name
  // var startdatemed = new Date(startnew_date);
  // var medidatemed = startdatemed.toISOString().split('T')[0];

  var endnew_date = req.body.medicationinsert.End_date;
  // var enddatemed = new Date(endnew_date);
  // var medicaEnd = enddatemed.toISOString().split('T')[0];
  // var obj={
  //     patientID:patientID,
  //     medicationdata:medicationdata,
  //     Frequencydata,

  // }
  // DosePriority, '${dosepriority}',

  // CHANGES HOSPITAL ID =BRANCH AND BRANCH =HOSPITAL
  command = `INSERT INTO transation_meditation (ClinicalDrug, Frequency, Instructionsforpatient,  StartingDat, EndDate, patientId,hospitalId,branchId,notes,doseUnit,Dose,Indication,transaction_by) values ('${medicationdata}', '${Frequencydata}', "${Patientinstration}",  '${startnew_date}', '${endnew_date}', '${patientID}','${Branch_ID}','${hospital_ID}','${note}' ,'${dose_unit}','${dose}','${patiend_reason}','patient' )`;
  console.log(command)
  execCommand(command)
    .then(result => res.json({ result, success: true }))
    .catch(err => logWriter(command, err));
});

// procedure data
router.post('/submit_proceduredata', (req, res) => {
  console.log(req.body, "procedure submit data");
  var hospital_ID = req.body.hospital_ID
  var Branch_ID = req.body.Branch_ID
  var patientID = req.body.patientID
  var procedureid = req.body.proceduredata.procedure_name.id
  // console.log(procedureid)
  var note = req.body.proceduredata.note
  var start_date = req.body.proceduredata.start_date
  // console.log(note,start_date)
  // var startdatemed = new Date(start_date);
  // var proceduredate = startdatemed.toISOString().split('T')[0];
  // console.log(proceduredate)
  var IndicationForProcedure = req.body.proceduredata.procedure_indication.id
  console.log(IndicationForProcedure)

  command = `INSERT INTO transaction_procedure_history (procedur,  DatePerformed, Patientguid,hospitalId,branchId,Notes,IndicationForProcedure,recorded_by,uploaded_by) values ('${procedureid}', '${start_date}', '${patientID}',  '${hospital_ID}', '${Branch_ID}', '${note}','${IndicationForProcedure}','patient','PHR')`;

  execCommand(command)
    .then(result => res.json({ result, success: true }))
    .catch(err => logWriter(command, err));

});


// visit
router.post('/phr_visitsrecord', (req, res) => {
  var patientID = req.body.patientID
  // const command = `select * ,(select name from master_chief_complaints where id= transaction_appointment.reason_of_visit)as resionofvisit FROM transaction_appointment where patient_id='${patientID}' `;
  //   console.log(command,'Deepak Dixit Visit recored');
  // console.log(1);
  const command = `
    
    
    
    select transaction_appointment.id,transaction_appointment.visitnumber ,transaction_appointment.provider_id,transaction_appointment.patient_id ,transaction_appointment.uploaded_by,transaction_appointment.start_time,TIMESTAMPDIFF(minute, transaction_appointment.start_time, transaction_appointment.end_time) as duration, transaction_appointment.end_time,transaction_appointment.start_date,transaction_appointment.reason,  concat(provider_personal_identifiers.firstname,' ', provider_personal_identifiers.Lastname) as provider,
    master_visit_status.visit_status as visit_status,
    (select name from master_chief_complaints where id= transaction_appointment.reason_of_visit)as reason,
    master_appointment_type.appointment_type ,
    concat(hosptal_registration.addressLine1," ",hosptal_registration.district_name," ",hosptal_registration.states_name," ",hosptal_registration.Country) as location,
    
    master_patient.displayName as patient from transaction_appointment 
    inner join master_appointment_type on transaction_appointment.Appointment_type=master_appointment_type.id
    INNER JOIN 
       master_visit_status ON  transaction_appointment.visit_status=master_visit_status.id 
       inner join hosptal_registration on hosptal_registration.guid=transaction_appointment.branch_id
    inner join provider_personal_identifiers on transaction_appointment.provider_id = provider_personal_identifiers.guid 
    inner join master_patient on transaction_appointment.patient_id = master_patient.guid 
    where transaction_appointment.patient_id = '${patientID}' ORDER BY id DESC;
    `
  console.log(command)
  execCommand(command)
    .then(result => {
      // // console.log(result);
      // var temp = []
      // temp = temp.concat(result[0], result[1]);
      // console.log(temp);
      // console.log('--->', result[1]);
      res.json(result)
    })
    .catch(err => logWriter(command, err));
});

// 
router.post('/phr_requestvisit', (req, res) => {
  var patientID = req.body.patientID
  const command = `SELECT phr_reqestforvisit.id, 'Request sent' as visit_status,patient_id, start_date, 
    concat(hosptal_registration.addressLine1," ",hosptal_registration.district_name," ",hosptal_registration.states_name," ",hosptal_registration.Country) as location,
    start_time, end_time, provider_id ,master_appointment_type.Appointment_type,(select name from master_chief_complaints where id= phr_reqestforvisit.reason_of_visit)as reason,CASE
    WHEN provider_personal_identifiers.Lastname IS NOT NULL AND provider_personal_identifiers.Lastname <> '' THEN CONCAT(provider_personal_identifiers.firstname, ' ', provider_personal_identifiers.Lastname)
    ELSE provider_personal_identifiers.firstname
  END AS provider ,master_patient.displayName as patient  FROM phr_reqestforvisit  

  inner join master_appointment_type on master_appointment_type.id=phr_reqestforvisit.Appointment_type
  inner join hosptal_registration on hosptal_registration.guid=phr_reqestforvisit.branch_id
  
  INNER JOIN provider_personal_identifiers ON provider_personal_identifiers.guid = phr_reqestforvisit.provider_id inner join master_patient on phr_reqestforvisit.patient_id = master_patient.guid 
  
    WHERE patient_id='${patientID}'  `;
  console.log(command, 'Deepak Dixit Visit recored');
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/phr_visitrecorddelete', (req, res) => {
  console.log(req.body, "phr_visitrecorddelete")
  var id = req.body.id
  const command = ` delete from transaction_appointment where id= '${id}' and uploaded_by='PHR'`;
  console.log(command)
  execCommand(command)
    .then(result => {

      res.json('success');

    }
    )
    .catch(err => logWriter(command, err))
})

router.post('/phr_reqestrecorddelete', (req, res) => {
  console.log(req.body, "phr_reqestrecorddelete")
  var id = req.body.id
  const command = ` delete from phr_reqestforvisit where id= '${id}' `;
  console.log(command)
  execCommand(command)
    .then(result => {

      res.json('success');

    }
    )
    .catch(err => logWriter(command, err))
})

// visit

router.post('/getTransactionLabOrderwithResult', (req, res) => {
  var patient_id = req.body.patientID
  const command = `select * from transaction_lab_order where PatientID='${patient_id}' AND ResultStatus=1 group by ParentName,orderId;`;
  // console.log('orderfor___', command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/getTransactionLabOrderForImportResutls', (req, res) => {
  // console.log(req.body);
  var orderId = req.body.data.orderId
  var parentId = req.body.data.parentId

  const command = `select * ,(select EXAMPLE_UCUM_UNITS from ucum_units where LOINC_NUM=transaction_lab_order.LoincNO) as units ,(select ReferancerRange from panels_new where Loinc=transaction_lab_order.LoincNO) as ranges ,(select max from max_min_laborder where Loinc=transaction_lab_order.LoincNO) as max1,(select min from max_min_laborder where Loinc=transaction_lab_order.LoincNO) as min1 from transaction_lab_order where parentId='${parentId}' AND orderId='${orderId}';`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/phr_getInvestigation', (req, res) => {
  var patientID = req.body.patientID

  const command = `select * from transaction_lab_order where  PatientID='${patientID}'  group by ParentName,orderId;`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/phr_getFamiltHistory', (req, res) => {
  console.log(req.body, "get family history")
  var patientID = req.body.patientID;
  // const command = `SELECT  * ,(select term from description_snapshot where id=master_family_histary.problem)  as problem_name FROM master_family_histary where  PatientId='${patientID}'`
  const command = `select master_family_histary.uploaded_by,master_family_histary.id,master_family_histary.PatientId,master_family_histary.Age,master_family_histary.name,master_family_histary.Alive,description_snapshot.term as problem_name,master_family_histary.OnsetDate  ,master_relationshipfamily.name as relation from master_family_histary
    inner join master_relationshipfamily on master_family_histary.relation=master_relationshipfamily.id
                                inner join description_snapshot on master_family_histary.problem =description_snapshot.id
                                 where  master_family_histary.PatientId='${patientID}' and lockStatus='0';`

  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post('/phr_delete_alargye', (req, res) => {
  var patientID = req.body.patientID
  const command = `delete from transaction_allergies where id='${patientID}' AND uploded_by='PHR'`;
  execCommand(command)
    .then(result => {
      if (result.affectedRows > 0) {
        res.json('success');
      } else {
        res.json('failed');
      }
    })
    .catch(err => logWriter(command, err))
})



router.post('/phr_Patientprobl', (req, res) => {
  var patientID = req.body.patientID;
  const command = `DELETE FROM transaction_problem WHERE id='${patientID}' and uploded_by='PHR' `;

  console.log(command);

  execCommand(command)
    .then(result => {
      if (result.affectedRows > 0) {
        res.json('success');
      } else {
        res.json('failed');
      }
    })
    .catch(err => {
      logWriter(command, err);
      res.json('failed: Internal server error');
    });
});


// for delete medication
router.post('/phr_delmedication', (req, res) => {
  var patientID = req.body.patientID
  const command = `delete from transation_meditation where id='${patientID}' and transaction_by='patient'`;
  console.log(command)
  execCommand(command)
    .then(result => res.json({ result, success: true }))
    .catch(err => logWriter(command, err))
})


// router.post('/phr_editmedication', (req, res) => {
//     console.log(req.body);
//     var id = req.body.id
//     const command = `
//        `;


//     console.log(command)

//     execCommand(command)
//         .then(result => res.json(result))
//         .catch(err => logWriter(command, err))
// })
//  medication end

router.post('/phr_delprocedure', (req, res) => {
  var id = req.body.id
  const command = `delete from transaction_procedure_history where id='${id}'`;
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err))
})

router.post('/phr_editprocedure', (req, res) => {
  console.log(req.body);
  var id = req.body.id
  const command = `
        select transaction_procedure_history.IndicationForProcedure,transaction_procedure_history.id ,transaction_procedure_history.procedur,master_procedure_history.name as name,term as procedure_indication,DatePerformed as start_date,Notes as note from  transaction_procedure_history    
        inner join master_procedure_history on master_procedure_history.id=transaction_procedure_history.procedur
        inner join description_snapshot on description_snapshot.id=transaction_procedure_history.IndicationForProcedure
        where transaction_procedure_history.id='${id}'`;


  console.log(command)

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err))
})
// procedure update
router.post('/update_procedure', (req, res) => {
  console.log(req.body, "update procedure");






  var procedureid = req.body.proceduredata.procedure_name.id
  var id = req.body.id
  var note = req.body.proceduredata.note
  var start_date = req.body.proceduredata.start_date
  console.log(start_date, "sahi date ")
  // var startdatemed = new Date(start_date);
  // var proceduredate = startdatemed.toISOString().split('T')[0];
  // console.log(proceduredate)
  var IndicationForProcedure = req.body.proceduredata.procedure_indication.id
  console.log(IndicationForProcedure)

  // command = `update  transaction_procedure_history set (procedur,DatePerformed,Notes,IndicationForProcedure) values ('${procedureid}','${proceduredate}','${note}','${IndicationForProcedure}') where id='${id}'`;

  command = ` UPDATE transaction_procedure_history 
SET procedur = '${procedureid}', 
    DatePerformed = '${start_date}' ,
    Notes = '${note}', 
    IndicationForProcedure = '${IndicationForProcedure}' 
WHERE id = '${id}'`;
  console.log(command)
  execCommand(command)
    .then(result => res.json({ result, success: true }))
    .catch(err => logWriter(command, err));

});

router.post('/getTransactionLabOrderForImportResutls', (req, res) => {
  // console.log(req.body);
  var orderId = req.body.data.orderId
  var parentId = req.body.data.parentId
  const command = `select * ,(select EXAMPLE_UCUM_UNITS from ucum_units where LOINC_NUM=transaction_lab_order.LoincNO) as units ,(select ReferancerRange from panels_new where Loinc=transaction_lab_order.LoincNO) as ranges ,(select max from max_min_laborder where Loinc=transaction_lab_order.LoincNO) as max1,(select min from max_min_laborder where Loinc=transaction_lab_order.LoincNO) as min1 from transaction_lab_order where parentId='${parentId}' AND orderId='${orderId}';`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})



router.post('/submit_healthissuedata', (req, res) => {
  console.log(req.body, "submit healthissue");
  var patientID = req.body.patientID;
  var hospital_ID = req.body.hospital_ID;
  var Branch_ID = req.body.Branch_ID;
  var patientproblemdata = req.body.currenthealthinsert.healthcare_insert.id;
  var healthissue_date = req.body.currenthealthinsert.healthissue_date;
  var healthissue_note = req.body.currenthealthinsert.healthissue_note;

  // Parse the input date into a JavaScript Date object
  // var d = new Date(healthissue_date);

  // Add 5 hours and 30 minutes to the date
  // d.setHours(d.getHours() + 5);
  // d.setMinutes(d.getMinutes() + 30);

  // Format the date as 'yyyy-MM-dd HH:mm:ss'
  // var formattedDateTime = d.toISOString().slice(0, 19).replace('T', ' ');

  // console.log(formattedDateTime);

  // Insert the formatted date and time into the database

  // problem status 1 because of ehr .in ehr get problem query condition problem status is one 

  // braanch me hospital,hospital me branch because of ehr entry
  command = `INSERT INTO transaction_problem (problem, onsetDate, patient_id, hospital_id, branch_id, notes,uploded_by,problemStatus) values ('${patientproblemdata}', '${healthissue_date}', '${patientID}',  '${Branch_ID}','${hospital_ID}', '${healthissue_note}','PHR','1') `;
  console.log(command);
  execCommand(command)
    .then(result => res.json({
      result,
      success: true
    }))
    .catch(err => logWriter(command, err));

});


router.post('/healthisse', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `SELECT description_snapshot.id, description_snapshot.term FROM description_snapshot INNER JOIN extendedmapsnapshot_2 ON description_snapshot.conceptId = extendedmapsnapshot_2.referencedComponentId where  description_snapshot.typeId = '900000000000013009' and term like '${text}%' and extendedmapsnapshot_2.active = '1' order by conceptId limit 50`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/submit_allargydata', (req, res) => {
  console.log(req.body);
  var patientID = req.body.patientID
  var hospital_ID = req.body.hospital_ID
  var Branch_ID = req.body.Branch_ID
  var note = req.body.allargyinsert.note
  var Allergytype = req.body.allargyinsert.Allergytype.name
  var Allergytype1 = req.body.allargyinsert.Allergytype.id
  // var summaryAllergiesdata = req.body.allargyinsert.allargy_insert.id;    changes for new table
  var summaryAllergiesdata = req.body.allargyinsert.allargy_insert.auto_id;

  var Reaction_Serverity = req.body.allargyinsert.reaction_serverity.guid;

  var dateofonset_date = req.body.allargyinsert.dateofonsetn_date;
  console.log(dateofonset_date)
  var dateofonset = new Date(dateofonset_date);

  // start
  // const utcTime = new Date(dateofonset_date);

  // Create a new Date object with the IST offset
  // const istTime = new Date(utcTime.getTime() + (5.5 * 60 * 60 * 1000));

  // Format the IST time as a string
  // const istTimeStr = istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // console.log(istTimeStr); // Display the IST time


  // end
  // const istTime = new Date(dateofonset_date);

  // Extract year, month, and day components
  // const year = istTime.getFullYear();
  // const month = String(istTime.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  // const day = String(istTime.getDate()).padStart(2, "0");

  // Format as yyyy-mm-dd
  // const formattedDate = `${year}-${month}-${day}`;

  // console.log(formattedDate); // Display the IST time in yyyy-mm-dd format

  var utcTimeString = dateofonset_date;
  var dateofonset1 = convertUtcToIST(utcTimeString);
  console.log(dateofonset1, "function bna kr"); // Output: "2023-11-21"


  // var onsetdate = dateofonset.toISOString().split('T')[0];

  var lastoccurence_date = req.body.allargyinsert.lastoccurencen_date;
  // var dateofonset = new Date(lastoccurence_date);
  // var lastoccurence = dateofonset.toISOString().split('T')[0];
  var utcTimeString = lastoccurence_date;
  var lastoccurence = convertUtcToIST(utcTimeString);

  console.log(lastoccurence, "last date")

  command = `INSERT INTO transaction_allergies (AllergyId, Severity, DateOfOnSet, last_occurance, patientguid,hospital_id,branch_Id,notes,AllergyIntoleranceType,uploded_by) values ('${summaryAllergiesdata}', '${Reaction_Serverity}', '${dateofonset1}', '${lastoccurence}', '${patientID}','${hospital_ID}','${Branch_ID}','${note}','${Allergytype1}','PHR' )  `;

  execCommand(command)
    .then(result => res.json('Sucess'))
    .catch(err => logWriter(command, err));
});



router.post('/masterAllargy', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `select * from master_allergens_new where name like  '%${text}%'`;
  // select * from master_allergy where name like  '%${text}%'  table changed 

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});



router.post('/mastermasterImmunizations', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `select * from master_vaccine_cvx where CVXShortDescription like  '%${text}%'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/submit_Immunization', (req, res) => {
  console.log(req.body);
  var patientID = req.body.patientID
  var hospital_Id = req.body.hospital_ID
  var branch_Id = req.body.Branch_ID
  var summaryImmunizations = req.body.Immunizationsinsert.Immunizationsname_insert.CVXCode;
  var note = req.body.Immunizationsinsert.note
  var dateAdministerdnew_date = req.body.Immunizationsinsert.dateAdministerd_date;
  // var addAdministerdnew_date = new Date(dateAdministerdnew_date);
  // var AdministerdnewDate = addAdministerdnew_date.toISOString().split('T')[0];

  // var dateofonset = new Date(dateofonset_date);
  // 
  var utcTimeString = dateAdministerdnew_date;
  var AdministerdnewDate = convertUtcToIST(utcTimeString);
  console.log(AdministerdnewDate, "function bna kr");

  // 
  var manufacture = req.body.Immunizationsinsert?.manufacture?.id
  if (manufacture, note) {

  } else {
    manufacture = '',
      note = ""
  }
  // console.log(summaryImmunizations);
  command = `INSERT INTO master_immunisation (Vaccine, Date_Administerd, patient_Id,hospital_Id,branch_Id,Notes,Manufacturer,uploaded_by,status) values ('${summaryImmunizations}', '${AdministerdnewDate}', '${patientID}','${hospital_Id}','${branch_Id}' ,'${note}','${manufacture}',"PHR",'Historical')  `;

  execCommand(command)
    .then(result => res.json('Sucess'))
    .catch(err => logWriter(command, err));
});

router.post('/phr_delimmunization', (req, res) => {
  var id = req.body.id
  const command = `delete from  master_immunisation where id='${id}' 
  
`;

  // AND uploded_by='PHR'
  execCommand(command)
    .then(result => {
      if (result.affectedRows > 0) {
        res.json('success');
      } else {
        res.json('failed');
      }
    })
    .catch(err => logWriter(command, err))
})

router.post('/phr_allergy_severity', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `select * from master_severity ORDER BY name`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
// for status
router.post('/phr_family_data_status', (req, res) => {
  console.log(req.body);
  var text = req.body.text
  const command = `SELECT * FROM master_alive`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
// for family relation
router.post('/phr_family_data_relation', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `SELECT * FROM master_relationshipfamily ORDER BY name`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
// for family relation end
router.post('/phr_Med_FrequencydataShow', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `select * from master_frequencymedication ORDER BY name`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post('/phr_Med_Dosequantity', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `select * from master_quantity ORDER BY name`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/phr_Med_InstrationsdataShow', (req, res) => {
  // console.log(req.body);
  var text = req.body.text
  const command = `select * from master_patientinstruction ORDER BY name`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/submit_FamiltHistorydata', (req, res) => {
  console.log(req.body, "submit family history");
  var patientID = req.body.patientID
  var hospital_ID = req.body.hospital_ID
  var branch_Id = req.body.Branch_ID

  var familyhistoryname = req.body.FamiltHistorydata.family_patient_name;
  var familyhistoryage = req.body.FamiltHistorydata.family_patient_age;
  var familyhistorypatient_status = req.body.FamiltHistorydata.family_patient_status.status;
  var familyhistoryrelation = req.body.FamiltHistorydata.family_patient_relation.id;
  var familyhistoryProblem = req.body.FamiltHistorydata.family_patient_Problem.id;
  var datepatient_onset_date = req.body.FamiltHistorydata.family_patient_onset;
  // var add_datepatient_onset_date = new Date(datepatient_onset_date);
  // var Administerdpatient_onset_date = add_datepatient_onset_date.toISOString().split('T')[0];

  // console.log(summaryImmunizations);
  command = `INSERT INTO master_family_histary (name, Age, Alive, relation, problem, OnsetDate, PatientId,hospitalId,branchId,uploaded_by,eocnumber,appopment_id) values ('${familyhistoryname}', '${familyhistoryage}', '${familyhistorypatient_status}', '${familyhistoryrelation}',  '${familyhistoryProblem}','${datepatient_onset_date}', '${patientID}','${branch_Id}','${hospital_ID}','PHR','0','0' )  `;

  execCommand(command)
    .then(result => res.json({
      result,
      success: true
    }))
    .catch(err => logWriter(command, err));
});

router.post('/phr_delfamilyhistory', (req, res) => {
  var id = req.body.id
  const command = `delete from  master_family_histary where id='${id}' 
  
`;

  // AND uploded_by='PHR'
  execCommand(command)
    .then(result => {
      if (result.affectedRows > 0) {
        res.json('success');
      } else {
        res.json('failed');
      }
    })
    .catch(err => logWriter(command, err))
})



router.post('/phr_master_fimalyhistory', (req, res) => {
  console.log(req.body);
  var text = req.body.text
  const command = `select * from description_snapshot where term like '%${text}%'`;
  // const command =`select * from master_vaccine where name like  '%${text}%'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});



router.post('/phr_flowvitaldataShow', (req, res) => {
  console.log(req.body);
  var text = req.body.text
  const command = `select * from master_site`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});




router.post('/submit_vitaldata', (req, res) => {
  console.log(req.body);
  var patientID = req.body.patientID

  var sitesbp = req.body.vitaldatainsert.Site_SBP;
  var vataldbp = req.body.vitaldatainsert.DBP;
  var vatalPulse = req.body.vitaldatainsert.Pulse;
  var vataltemp = req.body.vitaldatainsert.Temp;
  var vitalbpsitename = req.body.vitaldatainsert.bpsite_name.id;
  var vataldevice = req.body.vitaldatainsert.device;
  var vitalRR = req.body.vitaldatainsert.RR;
  var vitalspo2 = req.body.vitaldatainsert.SpO2;
  var vitalo2flow = req.body.vitaldatainsert.o2flow;
  var vitalhight = req.body.vitaldatainsert.hight;
  var vitalweight = req.body.vitaldatainsert.weight;
  var vitalbsa = req.body.vitaldatainsert.BSA;

  var vitaldate = req.body.vitaldatainsert.datevital_date;
  var add_datevital = new Date(vitaldate);

  var dateadd = add_datevital.toLocaleString();
  console.log(dateadd);
  command = `INSERT INTO transaction_vitals (SBP, DBP, Pulse, Temprature, BP_Site, Temprature_Device, RR, spO2, O2Flow, Height, Weight, BSA, DateAndTime, PatientId) values ('${sitesbp}', '${vataldbp}','${vatalPulse}', '${vataltemp}', '${vitalbpsitename}',  '${vataldevice}','${vitalRR}', '${vitalspo2}', '${vitalo2flow}', '${vitalhight}', '${vitalweight}', '${vitalbsa}', '${dateadd}', '${patientID}' )  `;

  execCommand(command)
    .then(result => res.json('Sucess'))
    .catch(err => logWriter(command, err));
});


// router.post('/phr_getFamiltProcedureHistory', (req, res) => {
//     var patientID=req.body.patientID;
//     const command=`SELECT  * ,(select term from description_snapshot where id=master_family_histary.problem)  as problem_name FROM master_family_histary where  PatientId='${patientID}'`

//         execCommand(command)
//         .then(result => res.json(result))
//         .catch(err => logWriter(command, err));
//     });
router.post('/phr_getProcedureHistory', (req, res) => {

  var patientID = req.body.patientID;
  // const command = `Select *,(select term from description_snapshot where id=transaction_procedure_history.IndicationForProcedure) as IndicationForProcedureName,(select name from master_laterality where guid=transaction_procedure_history.Literality) as literalityName,(select clinicName from hosptal_registration where guid=transaction_procedure_history.ClinicHospital) as ClinicHospitalName,(select concat(firstname,' ',Lastname) from provider_personal_identifiers where guid=transaction_procedure_history.Performer) as PerformerName,(select shortname from master_source where id=transaction_procedure_history.Source) as SourceName,(select name from master_procedure_history where id=transaction_procedure_history.procedur) as ProcedureName from transaction_procedure_history where Patientguid='${Patientguid}'`;
  const command = `SELECT tph.*,
                  ds.term AS IndicationForProcedureName,
                  ml.name AS literalityName,
                  hr.clinicName AS ClinicHospitalName,
                  CONCAT(ppi.firstname, ' ', ppi.lastname) AS PerformerName,
                  ms.shortname AS SourceName,
                  mph.name AS ProcedureName
                FROM transaction_procedure_history tph
                LEFT JOIN description_snapshot ds ON ds.id = tph.IndicationForProcedure
                LEFT JOIN master_laterality ml ON ml.guid = tph.Literality
                LEFT JOIN hosptal_registration hr ON hr.guid = tph.ClinicHospital
                LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = tph.Performer
                LEFT JOIN master_source ms ON ms.id = tph.Source
                LEFT JOIN master_procedure_history mph ON mph.id = tph.procedur
                WHERE tph.Patientguid = '${patientID}' and tph.lockStatus='0';`
  console.log(command, 'deepakdixittextprocduresystem');
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})



router.post('/phr_getTobaccoHistory', (req, res) => {
  console.log('petgcdgf', req.body);
  var patientID = req.body.patientID
  const command = `Select *,(select name from master_smoking_status where id=transaction_tobacco_use.Smoking_Status) as SmokeStatusName,(select name from master_smoking_category where id=transaction_tobacco_use.smokingType) as smokingCategory,(select name from master_smoking_type where id=transaction_tobacco_use.type) as smokingTypeName,(select name from master_smoking_type where id=transaction_tobacco_use.type) as Smokingtypes  from transaction_tobacco_use where patientId='${patientID}' and lockStatus='0'`;
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/phr_getprocedure_data', (req, res) => {
  console.log('phr_getproceduredata', req.body);
  var text = req.body.text
  const command = `select * from  master_procedure_history where name like '%${text}%'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/phr_getprocedure_indication', (req, res) => {
  console.log('phr_getprocedure_indication', req.body);
  var text = req.body.text
  const command = `select * from  description_snapshot where term like '%${text}%'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/procedure_data', (req, res) => {
  console.log('phr_getproceduredata', req.body);
  // var text = req.body.text
  var patientID = req.body.patientID
  // const command = `
  //   select tph.id, tph.uploaded_by, master_procedure_history.name,term,DatePerformed,Notes from  transaction_procedure_history  tph
  //   inner join master_procedure_history on master_procedure_history.id=tph.procedur
  //   inner join description_snapshot on description_snapshot.id=tph.IndicationForProcedure
    
  //   where Patientguid='${patientID}' and lockStatus='0'`
  const command=`SELECT tph.*,
  ds.term AS IndicationForProcedureName,
  ml.name AS literalityName,
  hr.clinicName AS ClinicHospitalName,
  CONCAT(ppi.firstname, ' ', ppi.lastname) AS PerformerName,
  ms.shortname AS SourceName,
  mph.name AS ProcedureName
FROM transaction_procedure_history tph
LEFT JOIN description_snapshot ds ON ds.id = tph.IndicationForProcedure
LEFT JOIN master_laterality ml ON ml.guid = tph.Literality
LEFT JOIN hosptal_registration hr ON hr.guid = tph.ClinicHospital
LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = tph.Performer
LEFT JOIN master_source ms ON ms.id = tph.Source
LEFT JOIN master_procedure_history mph ON mph.id = tph.procedur
WHERE tph.Patientguid = '${patientID}' and tph.lockStatus='0';`
  console.log(command)

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.get('/phr_get_procedure_type', (req, res) => {
  // console.log('phr_getproceduredata', req.body);
  // var text = req.body.text
  const command = `select * from  master_procedure_type `;
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})



router.post('/phr_getSexualHistory', (req, res) => {
  // console.log('petgcdgf', req.body);
  var patientID = req.body.patientID
  const command = `Select * ,(select name from master_protection_method where id=transaction_sexual_history.ProtectionMethod) as protection_method from transaction_sexual_history where patientId='${patientID}' and lockStatus='0'`;

  // const command = `Select *,(select name from master_smoking_status where id=transaction_tobacco_use.Smoking_Status) as SmokeStatusName,(select name from master_smoking_category where id=transaction_tobacco_use.smokingType) as smokingCategory,(select name from master_smoking_type where id=transaction_tobacco_use.type) as smokingTypeName,(select name from master_smoking_type where id=transaction_tobacco_use.type) as Smokingtypes  from transaction_tobacco_use where patientId='${patientID}'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


router.post('/phr_ImplantedDeviceshistory', (req, res) => {
  // var display_name = req.body.event; 
  // var hospitalId = req.body.hospitalId;
  var patientID = req.body.patientID;
  // var  branchId=req.body.branchId
  console.log('cityname');
  // const command =`Select * ,(Select name from master_implantdevice where id=transaction_implants.device)  as deviceName,(Select term from description_snapshot where id=transaction_implants.indication) as indicationName from transaction_implants where hospital_id='${hospitalId}' AND branch_id='${branchId}' AND patient_id='${patientGuid}'`;
  // console.log('vaibhav transaction_problem',command);
  const command = `SELECT ti.*,
    mid.name AS deviceName,
    ds.term AS indicationName
FROM transaction_implants ti
JOIN master_implantdevice mid ON mid.id = ti.device
JOIN description_snapshot ds ON ds.id = ti.indication
WHERE ti.patient_id = '${patientID}' and lockStatus='0';`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



router.post('/phr_getHospitalizationhistory', (req, res) => {
  // var display_name = req.body.event; 
  // var hospitalId = req.body.hospitalId;
  var patientID = req.body.patientID;
  // var  branchId=req.body.branchId
  console.log('');

  // const command =`Select *,(select name from masterclinichospital where id=master_ad_addmission.Hospital_Name)  as Hospital_NameValue ,(select term from description_snapshot where id=master_ad_addmission.Admission_Reason)  as Admission_ReasonName from master_ad_addmission where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}'`;
  const command = `SELECT 
 master_ad_addmission.*, 
 masterclinichospital.name AS Hospital_NameValue,
 description_snapshot.term AS Admission_ReasonName
FROM 
 master_ad_addmission
LEFT JOIN
 masterclinichospital ON master_ad_addmission.Hospital_Name = masterclinichospital.id
LEFT JOIN
 description_snapshot ON master_ad_addmission.Admission_Reason = description_snapshot.id
WHERE  master_ad_addmission.PatientId = '${patientID}' and lockStatus='0';`;
  console.log('vaibhav', command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})




router.post('/phr_getAlcohslSubstanceshistory', (req, res) => {
  // var display_name = req.body.event; 
  // var hospitalId = req.body.hospitalId;
  var patientID = req.body.patientID;
  // var  branchId=req.body.branchId
  console.log('');

  // const command =`Select *,(select name from masterclinichospital where id=master_ad_addmission.Hospital_Name)  as Hospital_NameValue ,(select term from description_snapshot where id=master_ad_addmission.Admission_Reason)  as Admission_ReasonName from master_ad_addmission where hospitalId='${hospitalId}' AND branchId='${branchId}' AND PatientId='${patientGuid}'`;
  const command = `Select *,(select name from master_boolean where id=transaction_alcohol_and_substances_use.DrugUse_alcoholuse) as DrugUse_alcoholuseBoolean,(select name from master_boolean where id=transaction_alcohol_and_substances_use.SubstanceUseCounselling) as SubstanceUseCounsellingBoolean,(select name from master_substance_use_drugs where id=transaction_alcohol_and_substances_use.SubstanceUseType) as drugs, (select name from master_form_type_alcohol where id=transaction_alcohol_and_substances_use.formType) as formTypeName  from transaction_alcohol_and_substances_use where patientId='${patientID}' and lockStatus='0'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/get_Manufacrure_data', (req, res) => {
  var text = req.body.text;
  console.log(text);
  // const command =`Select * from master_vaccine_cvx where CVXShortDescription like '%${text}%'`;
  const command = `Select * from product_mappng_cvx_mvx where CVXCode='${text}'`;

  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

// document start
router.post('/phr_getpatientdocument', (req, res) => {
  console.log(req.body, "document");


  var patient_id = req.body.patientID

  const command = `SELECT tpd.id, tpd.phr_folder_id,tpd.upload_by,tpd.doctype_extention, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
    CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
  FROM transaction_my_patient_docs tpd
  left join master_patient mp on mp.guid = tpd.patient_id
  left join provider_personal_identifiers pi on pi.Id = tpd.reviewer_id 

  where tpd.phr = '1' and  tpd.patient_id = '${patient_id}' and lockunlock="0";`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.post('/phr_sharebyme', (req, res) => {
  console.log(req.body, "document");


  var patient_id = req.body.patientID

  const command = `select pds.docsize as docSize, pds.documentpath as full_path,pds.id, mp.firstName,fileName, DATE(transactionTime) as Date_uplods  from  phr_document_shared pds
    left join master_patient mp on mp.guid = pds.sharedby
    where sharedby = '${patient_id}'   ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/phr_sharewithmail', (req, res) => {
  console.log(req.body, "document");


  var patient_id = req.body.patientID

  const command = `select ma.documentname as fileName,ma.id, ma.document_path as full_path ,ppi.firstname as providername ,ma.transaction_time as Date_uplods ,'EMAIL' AS documentType from mail_attachments ma
  inner join provider_personal_identifiers ppi on ma.provider_id=ppi.guid
   where patient_id ='${patient_id}'   ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.post('/phr_uploaddocument', (req, res) => {
  console.log(req.body, "document______");


  var filename = req.body.uploadDocumentform.file_name
  // var DocType = req.body.DocType
  // var sms = req.body.formvalue.sms
  // var phr = req.body.formvalue.phr
  // var Date = req.body.formvalue.Date
  // var Filefrreview = req.body.formvalue.Filefrreview
  // var reviewer = req.body.formvalue.Reviewer
  // var patient_id = req.body.formvalue.patient_id
  var patient_id = req.body.patientID
  //   var full_Path=req.body.fullpath
  //   console.log(full_Path?.fullpath)
  //   var newfullpa
  console.log(fullPath)
  var fullPath = req.body.fullpathArray.replace(/\\/g, '/')
  console.log(fullPath)

  var doctype_extention = req.body.fullpathArray.mimetype



  // // 
  // let pathParts = fullPath.split('healaxyapp\\');

  // if (pathParts.length > 1) {
  //     // Extract the part after 'ngdata'
  //     var pathAfterNgdata = pathParts[1];
  //     var newpath = pathAfterNgdata.replace(/\\/g, '/')
  //     console.log(pathAfterNgdata);
  // } else {
  //     console.log("The 'ngdata' part was not found in the path.");
  // }
  var folder_id = req.body.uploadDocumentform.folder_name.id
  // 
  // console.log(filename,"new")
  var hospital_id = req.body.hospital_ID
  var branch_id = req.body.branchID
  var docSize = req.body.totalSizeKB
  // var filename = req.body.filename

  const command = `INSERT INTO transaction_my_patient_docs (branch_id, hospital_id,  transaction_time, full_path, docSize, fileName, patient_id, phr,upload_by,Date_uplods,phr_folder_id,doctype_extention)
    VALUES ('${branch_id}', '${hospital_id}', now(), '${fullPath}', '${docSize}KB', '${filename}','${patient_id}','1','PHR', DATE_FORMAT(NOW(), '%Y-%m-%d'),'${folder_id}','${doctype_extention}')
           
            ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json('inserted'))
    .catch(err => logWriter(command, err));


})
router.post('/phr_sharedoc', (req, res) => {
  console.log(req.body, "document");
  var hospital_id = req.body.hospital_ID
  var branch_id = req.body.branchID
  var expiredate = req.body.documentshare.expire
  var patient_id = req.body.patientID
  var documenturl = req.body.documenturl
  var full_Path = req.body.selecteddoc[0].full_path
  var docSize = req.body.selecteddoc[0].docSize
  var filename = req.body.selecteddoc[0].fileName
  var doctype_extention = req.body.selecteddoc[0].doctype_extention
  var provider = req.body.documentshare.provider_name?.guid
  var check = req.body.documentshare.check1
  var email = req.body.documentshare.Email

  var docguid = newGuid()
  var Shareto = ''
  if (check == 'option1') {

    console.log('1')
    const command = `select emailId1 from provider_contact where provider_id='${provider}'
               
                ;`
    console.log(command, 'ddddd');
    execCommand(command)
      .then(result => {
        console.log(result[0].emailId1)
        // res.json(result)
        Shareto = result[0].emailId1
      })
      .catch(err => logWriter(command, err));

  }
  else {
    Shareto = email
  }
  var key = generateSecretKey(5)
  console.log(key)

  setTimeout(() => {
    const command = `INSERT INTO phr_document_shared (branch_id, hospital_id,  documentpath, docSize, fileName, sharedby,shareto ,docguid,doctype_extention,secretkey,expire_date)
        VALUES ('${branch_id}', '${hospital_id}', '${full_Path}', '${docSize}KB', '${filename}','${patient_id}','${Shareto}','${docguid}','${doctype_extention}','${key}','${expiredate}')
               
                ;`
    console.log(command);
    execCommand(command)
      .then(result => {
        res.json('inserted')
        var email_id = Shareto;
        var url = `${documenturl}${docguid}`
        mailOptions.to = `${email_id}`
        mailOptions.subject = `Shared documents with You`
        mailOptions.html = `<!DOCTYPE html>
            <html>
            <head>
            
              <meta charset="utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <title>Healaxy Documents</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">
              /**
               * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
               */
              @media screen {
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                }
            
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 700;
                  src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                }
              }
            
              /**
               * Avoid browser level font resizing.
               * 1. Windows Mobile
               * 2. iOS / OSX
               */
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%; /* 1 */
                -webkit-text-size-adjust: 100%; /* 2 */
              }
            
              /**
               * Remove extra space added to tables and cells in Outlook.
               */
              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }
            
              /**
               * Better fluid images in Internet Explorer.
               */
              img {
                -ms-interpolation-mode: bicubic;
              }
            
              /**
               * Remove blue links for iOS devices.
               */
              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
            
              /**
               * Fix centering issues in Android 4.4.
               */
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
            
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
            
              /**
               * Collapse table borders to avoid space between cells.
               */
              table {
                border-collapse: collapse !important;
              }
            
              a {
                color: #1a82e2;
              }
            
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
              </style>
            
            </head>
            <body style="background-color: #e9ecef;">
            
            
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                   
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                      <td align="center" valign="top" style="padding: 0px 24px; background: white;">
                      <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                        <img src="http://103.245.200.92/healaxy/assets/img/Helaxy%20logo-03.png" alt="Logo" border="0" width="48" style="display: block; width: 208px; max-width: 208px; min-width: 208px;">
                      </a>
                    </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                   
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Healaxy Documents </h1>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
               
                <tr>
                  <td align="center" bgcolor="#e9ecef">
               
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">Hi </p>
                          <p>Thank You For Choosing Healaxy, Please Use This Following Link  To View  Your Documents</p>
                          <a href="${url}" style="    display: block;
                          text-align: center;"><button class="btn"> click here </button></a>
                     
                          
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start button -->
                      <tr>
                        <td align="left" bgcolor="#ffffff">
                        
                        </td>
                      </tr>
                      <!-- end button -->
            
                      <!-- start copy -->
                      <tr>
                        
                      </tr>
                      <!-- end copy -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                          <p style="margin: 0;">Regards,<br> Healaxy administrator</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end copy block -->
            
                <!-- start footer -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
                          <p style="margin: 0;">Healaxy, India</p>
                        </td>
                      </tr>
                      <!-- end unsubscribe -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end footer -->
              </table>
              <!-- end body -->
            </body>
            </html>`

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending url' });
          } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'url sent successfully' });
          }
        });
        // });

        // })



        setTimeout(() => {
          email_sent(Shareto, key)
        }, 1000);


      })
      .catch(err => logWriter(command, err));
  }, 500);


})
router.post('/phr_sharedocAll', (req, res) => {
  var docguid = newGuid()
  var selectDoct = req.body.selecteddoc;
  console.log(req.body, "tissisisidi   share doc")
  var expiredate = req.body.documentshare.expire
  var hospital_id = req.body.hospital_ID
  var documenturl = req.body.documenturl
  var branch_id = req.body.branchID
  var patient_id = req.body.patientID
  var full_Path = req.body.selecteddoc[0].full_path // Assuming full_Path is the same for all selected documents

  var docSize = req.body.selecteddoc[0].docSize // Assuming docSize is the same for all selected documents
  var filename = req.body.selecteddoc[0].fileName // Assuming filename is the same for all selected documents
  var provider = req.body.documentshare.provider_name?.guid
  var check = req.body.documentshare.check1
  var email = req.body.documentshare.Email
  var Shareto = ''
  if (check == "option1") {

    console.log('1')
    const command = `select emailId1 from provider_contact where provider_id='${provider}'
               
                ;`
    console.log(command, 'ddddd');
    execCommand(command)
      .then(result => {
        console.log(result[0].emailId1)
        // res.json(result)
        Shareto = result[0].emailId1
      })
      .catch(err => logWriter(command, err));
    // var Shareto = provider
    // var Shareto = provider
  } else {
    Shareto = email
  }
  var key = generateSecretKey(5)
  console.log(key)
  setTimeout(() => {
    let i = 0;
    (function loop() {
      if (i < selectDoct.length) {
        full_Path = req.body.selecteddoc[i].full_path
        docSize = req.body.selecteddoc[i].docSize
        filename = req.body.selecteddoc[i].fileName
        doctype_extention = req.body.selecteddoc[i].doctype_extention

        const command = `INSERT INTO phr_document_shared(branch_id, hospital_id,  sharedby, shareto, documentpath, docSize, fileName, docguid,doctype_extention,secretkey,expire_date) values('${branch_id}', '${hospital_id}','${patient_id}','${Shareto}','${full_Path}', '${docSize}KB', '${filename}','${docguid}','${doctype_extention}','${key}','${expiredate}')`

        console.log('insert', command);

        execCommand(command)
          .then(() => {
            i++;
            loop()
          })
          .catch(err => logWriter(command, err));
      } else {

        res.json({ msg: 'success', key: key })
        // console.log(req.body)
        var email_id = Shareto;
        var url = `${documenturl}${docguid}`
        mailOptions.to = `${email_id}`
        mailOptions.subject = `Shared documents with You`
        mailOptions.html = `<!DOCTYPE html>
            <html>
            <head>
            
              <meta charset="utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <title>Healaxy Documents</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">
              /**
               * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
               */
              @media screen {
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                }
            
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 700;
                  src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                }
              }
            
              /**
               * Avoid browser level font resizing.
               * 1. Windows Mobile
               * 2. iOS / OSX
               */
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%; /* 1 */
                -webkit-text-size-adjust: 100%; /* 2 */
              }
            
              /**
               * Remove extra space added to tables and cells in Outlook.
               */
              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }
            
              /**
               * Better fluid images in Internet Explorer.
               */
              img {
                -ms-interpolation-mode: bicubic;
              }
            
              /**
               * Remove blue links for iOS devices.
               */
              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
            
              /**
               * Fix centering issues in Android 4.4.
               */
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
            
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
            
              /**
               * Collapse table borders to avoid space between cells.
               */
              table {
                border-collapse: collapse !important;
              }
            
              a {
                color: #1a82e2;
              }
            
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
              </style>
            
            </head>
            <body style="background-color: #e9ecef;">
            
            
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                   
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                      <td align="center" valign="top" style="padding: 0px 24px; background: white;">
                      <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                        <img src="http://103.245.200.92/healaxy/assets/img/Helaxy%20logo-03.png" alt="Logo" border="0" width="48" style="display: block; width: 208px; max-width: 208px; min-width: 208px;">
                      </a>
                    </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                   
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Healaxy Documents </h1>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
               
                <tr>
                  <td align="center" bgcolor="#e9ecef">
               
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">Hi </p>
                          <p>Thank You For Choosing Healaxy, Please Use This Following Link  To View  Your Documents</p>
                          <a href="${url}" style="    display: block;
                          text-align: center;"><button class="btn"> click here </button></a>
                     
                          
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start button -->
                      <tr>
                        <td align="left" bgcolor="#ffffff">
                        
                        </td>
                      </tr>
                      <!-- end button -->
            
                      <!-- start copy -->
                      <tr>
                        
                      </tr>
                      <!-- end copy -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                          <p style="margin: 0;">Regards,<br> Healaxy administrator</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end copy block -->
            
                <!-- start footer -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
                          <p style="margin: 0;">Healaxy, India</p>
                        </td>
                      </tr>
                      <!-- end unsubscribe -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end footer -->
              </table>
              <!-- end body -->
            </body>
            </html>`


        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending url' });
          } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'url sent successfully' });
          }
        });
        // });

        // })




        setTimeout(() => {
          email_sent(Shareto, key)

        }, 1000);



      }
    }())
  }, 500);


})


router.post('/phr_getdocbyid', (req, res) => {
  console.log(req.body, "document");


  var docid = req.body.docid
  var date = new Date();
  console.log(date);
  const command = `SELECT *
    FROM phr_document_shared
    WHERE 
         docguid='${docid}' and   expire_date >= CURDATE();`
  console.log(command);
  execCommand(command)
    .then(result => {
      console.log(result);
      res.json(result)
      //             console.log(result[0].expire_date,date,'-------------------');
      //             if(result[0].expire_date>=date){
      // console.log("true")
      //             }else{

      //             }
    })
    .catch(err => logWriter(command, err));


})


router.post('/phr_createfolder', (req, res) => {
  console.log(req.body, "folder");


  var patient_id = req.body.patientID
  var hospital_id = req.body.hospital_ID
  var branch_id = req.body.branchID
  var folder_name = req.body.createfolderform.folder_name

  const command = `insert into master_my_document_folder(branchId, hospitalId,patient_Id,Folder_name,upload_by) values('${branch_id}', '${hospital_id}','${patient_id}','${folder_name}','PHR')`
  console.log(command);
  execCommand(command)
    .then(result => res.json('inserted'))
    .catch(err => {
      logWriter(command, err)

    });


})
router.post('/phr_getfoldersname', (req, res) => {
  console.log(req.body, "folder");


  var patient_id = req.body.patientID

  // const command = `select * from phr_doc_folder where patient_id='${patient_id}'`
  const command = `select * from master_my_document_folder where  upload_by='PHR' and patient_id='${patient_id}'`

  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


// invoice
router.post('/getinvoicedata', (req, res) => {
  console.log(req.body, "folder");


  var patient_id = req.body.patientID

  // const command = `select * from phr_doc_folder where patient_id='${patient_id}'`
  const command = `select * from master_invoiceall where  patient_id='${patient_id}'`

  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


// invoice
// document end
// function for secret key

function generateSecretKey(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let secretKey = '';

  for (let i = 0; i < length; i++) {
    secretKey += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return secretKey;
}

//email sms sender

function email_sent(Shareto, key) {
  var email_id = Shareto;
  var otp = key
  console.log(otp, "otp")
  mailOptions.to = `${email_id}`
  mailOptions.subject = `Shared documents with You`
  mailOptions.html = `<!DOCTYPE html>
    <html>
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title> Healaxy Documents</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
      /**
       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
       */
      @media screen {
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
        }
    
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 700;
          src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
        }
      }
    
      /**
       * Avoid browser level font resizing.
       * 1. Windows Mobile
       * 2. iOS / OSX
       */
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
      }
    
      /**
       * Remove extra space added to tables and cells in Outlook.
       */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }
    
      /**
       * Better fluid images in Internet Explorer.
       */
      img {
        -ms-interpolation-mode: bicubic;
      }
    
      /**
       * Remove blue links for iOS devices.
       */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }
    
      /**
       * Fix centering issues in Android 4.4.
       */
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }
    
      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    
      /**
       * Collapse table borders to avoid space between cells.
       */
      table {
        border-collapse: collapse !important;
      }
    
      a {
        color: #1a82e2;
      }
    
      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
      </style>
    
    </head>
    <body style="background-color: #e9ecef;">
    
    
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
    
        <tr>
          <td align="center" bgcolor="#e9ecef">
           
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
              <td align="center" valign="top" style="padding: 0px 24px; background: white;">
              <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                <img src="http://103.245.200.92/healaxy/assets/img/Helaxy%20logo-03.png" alt="Logo" border="0" width="48" style="display: block; width: 208px; max-width: 208px; min-width: 208px;">
              </a>
            </td>
              </tr>
            </table>
            
          </td>
        </tr>
      
        <tr>
          <td align="center" bgcolor="#e9ecef">
           
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Secret key </h1>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
       
        <tr>
          <td align="center" bgcolor="#e9ecef">
       
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">Hi,</p>
                  <p>
                     Use The Secret Key To Open Documents ,Thank You</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                  
                </td>
              </tr>
              <!-- end copy -->
    
              <!-- start button -->
              <tr>
                <td align="left" bgcolor="#ffffff">
                
                </td>
              </tr>
              <!-- end button -->
    
              <!-- start copy -->
              <tr>
                
              </tr>
              <!-- end copy -->
    
              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                  <p style="margin: 0;">Regards,<br> Healaxy</p>
                </td>
              </tr>
              <!-- end copy -->
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end copy block -->
    
        <!-- start footer -->
        <tr>
          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
                  <p style="margin: 0;">Healaxy, India</p>
                </td>
              </tr>
              <!-- end unsubscribe -->
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end footer -->
      </table>
      <!-- end body -->
    </body>
    </html>`


  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending url' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'url sent successfully' });
    }
  });
}



// date convert function
function convertUtcToIST(utcTimeString) {
  const utcTime = new Date(utcTimeString);
  const istTime = new Date(utcTime.getTime() + (5.5 * 60 * 60 * 1000));

  const year = istTime.getFullYear();
  const month = String(istTime.getMonth() + 1).padStart(2, "0");
  const day = String(istTime.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}
function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
//   console.log(newGuid(),"this is guid")



//Diet Type Api
//Diet Api
router.get("/dietType", (req, res) => {
  let command = `SELECT * FROM master_diettype;`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/addDiet", (req, res) => {
  console.log(req.body);
  let name = req.body.name;
  let type = req.body.type;
  let intake = req.body.intake;
  let startDate = convertUtcToIST(req.body.startDate);
  let endDate = convertUtcToIST(req.body.endDate);
  let note = req.body.note;
  let patientId = req.body.patientId;
  let hospitalId = req.body.hospitalId;
  let branchId = req.body.branchId;
  let command = `INSERT INTO master_diet (name,type,intake,note,startDate,endDate,patient_Id,hospital_Id,branch_id) Values ('${name}','${type}','${intake}','${note}','${startDate}','${endDate}','${patientId}','${hospitalId}','${branchId}')`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.delete("/diet/:id", (req, res) => {
  let dietId = req.params.id;
  let command = `delete from master_diet where id='${dietId}'`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/allDietRecord", (req, res) => {
  let patientId = req.body.patientId;
  let command = `SELECT 
  md.*,
  mph.name AS Name,
  mdt.name As Type
FROM 
  master_diet AS md
LEFT JOIN
  master_procedure_history AS mph ON md.name = mph.id
LEFT JOIN 
master_diettype AS mdt ON md.type=mdt.id 
Where patient_Id='${patientId}';`;
  console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
//End Diet Api

//Threapy Api
router.get("/therapyType", (req, res) => {
  let command = `select * from master_therapytype;`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/therapyNameList", (req, res) => {
  let data = req.body.data;
  let name = req.body.name;
  let command = `SELECT * FROM master_therapylist WHERE type='${data}' AND name LIKE '${name}%';`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/therapyList", (req, res) => {
  console.log("upcomig therapy list : ", req.body);
  let patientId = req.body.patientId;
  let command = `SELECT 
  mt.*,
  mtl.name AS Name,
  mtt.name As Type
FROM 
  master_therapy AS mt
LEFT JOIN
  master_therapylist AS mtl ON mt.name = mtl.id
LEFT JOIN 
master_therapytype AS mtt ON mt.type=mtt.id Where patient_Id='${patientId}';`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/addTherapy", (req, res) => {
  let type = req.body.type;
  let name = req.body.name;
  let startDate = convertUtcToIST(req.body.startDate);
  let endDate = convertUtcToIST(req.body.endDate);
  var time = formatDate(req.body.time);
  let note = req.body.note;
  let patientId = req.body.patientId;
  let hospitalId = req.body.hospitalId;
  let branchId = req.body.branchId;
  let command = `INSERT INTO master_therapy (type,name,startDate,endDate,time,note,patient_Id,hospital_Id,branch_Id) Values ('${type}','${name}','${startDate}','${endDate}','${time}','${note}','${patientId}','${hospitalId}','${branchId}')`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.delete("/therapy/:id", (req, res) => {
  let therapyId = req.params.id;
  let command = `delete from master_therapy where id='${therapyId}';`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
//End Threapy Diet Api

function formatDate(dateToBeFormatted) {
  if (
    dateToBeFormatted != null &&
    dateToBeFormatted != undefined &&
    dateToBeFormatted != ""
  ) {
    var date = new Date(dateToBeFormatted.toLocaleString("en-US"));
    date = new Date(date);
    var dateReturn = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
      "0" + date.getSeconds()
    ).slice(-2)}`;
    console.log(dateReturn);
    return dateReturn;
  } else {
    return "";
  }
}
//End Threapy Diet Api
// 
// start pharmacy
router.post('/findCountry', (req, res) => {
  console.log(req.body.text);
  const countryName = req.body.text
  const command = `select * from master_country_code1 where Country like '%${countryName}%';`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})
router.post('/getStates', (req, res) => {
  // console.log(req.body);
  const country_id = req.body.countryId
  const command = `select * from master_coutry_postalcode where countrycode = '${country_id}' group by states_name;`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/getDisrict', (req, res) => {
  const states_name = req.body.states_name
  const command = `select * from master_coutry_postalcode where states_name = '${states_name}' group by district_name;`;
  console.log(command,"AMAN")
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/getPincodesAccToDistrict', (req, res) => {
  const district = req.body.district;
  console.log(district);
  const command = `select * from master_pincode where area = '${district}'`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/findPostalCode', (req, res) => {
  // console.log(req.body.text);
  const postalcode = req.body.text
  const command = `select * from master_coutry_postalcode where postalcode like '%${postalcode}%' group by postalcode;`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})


router.post('/addpharmacydata', (req, res) => {
  console.log(req.body, "pharmacy");
  let patientID = req.body.patientID;
  let hospital_ID = req.body.hospital_ID;
  let branchID = req.body.branchID;
  let Pharmacy_Name = req.body.formvalue.Pharmacy_Name
  let Pharmacy_Email = req.body.formvalue.Pharmacy_Email
  let Mobile = req.body.formvalue.Mobile
  let Phone = req.body.formvalue.Phone
  let Address = req.body.formvalue.Address
  let Country = req.body.formvalue.country.Country
  let state = req.body.formvalue.state
  let district = req.body.formvalue.district
  let postalCode = req.body.formvalue.postalCode.postalcode
  // const postalcode = req.body.text
  const command = `insert into phr_pharmacy (patient_id,hospital_id,branch_id,pharmacy_name,pharmacy_email,pharmacy_address,mobile,phone,county,city,state,postal_code) Values ('${patientID}','${hospital_ID}','${branchID}','${Pharmacy_Name}','${Pharmacy_Email}','${Address}','${Mobile}','${Phone}','${Country}','${state}','${district}','${postalCode}') `;
  console.log(command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));

})


router.post("/getpharmacydata", (req, res) => {
  let patient_id = req.body.patientID;

  let command = `SELECT * FROM phr_pharmacy WHERE patient_id='${patient_id}';`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post('/delete_pharmacy', (req, res) => {
  let id = req.body.id;
  const command = `delete from phr_pharmacy where id='${id}'`;
  console.log(command)
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err))
})
// end pharmacy

// lab 
router.post("/getlaborder", (req, res) => {
  let patient_id = req.body.patientID;

  // let command = `SELECT osp.*, concat(ppi.firstname,' ',ppi.lastname) as provider_name FROM order_sendto_phr osp
  // inner join provider_personal_identifiers ppi on ppi.guid=osp.provider_id where PatientID='${patient_id}';`;
  // console.log(command)

  let command = ` SELECT tlo.*, concat(ppi.firstname,' ',ppi.lastname) as provider_name FROM transaction_lab_order tlo
  inner join provider_personal_identifiers ppi on ppi.guid=tlo.provider_id

  where tlo.PatientID='${patient_id}'   group by tlo.orderId;`;
  console.log(command)
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/getlabresult", (req, res) => {
  let patient_id = req.body.patientID;

  let command = `SELECT osp.*, concat(ppi.firstname,' ',ppi.lastname) as proivder_name FROM transaction_lab_order osp
  inner join provider_personal_identifiers ppi on ppi.guid=osp.provider_id
  WHERE PatientID='${patient_id}' group by orderId`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/getlabresultdetail", (req, res) => {
  let patient_id = req.body.patientID;
  let orderId = req.body.orderId
  let command = `SELECT osp.*, concat(ppi.firstname,' ',ppi.lastname) as proivder_name FROM transaction_lab_order osp
  inner join provider_personal_identifiers ppi on ppi.guid=osp.provider_id
  WHERE orderId='${orderId}' and  PatientID='${patient_id}' and order_Status='Y' `;
  console.log(command)
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});


router.post("/getdownload", (req, res) => {
  let patient_id = req.body.patientID;
  let orderId = req.body.orderId
  let command = `select * from order_sendto_phr
  WHERE orderId='${orderId}' and  PatientID='${patient_id}'  `;
  console.log(command)
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});



router.post("/genrateLABTEMP", (req, res) => {
  let patient_id = req.body.patientID;

  let command = `select * from master_labtemplate
  WHERE active='2' `;
  console.log(command)
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/detailsdata", (req, res) => {
  console.log(req.body)
  let patientID = req.body.modeldata[0].PatientID
  let hospitalId = req.body.modeldata[0].hospitalId
  let BranchID = req.body.modeldata[0].BranchID
  let provider_id = req.body.modeldata[0].provider_id


  const command = `SELECT
    pc.emailId1 AS patient_email,
    pc.mobilePhone AS patient_mob,
    pc.homePhone AS patient_Home_phone,
    pc.workPhone AS patient_work_phone,
    mp.completeName AS patient_name,
    mp.dateOfBirth AS patient_dob,
    mp.age AS patient_age,
    CONCAT(pc.addressLine1, " ", pc.district, " ", pc.state) AS patient_address,
    gender.gender AS patient_gender,
    hr.clinicName AS hospital_name,
    CONCAT(hr.addressLine1, " ", hr.district_name, " ", hr.states_name, " ", hr.Country) AS hospital_address,
    hr.mobile AS hospital_phone,
    hr.email_id AS hospital_email,
    hr.GSTIN AS hospital_gstn,
    hr.WebSitelink AS hospital_website,
    hr.postalCode AS hospital_postalcode,
    CASE
        WHEN ppi.lastname IS NOT NULL THEN ppi.firstname
        ELSE ''
    END AS provider_name,
    ppi.Emailid AS provider_email,
    ppi.Phonenumber AS provider_phone
FROM
    patientcontact pc

    inner join master_patient mp  on pc.patient_id=mp.guid
        inner join  hosptal_registration hr on   '${BranchID}' =hr.guid
        inner join provider_personal_identifiers ppi on  '${provider_id}'=ppi.guid
        inner join gender on  mp.sex=gender.conceptId
            where patient_id= '${patientID}';`;
  console.log(command)
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});



// lab end

// task

/* Patient task Api Start*/

router.post("/patientTaskList", (req, res) => {
  let patientId = req.body.patientId;
  let command = `SELECT 
  t.id,
  t.category,
  t.assigned_byName,
  t.assigned_forName,
  t.patientname,
  t.assigned_forSeletedButton,
  t.Ispatientspecific,
  t.shortName,
  t.description,
  t.assigned_by,
  t.assigned_for,
  t.task_owner,
  t.priority,
  t.status,
  t.due_date,
  t.Frequencytype,
  t.Reminderintervalsnum,
  mp.id AS mp_id,
  mp.guid,
  mp.active,
  mp.prefix,
  mp.firstName,
  mp.middleName,
  mp.lastName,
  mp.suffix,
  mp.completeName,
  mp.displayName,
  mp.imgSrc,
  mp.mobilecodes,
  mtc.id AS msc_id,
  mtc.name AS msc_name,
  mtc.lang_id,
  mtp.id AS mtp_id,
  mtp.priority_label,
  mts.id AS mts_id,
  mts.task_status,
  mts.task_action,
  mts.task_name,
  CONCAT(ppi.providertitle, '', ppi.firstname, '', ppi.middlename) AS assignedByName,
  mft.id AS mft_id,
  mft.name AS mft_name,
  mft.ids
FROM 
  task t
LEFT JOIN 
  master_patient mp ON t.assigned_for = mp.id
LEFT JOIN 
  provider_personal_identifiers ppi ON t.assigned_by = ppi.guid
LEFT JOIN 
  master_task_category mtc ON t.category = mtc.id
LEFT JOIN 
  master_task_priority mtp ON t.priority = mtp.id
LEFT JOIN 
  master_task_status mts ON t.status = mts.id
LEFT JOIN 
  master_frefuencytime mft ON t.task_Reminderintervals = mft.ids
WHERE   
  assigned_for = '${patientId}' order by id desc ;`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.put("/updateTaskStatus", (req, res) => {
  var status = req.body.index;
  var taskId = req.body.itemId;
  let differReason = req.body.differReason;
  var command = `update task Set status='${status}'`;
  if (differReason) {
    command += `, reason='${differReason}'`;
  }
  command += ` where id='${taskId}';`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
})

/* Patient task Api End*/
module.exports = router;



// SELECT phr_reqestforvisit.id,patient_id, start_date, start_time, end_time, provider_id, TIMESTAMPDIFF(minute, phr_reqestforvisit.start_time, phr_reqestforvisit.end_time) AS duration ,(select name from master_chief_complaints where id= phr_reqestforvisit.reason_of_visit)as reason,concat(provider_personal_identifiers.firstname,' ', provider_personal_identifiers.Lastname) as provider ,master_patient.displayName as patient   FROM phr_reqestforvisit   INNER JOIN provider_personal_identifiers ON provider_personal_identifiers.guid = phr_reqestforvisit.provider_id inner join master_patient on phr_reqestforvisit.patient_id = master_patient.guid


// select transaction_appointment.id, transaction_appointment.provider_id,transaction_appointment.patient_id ,transaction_appointment.start_time,TIMESTAMPDIFF(minute, transaction_appointment.start_time, transaction_appointment.end_time) as duration, transaction_appointment.end_time,transaction_appointment.start_date,transaction_appointment.reason,  concat(provider_personal_identifiers.firstname,' ', provider_personal_identifiers.Lastname) as provider,
// master_visit_status.visit_status as visit_status,
// master_appointment_type.appointment_type ,


// master_patient.displayName as patient from transaction_appointment
// inner join master_appointment_type on transaction_appointment.Appointment_type=master_appointment_type.id
// INNER JOIN
//    master_visit_status ON  transaction_appointment.visit_status=master_visit_status.id
// inner join provider_personal_identifiers on transaction_appointment.provider_id = provider_personal_identifiers.guid
// inner join master_patient on transaction_appointment.patient_id = master_patient.guid
// where transaction_appointment.patient_id = '${patientID}' ORDER BY start_date DESC;