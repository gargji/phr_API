const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gaurang@dnavigation.com',
    pass: 'gazcyutoqeemteek'
  }
});

var mailOptions = {
  from: 'Healaxy <gaurang@dnavigation.com>',
  to: '',
  subject: '',
  html: ``
};


router.post("/transactionAppointment", (req, res) => {
  // console.log('provider slots',req.body);
  var hospital_id = req.body.organizationID
  var branch_id = req.body.branchID
  // var branch_id = req.body.branch_id,reason_of_visit
  // var provider_id = req.body.selected_provider

  // const command = `select *,(select appointment_type from master_appointment_type where id=transaction_appointment.Appointment_type) as appointmentType,
  // (select term from description_snapshot where id=transaction_appointment.reason_of_visit) as problem,
  // (select patientsId from master_patient where guid=transaction_appointment.patient_id) as profile,
  // (select id from transaction_encounter where appointmentId=transaction_appointment.id) as mrn,
  // (select transactionTime from transaction_encounter where appointmentId=transaction_appointment.id) as timeEncounter,
  // (select visit_status from master_visit_status where id=transaction_appointment.visit_status) as visit_statusName,
  // (select visit_type from master_visit_type where id=transaction_appointment.visit_type) as VistTypeName from transaction_appointment;`;
  const command = `SELECT
    transaction_appointment.*,
    master_appointment_type.appointment_type AS appointmentType,
    master_chief_complaints.name AS problem,
    master_patient.patientsId AS profile,
    transaction_encounter.id AS mrn,
    transaction_encounter.transactionTime AS timeEncounter,
    master_visit_status.visit_status AS visit_statusName,
    master_visit_type.visit_type AS VistTypeName
  FROM
    transaction_appointment
    LEFT JOIN master_appointment_type ON master_appointment_type.id = transaction_appointment.Appointment_type
    LEFT JOIN master_chief_complaints ON master_chief_complaints.id = transaction_appointment.reason_of_visit
    LEFT JOIN master_patient ON master_patient.guid = transaction_appointment.patient_id
    LEFT JOIN transaction_encounter ON transaction_encounter.appointmentId = transaction_appointment.id
    LEFT JOIN master_visit_status ON master_visit_status.id = transaction_appointment.visit_status
    LEFT JOIN master_visit_type ON master_visit_type.id = transaction_appointment.visit_type where hospital_id='${hospital_id}' and branch_id='${branch_id}' And DATE(start_date) = CURDATE()`;
  console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
})

router.get('/getMasterAppointmentType', (req, res) => {
  const command = `select * from master_appointment_type`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/get_master_visit_status', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_visit_status where lang_id = '${lang_id}' and status = 'A' order by sequence`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/get_master_date_time_type', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_appointment_date_time_type where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_visit_type', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_visit_type where lang_id = '${lang_id}' and status = 'A'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_duration', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_appointment_duration where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/getHospitalResources', (req, res) => {
  const lang_id = req.body.langId
  var hospitalId = req.body.hospitalData.guid
  var branchId = req.body.hospitalData.branchId
  const command = `select * from master_location where  lang_id = '${lang_id}' AND hospital_id='${hospitalId}' AND branch_id='${branchId}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/get_master_boolean', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_boolean where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_notification', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_notification where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_event_status', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_event_status where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_event_audience', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_event_audience where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_task_category', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_task_category where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_master_priority', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_priority where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/get_master_frequency', (req, res) => {
  const lang_id = req.body.langId
  const command = `select * from master_frequency where lang_id = '${lang_id}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/get_calendar_events', (req, res) => {
  var branch_id = req.body.branch_id;

  const command = `select id, visit_status, Appointment_type, (select appointment_type from master_appointment_type where id = transaction_appointment.Appointment_type) as appointment_type_name, visit_type, (select visit_type from master_visit_type where id = transaction_appointment.visit_type) as visit_type_name,concat('Appointment with ',patient_name) as title,  provider_id as resourceId, (select location_name from master_location where id = transaction_appointment.resource) as rscname , resource as rsc, replace(start_time, ' ', 'T') as start, replace(end_time, ' ', 'T') as end from transaction_appointment where branch_id = '${branch_id}'; select event_title as title, replace(date_time, ' ', 'T') as start from transaction_event where branch_id = '${branch_id}';`;
  console.log('command', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/checkTimeAvailabilityForProvider', (req, res) => {
  var branch_id = req.body.branch_id;
  var provider_id = req.body.provider_id;
  var dateTime = formatDate(req.body.date);
  var date = new Date(`${dateTime}`);

  const command = `select * from provider_hours where branch_id  = '${branch_id}' and provider_id = '${provider_id}' and numeric_days = '${date.getDay()}' and open<='${dateTime.split(' ')[1]}' and close>'${dateTime.split(' ')[1]}';`;
  console.log(command);
  execCommand(command)
    .then(result => {
      if (result.length > 0) {
        res.json(true)
      }
      else {
        res.json(false)
      }
    })
    .catch(err => logWriter(command, err));
})

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

async function sendEmailConfirmation(startdate, patient_email_id, provider_email_id, provider_name, patient_name, duration, receiver) {
  var date = new Date(startdate);
  var first_person_id = '';
  var first_person_name = '';
  var second_person_id = '';
  var second_person_name = '';
  var subject = '';

  if (receiver == 'toPatient') {
    first_person_id = patient_email_id;
    second_person_id = provider_email_id;
    first_person_name = patient_name;
    second_person_name = `Dr. ${provider_name}`;
    subject = 'Appointment Comfirmation!';
  }
  else {
    first_person_id = provider_email_id;
    second_person_id = patient_email_id;
    first_person_name = `Dr. ${provider_name}`;
    second_person_name = `Patient (${patient_name})`;
    subject = 'Appointment Comfirmation!';
  }

  if (second_person_id != '' && first_person_name != '' && second_person_name != '') {

    mailOptions.subject = subject;
    mailOptions.to = first_person_id;
    mailOptions.html = `<!DOCTYPE html>
    <html>
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Appointment Confirmation</title>
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
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Appointment confirmation..!</h1>
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
                  <p style="margin: 0;">Hi ${first_person_name},</p>
                  <p style="margin: 0; margin-top: 10px;">You have an appointment scheduled with ${second_person_name} for ${duration} Minutes on, <span style="margin: 0;  margin-top: 20px; font-size: 1.2rem; font-weight: bold;"">${date.toGMTString()}</span></p>
                  
                </td>
              </tr>
              <!-- end copy -->
    
              <!-- start button -->
              <tr>
                <td align="left" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            For more details login to <a>https://healaxy.com</a>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
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
    </html>`;

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        //  res.json('success')
      }

    });
  }




}


