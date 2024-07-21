const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const { log } = require('console');



//Task API Matebul======
router.post("/getmasterPatientforTask", (req, res) => {
    console.log(req.body)
    var text = req.body.text;
    var hospitalId = req.body.hospitalId
    var branchId = req.body.branchId
    console.log('vaibhav', text)
    const command = `Select * from master_patient where displayName like '%${text}%' AND hospitalId='${hospitalId}' AND branchId='${branchId}'`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

router.post("/getMasterProviderData", (req, res) => {
    console.log(req.body, "====");
    var text = req.body.text;
    var hospitalId = req.body.hospitalId
    var branchId = req.body.branchId
    console.log('vaibhav', text)
    const command = `Select * ,concat(providertitle,' ',firstname,' ',Lastname)  as completeName from provider_personal_identifiers where firstname like '%${text}%' AND hospital_id='${hospitalId}' AND branchId='${branchId}'`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});


router.post('/SaveTaskData', async (req, res) => {
    console.log(req.body, "this is the body===============================");
    var hospitalId = req.body.hospitalId ?? ''
    var branchId = req.body.branchId ?? ''
    var status = req.body.categaryname.id ?? ''
    var create_task = req.body.create_task_form ?? ''
    var assigned_by = create_task.assigned_by.Id ?? '' 
    var patientguid = create_task.assigned_for.guid ?? ''
    var assigned_for = create_task.assigned_for.id ?? ''
    var id = req.body.create_task_form.id

    // console.log(id, "this is the assigned by id ");
    var due_date = new Date(create_task.due_date);
    var yyyy = due_date.getFullYear();
    var mm = due_date.getMonth() + 1;
    var dd = due_date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    var formattedStartDate = mm + '/' + dd + '/' + yyyy ?? ''
    console.log(formattedStartDate, "formated date");

    var before_due_date = create_task.Beforeduedate.name ?? '';
    // console.log(before_due_date, "this is the before the due date");
    var task_Reminderintervals = create_task.Reminderintervals.name ?? ''

    if (!create_task) {
        return res.status(404).json({ error: "something missing create_task_form" });
    }
    var command;

    if (id == '' || id == null || id == undefined) {
        command = `INSERT INTO task(hospitalId, patientguid, branchId, category, shortName, description, assigned_by, assigned_for, task_owner, IsPatientspecific, before_due_date, task_Reminderintervals, priority, status, due_date, Beforeduedatenum, Reminderintervalsnum, Frequencytype, AlertFrequency) VALUES('${hospitalId}', '${patientguid}', '${branchId}', '${create_task.category}', '${create_task.shortName}', '${create_task.description}', '${assigned_by}', '${assigned_for}', '${create_task.task_owner}', '${create_task.IsPatientspecific}', '${before_due_date}', '${task_Reminderintervals}', '${create_task.priority}', '${status}', '${formattedStartDate}', '${create_task.Beforeduedatenum}', '${create_task.Reminderintervalsnum}', '${create_task.Frequencytype}', '${create_task.AlertFrequency}')`;
    } else {
        command = `UPDATE task SET shortName='${create_task.shortName}', description='${create_task.description}', assigned_by='${assigned_by}', assigned_for='${assigned_for}', task_owner='${create_task.task_owner}', IsPatientspecific='${create_task.IsPatientspecific}', priority='${create_task.priority}', status='${create_task.status}', due_date='${formattedStartDate}', before_due_date='${before_due_date}', task_Reminderintervals='${task_Reminderintervals}', Beforeduedatenum='${create_task.Beforeduedatenum}', Reminderintervalsnum='${create_task.Reminderintervalsnum}', Frequencytype='${create_task.Frequencytype}', AlertFrequency='${create_task.AlertFrequency}' WHERE id='${id}'`;
    }
    // console.log(command, "this is the update query here");
    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
});

//save reminder time
router.post('/saveRiminderTask', async (req, res) => {
    var create_task = req.body.create_task_form ?? ''
    // console.log(create_task, "this is the body of remiderTasksdfsdf");
    var assigned_by = create_task.assigned_by.Id ?? '' 
    var patientguid = create_task.assigned_for.guid ?? ''
    var id = req.body.create_task_form.id ?? ''
    var data = req.body.data ?? ''
    // var taskId = req.body.taskId;
    let i = 0;
    (function loop() {
        console.log(data.length);
      if (i < data.length) {
        const command = `INSERT INTO  master_task_reminder( patientId, reminder_dateGenerate) values('${patientguid}','${data[i].data}')`;
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
    
});


router.get('/getTaskData', (req, res) => {


    const command = `SELECT t.id,t.patientguid,t.branchId,  t.hospitalId, t.category, t.shortName,t.description,t.assigned_by,t.assigned_for, t.task_owner,   t.Ispatientspecific, t.priority, t.status, t.due_date, t.task_Reminderintervals,t.AlertFrequency,   t.Beforeduedatenum, t.Reminderintervalsnum,concat(t.Reminderintervalsnum , ' ', t.before_due_date) as Remindersnum , t.Frequencytype,
    -- Alias for mp.id
    mp.id AS mp_id, mp.guid, mp.active,  mp.hospitalId AS mp_hospitalId, mp.branchId AS mp_branchId,  mp.prefix,mp.firstName, mp.middleName, mp.lastName, mp.suffix,mp.completeName, mp.displayName,   mp.nickName,mp.previousName, mp.dateOfBirth,mp.smokingStatus,mp.patientsId,mp.deceasedStatus,mp.deceasedDate,mp.deceasedReason,mp.maritalStatus,mp.familySize,mp.monthlyIncome,mp.preferredLanguage,  mp.bloodGroup,mp.tag,mp.sex, mp.sogiDeclaration, mp.sexualOrientation,mp.age,  mp.phone_no, mp.imgSrc, mp.mobilecodes,
    -- Alias for mtc.id
	mtc.id AS msc_id,mtc.name AS msc_name,mtc.lang_id,
    -- Alias for mtp.id
    mtp.id AS mtp_id,mtp.priority_label,
    -- Alias for mts.id
    mts.id AS mts_id, mts.task_status,
    -- Alias for mft.id
    mft.id AS mft_id, mft.name AS mft_name, mft.ids
FROM task t
LEFT JOIN master_patient mp ON t.assigned_for = mp.id
LEFT JOIN master_task_category mtc ON t.category = mtc.id
LEFT JOIN master_task_priority mtp ON t.priority = mtp.id
LEFT JOIN master_task_status mts ON t.status = mts.id
LEFT JOIN master_frefuencytime mft ON t.task_Reminderintervals = mft.name`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


router.post('/getTaskSingleData', (req, res) => {
    var id = req.body.id;
    const command = `select * from task where id='${id}']`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/deleteTask', (req, res) => {
    var id = req.body.id;
    const command = `delete from task where id='${id}' `;
    console.log(command, "tnis is the task delete")
    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
})


// router.post('/update_Task', (req, res) => {
//     console.log(req.body, "this is the task form ");
//     var hospitalId = req.body.hospitalId;
//     var branchId = req.body.branchId;
//     var create_task = req.body.create_task_form;
//     var assigned_by = create_task.assigned_by.completeName;
//     var patientguid = create_task.assigned_by.patientsId;

//     var due_date = new Date(create_task.due_date);
//     var yyyy = due_date.getFullYear();
//     var mm = due_date.getMonth() + 1;
//     var dd = due_date.getDate();

//     if (dd < 10) dd = '0' + dd;
//     if (mm < 10) mm = '0' + mm;

//     var formattedStartDate = dd + '/' + mm + '/' + yyyy;
//     console.log(formattedStartDate, "formated date");

//     if (!create_task) {
//         return res.status(404).json({ error: "something missing create_task_form" });
//     }
//     let { category, shortName, description, assigned_for, task_owner, IsPatientspecific, priority, status, reminder_frequency } = create_task;

//     const command = `Update transation_disesereminder set category='${category}', shortName='${shortName}',description='${description}',assigned_for='${assigned_for}',task_owner='${task_owner}' ,IsPatientspecific='${IsPatientspecific}' ,priority='${priority}' ,status='${status}' ,reminder_frequency='${reminder_frequency}' where id='${id}';`;

//     console.log('', command)
//     execCommand(command)
//         .then(result => res.json('success'))
//         .catch(err => logWriter(command, err));
// })

router.get('/getCategory', (req, res) => {

    const command = `SELECT * FROM master_task_category`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


});
router.post('/addcategory', (req, res) => {
    console.log(req.body, "this is category console");
    var categorygetbody = req.body.addCategoryform;
    console.log(categorygetbody, "categorygetbod");
    var name = categorygetbody.category;
    console.log(name, "this is name console");
    const command = `insert into master_task_category(name) values('${name}')`;
    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
})

router.get('/getTaskPriority', (req, res) => {

    const command = `SELECT * FROM master_task_priority`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})

router.get('/getTaskStatus', (req, res) => {

    const command = `SELECT * FROM master_task_status`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})

router.get('/getTaskdataforpatch', (req, res) => {

    const command = `SELECT * 
      FROM task ts 
      LEFT JOIN master_patient mp ON ts.assigned_for = mp.id`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


});

router.post("/getpatientwithid", (req, res) => {
    console.log('vaibhav couhan')
    var text = req.body.text;
    console.log('vaibhav', text)
    const command = `Select * from master_patient where displayName like '%${text}%'`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});


router.post("/get_provider_data", (req, res) => {
    console.log(req.body);
    var guid = req.body.hospital_id;
    // var command = `SELECT * FROM provider_schedular where guid='${guid}'`;
    var command = `SELECT * FROM provider_personal_identifiers where branchId ='${guid}'`
    console.log('getScheduledata', command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


module.exports = router;