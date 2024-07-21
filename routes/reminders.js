const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const { log } = require('console');


router.get('/getRemindersdata', (req, res) => {
  const command = `SELECT *,(select categorys from master_category where id=transation_reminder.Category) as CategoryName 
    ,(select name from master_reminders where id=transation_reminder.NameofAlert) as NameofAlertname, (select name from master_frefuencytime where id=transation_reminder.Reminderintervals) 
    as Reminderintervalsname ,(select name from master_drug where identifier=transation_reminder.medication) as medicationname  FROM transation_reminder`;

  console.log('getRemindersdata', command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post('/getorderddata', (req, res) => {
  var text = req.body.text
  const command = `SELECT LOINC_NUM,LONG_COMMON_NAME FROM loincuniversal where LONG_COMMON_NAME like '%${text}%'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.get('/getCategorydata', (req, res) => {

  const command = `SELECT * FROM master_category`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post('/getReminderdata', (req, res) => {
  var id = req.body.id;
  const command = `SELECT * FROM master_reminders where categarytype='${id}'`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.get('/master_typereminderdata', (req, res) => {

  const command = `SELECT * FROM master_typereminder`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.get('/getbooleandatadata', (req, res) => {

  const command = `SELECT * FROM master_boolean`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.get('/getalertreminderdata', (req, res) => {

  const command = `SELECT * FROM master_alertreminder`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.get('/getfrequencytypedata', (req, res) => {

  const command = `SELECT * FROM master_frequencytype`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.get('/getgradedata', (req, res) => {

  const command = `SELECT * FROM master_grade`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.get('/getFrequencyreminder', (req, res) => {

  const command = `SELECT * FROM master_frefuencytime`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.post('/gethealthyreminder', (req, res) => {
  var patientguid = req.body.patientguid
  // const command = `SELECT *,(select categorys from master_category where id=transation_reminder.Category) as CategoryName 
  // ,(select name from master_reminders where id=transation_reminder.NameofAlert) as NameofAlertname, (select name from master_frefuencytime where id=transation_reminder.Reminderintervals) 
  // as Reminderintervalsname ,(select name from master_drug where identifier=transation_reminder.medication) as medicationname  FROM transation_reminder`;
  // const command = `SELECT * FROM trainsation_healthyreminder INNER JOIN master_reminder where trainsation_healthyreminder.id_reminder=master_reminder.id `;
  const command = ` SELECT *,(select categorys from master_category where id=master_reminder.Category) as CategoryName ,(select name from master_frefuencytime where id=master_reminder.Reminderintervals) as Reminderintervalsname,(select name from master_reminders where id=master_reminder.id)as NameofAlertname FROM master_reminder;`

  // SELECT * FROM trainsation_healthyreminder INNER JOIN master_reminder where trainsation_healthyreminder.id_reminder=master_reminder.id ;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post('/SaveReminderData', (req, res) => {
  console.log(req.body)
  var hospitalid = req.body.hospitalId;
  var branchid = req.body.branchId;
  var patientid = req.body.patientguid;
  var catogary = req.body.reminderform.Category;
  var NameofAlert = req.body.reminderform.NameofAlert;
  var Typeofreminder = req.body.reminderform.Typeofreminder;
  var Reminderintervals = req.body.reminderform.Reminderintervals.id;
  var Beforeduedate = req.body.reminderform.Beforeduedate;
  var Afterduedate = req.body.reminderform.Afterduedate.id;
  var order = req.body.reminderform.Order.LOINC_NUM;
  var order2 = req.body.reminderform.Order2.LOINC_NUM;
  var ordernumber = req.body.lorangeNum;
  var medication = req.body.reminderform.medication.identifier;
  console.log('req.body', ordernumber)
  var convertedDate = new Date(req.body.reminderform.DueDate);
  console.log('+++++++ 1=======>', convertedDate)
  let isoDate = convertedDate;
  // var duedate=isoDate.toISOString().split('T')[0];

  var { Grade, Message, TypeofAlert, Patientreminder, Source, Version, WebReference, WebReference2, Frequencytype, Reminderintervalsnum, Beforeduedatenum, Afterduedatenum, AlertFrequency, AlertFrequency1, MinAge, MaxAge, Pregnant, Risk } = req.body.reminderform
  console.log(req.body);

  console.log(catogary, NameofAlert, Typeofreminder, Reminderintervals, Beforeduedate, Afterduedate, Grade, Message, TypeofAlert, Patientreminder, Patientreminder, Source, Version, WebReference, WebReference2,
    Frequencytype, MinAge, MaxAge, Pregnant, Risk);

  command = `INSERT INTO transation_reminder( hospitalid, branchid, patientid, Category, NameofAlert, Typeofreminder, Grade, Message, TypeofAlert, Patientreminde, Reminderintervals, Beforeduedate,
       Afterduedate,Frequencytype,AlertFrequency,Alertafterfrequency,  Reminderintervalsnum,Beforeduedatenum,Afterduedatenum,orders,order2,medication) values('${hospitalid}',
       '${branchid}','${patientid}','${catogary}','${NameofAlert}','${Typeofreminder}','${Grade}','${Message}','${TypeofAlert}','${Patientreminder}',' ${Reminderintervals}','${Beforeduedate}',
       '${Afterduedate}','${Frequencytype}','${AlertFrequency}','${AlertFrequency1}','${Reminderintervalsnum}','${Beforeduedatenum}','${Afterduedatenum}','${order}','${order2}','${medication}')`;
  console.log(command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
// deleteTransaction_reminder',{hospitalId,branchId,patientguid,id})
router.post('/SaveReminderDatamaster', (req, res) => {
  console.log(req.body)
  // var hospitalid =req.body.hospitalId;
  // var branchid=req.body.branchId;
  // var patientid=req.body.patientguid;
  var catogary = req.body.reminderform.Category;
  var NameofAlert = req.body.reminderform.NameofAlert;
  var Typeofreminder = req.body.reminderform.Typeofreminder;
  var Reminderintervals = req.body.reminderform.Reminderintervals.id;
  var Beforeduedate = req.body.reminderform.Beforeduedate.id;
  var Afterduedate = req.body.reminderform.Afterduedate.id;
  var Gender = req.body.reminderform.Gender.id;
  var ordernumber = req.body.lorangeNum;
  var medication = req.body.reminderform.medication.identifier;

  console.log('req.body', ordernumber)
  var convertedDate = new Date(req.body.reminderform.DueDate);

  console.log('+++++++ 1=======>', convertedDate)
  let isoDate = convertedDate;
  var duedate = isoDate.toISOString().split('T')[0];

  var { id, Grade, Message, TypeofAlert, Patientreminder, Source, Version, WebReference, WebReference2, Frequencytype, Reminderintervalsnum, Beforeduedatenum, Afterduedatenum, AlertFrequency, AlertFrequency1, MinAge, MaxAge, Pregnant, Risk } = req.body.reminderform
  console.log(req.body);

  console.log(catogary, NameofAlert, Typeofreminder, Reminderintervals, Beforeduedate, Afterduedate, Grade, Message, TypeofAlert, Patientreminder, Patientreminder, Source, Version, WebReference, WebReference2, duedate, Frequencytype, MinAge, MaxAge, Gender, Pregnant, Risk);
  if (id == '' || id == '0' || id == undefined) {
    command = `INSERT INTO master_reminder(Category, NameofAlert, Typeofreminder, Grade, Message, TypeofAlert, Patientreminde, Source, Version, Webreference,WebReference2, Duedate, Reminderintervals, Beforeduedate, Afterduedate,Frequencytype,beforereminder,afterreminder,AlertFrequency,Alertafterfrequency,Reminderintervalsnum,Beforeduedatenum,Afterduedatenum,MinAge,MaxAge,Gender,Pregnant,ordernumber,medication,Risk) values('${catogary}','${NameofAlert}','${Typeofreminder}','${Grade}','${Message}','${TypeofAlert}','${Patientreminder}','${Source}','${Version}','${WebReference}','${WebReference2}','${duedate}',' ${Reminderintervals}','${Beforeduedate}','${Afterduedate}','${Frequencytype}','${''}','${''}','${AlertFrequency}','${AlertFrequency1}','${Reminderintervalsnum}','${Beforeduedatenum}','${Afterduedatenum}','${MinAge}','${MaxAge}','${Gender}','${Pregnant}','${ordernumber}','${medication}','${Risk}')`;
  } else {
    const command = `Update transation_reminder set Category='${Category}', Reminderintervals='${NameofAlert}',Typeofreminder='${Typeofreminder}',Grade='${Grade}',Message='${Message}' ,TypeofAlert='${TypeofAlert}',Patientreminde='${Patientreminde}',Source='${Source}'where id='${id}';`;

  }
  console.log(command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/SaveReminderDataduedat', (req, res) => {
  var hospitalid = req.body.hospitalId;
  var branchid = req.body.branchId;
  var patientid = req.body.patientguid;
  var beforereminder = req.body.allbeforereminder;
  console.log('req.body1111111111111111111111111', beforereminder.length)

  let i = 1;
  (function loop() {
    if (i < beforereminder.length) {
      const command = `INSERT INTO  master_beforereminderdate( hospitalId, branchId, patientId, beforetime) values('${hospitalid}','${branchid}','${patientid}','${beforereminder[i].beforedate}')`;
      console.log(command);

      execCommand(command)
        .then(() => {
          i++;
          loop()
        })
        .catch(err => logWriter(command, err));
    }
    else {
      res.json('Delete')
    }
  }())



})
router.post('/SaveAfterReminderDataduedat', (req, res) => {
  console.log('', req.body)
  var hospitalid = req.body.hospitalId;
  var branchid = req.body.branchId;
  var patientid = req.body.patientguid;
  var beforereminder = req.body.reminderreminder;
  let i = 1;
  (function loop() {
    if (i < beforereminder.length) {

      const command = `INSERT INTO  master_afterreminder( hospitalId, branchId, patientId, afterreminder) values('${hospitalid}','${branchid}','${patientid}','${beforereminder[i].afterreminder}')`;
      console.log(command);

      execCommand(command)
        .then(() => {
          i++;
          loop()
        })
        .catch(err => logWriter(command, err));
    }
    else {
      res.json('Delete')
    }
  }())
})

// var {Grade,Message,TypeofAlert,Patientreminder,Source,Version,WebReference,WebReference2,Frequencytype,AlertFrequency,Reminderintervalsnum,Beforeduedatenum,Afterduedatenum,MinAge,MaxAge,Gender,Pregnant}=req.body.reminderform
// console.log(req.body);

//     command = `INSERT INTO transation_reminder( hospitalid, branchid, patientid, Category, NameofAlert, Typeofreminder, Grade, Message, TypeofAlert, Patientreminde, Source, Version, Webreference,WebReference2, Duedate,  Frequencytype, Reminderintervals, Beforeduedate, Afterduedate,beforereminder,afterreminder,AlertFrequency,Reminderintervalsnum,Beforeduedatenum,Afterduedatenum,MinAge,MaxAge,Gender,Pregnant) values('${hospitalid}','${branchid}','${patientid}','${catogary}','${NameofAlert}','${Typeofreminder}','${Grade}','${Message}','${TypeofAlert}','${Patientreminder}','${Source}','${Version}','${WebReference}','${WebReference2}','${duedate}','${Frequencytype}',' ${Reminderintervals}','${Beforeduedate}','${Afterduedate}','${beforedate}','${afterdate}','${AlertFrequency}','${Reminderintervalsnum}','${Beforeduedatenum}','${Afterduedatenum}','${MinAge}','${MaxAge}','${Gender}','${Pregnant}')`;
//     console.log(command)
//     execCommand(command)
//     .then(result => res.json('success'))
//      .catch(err => logWriter(command, err));


router.post('/deleteTransaction_reminder', (req, res) => {
  // var display_name = req.body.event; 
  var hospitalId = req.body.hospitalId;
  var patientGuid = req.body.patientguid;
  var branchId = req.body.branchId;
  var ids = req.body.id;

  const command = `delete from transation_reminder where hospitalid='${hospitalId}' AND branchid='${branchId}' AND patientid='${patientGuid}' AND id='${ids}' `;
  // delete from master_appointment where HospitalId='1442f75b-2d1f-41a1-9680-4867476fab85' AND Branch_Id='1442f75b-2d1f-41a1-9680-4867476fab85' AND Patient_Id='b5f0bd19-496d-4ecf-894d-24a2cabe245f' AND id='6' 
  console.log('vaibhav 4444444444444444444444444444444444444444', command);

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/getpatientname', (req, res) => {
  // var display_name = req.body.event; 

  var patientGuid = req.body.patientguid;




  const command = `SELECT * FROM master_patient where guid='${patientGuid}'`;
  console.log('vaibhav ', command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/updatereminder_data', (req, res) => {
  var values = req.body.values
  console.log('11111111111111111111111111119999999999999999999999999', req.body)
  var hospitalid = req.body.hospitalId;
  var branchid = req.body.branchId;
  var patientid = req.body.patientguid;
  var ids = req.body.ids
  var Reminderintervals = req.body.EditRecommendationform.Reminderintervals.id;
  var convertedDate = new Date(req.body.EditRecommendationform.DueDate);
  console.log('+++++++ 1=======>', convertedDate)
  let isoDate = convertedDate;
  var duedate = isoDate.toISOString().split('T')[0];
  var { id, Reminderintervalsnum, Reason, Commments, AlertFrequency, AlertFrequency1 } = req.body.EditRecommendationform
  console.log(req.body);
  if (values != 'healthy') {

    // const command =`Update transation_disesereminder set due_date='${duedate}', Reminderintervals='${Reminderintervals}',Reminderintervalsnum='${Reminderintervalsnum}',Ression='${Reason}',Comments='${Commments}' where id='${id}';`;
    const command = `Update transation_disesereminder set due_date='2023-10-16',resion='fever',Comments='sag', active='1', status='order' where id='${id}';`;
  }
  else {
    command = `Update trainsation_healthyreminder set duedate='2023-10-16', active='1', Status='order' where id='${ids}';`;
  }
  console.log('', command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})


router.post('/updatereminder_databefore', (req, res) => {
  var hospitalid = req.body.hospitalId;
  var branchid = req.body.branchId;
  var patientid = req.body.patientguid;
  var beforereminder = req.body.reminderreminder;
  console.log('req.body1111111111111111111111111', req.body, beforereminder.length)

  let i = 1;
  (function loop() {
    if (i < beforereminder.length) {
      const command = `Update master_beforereminderdate set beforetime='${beforereminder[i].afterreminder}'  where patientid='${patientid}';`;
      console.log(command);

      execCommand(command)
        .then(() => {
          i++;
          loop()
        })
        .catch(err => logWriter(command, err));
    }
    else {
      res.json('Delete')
    }
  }())
})
router.post('/updatereminder_dataAfter', (req, res) => {
  var hospitalid = req.body.hospitalId;
  var branchid = req.body.branchId;
  var patientid = req.body.patientguid;
  var afterreminder = req.body.allbeforereminder;
  console.log('req.body1111111111111111111111111', req.body, afterreminder.length)

  let i = 1;
  (function loop() {
    if (i < afterreminder.length) {
      const command = `Update master_beforereminderdate set afterreminder='${afterreminder[i].beforedate}'  where patientid='${patientid}';`;
      console.log(command);

      execCommand(command)
        .then(() => {
          i++;
          loop()
        })
        .catch(err => logWriter(command, err));
    }
    else {
      res.json('Delete')
    }
  }())
})

router.post('/orderdata_reminder', (req, res) => {
  console.log(req.body);
  lorangeid = req.body.lorangeNum;
  patientguid = req.body.patientguid;
  const command = `SELECT * FROM transaction_lab_order where orderId='${lorangeid}' AND patientid='${patientguid}' group by ParentName;`

  console.log('1111111111111111111111111111111111111', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/Deassesmanagmentsdata', (req, res) => {
  var text = req.body.text
  console.log(req.body);
  const command = `SELECT * FROM master_reminders where name like '%${text}%'  && categarytype='2'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/deseaderemindersave', (req, res) => {
  // var text=req.body.text
  var deasesereminderdatas = req.body.deasesereminderdatas
  var patientid = req.body.patientid
  console.log(req.body);
  const commands = `delete from transation_disesereminder where Patient_Id='${patientid}'`;
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < deasesereminderdatas.length) {
            const command = `INSERT INTO transation_disesereminder (patient_id, hospital_id, branch_id, desise_id) values ('${deasesereminderdatas[i].pattientid}','${deasesereminderdatas[i].hospitalId}','${deasesereminderdatas[i].branchid}' ,'${deasesereminderdatas[i].id}' )`;
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })


})

router.post('/changeStatusreminder', (req, res) => {
  //  req.body
  console.log(req.body);
  ids = req.body.id,
    id = req.body.ids
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  patientguid = req.body.patientguid
  statuss = req.body.status
  var dates = new Date();
  var duedate = formatDate(dates)
  console.log(ids);
  if (ids != null && ids != undefined && ids != '') {
    console.log('update');
    result => res.json('success')
    command = `update trainsation_healthyreminder set  active='${statuss}' where ids='${ids}'`;
  } else {
    console.log('save');
    result => res.json('success')
    command = `INSERT INTO trainsation_healthyreminder(patient_id, hospital_id, branch_id, Status, active, id_reminder, duedate) values('${patientguid}','${hospitalId}','${branchId}','${''}','${'statuss'}','${id}','${duedate}')`;

  }
  console.log(command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
});
router.post('/changeStatusdeaseasereminder', (req, res) => {
  //  req.body
  console.log(req.body);
  ids = req.body.id,
    id = req.body.ids
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  patientguid = req.body.patientguid
  statuss = req.body.status
  var dates = new Date();
  var duedate = formatDate(dates)
  console.log(ids);
  if (ids != null && ids != undefined && ids != '') {
    console.log('update');
    result => res.json('success')
    command = `update transation_disesereminder set  active='${statuss}' where id='${ids}'`;
  } else {
    console.log('save');
    result => res.json('success')
    command = `INSERT INTO transation_disesereminder(patient_id, hospital_id, branch_id, Status, active, desise_id, due_date) values('${patientguid}','${hospitalId}','${branchId}','${''}','${'statuss'}','${id}','${duedate}')`;
  }
  console.log(command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
});
function formatDate(dateToBeFormatted) {
  if (dateToBeFormatted != null && dateToBeFormatted != undefined && dateToBeFormatted != '') {
    var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
    date = new Date(date);
    // ("0" + (this.getMonth() + 1)).slice(-2)
    var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
    console.log(dateReturn);
    return dateReturn
  }
  else {
    return ''
  }
}

router.get('/getdeasesereminderdata', (req, res) => {
  var text = req.body.text
  console.log(req.body);

  // const command = `SELECT *,(select categorys from master_category where id=master_reminder.Category) as CategoryName ,(select name from master_frefuencytime where 
  //   id=master_reminder.Reminderintervals) as Reminderintervalsname,(select name from master_reminders where id=master_reminder.id)as NameofAlertname FROM master_reminder 
  //   INNER JOIN trainsation_healthyreminder  WHERE trainsation_healthyreminder.id_reminder=master_reminder.id;`

  const command = ` SELECT *,(select categorys from master_category where id=transation_reminder.Category) as CategoryName 
    ,(select name from master_reminders where id=transation_reminder.NameofAlert) as NameofAlertname, (select name from master_frefuencytime where id=transation_reminder.Reminderintervals) 
    as Reminderintervalsname ,(select name from master_drug where identifier=transation_reminder.medication) as medicationname ,(select LONG_COMMON_NAME from loincuniversal where
       LOINC_NUM=transation_reminder.orders)ordername FROM transation_reminder;`
  console.log('getdeasesereminderdata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/getmasterreminderdata', (req, res) => {
  var text = req.body.text
  const command = `SELECT *,(select categorys from master_category where id=master_reminder.Category) as CategoryName ,(select name from master_frefuencytime where id=master_reminder.Reminderintervals) as Reminderintervalsname,(select name from master_reminders where id=master_reminder.id)as NameofAlertname FROM master_reminder INNER JOIN trainsation_healthyreminder  WHERE trainsation_healthyreminder.id_reminder=master_reminder.id;`
  console.log('getdeasesereminderdata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.get('/deasese_transationdatas', (req, res) => {
  var text = req.body.text
  const command = `SELECT *,(select categorys from master_category where id=transation_reminder.Category) as CategoryName ,(select name from master_frefuencytime where id=transation_reminder.Reminderintervals) as Reminderintervalsname,(select name from master_reminders where id=transation_reminder.NameofAlert)as NameofAlertname FROM transation_reminder INNER JOIN transation_disesereminder  WHERE transation_disesereminder.desise_id=transation_reminder.id;`
  

  console.log('getdeasesereminderdata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post('/getvaccinedata', (req, res) => {
  var patientguid = req.body.patientguid
  console.log(patientguid,'');
  const command=` Select * ,concat((DoseType),' ',(select name from master_quantity where id=immunization_schedule_tranzation.DoseType)) as doseunit,(select CVXShortDescription 
    from master_vaccine_cvx where CVXCode=immunization_schedule_tranzation.Vaccine) as VaccineName, (select Route_Of_Administration from master_drug_routes1 where 
    Identifier=immunization_schedule_tranzation.Routes)as RoutesName , (select shortname from master_site where id=immunization_schedule_tranzation.Site)as SiteName ,
    (select name from master_reason_administerd where id=immunization_schedule_tranzation.Indication) as IndicationName   from immunization_schedule_tranzation where
    pattientid='${patientguid}'`
  console.log('getdeasesereminderdata 111111111111111111122222222222@@@@@@@2', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
module.exports = router;

