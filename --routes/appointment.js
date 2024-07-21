const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

router.get('/getMasterAppointmentType',(req,res)=>{
    
    const command =`select * from master_appointment_type`;
    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
 })  


router.post('/get_calendar_events',(req,res)=>{
    var branch_id = req.body.branch_id;

    const command =`select id,concat('Appointment with ',patient_name) as title,  provider_id as resourceId, replace(start_time, ' ', 'T') as start, replace(end_time, ' ', 'T') as end from transaction_appointment where branch_id = '${branch_id}'; select event_title as title, replace(date_time, ' ', 'T') as start from transaction_event where branch_id = '${branch_id}';`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
 }) 


router.post('/checkTimeAvailabilityForProvider',(req,res)=>{
    var branch_id = req.body.branch_id;
    var provider_id = req.body.provider_id;
    var dateTime = formatDate(req.body.date);
    var date = new Date(`${dateTime}`);
    // var day = date.getDay()
    // console.log(day.getDay());
    // var branch_id = req.body.branch_id;
    const command =`select * from provider_hours where branch_id  = '${branch_id}' and provider_id = '${provider_id}' and numeric_days = '${date.getDay()}' and open<='${dateTime.split(' ')[1]}' and close>'${dateTime.split(' ')[1]}';`;
    console.log(command);
    execCommand(command)
    .then(result => {
        if(result.length>0){
            res.json(true)
        }
    })
    .catch(err => logWriter(command, err));
 })  

 function formatDate(dateToBeFormatted){
    if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){

        var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
        date = new Date(date);
        // ("0" + (this.getMonth() + 1)).slice(-2)
        var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
        console.log(dateReturn);
        return dateReturn
    }
    else{
        return ''
    }
 }