router.post('/SaveAppointment', (req, res) => {
  var patient_id = req.body.AddAppointments.PatientName?.guid;
  var patient_name = req.body.AddAppointments.PatientName?.completeName;
  var patient_email_id = req.body.AddAppointments.PatientName?.email;
  var provider_id = req.body.AddAppointments.ProviderName?.guid;
  var provider_name = req.body.AddAppointments.ProviderName?.firstname;
  var provider_email_id = req.body.AddAppointments.ProviderName.email;
  var resourcename = req.body.AddAppointments.ResourceName?.id
  var resource_names = req.body.AddAppointments.ResourceName?.location_name
  var appointmenttype = req.body.AddAppointments?.Appointmenttype
  var datetimetype = req.body.AddAppointments.dateTimeType;
  var startdate = formatDate(req.body.AddAppointments?.StartDate);
  var enddate = formatDate(req.body.AddAppointments?.Enddate);
  var starttime = formatDate(req.body.AddAppointments?.StartTime);
  var EndTimeAppointment = formatDate(req.body.AddAppointments?.EndTimeAppointment);
  var duration = req.body.AddAppointments?.Durations;
  var Frequency = req.body.AddAppointments?.Frequency;
  var visit_type = req.body.AddAppointments?.visit_type;
  var reasonOfVisit = req.body.AddAppointments?.reasonOfVisit.id;
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
  var branch_id = req.body.AddAppointments.Facility
  if (req.body.state == 'new') {

    if (datetimetype == 'R') {
      var my = new Date();
      // getrecurringAppointments(startdate, enddate, starttime, EndTimeAppointment);
      var st = new Date(starttime) // short for startdate
      var et = new Date(EndTimeAppointment); // short for enddate
      var loopVal = st.getTime();
      (function loop() {
        if (loopVal < et.getTime()) {
          var newst = new Date(loopVal)                   // short for new startdate
          var newet = new Date(loopVal + (duration * 60000))  // short for new enddate
          var insertAppointment = `insert into transaction_appointment (resource_name,hospital_id, branch_id, patient_id, patient_name, provider_id, provider_name, resource, Appointment_type, data_time_type, start_date, end_date, start_time, end_time, Duration, Frequency, visit_type, reason_of_visit, visit_status, Notification, Message, Add_location, Linkof_video, Send_phr_Invitation, Share_Questionnarie, ShareConsents, Alerts) values('${resource_names}','${hospital_id}','${branch_id}','${patient_id}','${patient_name}','${provider_id}','${provider_name}','${resourcename}','${appointmenttype}','${datetimetype}','${formatDate(newst)}','${formatDate(newet)}','${formatDate(newst)}','${formatDate(newet)}','${duration}', '${Frequency}', '${visit_type}', '${reasonOfVisit}', '${visit_status}', '${Notification}', '${Message?.replace(/'/g, "''")?.replace(/"/g, '""')}', '${AddLocation}', '${Linkforvideoconsult}', '${SendPHRInvitation}', '${ShereQuestionnaire}', '${ShareConsent}', '${Alerts}');`
          execCommand(insertAppointment.replace(/null/g, ''))
            .then(result => {
              loopVal = parseInt(loopVal) + parseInt(Frequency);
              loop();
            })
            .catch(err => logWriter(insertAppointment, err));
        }
        else {
          var command = `select count(*) as count from phr_login_details where guid = '${patient_id}'`
          execCommand(command)
            .then(result => {
              if (result[0].count == 0) {
                mailOptions.to = `${patient_email_id}`
                mailOptions.subject = `Email verification for PHR`
                mailOptions.html = `<!DOCTYPE html>
                <html>
                <head>
                
                  <meta charset="utf-8">
                  <meta http-equiv="x-ua-compatible" content="ie=edge">
                  <title>Email verification for PHR</title>
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
                              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Email verification for  PHR </h1>
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
                              <p style="margin: 0;">Hi Aman,</p>
                              <p>Thank you for choosing Healaxy, please use following link  to activate your PHR Account</p>
                              <a href="${url}registration?hopitalID=${hospital_id}&patientID=${patient_id}" target="_blank">${url}registration?hopitalID=${hospital_id}&patientID=${patient_id}</a>
                              <h2 style="width: max-content;padding: 0 10px;color: #fff;"> Email:${patient_email_id}</h2>
                              
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

                // transporter.sendMail(mailOptions, function(error, info){
                //   if (error) {
                //    console.log(error);
                //   } else {
                //     console.log('Email sent: ' + info.response);
                //     res.json('success')
                //   }
                // });
              } else {
                res.json('success')
              }
            })
        }
      }());
    }
    else {

      var insertAppointment = `insert into transaction_appointment (hospital_id, branch_id, patient_id, patient_name, provider_id, provider_name, resource, Appointment_type, data_time_type, start_date, end_date, start_time, end_time, Duration, Frequency, visit_type, reason_of_visit, visit_status, Notification, Message, Add_location, Linkof_video, Send_phr_Invitation, Share_Questionnarie, ShareConsents, Alerts) values('${hospital_id}','${branch_id}','${patient_id}','${patient_name}','${provider_id}','${provider_name}','${resourcename}','${appointmenttype}','${datetimetype}','${startdate}','${enddate}','${starttime}','${EndTimeAppointment}','${duration}', '${Frequency}', '${visit_type}', '${reasonOfVisit}', '${visit_status}', '${Notification}', '${Message?.replace(/'/g, "''").replace(/"/g, '""')}', '${AddLocation}', '${Linkforvideoconsult}', '${SendPHRInvitation}', '${ShereQuestionnaire}', '${ShareConsent}', '${Alerts}');`
      sendEmailConfirmation(startdate, 'gaurangvishnoi.1703@gmail.com', 'gaurang@dnavigation.com', provider_name, patient_name, duration, 'toPatient');
      sendEmailConfirmation(startdate, 'gaurangvishnoi.1703@gmail.com', 'gaurang@dnavigation.com', provider_name, patient_name, duration, 'toDoctor');
      // sendEmailConfirmation(startdate, patient_email_id, provider_email_id, provider_name, patient_name, duration, 'toPatient');
      // sendEmailConfirmation(startdate, patient_email_id, provider_email_id, provider_name, patient_name, duration, 'toDoctor');

      execCommand(insertAppointment.replace(/null/g, ''))
        .then(result => {
          var obj = { date: startdate, time: starttime, provider_id: provider_id, patient_id: patient_id, provider_name: provider_name, patient_name: patient_name, patient_email: patient_email_id, provider_email: provider_email_id, duration: duration, hospital_id: hospital_id, branch_id: branch_id }
          createLinkForVideoAppointment(obj)
            .then((result) => {
              if (result == 'ok') {
                res.json('success')
              }
            }).catch((error) => {
              console.log(error);
            })
        }).catch(err => logWriter(insertAppointment, err));
    }
  }
  else {
    id = req.body.AddAppointments.id
    var sql = `update transaction_appointment set patient_id = '${patient_id}',branch_id='${branch_id}', patient_name = '${patient_name}', provider_id = '${provider_id}', provider_name = '${provider_name}', resource = '${resourcename}',resource_name = '${resource_names}', Appointment_type = '${appointmenttype}', data_time_type = '${datetimetype}', start_date = '${formatDate(starttime)}', end_date = '${formatDate(EndTimeAppointment)}', start_time = '${formatDate(starttime)}', end_time = '${formatDate(EndTimeAppointment)}', Duration = '${duration}',  Frequency = '${Frequency}', visit_type = '${visit_type}', reason_of_visit = '${reasonOfVisit}', visit_status = '${visit_status}', Notification = '${Notification}', Message = '${Message?.replace(/'/g, "''").replace(/"/g, '""')}', Add_location = '${AddLocation}', Linkof_video = '${Linkforvideoconsult}',  Send_phr_Invitation = '${SendPHRInvitation}', Share_Questionnarie = '${ShereQuestionnaire}', ShareConsents = '${ShareConsent}', Alerts = '${Alerts}' where id = '${id}'`
    execCommand(sql.replace(/null/g, ''))
      .then(result => {
        res.json('success')
      })
      .catch(err => logWriter(insertAppointment, err));
  }
})


router.post('/SaveWaitilist', (req, res) => {
  console.log(req.body);
  var patient_id = req.body.AddAppointments.PatientName.guid;
  var patient_name = req.body.AddAppointments.PatientName?.completeName;
  var patient_email_id = req.body.AddAppointments.PatientName?.email;
  var Facility = req.body.AddAppointments.FacilityName
  var provider_id = req.body.AddAppointments.ProviderName?.guid;
  var provider_name = req.body.AddAppointments.ProviderName?.firstname;
  var provider_email_id = req.body.AddAppointments.ProviderName?.email;
  var resourcename = req.body.AddAppointments.ResourceName?.id
  var appointmenttype = req.body.AddAppointments.Appointmenttype
  var datePreferanceDAte = req.body.AddAppointments.DatePreference
  var DatePreferenceOption = []
  DatePreferenceOption = req.body.AddAppointments.DatePreferenceOption
  var datepreferance = []
  if (req.body.AddAppointments.FromTime != null || req.body.AddAppointments.ToTime != null) {
    var FromDatePeriod = formatDate(req.body.AddAppointments.FromDatePeriod.split('T')[0])
    var ToDatePeriod = formatDate(req.body.AddAppointments.ToDatePeriod.split('T')[0])
    var FromDate = FromDatePeriod.split(' ')[0]
    var ToDate = ToDatePeriod.split(' ')[0]
    var time = new Date(ToDate)
    var t = time.getTime()
    console.log(t);
  } else {
    FromDate = ''
    ToDate = ''
  }
  var TimePreference = req.body.AddAppointments.TimePreference
  var reason = req.body.AddAppointments.reason;
  console.log(req.body.AddAppointments.FromTime);
  if (req.body.AddAppointments.FromTime != null || req.body.AddAppointments.ToTime != null) {
    var FromTime = formatDate(req.body.AddAppointments.FromTime);
    var ToTime = formatDate(req.body.AddAppointments.ToTime);
    var st = new Date(FromTime) // short for startdate
    var et = new Date(ToTime)
    var Stime = st.getTime()
    var newst = new Date(Stime)
    var Etime = et.getTime()
    var newEt = new Date(Etime)
    var Sttime = formatDate(newst)
    var EtTime = formatDate(newEt)
  } else {
    Sttime = ''
    EtTime = ''
  }

  var visit_status = req.body.satus
  var hospital_id = req.body.hospitalId
  var branch_id = req.body.branchId
  if (datePreferanceDAte == '1') {
    for (let i = 0; i < DatePreferenceOption.length; i++) {
      var datepick = formatDate(DatePreferenceOption[i])
      let datesplit = datepick.split('T')[0]
      var dd = datesplit.split(' ')[0]
      datepreferance.push(dd)
      console.log(dd);

    }

    let i = 0;
    (function loop() {
      if (i < datepreferance.length) {
        var command = ''
        command = `INSERT INTO  transaction_appointment (hospital_id, branch_id, patient_id, patient_name, Facility, provider_id, provider_name, resource, Appointment_type, start_date, end_date, visit_status, start_time, end_time,time_preferance,reason) values
            ('${hospital_id}','${branch_id}','${patient_id}','${patient_name}','${Facility}','${provider_id}','${provider_name}','${resourcename}','${appointmenttype}','${datepreferance[i]}','${datepreferance[i]}','${visit_status}','${Sttime}','${EtTime}','${TimePreference}','${reason}')`
        execCommand(command.replace(/null/g, '').replace(/undefined/g, ''))
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

  } else {

    const command = `INSERT INTO  transaction_appointment (hospital_id, branch_id, patient_id, patient_name, Facility, provider_id, provider_name, resource, Appointment_type, start_date, end_date, visit_status, start_time, end_time,time_preferance,reason) values
      ('${hospital_id}','${branch_id}','${patient_id}','${patient_name}','${Facility}','${provider_id}','${provider_name}','${resourcename}','${appointmenttype}','${FromDate}','${ToDate}','${visit_status}','${Sttime}','${EtTime}','${TimePreference}','${reason}')`
    execCommand(command.replace(/null/g, '').replace(/undefined/g, ''))
      .then(result => res.json('success'))
      .catch(err => logWriter(command, err));
  }
})

router.post('/get_appointment_for_edit', (req, res) => {
  var getQuery = `select * from transaction_appointment where id = ${req.body.eventid}`;
  execCommand(getQuery)
    .then(result => {

      if (result.length) {
        var necessarydata = `select guid, completeName from master_patient where guid = '${result[0].patient_id}'; select guid, firstname from provider_personal_identifiers where guid = '${result[0].provider_id}'; select id, name from master_chief_complaints where id = '${result[0].reason_of_visit}'`
        console.log(necessarydata);
        execCommand(necessarydata)
          .then(result2 => {
            res.json({ result, result2 })


          }).catch(err => logWriter(necessarydata, err))
      }
    })
    .catch(err => logWriter(getQuery, err));
})

router.post('/changeDatesForEvents', (req, res) => {
  var dates = req.body.dates
  var eventid = req.body.eventid;
  var getQuery = `select * from transaction_appointment where id = ${eventid}`;
  execCommand(getQuery)
    .then(result => {
      if (result.length) {
        var start_date = new Date(result[0].start_date)
        var end_date = new Date(result[0].start_date)
        var start_time = new Date(result[0].start_date)
        var end_time = new Date(result[0].start_date);
        if (dates.years > 0) {
          var year = 24 * 60 * 60 * 1000 * 365 * dates.years
          start_date = start_date.getTime() + year
          end_date = end_date.getTime() + year;
          start_time = start_time.getTime() + year
          end_time = end_time.getTime() + year;
        }
        if (dates.months > 0) {
          var month = 24 * 60 * 60 * 1000 * 30 * dates.months
          start_date = start_date.getTime() + month
          end_date = end_date.getTime() + month;
          start_time = start_time.getTime() + month
          end_time = end_time.getTime() + month;
        }
        if (dates.days != 0) {
          var day = 24 * 60 * 60 * 1000 * dates.days;
          start_date = start_date.getTime() + day
          end_date = end_date.getTime() + day;
          start_time = start_time.getTime() + day
          end_time = end_time.getTime() + day;
        }
        start_date = new Date(start_date)
        end_date = new Date(end_date)
        start_time = new Date(start_time)
        end_time = new Date(end_time)
        var updateEventDateQuery = `update transaction_appointment set start_date = '${formatDate(start_date)}', end_date = '${formatDate(end_date)}', start_time = '${formatDate(start_time)}', end_time = '${formatDate(end_time)}' where id = ${eventid}`
        execCommand(updateEventDateQuery)
          .then(result => res.json('success'))
          .catch(err => logWriter(updateEventDateQuery, err));
      }
    })
    .catch(err => logWriter(getQuery, err));

})
router.post('/SaveAddPatient', (req, res) => {

  var { First_Name, Last_Name, phone_no, Date_Of_Birth } = req.body.Add_Patientform
  var hospitalId = req.body.hospitalId;
  var branchId = req.body.branchId
  var guid = newGuid()

  const command = `INSERT INTO  master_patient ( hospitalId, branchId, guid, firstName, lastName, dateOfBirth, phone_no) values('${hospitalId}','${branchId}','${guid}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${phone_no}')`;
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

router.post('/Get_Patient_Detail', (req, res) => {
  var completename = req.body.text;
  var branchId = req.body.branchId;

  const command = `Select guid, completeName,(select emailId1 from patientcontact where patient_id=master_patient.guid) as email from master_patient where completeName like '${completename}%' and branchId='${branchId}'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/get_task_owner_details', (req, res) => {
  var name = req.body.name
  var branch_id = req.body.branchId
  var For = req.body.For
  var command = ''
  if (For == '1') {
    command = `Select guid, displayName as name from master_patient where displayName like '${name}%' and branchId='${branch_id}'`;
  }
  else {
    command = `Select guid, concat(firstname, ' ',lastname) as name from provider_personal_identifiers where firstname like 'viv%' and branchId='ad661e68-51b4-4db9-b8b6-019fd634bad5';`
  }

  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/Get_Facility_Detail', (req, res) => {
  var completename = req.body.text;

  const command = `Select * from transaction_place_of_practice where clinic_name like '%${completename}%'`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/Get_resource_Detail', (req, res) => {
  var completename = req.body.text;
  const command = `Select * from master_location where location_name like '%${completename}%'`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/Get_Persinal_Identifire_Detail', (req, res) => {
  var completename = req.body.text;
  var branchId = req.body.branchId;
  const command = `Select guid, firstname, (select emailId1 from provider_contact where provider_id = provider_personal_identifiers.guid) as email from provider_personal_identifiers  where Firstname like '%${completename}%' and branchId = '${branchId}'`; console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/SaveTask_Appointment', (req, res) => {
  var hospitalId = req.body.hospitalId;
  var branchId = req.body.branchId
  var task_category = req.body.Appointment_Task.task_category
  var taskFor = req.body.Appointment_Task.taskFor
  var owner = req.body.Appointment_Task.owner
  var priority = req.body.Appointment_Task.priority
  var duedate = formatDate(req.body.Appointment_Task.Duedate)
  var Notification = req.body.Appointment_Task.Notification
  var Message = req.body.Appointment_Task.Message
  var command = `INSERT INTO transaction_task (hospital_id, branch_id, task_category, taskFor, owner, priority, duedate, notification, message) VALUES ('${hospitalId}','${branchId}','${task_category}','${taskFor}','${owner.guid}','${priority}','${duedate}','${Notification}','${Message}')`;
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/SaveEvent', (req, res) => {
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
  var command = `insert into transaction_event (creator_id,  hospital_id, branch_id, schedule_for, status, event_title, date_time, notification, message, location) 
    values('${creatorId}','${hospitalId}','${branchId}','${ScheduleFor}','${Status}','${Event_title}','${DateTime}','${Notification}','${Message}','${AddLocation}')`
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})


router.post('/save_block_calendar', (req, res) => {
  var hospitalId = req.body.hospitalId;
  var branchId = req.body.branchId;
  var dateRange = req.body.calendarBlock.dateRange
  var reason = req.body.calendarBlock.reason
  for (var i = 0; i < dateRange.length; i++) {
    var formattedDate = formatDate(dateRange[i]);
    var command = `insert into transaction_block_calendar (hospital_id, branch_id, provider_id, date, reason) values('${hospitalId}','${branchId}','','${formattedDate}','${reason}')`;
    execCommand(command)
      .then(result => { })
      .catch(err => logWriter(command, err));
  }
  res.json('success')
})
router.post('/Get_Appointment', (req, res) => {
  var hospitalId = req.body.hospitalId;
  var patientGuid = req.body.patientguid;
  var branchId = req.body.branchId
  const command = `Select *,(select clinic_name from transaction_place_of_practice where id=master_appointment.Facility) as Facility, (select ResourceName from master_resorce_appointment where id=master_appointment.Resource) as Resource,(select term from description_snapshot where id=master_appointment.Resign_of_Visit) as Resign_of_Visitc from master_appointment  where HospitalId='${hospitalId}' AND Branch_Id='${branchId}' AND Patient_Id='${patientGuid}'`;
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
  // console.log('provider slots',req.body);
  // var hospital_id = req.body.hospital_id
  // var branch_id = req.body.branch_id
  // var provider_id = req.body.selected_provider
  // const command = `select * from provider_hours where slot = '1' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
  //                  select * from provider_hours where slot = '2' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
  //                  select * from provider_hours where slot = '3' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
  //                  select * from provider_hours where slot = '4' and branch_id = '${branch_id}' and provider_id = '${provider_id}';`
  // execCommand(command)
  //   .then((result) => res.json(result))
  //   .catch((err) => logWriter(command, err));
  res.json([])
});

router.post("/changetrackboardStatus", (req, res) => {
  var status = req.body.status
  var Data = req.body.data

  let i = 0;
  (function loop() {
    if (i < Data.length) {
      var command = ''
      if (status == '7') {
        command = `update transaction_appointment set visit_status='${status}', Arrived_time=now() where id='${Data[i].id}';`
      } else if (status == '8') {
        command = `update transaction_appointment set visit_status='${status}', start_visit_time=now() where id='${Data[i].id}';`
      } else {
        command = `update transaction_appointment set visit_status='${status}', checkout_time=now() where id='${Data[i].id}';`
      }
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


})

router.get('/selectproviderFromAppointment', (req, res) => {
  const command = `select provider_name,provider_id from transaction_appointment`
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
})


router.post('/deleteTransactionAppintment', (req, res) => {
  const id = req.body.id;

  const command = `delete from transaction_appointment where id=${id};`;

  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
})


router.post('/lockUnlockAppointment', (req, res) => {
  const id = req.body.id;
  const status = req.body.status

  const command = `update   transaction_appointment set lock_status='${status}' where id=${id};`;

  execCommand(command)
    .then(result => res.json('update'))
    .catch(err => logWriter(command, err));
})
router.post('/cancelAppointment', (req, res) => {
  const id = req.body.formvalue.id;
  const status = req.body.formvalue.visit_status

  const command = `update transaction_appointment set visit_status='9' where id=${id};`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})


router.post('/SendPHRInvation', (req, res) => {
  console.log(req.body);
  var patient_id = req.body.patient.guid
  var patient_email_id = req.body.patient.email_id
  var hospital_id = req.body.patient.hospitalId
  var url = req.body.url
  var command = `select count(*) as count from phr_login_details where guid = '${patient_id}'`
  execCommand(command)
    .then(result => {
      console.log(result[0].count, 'phrINVitation');
      if (result[0].count == 0) {
        mailOptions.to = `${patient_email_id}`
        mailOptions.subject = ` Email verification for PHR`
        mailOptions.html = `<!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email verification for PHR</title>
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
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Email verification for  PHR </h1>
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
                      <p style="margin: 0;">Hi Aman,</p>
                      <p>Thank you for choosing Healaxy, please use following link  to activate your PHR Account</p>
                      <a href="${url}registration?hopitalID=${hospital_id}&patientID=${patient_id}" target="_blank">${url}registration?hopitalID=${hospital_id}&patientID=${patient_id}</a>
                      <h2 style="width: max-content;padding: 0 10px;color: #fff;"> Email:${patient_email_id}</h2>
                      
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

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(err);
          } else {
            console.log('Email sent: ' + info.response);
            res.json('success')
          }
        });
      } else {
        res.json('AllReadySend')
      }
    })

})
router.post('/getPhrdetails', (req, res) => {
  var patient_id = req.body.patientID
  var command = `select * from phr_login_details where guid = '${patient_id}'`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})


router.post('/getZoomMeetings', (req, res) => {
  var command = `SELECT * FROM transaction_teleconsult where hospital_id = '${req.body.hospital_id}' and date >= now() order by date;`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})
router.post('/getAppointmentRequests', (req, res) => {
  var sql = `select patient_id,(select completeName from master_patient where guid = phr_reqestforvisit.patient_id) as patient_name, patient_name, provider_id, (select concat(providertitle, ' ' , firstname, ' ', lastname) from provider_personal_identifiers where guid = phr_reqestforvisit.provider_id) as provider_name, hospital_id, branch_id,start_date,start_time, end_time, reason_of_visit, Appointment_type,(select appointment_type from master_appointment_type where id=phr_reqestforvisit.Appointment_type) as appointmentType, (select name from master_chief_complaints where id=phr_reqestforvisit.reason_of_visit) as problem from phr_reqestforvisit where branch_id = '${req.body.branchId}';`
  execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));
})


// createLinkForVideoAppointment('')

function createLinkForVideoAppointment(aptData) {
  var data = aptData
  return new Promise((resolve, reject) => {

    var sql = `insert into transaction_teleconsult (hospital_id, branch_id, meeting_id, passcode, meeting_link, provider_id, patient_id, date, time, status) values('${data.hospital_id}','${data.branch_id}','4529377801','n34A6F', 'https://us04web.zoom.us/j/4529377801?pwd=vY0Ai99Z8ISzaQOMgPgZWfg9DIxNfM.1', '${data.provider_id}', '${data.patient_id}', '${data.date}', '${data.time}', 0)`;
    execCommand(sql)
      .then(result => {
        if (result) {
          resolve('ok')
        }
      })
      .catch(err => {
        logWriter(sql, err);
        reject('error')
      });
    //   axios({
    //     method: 'post',
    //     url: 'https://api.zoom.us/v2/users/me/meetings',
    //     data: {
    //         "agenda": `Appointment Scheduled with ${data.patient_name}` ,
    //         "default_password": false,
    //         "duration": parseInt(data.duration),
    //         "password": "123456",
    //         "pre_schedule": false,
    //         "settings": {
    //           "additional_data_center_regions": [
    //             "IN"
    //           ],
    //           "allow_multiple_devices": true,
    //           "approval_type": 2,
    //           "audio": "telephony",
    //           "audio_conference_info": "test",
    //           "auto_recording": "cloud",
    //           "calendar_type": 1,
    //           "email_notification": true,
    //           "encryption_type": "enhanced_encryption",
    //           "focus_mode": true,
    //           "join_before_host": false,
    //           "meeting_authentication": true,
    //           "meeting_invitees": [
    //             {
    //               "email": "gaurangvishnoi.1703@gmail.com"
    //             }
    //           ],
    //           "mute_upon_entry": false,
    //           "participant_video": false,
    //           "private_meeting": false,
    //           "registrants_confirmation_email": true,
    //           "registrants_email_notification": true,
    //           "registration_type": 1,
    //           "show_share_button": true,
    //           "use_pmi": false,
    //           "waiting_room": false,
    //           "watermark": false,
    //           "host_save_video_order": true,
    //           "alternative_host_update_polls": true,
    //           "internal_meeting": false,
    //           "continuous_meeting_chat": {
    //             "enable": true,
    //             "auto_add_invited_external_users": true
    //           },
    //           "participant_focused_meeting": false,
    //           "push_change_to_calendar": false
    //         },
    //         "start_time": `${data.date.replace(' ', 'T')}`,
    //         "template_id": "Dv4YdINdTk+Z5RToadh5ug==",
    //         "topic": "My Meeting",
    //         "tracking_fields": [
    //           {
    //             "field": "field1",
    //             "value": "value1"
    //           }
    //         ],
    //         "type": 2
    //     }
    //   });



  })
}

// getNewAccessTokenForZoom();
setInterval(() => {
  // getNewAccessTokenForZoom();

}, 60 * 60 * 1000);
function getNewAccessTokenForZoom() {
  console.log('getting new access token');

  var token;
  // axios({
  //   method: 'post',
  //   url: 'https://zoom.us/oauth/authorize ',
  //   Option: {},
  //   param:{
  //     "response_type":"code",
  //     "client_id":"8JFTAyCzTJmR3K84rjp_A",
  //     "redirect_uri":"http://localhost:55000"
  //   }
  // }).then(data=>{
  //   console.log(data);
  // })


  // axios({
  //   method: 'post',
  //   url: 'https://api.zoom.us/v2/users/me/meetings',
  //   Option: {
  //     Headers: {
  //       "Content-Type": "",
  //       "Authorization": "eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjgzNDM4MDkwLTkzYzEtNGM0OS05OTZkLTc0ZTRjMTE1ZWNjNyJ9.eyJ2ZXIiOjksImF1aWQiOiIzMDM0ZjE3NWYwODdkMWVlN2JhZmVlODQ1OWQyM2M3NiIsImNvZGUiOiJVMDU2Nnl6QTduUjRyeHJDMnhuUjJPTEdPei1SVUNHa0EiLCJpc3MiOiJ6bTpjaWQ6OEpGVEF5Q3pUSm1SM0s4NHJqcF9BIiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjEsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6Inh1TjdFWEczU2M2eEI4cHdHMXZjOGciLCJuYmYiOjE2OTYwNzI3ODAsImV4cCI6MTY5NjA3NjM4MCwiaWF0IjoxNjk2MDcyNzgwLCJhaWQiOiJqUHVma3BxRFI2bVFwSUw0T2M5XzZRIn0.FC3UnAKj6eoXNovR7Fw_gaKedWAFZyHI2977mfOJ8kU66w5KWrv-1wmCaYKSWvehjgfSgllh2WH44xtqmoIWbQ"
  //     }
  //   },
  //   data: {
  //     "agenda": "My Meeting",
  //     "default_password": false,
  //     "duration": 40,
  //     "password": "123456",
  //     "pre_schedule": false,
  //     "settings": {
  //       "additional_data_center_regions": [
  //         "IN"
  //       ],
  //       "allow_multiple_devices": true,
  //       "approval_type": 2,
  //       "audio": "telephony",
  //       "audio_conference_info": "test",
  //       "auto_recording": "cloud",
  //       "calendar_type": 1,
  //       "email_notification": true,
  //       "encryption_type": "enhanced_encryption",
  //       "focus_mode": true,
  //       "join_before_host": false,
  //       "meeting_authentication": true,
  //       "meeting_invitees": [
  //         {
  //           "email": "santosh@dnavigation.com"
  //         }
  //       ],
  //       "mute_upon_entry": false,
  //       "participant_video": false,
  //       "private_meeting": false,
  //       "registrants_confirmation_email": true,
  //       "registrants_email_notification": true,
  //       "registration_type": 1,
  //       "show_share_button": true,
  //       "use_pmi": false,
  //       "waiting_room": false,
  //       "watermark": false,
  //       "host_save_video_order": true,
  //       "alternative_host_update_polls": true,
  //       "internal_meeting": false,
  //       "continuous_meeting_chat": {
  //         "enable": true,
  //         "auto_add_invited_external_users": true
  //       },
  //       "participant_focused_meeting": false,
  //       "push_change_to_calendar": false
  //     },
  //     "start_time": "2023-10-4T19:30:10",
  //     "template_id": "Dv4YdINdTk+Z5RToadh5ug==",
  //     "topic": "My Meeting",
  //     "tracking_fields": [
  //       {
  //         "field": "field1",
  //         "value": "value1"
  //       }
  //     ],
  //     "type": 2
  //   }

  // }).then(res => {
  //   console.log(res.data);
  // }).catch(error => {
  //   console.log(error);
  // })
  axios({
    method: 'get',
    url: 'https://zoom.us/oauth/token',
    Option: {
      Headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": Buffer.from('8JFTAyCzTJmR3K84rjp_A' + ':' + 'RkJ1FsTlLcpBIAWENwnHHaFuKqqd7WVa').toString('base64')
      },
    },
    params: {
      "refresh_token": "eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjgzNDM4MDkwLTkzYzEtNGM0OS05OTZkLTc0ZTRjMTE1ZWNjNyJ9.eyJ2ZXIiOjksImF1aWQiOiIzMDM0ZjE3NWYwODdkMWVlN2JhZmVlODQ1OWQyM2M3NiIsImNvZGUiOiJVMDU2Nnl6QTduUjRyeHJDMnhuUjJPTEdPei1SVUNHa0EiLCJpc3MiOiJ6bTpjaWQ6OEpGVEF5Q3pUSm1SM0s4NHJqcF9BIiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjEsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6Inh1TjdFWEczU2M2eEI4cHdHMXZjOGciLCJuYmYiOjE2OTYwNzI3ODAsImV4cCI6MTY5NjA3NjM4MCwiaWF0IjoxNjk2MDcyNzgwLCJhaWQiOiJqUHVma3BxRFI2bVFwSUw0T2M5XzZRIn0.FC3UnAKj6eoXNovR7Fw_gaKedWAFZyHI2977mfOJ8kU66w5KWrv-1wmCaYKSWvehjgfSgllh2WH44xtqmoIWbQ",
      "grant_type": "refresh_token"
    }
  }).then(res => {
    console.log(res.data);
  }).catch(error => {
    console.log(error);
  })
}


module.exports = router;