router.post('/SaveAppointment',(req,res)=>{
    console.log(req.body);
    var patient_name = req.body.AddAppointments.PatientName.displayName;
    var patient_id = req.body.AddAppointments.PatientName.guid;
    var provider_name = req.body.AddAppointments.ProviderName.firstname;
    var provider_id = req.body.AddAppointments.ProviderName.guid;
    var resourcename = req.body.AddAppointments.ResourceName
    var appointmenttype = req.body.AddAppointments.Appointmenttype
    var datetimetype = req.body.AddAppointments.dateTimeType;
    var startdate = formatDate(req.body.AddAppointments.StartDate);
    var enddate = formatDate(req.body.AddAppointments.Enddate);
    var starttime = formatDate(req.body.AddAppointments.StartTime);
    var EndTimeAppointment = formatDate(req.body.AddAppointments.EndTimeAppointment);
    var duration = req.body.AddAppointments.Durations;
    var Frequency = req.body.AddAppointments.Frequency;
    
    var visit_type = req.body.AddAppointments.visit_type;
    var reasonOfVisit = req.body.AddAppointments.reasonOfVisit;
    var visit_status = req.body.AddAppointments.visit_status;

    var Notification = req.body.AddAppointments.Notification;
    var Message = req.body.AddAppointments.Message;
    var AddLocation = req.body.AddAppointments.AddLocation;
    var Linkforvideoconsult = req.body.AddAppointments.Linkforvideoconsult;
    
    var SendPHRInvitation = req.body.AddAppointments.SendPHRInvitation;
    var ShereQuestionnaire = req.body.AddAppointments.ShereQuestionnaire;
    var ShareConsent = req.body.AddAppointments.ShareConsent;
    var Alerts = req.body.AddAppointments.Alerts;
    
    var hospital_id = req.body.hospitalId
    var branch_id = req.body.branchId

    var insertAppointment = `insert into transaction_appointment (hospital_id, branch_id, patient_id, patient_name, provider_id, provider_name, resource, Appointment_type, data_time_type, start_date, end_date, start_time, end_time, Duration, Frequency, visit_type, reason_of_visit, visit_status, Notification, Message, Add_location, Linkof_video, Send_phr_Invitation, Share_Questionnarie, ShareConsents, Alerts)
    values('${hospital_id}','${branch_id}','${patient_id}','${patient_name}','${provider_id}','${provider_name}','${resourcename}','${appointmenttype}','${datetimetype}','${startdate}','${enddate}','${starttime}','${EndTimeAppointment}','${duration}', '${Frequency}', '${visit_type}', '${reasonOfVisit}', '${visit_status}', '${Notification}', '${Message.replace(/'/g,"''").replace(/"/g,'""')}', '${AddLocation}', '${Linkforvideoconsult}', '${SendPHRInvitation}', '${ShereQuestionnaire}', '${ShareConsent}', '${Alerts}');`
    console.log(insertAppointment);
    execCommand(insertAppointment.replace(/null/g,''))
        .then(result => res.json('success'))
        .catch(err => logWriter(insertAppointment, err));
    // }
    // console.log(hospital_id, branch_id)

    // var d = new Date(starttime)
    // console.log(d.getFullYear(), d.getMonth(),d.getDate(), d.getHours(), d.getMinutes());

    // var hospitalId = req.body.hospitalId;
    // var patientGuid=req.body.patientguid;
    // var  branchId=req.body.branchId
    // var {id,PatientName,Appointmenttype,DateTimes,Duration,Frequency,StartDate,Enddate,VisitType,VisitStatus,Notification,Message,AddLocation,SendPHRInvitation,ShereQuestionnaire,ShareConsent,Alerts,Linkforvideoconsult}=req.body.AddAppointments 
    // var FacilityName=req.body.AddAppointments.FacilityName.id
    // let date=new Date();
    // StartDate=date.toISOString().split('T')[0];
    // Enddate=date.toISOString().split('T')[0];
    // var PatientName=req.body.AddAppointments.PatientName.guid;
    // var ProviderName=req.body.AddAppointments.ProviderName.Firstname;
    // var Resignofvisit=req.body.AddAppointments.Resignofvisit.id;
    // var ResourceName=req.body.AddAppointments.ResourceName.id;
    
   
        
    // if(id=='' || id=='0' || id==undefined || id==null){
    // const command =`INSERT INTO  master_appointment(HospitalId, Branch_Id, Patient_Id, Facility, Patient_Name, Provider_Name, Resource, Appointment_type, Data_Timel, Frequency, Start_Date, End_Date, Duration, Visit_type, Resign_of_Visit, Notification, Message, Add_location, Linkof_video, Send_phr_Invitation, Share_Questionnarie, ShareConsents, Alerts,Visit_Status) values ('${hospitalId}','${branchId}','${patientGuid}','${FacilityName}','${PatientName}','${ProviderName}','${ResourceName}','${Appointmenttype}','${DateTimes}','${Frequency}','${StartDate}','${Enddate}','${Duration}','${VisitType}','${Resignofvisit}','${Notification}','${Message}','${AddLocation}','${Linkforvideoconsult}','${SendPHRInvitation}','${ShereQuestionnaire}','${ShareConsent}','${Alerts}','${VisitStatus}')`;
    // execCommand(command)
    // .then(result => res.json('success'))
    // .catch(err => logWriter(command, err));
    // }
    // else{
    //     const command =`Update master_appointment set Facility='${FacilityName}', Patient_Name='${PatientName}', Provider_Name='${ProviderName}', Resource='${ResourceName}',Appointment_type='${Appointmenttype}', Data_Timel='${DateTimes}', Frequency='${Frequency}',Start_Date='${StartDate}', End_Date='${Enddate}' ,Duration='${Duration}',Visit_type='${VisitType}',Resign_of_Visit='${Resignofvisit}',Notification='${Notification}',Message='${Message}',Add_location='${AddLocation}',Linkof_video='${Linkforvideoconsult}',Send_phr_Invitation='${SendPHRInvitation}',ShareConsents='${ShareConsent}',Share_Questionnarie='${ShereQuestionnaire}',Alerts='${Alerts}',Visit_Status='${VisitStatus}' where id='${id}';`;       
    //     execCommand(command)
    //     .then(result => res.json('update'))
    //     .catch(err => logWriter(command, err));
    // }
    
 }) 
 router.post('/SaveAddPatient',(req,res)=>{

    var {First_Name,Last_Name,phone_no,Date_Of_Birth }=req.body.Add_Patientform
    var hospitalId = req.body.hospitalId;
 
    var  branchId=req.body.branchId

    var guid = newGuid()

    
    // var {Name, Relation, sex, birthdate, birthdate, Age, Alive, OnsetDate, Source, notess, Problem}=req.body.AddFamilyForm;
    
    const command =`INSERT INTO  master_patient ( hospitalId, branchId, guid, firstName, lastName, dateOfBirth, phone_no) values('${hospitalId}','${branchId}','${guid}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${phone_no}')`;
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
 })  


 function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
 
  router.post('/Get_Patient_Detail',(req,res)=>{
    var completename=req.body.text;
    var branchId=req.body.branchId;

    const command =`Select guid, displayName from master_patient where displayName like '${completename}%' and branchId='${branchId}'`;
    console.log(command);
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/Get_Facility_Detail',(req,res)=>{
    // var display_name = req.body.event; 
    var completename=req.body.text;
  
    const command =`Select * from transaction_place_of_practice where clinic_name like '%${completename}%'`;
 
    
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/Get_resource_Detail',(req,res)=>{
    // var display_name = req.body.event; 
    var completename=req.body.text;
  
    const command =`Select * from master_resorce_appointment where ResourceName like '%${completename}%'`;
 
    
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/Get_Persinal_Identifire_Detail',(req,res)=>{
    var completename=req.body.text;
    var branchId=req.body.branchId;
    const command =`Select guid, firstname from provider_personal_identifiers  where Firstname like '%${completename}%' and branchId = '${branchId}'`;
        console.log(command);
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
router.post('/SaveTask_Appointment',(req,res)=>{

 
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientGuid;
    var  branchId=req.body.branchId

    

    
    // var {Name, Relation, sex, birthdate, birthdate, Age, Alive, OnsetDate, Source, notess, Problem}=req.body.AddFamilyForm;
    
    // const command =`INSERT INTO  master_patient ( hospitalId, branchId, guid, firstName, lastName, dateOfBirth, phone_no) values('${hospitalId}','${branchId}','${guid}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${phone_no}')`;
    // console.log(command);
    // execCommand(command)
    // .then(result => res.json('success'))
    // .catch(err => logWriter(command, err));
 })  
 router.post('/SaveEvent',(req,res)=>{ 
 
     var creatorId = req.body.creatorId;
     var hospitalId = req.body.hospitalId;
     var branchId = req.body.branchId;

     var FacilityName = req.body.EventAppointment.FacilityName;
     var ScheduleFor = req.body.EventAppointment.ScheduleFor;
     var Status = req.body.EventAppointment.Status;
     var Event_title = req.body.EventAppointment.Event_title;
     var DateTime = formatDate(req.body.EventAppointment.DateTime);
     var Notification = req.body.EventAppointment.Notification;
     var Message = req.body.EventAppointment.Message;
     var AddLocation = req.body.EventAppointment.AddLocation;
   
    console.log(DateTime, 'event');

    var command =  `insert into transaction_event (creator_id,  hospital_id, branch_id, schedule_for, status, event_title, date_time, notification, message, location) 
    values('${creatorId}','${hospitalId}','${branchId}','${ScheduleFor}','${Status}','${Event_title}','${DateTime}','${Notification}','${Message}','${AddLocation}')`
    console.log(command);
    // var {Name, Relation, sex, birthdate, birthdate, Age, Alive, OnsetDate, Source, notess, Problem}=req.body.AddFamilyForm;
    
    // const command =`INSERT INTO  master_patient ( hospitalId, branchId, guid, firstName, lastName, dateOfBirth, phone_no) values('${hospitalId}','${branchId}','${guid}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${phone_no}')`;
    // console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
 }) 
 router.post('/Get_Appointment',(req,res)=>{
//     console.log('req.body.AddAdmission1111111111');
//     console.log(req.body.AddAppointments);
    var hospitalId = req.body.hospitalId;
   var patientGuid=req.body.patientguid;
   
    var  branchId=req.body.branchId
//     console.log(hospitalId,'1111111111111111111111111')
//     console.log(branchId)
  
//    var PatientName=req.body.AddAppointments.PatientName.displayName;
//    var ProviderName=req.body.AddAppointments.ProviderName.Firstname;
//    console.log('eeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrr',PatientName,ProviderName);
    
    // var {Name, Relation, sex, birthdate, birthdate, Age, Alive, OnsetDate, Source, notess, Problem}=req.body.AddFamilyForm; where id='${id}';
    // HospitalId, Branch_Id, Patient_Id, Facility, Patient_Name, Provider_Name, 
    const command =`Select *,(select clinic_name from transaction_place_of_practice where id=master_appointment.Facility) as Facility, (select ResourceName from master_resorce_appointment where id=master_appointment.Resource) as Resource,(select term from description_snapshot where id=master_appointment.Resign_of_Visit) as Resign_of_Visitc from master_appointment  where HospitalId='${hospitalId}' AND Branch_Id='${branchId}' AND Patient_Id='${patientGuid}'`;
    
  
    
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
 }) 
router.post('/getmaster_problem', (req, res) => {
    var text = req.body.text;
    console.log(text);

    const command = `SELECT description_snapshot.id, description_snapshot.term FROM description_snapshot INNER JOIN extendedmapsnapshot_2 ON description_snapshot.conceptId = extendedmapsnapshot_2.referencedComponentId where  description_snapshot.typeId = '900000000000013009' and term like '%${text}%' and extendedmapsnapshot_2.active = '1' order by conceptId limit 50`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})



// _______________________________________________________________________________________________________________________________________________________________________________________



router.post("/getProviderSlotsForCalendar", (req, res) => {
    console.log('provider slots',req.body);
    var hospital_id = req.body.hospital_id
    var branch_id = req.body.branch_id
    var provider_id = req.body.selected_provider
    const command = `select * from provider_hours where slot = '1' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
                     select * from provider_hours where slot = '2' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
                     select * from provider_hours where slot = '3' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
                     select * from provider_hours where slot = '4' and branch_id = '${branch_id}' and provider_id = '${provider_id}';`
    execCommand(command)
      .then((result) => res.json(result))
      .catch((err) => logWriter(command, err));
  });
 module.exports =router;