const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const nodemailer = require('nodemailer');
const cose = require('cose-js');
const crypto = require('crypto');
// Polyfill for Web Crypto API
const QRCode = require('qrcode');
const { authenticator } = require('otplib');


const secretKey = '9300729@123savdbsfxdczdvsavxcfadvx';


const { parseAuthenticatorData } = require('@simplewebauthn/server/helpers');
const cbor = require('cbor');
global.crypto = new (require('@peculiar/webcrypto').Crypto)();

const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require('@simplewebauthn/server');

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
router.post('/submit_registration_details', (req, res) => {

  var password = req.body.registrationForm.password;
  var confirm_password = req.body.registrationForm.confirm_password;
  var id = req.body.original_id_b64;
  var pid = req.body.original_pid_b64;
  console.log(password, confirm_password, id, pid);

  // decode Our Id 

  let iddata = id;
  let idbuff = new Buffer.from(iddata, 'base64');
  let textid = idbuff.toString('ascii');
  console.log('"' + iddata + '"converted from Base64 to ASCII is"' + textid + '"');
  // Decode Our Guid

  let piddata = pid;
  let buff = new Buffer.from(piddata, 'base64');
  let textpid = buff.toString('ascii');
  console.log('"' + piddata + '"converted from Base64 to ASCII is"' + textpid + '"');


  const command = `SELECT guid,(select emailId1 from patientcontact where patient_id = '${textid}' ) as email_id  FROM .master_patient where guid = '${textid}';`;

  console.log(command);
  execCommand(command)
    .then(result => {
      console.log(result);
      if (result.length > 0) {
        console.log(result.guid);
        const command2 = `insert into phr_login_details (pid, guid, email_id, password) values ('${textpid}', '${result[0].guid}', '${result[0].email_id}', '${password}')`;
        execCommand(command2)
          .then(result => {
            console.log(result);
            if (result.affectedRows > 0) {
              res.json('success')

            }
          })

          .catch(err => logWriter(command, err));
      }

    })

    .catch(err => logWriter(command, err));
});


// login user now

// router.post('/Phrlogin', (req, res) => {
//   console.log(req.body);
//   var Email = req.body.data.email
//   var Password = req.body.data.password
//   var sessionid = req.body.sessionid



//   // console.log(ipAddress,"mu ip")
//   const command = `select * from 

//     phr_login_details 
//  where email_id='${Email}' and password='${Password}' and active='1'`;
//   console.log(command);
//   execCommand(command)
//     .then(rows => res.json(rows))

//     .catch(err => logWriter(command, err));

// });



// 

router.post('/Phrlogin', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body.data;
  const ip = req.body.ip;
  const loginQuery = `SELECT * FROM phr_login_details WHERE email_id='${email}' AND password='${password}' AND active='1'`;
  console.log(loginQuery);

  try {
    const rows = await execCommand(loginQuery);

    if (rows.length > 0) {
      const user = rows[0];
      const guid = user.guid;
      const activesessionlimit = user.activesessionlimit || 10; // Default to 10 if not specified

      // Check for active sessions
      const activeSessionsQuery = `SELECT * FROM phr_active_sessions WHERE patient_id='${guid}'`;
      console.log(activeSessionsQuery);
      const activeSessions = await execCommand(activeSessionsQuery);

      if (activeSessions.length < activesessionlimit) {
        
        // Check if the patient_id exists in the allowed IPs table
        const patientIdCheckQuery = `SELECT COUNT(*) AS count FROM phr_allowed_ip WHERE patient_id='${guid}'`;
        console.log(patientIdCheckQuery);
        const patientIdCheckResult = await execCommand(patientIdCheckQuery);

        if (patientIdCheckResult[0].count > 0) {
          // Check if the IP is allowed
          const ipQuery = `SELECT * 
            FROM phr_allowed_ip 
            WHERE patient_id='${guid}' 
              AND (
                ip_address='${ip}' OR 
                (
                  INET_ATON(ip_range_start) <= INET_ATON('${ip}') AND 
                  INET_ATON(ip_range_end) >= INET_ATON('${ip}')
                )
              )`;
          console.log(ipQuery);
          const ipResult = await execCommand(ipQuery);

          if (ipResult.length === 0) {
            console.log('IP not allowed');
            res.status(403).json({ error: 'IP address not allowed' });
          } else {
            console.log('IP allowed');
            if (user.authenticator === 1 || user.passkey === 1) {
              res.json({ 
                guid: user.guid, 
                hospital_id: user.hospital_id, 
                branch_id: user.branch_id, 
                authenticator: user.authenticator, 
            
                passkey: user.passkey 
                // rows
              });
            } else {
            //  console.log(req.cookies,':userdata')
              res.json(rows);
            }
          }
        } else {
          console.log('No allowed IP entries for this patient');
          if (user.authenticator === 1 || user.passkey === 1) {
            res.json({ 
              guid: user.guid, 
              hospital_id: user.hospital_id, 
              branch_id: user.branch_id, 
              authenticator: user.authenticator, 
              // authenticator_key: user.authenticator_key, 
              passkey: user.passkey 
            });
          } else {
            // console.log(req.cookies.userData,':userdata')

            res.json(rows);
          }
        }
      } else {
        console.log('Maximum active sessions reached');
        res.status(403).json({ error: 'Maximum active sessions reached' });
      }
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error executing login query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/getUserDetails', async (req, res) => {
  const { guid } = req.body;

  const userDetailsQuery = `SELECT * FROM phr_login_details WHERE guid='${guid}'`;
  console.log(userDetailsQuery);

  try {
    const rows = await execCommand(userDetailsQuery);

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// 
// router.post('/Phrlogin', (req, res) => {
//   console.log(req.body);
//   var Email = req.body.data.email;
//   var Password = req.body.data.password;
//   var sessionid = req.body.sessionid;

//   // Check if session ID exists and is active in phr_active_sessions table
//   const checkSessionCommand = `SELECT * FROM phr_active_sessions WHERE sessionid='${sessionid}' AND active='1'`;

//   execCommand(checkSessionCommand)
//     .then(sessionResult => {
//       if (sessionResult.length > 0) {
//         // Session is active, proceed with login
//         const command = `SELECT * FROM phr_login_details WHERE email_id='${Email}' AND password='${Password}'`;
//         console.log(command);
//         execCommand(command)
//           .then(rows => res.json(rows))
//           .catch(err => logWriter(command, err));
//       } else {
//         // Session is not active, logout
//         const command = `SELECT * FROM phr_login_details WHERE email_id='${Email}' AND password='${Password}'`;
//         console.log(command);
//         execCommand(command)
//           .then(rows => res.json(rows))
//           .catch(err => logWriter(command, err));
//       }
//     })
//     .catch(err => logWriter(checkSessionCommand, err));
// });

// router.post('/phrgetemail', (req, res) => {
//     console.log(req.body)
//     var guid = req.body.data
//     const command = `SELECT  FROM hospital7.master_patient where guid=${guid};`
//     execCommand(command)
//         .then(rows => res.json(rows))
//         .catch(err => logWriter(command, err));
// })


router.post('/Phrgetemail', (req, res) => {
  // console.log(req.body, "THIS IS GETMAIL")
  var guid = req.body.data
  // console.log(guid.data, "THIS IS GUID")
  const command = `SELECT completeName, dateOfBirth,branchId,(SELECT emailId1 FROM patientcontact where patient_id='${guid}') AS emailId1 FROM master_patient where guid='${guid}';`
  console.log(command)
  execCommand(command)
    .then(rows => res.json(rows))
    .catch(err => logWriter(command, err));
})

// router.post('/Phrgetusername', (req, res) => {
//     // console.log(req.body)'
//     var guid = req.body.data
//     const command = `SELECT completeName FROM master_patient where guid='${guid}';`
//     execCommand(command)
//         .then(rows => res.json(rows))
//         .catch(err => logWriter(command, err));
// })


router.post('/Phrgetuserdetail', (req, res) => {
  // console.log(req.body, "THIS IS GETMAIL")
  var guid = req.body.data
  // console.log(guid.data, "THIS IS GUID")
  const command = `SELECT firstName,imgSrc, middleName, lastName,displayName, dateOfBirth,postalCode,countrycode,pld.last_chnage_password,
  authenticator,passkey,
    patientcontact.city ,patientcontact.state,patientcontact.emailId1 ,master_country_code1.Country,patientcontact.mobilePhone
    FROM master_patient
    inner join patientcontact on master_patient.guid=patientcontact.patient_id
    inner join phr_login_details pld on pld.guid=master_patient.guid
     inner join master_country_code1  ON patientcontact.country = master_country_code1.countrycode
    WHERE master_patient.guid = '${guid}';`
  console.log(command)
  execCommand(command)
    .then(rows => res.json(rows))
    .catch(err => logWriter(command, err));
})


router.get('/Phrgetcountry', (req, res) => {
  const command = `select * from  master_country_code1;`
  console.log(command)
  execCommand(command)
    .then(rows => res.json(rows))
    .catch(err => logWriter(command, err));
})
router.post('/Phrgetcountry1', (req, res) => {
  var text = req.body.text
  const command = `select * from  master_country_code1 where Country like '%${text}%'`
  console.log(command)
  execCommand(command)
    .then(rows => res.json(rows))
    .catch(err => logWriter(command, err));
})

router.post('/Phrgetstate', (req, res) => {
  var text = req.body.text
  const command = `SELECT * FROM master_coutry_postalcode where countrycode='${text}' group by states_name;`
  console.log(command)
  execCommand(command)
    .then(rows => res.json(rows))
    .catch(err => logWriter(command, err));
})
router.post('/Phrgetcity', (req, res) => {
  console.log(req.body)
  var code = req.body.code
  var states_name = req.body.name
  const command = `SELECT * FROM master_coutry_postalcode where countrycode='${code}'AND  states_name='${states_name}' group by district_name;`
  console.log(command)
  execCommand(command)
    .then(rows => res.json(rows))
    .catch(err => logWriter(command, err));
})

router.post('/chnagepass', (req, res) => {

  var guid = req.body.guid
  var newpass = req.body.data.newpass
  var cuurentpass = req.body.data.cuurentpass


  const command = `
    select * from phr_login_details where guid='${guid}' and password='${cuurentpass}'`;

  console.log(command);
  execCommand(command)
    .then(result => {
      console.log(result);
      if (result.length > 0) {
        console.log(result.guid);
        const command2 = `UPDATE phr_login_details
        SET password = '${newpass}', last_chnage_password = NOW()
        WHERE guid = '${guid}';
        `;
        execCommand(command2)
          .then(result => {
            console.log(result);
            if (result.affectedRows > 0) {
              res.json(200)

            }
          })

          .catch(err => logWriter(command, err));
      }
      else {
        res.json(401)
      }


    })

    .catch(err => logWriter(command, err));
});

router.post('/phrregister', (req, res) => {
  console.log(req.body)
  var email = req.body.registrationForm.email
  var password = req.body.registrationForm.password
  var patient_id = req.body.patient
  var hopitalID = req.body.hopitalID
  var username = req.body.username

  var branchId = req.body.branchId


  const command = `SELECT * FROM phr_login_details
    
    
    where guid='${patient_id}'`

  execCommand(command)
    .then(result => {
      // console.log(result);
      if (result.length > 0) {
        console.log("alredt exists")
        res.json("fail")
      } else {
        const command2 = `insert into phr_login_details ( guid, email_id, password,hospital_id,organization_id,user_name) values ( '${patient_id}', '${email}', '${password}','${branchId}','${hopitalID}','${username}')`
        execCommand(command2)
          .then(result => {
            // console.log(result);
            if (result.affectedRows > 0) {
              res.json('success')

            }
          })

          .catch(err => logWriter(command2, err));
      }
      console.log("1")


    })

    .catch(err => logWriter(command, err));
});
// router.post('/send-otp', (req, res) => {
//     console.log(req.body)
//     var email_id = req.body.email;
//     var otp = req.body.otp;
//     mailOptions.to = `${email_id}`
//     mailOptions.subject = `i Email Verification`
//     mailOptions.html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
//     <div style="margin:50px auto;width:70%;padding:20px 0">
//       <div style="border-bottom:1px solid #eee">
//         <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Healaxy</a>
//       </div>
//       <p style="font-size:1.1em">Hi,</p>
//       <p>Thank you for choosing Healaxy. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
//       <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
//       <p style="font-size:0.9em;">Best,<br />Healaxy</p>
//       <hr style="border:none;border-top:1px solid #eee" />
//       <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
//         <p>Healaxy</p>
//         <p>India</p>
//       </div>
//     </div>
//   </div>`


//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//             res.status(500).json({ message: 'Error sending OTP' });
//         } else {
//             console.log('Email sent:', info.response);
//             res.status(200).json({ message: 'OTP sent successfully' });
//         }
//     });
// });



router.post('/send-otp', (req, res) => {
  console.log(req.body)
  var email_id = req.body.email;
  var otp = req.body.otp;
  mailOptions.to = `${email_id}`
  mailOptions.subject = `i Email Verification`
  mailOptions.html = `<!DOCTYPE html>
    <html>
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title> Email Verification</title>
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
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Email verification</h1>
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
                    Thank you for choosing Healaxy. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
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
      res.status(500).json({ message: 'Error sending OTP' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});




// })
//  share record dataa
// router.post('/sharerecorddata', (req, res) => {
//   console.log(req.body);
//   var patient_id = req.body.patient_id;
//   var hospital_id = req.body.hospital_id;
//   var Branch_ID = req.body.Branch_ID;
//   const { Medication, Allergies, Labs, Problem_List, Procedures, Diet, Immunizations, Therapies, Documents, Family_History } = req.body.sharerecordfrom;

//   // Check if patient_id already exists
//   const checkCommand = `SELECT * FROM transaction_phrsharedata WHERE patient_id='${patient_id}'`;

//   execCommand(checkCommand)
//     .then(result => {
//       if (result.length > 0) {
//         // Patient ID exists, perform an update
//         const updateCommand = `UPDATE transaction_phrsharedata 
//           SET Medication='${Medication}', Allergies='${Allergies}', Labs='${Labs}', Problem='${Problem_List}', procedurePHR='${Procedures}', Immunizations='${Immunizations}', 
//           Therapy='${Therapies}', Diet='${Diet}', Documents='${Documents}', Family_history='${Family_History}'
//           WHERE patient_id='${patient_id}'`;

//         return execCommand(updateCommand);
//       } else {
//         // Patient ID does not exist, perform an insert
//         const insertCommand = `INSERT INTO transaction_phrsharedata(patient_id,hospital_id,branch_id, Medication, Allergies, Labs, Problem, procedurePHR, Immunizations, Therapy, Diet, Documents, Family_history) 
//           VALUES ('${patient_id}', '${hospital_id}', '${Branch_ID}', '${Medication}', '${Allergies}', '${Labs}', '${Problem_List}', '${Procedures}',
//           '${Immunizations}', '${Therapies}', '${Diet}', '${Documents}', '${Family_History}')`;

//         return execCommand(insertCommand);
//       }
//     })
//     .then(result => res.json('success'))
//     .catch(err => logWriter(checkCommand, err));
// });
router.post('/sharerecorddata', async (req, res) => {
  try {
    console.log(req.body);
    var patient_id = req.body.patient_id;
    var Branch_ID = req.body.Branch_ID;

    const { Medication, Allergies, Labs, Problem_List, Procedures, Diet, Immunizations, Therapies, Documents, Family_History } = req.body.sharerecordfrom;

    for (const hospital of req.body.sharerecordfrom.hospitalname) {
      console.log(hospital);
      const hospital_id = hospital.hospitalid;

      // Check if patient_id already exists
      const checkCommand = `SELECT * FROM transaction_phrsharedata WHERE patient_id='${patient_id}' and hospital_id='${hospital_id}'`;
      console.log(checkCommand);
      const result = await execCommand(checkCommand);

      if (result.length > 0) {
        // Patient ID exists, perform an update
        const updateCommand = `UPDATE transaction_phrsharedata 
          SET Medication='${Medication}', Allergies='${Allergies}', Labs='${Labs}', Problem='${Problem_List}', procedurePHR='${Procedures}', Immunizations='${Immunizations}', 
          Therapy='${Therapies}', Diet='${Diet}', Documents='${Documents}', Family_history='${Family_History}'
          WHERE patient_id='${patient_id}' and hospital_id='${hospital_id}'`;

        await execCommand(updateCommand);
      } else {
        // Patient ID does not exist, perform an insert
        const insertCommand = `INSERT INTO transaction_phrsharedata(patient_id,hospital_id,branch_id, Medication, Allergies, Labs, Problem, procedurePHR, Immunizations, Therapy, Diet, Documents, Family_history) 
          VALUES ('${patient_id}', '${hospital_id}', '${Branch_ID}', '${Medication}', '${Allergies}', '${Labs}', '${Problem_List}', '${Procedures}',
          '${Immunizations}', '${Therapies}', '${Diet}', '${Documents}', '${Family_History}')`;

        await execCommand(insertCommand);
      }
    }

    res.json('success');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


router.post('/getsharerecorddata', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patient_id


  const command = `select * from transaction_phrsharedata where patient_id='${patient_id}'`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

// account
router.post('/checkpass', (req, res) => {
  // Extract guid and password from request body
  const { guid, Password } = req.body;
  const passwordKey = Password && Password.key;

  // Check if guid and password are provided
  if (!guid || !passwordKey) {
    return res.status(400).json({ error: 'Guid and password are required.' });
  }

  // Construct the SQL command to check password
  const command = `SELECT * FROM phr_login_details WHERE guid='${guid}' AND password='${passwordKey}'`;

  console.log('Executing command:', command);

  // Execute the SQL command
  execCommand(command)
    .then(result => {
      // Check if any record matches
      if (result.length > 0) {
        console.log('Password matched for guid:', guid);
        return res.json({ message: 'Success' });
      } else {
        // If no record matched, return 401 Unauthorized
        console.log('Password did not match for guid:', guid);
        return res.status(401).json({ error: 'Unauthorized' });
      }
    })
    .catch(err => {
      // Handle errors
      console.error('Error executing command:', command);
      logWriter(command, err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });

});

router.post('/getactivityhistory', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID


  const command = `select * from phr_login_history where patient_id='${patient_id}' ORDER BY id DESC;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/getsessionhistory', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID


  const command = `select * from phr_active_sessions where patient_id='${patient_id}' ORDER BY id DESC;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/checkuser', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID
  var sessionid = req.body.session_id

  const command = `select COUNT(*) AS count from phr_active_sessions where patient_id='${patient_id}'  and sessionid ='${sessionid}';`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/chnagsessionestatus', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID
  var sessionid = req.body.session_id

  const command = `delete from  phr_active_sessions where patient_id='${patient_id}'  and sessionid ='${sessionid}';`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/createloginhistory', (req, res) => {
  console.log(req.body)
  var branch_id = req.body.Branch_ID
  var deviceName = req.body.deviceName
  var patient_id = req.body.patientID
  var hopitalID = req.body.hopitalID
  var location = req.body.location
  var browser = req.body.browser
  var os = req.body.os
  var osVersion = req.body.osVersion
  var sessionid = req.body.sessionid

  var ip = req.body.ip
  const command = `insert into phr_login_history (patient_id,location,ip,device,hospital_id,branch_id,browser,os,os_version) values ( '${patient_id}', '${location}', '${ip}','${deviceName}','${hopitalID}','${branch_id}','${browser}','${os}','${osVersion}');
  insert into phr_active_sessions (sessionid,patient_id,location,ip,device,hospital_id,branch_id,browser,os,os_version,active) values ( '${sessionid}', '${patient_id}', '${location}', '${ip}','${deviceName}','${hopitalID}','${branch_id}','${browser}','${os}','${osVersion}','1')`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err))

  // const command2 = `insert into phr_active_sessions (sessionid,patient_id,location,ip,device,hospital_id,branch_id,browser,os,os_version,active) values ( '${sessionid}', '${patient_id}', '${location}', '${ip}','${deviceName}','${hopitalID}','${branch_id}','${browser}','${os}','${osVersion}','1')`;
  // console.log(command2)
  // execCommand(command2)
  //   .then(result => res.json(result))
  //   .catch(err => logWriter(command2, err))
});

// for add mobile number 
router.post('/get_patient_number', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID


  const command = `select * from phr_patient_mob where patient_id='${patient_id}';
  select * from patientcontact where patient_id='${patient_id}' `
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/add_patient_number', (req, res) => {


  console.log(req.body);
  var patient_id = req.body.patientID;
  var mobile_number = req.body.mobile.mobile_number;

  // Assuming you have a table structure like: phr_patient_mob(patient_id, mobile_number)

  const command = `insert into phr_patient_mob (patient_id, mobile_number) values ('${patient_id}', '${mobile_number}')`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/add_patient_email', (req, res) => {


  console.log(req.body);
  var patient_id = req.body.patientID;
  var email_address = req.body.email.email_address;

  // Assuming you have a table structure like: phr_patient_mob(patient_id, mobile_number)

  const command = `insert into phr_patient_email (patient_id, email) values ('${patient_id}', '${email_address}')`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/get_patient_email', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID


  const command = `select * from phr_patient_email where patient_id='${patient_id}';
  select * from patientcontact where patient_id='${patient_id}' `
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/setbydeaultnumber', (req, res) => {


  console.log(req.body);
  var patient_id = req.body.item.patient_id;
  var mobile_number = req.body.item.mobile_number;

  var activenumber= req.body.activenumber[0].mobilePhone;
  // var transaction_time= req.body.activenumber[0].transaction_time;

  // Assuming you have a table structure like: phr_patient_mob(patient_id, mobile_number)

  const command = `
  delete from phr_patient_mob where patient_id='${patient_id}' and mobile_number= '${mobile_number}';
  UPDATE patientcontact SET mobilePhone = '${mobile_number}'  WHERE patient_id = '${patient_id}';

  insert into phr_patient_mob (patient_id, mobile_number) values ('${patient_id}', '${activenumber}')
  `;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/setbydeaultemail', (req, res) => {


  console.log(req.body);
  var patient_id = req.body.item.patient_id;
  var email = req.body.item.email;

  var activemail= req.body.activeemail[0].emailId1;
  // var transaction_time= req.body.activenumber[0].transaction_time;

  // Assuming you have a table structure like: phr_patient_mob(patient_id, mobile_number)

  const command = `
  delete from phr_patient_email where patient_id='${patient_id}' and email= '${email}';
  UPDATE patientcontact SET emailId1 = '${email}'  WHERE patient_id = '${patient_id}';
  UPDATE phr_login_details SET email_id = '${email}'  WHERE guid = '${patient_id}';
  insert into phr_patient_email (patient_id, email) values ('${patient_id}', '${activemail}')
  `;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/submit_allowed_ip', (req, res) => {
  console.log(req.body);
  const patient_id = req.body.patientID;
  const ip_name = req.body.formvalue.ip_name;

  const ranges = req.body.formvalue.ranges;
  const todos = req.body.formvalue.todos;

  // Array to store all SQL queries
  const commands = [];

  // If ranges exist, create queries for each range
 console.log(ranges.length,"length")
 console.log(todos[0],"length")
  if (ranges.length >= 1 && ranges[0].rangeStart!='' && ranges[0].rangeEnd!='') {
      for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const rangeStart = range.rangeStart;
          const rangeEnd = range.rangeEnd;

          // Create SQL query for each range
          const command = `INSERT INTO phr_allowed_ip (patient_id, ip_range_start, ip_range_end, ip_name ) 
                          VALUES ('${patient_id}', '${rangeStart}', '${rangeEnd}', '${ip_name}' )`;
          console.log(command);

          // Push the SQL query to the commands array
          commands.push(execCommand(command));
      }
  }

  // If todos exist, create queries for each todo
  if (todos.length >= 1  && todos[0].ip!='' ) {
      for (let i = 0; i < todos.length; i++) {
        const ip_address = req.body.formvalue.todos[i].ip;
          const todo = todos[i];
 
          // Create SQL query for each todo
          const command = `INSERT INTO phr_allowed_ip (patient_id, ip_name, ip_address) 
                          VALUES ('${patient_id}', '${ip_name}', '${ip_address}')`;
          console.log(command);

          // Push the SQL query to the commands array
          commands.push(execCommand(command));
      }
  }

  // Execute all SQL queries in parallel
  Promise.all(commands)
      .then(results => res.json(results))
      .catch(err => logWriter(err));
});

router.post('/get_allowed_ip', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID


  const command = `select * from phr_allowed_ip where patient_id='${patient_id}';
 `
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/deletemail', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID

var mailid=req.body.mailid
  const command = `delete from phr_patient_email where  patient_id='${patient_id}' and id='${mailid}' ;
 `
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/deletephone', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID

var phoneid=req.body.mailid
  const command = `delete from phr_patient_mob where  patient_id='${patient_id}' and id='${phoneid}' ;
 `
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/closemyaccount', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID

var phoneid=req.body.mailid
  const command = `update   phr_login_details set active='0'  where  guid='${patient_id}' ;`
  console.log(command)
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

router.post('/setlimit', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID

var Limit=req.body.limit.Limit
  const command = `update   phr_login_details set activesessionlimit='${Limit}'  where  guid='${patient_id}' ;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/updatepatientimg', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID

var path=req.body.path
  const command = `update   master_patient set imgSrc='${path}'  where  guid='${patient_id}' ;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/updatesecurity', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID
//   var cmd=`select passkey from ohr_login_details where guid='${patient_id}'`
//   console.log(cmd)
//   execCommand(cmd)
//     .then(result => {
      
//       console.log(result,"hh")
//       if(result==1){
// console.log('hy')
//       }
//     }
//   )
    // .catch(err => logWriter(cmd, err));
var mode=req.body.mode
var active=req.body.active
var secret=req.body.secret
  const command = `update  phr_login_details set ${mode}='${active}',authenticator_key='${secret}',passkey='0' where  guid='${patient_id}' ;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



function userIdToBuffer(userId) {
  // Assuming userId is a string, you can convert it to a Buffer
  return Buffer.from(userId);
}
async function saveUser(user) {
  const { id, username } = user;
  const command = `INSERT INTO users_2fa (patient_id, username) VALUES ('${id}', '${username}')`;
  try {
    await execCommand(command);
  } catch (error) {
    throw error;
  }
}


router.post('/register-challenge', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  let user = await getUserById(userId);
  if (!user) {
    user = { id: userIdToBuffer(userId), username: 'User ' + userId };
    await saveUser(user);
  }

  const challengePayload = await generateRegistrationOptions({
    rpID: 'localhost',
    rpName: 'My Localhost Machine',
    attestationType: 'none',
    userName: user.username,
    userID: user.id,
    timeout: 30000,
  });

  await saveChallenge(userId, challengePayload.challenge);
  return res.json({ options: challengePayload });
});

// POST endpoint for user registration verification
router.post('/register-verify', async (req, res) => {
  const { userId, cred } = req.body;

  if (!userId || !cred) {
    return res.status(400).json({ error: 'Missing userId or cred' });
  }

  const challenge = await getChallenge(userId);
  if (!challenge) {
    return res.status(400).json({ error: 'Challenge not found' });
  }

  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: challenge,
    expectedOrigin: 'http://localhost:4200',
    expectedRPID: 'localhost',
    response: cred,
  });

  if (!verificationResult.verified) {
    return res.json({ error: 'Could not verify' });
  }

  const { credentialPublicKey, counter, credentialID } = verificationResult.registrationInfo;

  await saveUserCredential(userId, credentialPublicKey, counter, credentialID);

  const command = `update  phr_login_details set authenticator='0',passkey='1' where  guid='${userId}' ;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  

  return res.json({ verified: true });
});

router.post('/login-challenge', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const opts = await generateAuthenticationOptions({
    rpID: 'localhost',
    allowCredentials: [{
      id: user.credential_id,
      type: 'public-key',
    }],
  });

  await saveChallenge(userId, opts.challenge);
  return res.json({ options: opts });
});


router.post('/login-verify', async (req, res) => {
  const { userId, cred } = req.body;

  if (!userId || !cred) {
    return res.status(400).json({ error: 'Missing userId or cred' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const challenge = await getChallenge(userId);
    if (!challenge) {
      return res.status(400).json({ error: 'Challenge not found' });
    }

    console.log("User credentialPublicKey:", user.credentialPublicKey);
    console.log("Challenge:", challenge);
    console.log("User credential_id:", user.credential_id);
    const base64PublicKey = user.credentialPublicKey;
    const publicKeyBuffer = Buffer.from(base64PublicKey.split(','));
    const credentialPublicKey = new Uint8Array(publicKeyBuffer);
    
    const verificationResult = await verifyAuthenticationResponse({
      expectedChallenge: challenge,
      expectedOrigin: 'http://localhost:4200',
      expectedRPID: 'localhost',
      response: cred,
      authenticator: {
        credentialID: user.credential_id,
        credentialPublicKey: credentialPublicKey,
        counter: user.counter,
      },
    });

    if (!verificationResult.verified) {
      return res.json({ error: 'Authentication failed' });
    }
console.log(verificationResult,"verificationResult")
    await updateCounter(userId, verificationResult.authenticationInfo.newCounter);
    return res.json({ success: true, userId });
  } catch (error) {
    console.error("Error in login verification:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



async function getUserById(userId) {
  const command = `SELECT * FROM users_2fa WHERE patient_id='${userId}'`;
  try {
    const rows = await execCommand(command);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function saveChallenge(userId, challenge) {
  const command = `INSERT INTO challenges (patient_id, challenge) VALUES ('${userId}', '${challenge}') ON DUPLICATE KEY UPDATE challenge = '${challenge}'`;
  try {
    await execCommand(command);
  } catch (error) {
    throw error;
  }
}
async function getChallenge(userId) {
  const command = `SELECT challenge FROM challenges WHERE patient_id='${userId}'`;
  try {
    const rows = await execCommand(command);
    return rows[0]?.challenge;
  } catch (error) {
    throw error;
  }
}
async function saveUserCredential(userId, credentialPublicKey, counter, credentialID) {
  const command = `UPDATE users_2fa SET credentialPublicKey='${base64ToBase64url(credentialPublicKey)}', counter=${counter}, credential_id='${base64ToBase64url(credentialID)}' WHERE patient_id='${userId}'`;
  try {
    await execCommand(command);
  } catch (error) {
    throw error;
  }
}
function base64ToBase64url(base64) {
  // Convert to string if base64 is not already a string
  if (typeof base64 !== 'string') {
    base64 = base64.toString('base64');
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function updateCounter(userId, counter) {
  const command = `UPDATE users_2fa SET counter = ${counter} WHERE patient_id = '${userId}'`;
  try {
    await execCommand(command);
  } catch (error) {
    throw error;
  }
}




router.post('/updateuserpersonaldetail', (req, res) => {
  console.log(req.body,"updateuserpersonaldetail")
  var patient_id = req.body.patientID
// var mode=req.body.mode
var fname=req.body.formdata.fname
var lname=req.body.formdata.lname
var displayname=req.body.formdata.mname
var countryname=req.body.formdata.Country.countrycode
var state=req.body.formdata.state.states_name
var district=req.body.formdata.city.district_name

// var secret=req.body.secret
  const command = `update  master_patient set firstName='${fname}',lastName='${lname}',displayName='${displayname}' where  guid='${patient_id}' ;
  update patientcontact set country='${countryname}',state='${state}',district='${district}' where patient_id='${patient_id}';
  update phr_login_details set user_name='${displayname}'`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

// for genrate backup code

router.post('/genratebackupcode', (req, res) => {
  console.log(req.body);
  const { patientID, branchId, hospital_ID } = req.body;

  // Generate 9 backup codes
  const backupCodes = generateBackupCodes(9);

  // Construct the SQL command to check if the patientID exists
  const command1 = `SELECT COUNT(*) as count FROM phr_backup_code WHERE patient_id = '${patientID}'`;

  // Execute the SQL command
  execCommand(command1)
    .then(result => {
      console.log(result[0].count);
      if (result[0].count > 0) {
        // If patientID exists, update the record with the new backup codes
        const updateCommand = `
          UPDATE phr_backup_code 
          SET 
              hospital_id = '${hospital_ID}', 
              branch_id = '${branchId}', 
              backup_code1 = '${backupCodes[0]}', 
              backup_code2 = '${backupCodes[1]}', 
              backup_code3 = '${backupCodes[2]}', 
              backup_code4 = '${backupCodes[3]}', 
              backup_code5 = '${backupCodes[4]}', 
              backup_code6 = '${backupCodes[5]}',
              backup_code7 = '${backupCodes[6]}',
              backup_code8 = '${backupCodes[7]}',
              backup_code9 = '${backupCodes[8]}',
              transaction_time=now()
          WHERE 
              patient_id = '${patientID}';
        `;
        
        console.log(updateCommand);
        // Execute the update command
        execCommand(updateCommand)
          .then(result => {
            // Return the generated backup codes to the frontend
            res.json({ status: 'success', backupCodes });
          })
          .catch(err => logWriter(updateCommand, err));
      } else {
        // If patientID doesn't exist, insert a new record with the backup codes
        const command = `
          INSERT INTO phr_backup_code 
          (patient_id, hospital_id, branch_id, backup_code1, backup_code2, backup_code3, backup_code4, backup_code5, backup_code6, backup_code7, backup_code8, backup_code9,transaction_time) 
          VALUES ('${patientID}', '${branchId}', '${hospital_ID}', '${backupCodes[0]}', '${backupCodes[1]}', '${backupCodes[2]}', '${backupCodes[3]}', '${backupCodes[4]}', '${backupCodes[5]}', '${backupCodes[6]}', '${backupCodes[7]}', '${backupCodes[8]}',now())
        `;
        
        console.log(command);
        // Execute the insert command
        execCommand(command)
          .then(result => {
            // Return the generated backup codes to the frontend
            res.json({ status: 'success', backupCodes });
          })
          .catch(err => logWriter(command, err));
      }
    })
    .catch(err => logWriter(command1, err));
});

const generateBackupCodes = (numCodes) => {
  const codes = [];
  const codeLength = 4; // Length of each backup code
  for (let i = 0; i < numCodes; i++) {
    const code = Math.random().toString(36).substr(2, codeLength).toUpperCase();
    codes.push(code);
  }
  return codes;
};

router.post('/getBackupCodes', (req, res) => {
  const { patientID } = req.body;

  // Construct the SQL command to select backup codes
  const command = `
    SELECT transaction_time,
      backup_code1, 
      backup_code2, 
      backup_code3, 
      backup_code4, 
      backup_code5, 
      backup_code6, 
      backup_code7, 
      backup_code8, 
      backup_code9 
    FROM 
      phr_backup_code 
    WHERE 
      patient_id = '${patientID}';
  `;

  // Execute the SQL command
  execCommand(command)
    .then(result => {
      if (result.length > 0) {
        console.log(result,"ressult")
        // Flatten the result to a single array of backup codes
        const backupCodes = Object.values(result[0]);
        res.json({ status: 'success', backupCodes ,time:result[0].transaction_time});
      } else {
        res.json({ status: 'error', message: 'No backup codes found for this patient ID' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ status: 'error', message: err.message });
    });
});

// 

 router.post('/generateSecretKey', (req, res) => {
  console.log(req.body,'generateSecretKey')

  var command = `select email_id from phr_login_details where guid='${req.body.patientId}'`;

try {
  console.log(command)
   execCommand(command)
   .then(result => {
    const secret = authenticator.generateSecret();

  const otpUri = authenticator.keyuri(result[0].email_id, 'healaxy', secret);
  var cmd=`update  phr_login_details set authenticator_key ='${secret}' where guid='${req.body.patientId}'`
  console.log(cmd)
  execCommand(cmd)
  .then(result => {
 

//  res.json();

 })
  res.json({ secret, otpUri });

  })

    .catch(err => logWriter(command, err));
} catch (error) {
  throw error;
}
 
});

// 

// router.post('/verifycode', (req, res) => {
//   console.log(req.body,"verifycode")
// //   var patient_id = req.body.patientID
// // var mode=req.body.mode
// // var active=req.body.active
// // var secret=req.body.secret
// //   const command = `update  phr_login_details set ${mode}='${active}',authenticator_key='${secret}' where  guid='${patient_id}' ;`
// //   console.log(command)
// //   execCommand(command)
// //     .then(result => res.json(result))
// //     .catch(err => logWriter(command, err));
// })
router.post('/verifycode', (req, res) => {
  const { patientID, code } = req.body;
  console.log(req.body)

  if (!patientID || !code || !code.backupcode) {
    return res.status(400).json({ status: 'error', message: 'Invalid request data' });
  }

  const backupCode = code.backupcode;
  const backupCodeSegments = backupCode.split('-');

  if (backupCodeSegments.length !== 9) {
    return res.status(400).json({ status: 'error', message: 'Invalid backup code format' });
  }

  // Construct the SQL command to select backup codes for the given patientID
  const command = `
    SELECT 
      backup_code1, 
      backup_code2, 
      backup_code3, 
      backup_code4, 
      backup_code5, 
      backup_code6, 
      backup_code7, 
      backup_code8, 
      backup_code9 
    FROM 
    phr_backup_code 
    WHERE 
    patient_id = '${patientID}';
  `;

  // Execute the SQL command
  execCommand(command)
    .then(result => {
      if (result.length > 0) {
        const dbCodes = result[0];

        // Compare each segment of the provided backup code with the corresponding db column
        const isMatch = backupCodeSegments.every((segment, index) => {
          return segment === dbCodes[`backup_code${index + 1}`];
        });

        if (isMatch) {
          res.json({ status: 'success', message: 'Backup code matches' });
        } else {
          res.json({ status: 'error', message: 'Backup code does not match' });
        }
      } else {
        res.json({ status: 'error', message: 'No backup codes found for this patient ID' });
      }
    })
    .catch(err => {
      logWriter(command, err)
      res.status(500).json({ status: 'error', message: err.message });
    });
});


 router.post('/verify', (req, res) => {
          const { token, secret,patientID } = req.body;
console.log(patientID,"patientID")
var command = `select authenticator_key from phr_login_details where guid='${patientID}'`;
try {
  console.log(command)
   execCommand(command)
   .then(result => {

    const isValid = authenticator.check(token, result[0].authenticator_key);
    res.json({ isValid });
  })
    .catch(err => logWriter(command, err));
} catch (error) {
  throw error;
}

        
        });


 router.post('/deleteip', (req, res) => {
  console.log(req.body)
  var patient_id = req.body.patientID
  var itemid = req.body.itemid

  const command = `delete from  phr_allowed_ip where  id ='${itemid}' and  patient_id='${patient_id}'  ;`
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})    


router.post('/deactivepasskey', (req, res) => {
  console.log(req.body,"deactivepasskey")
  var patient_id = req.body.patientID
  // var itemid = req.body.itemid

  const command = `delete from  users_2fa where  patient_id='${patient_id}'  ;
  delete from  challenges where  patient_id='${patient_id}';
  update phr_login_details set  passkey=0 where guid='${patient_id}';
  `
  console.log(command)
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})  

router.post('/sendalertemail', async (req, res) => {
  try {
      console.log(req.body, "sendalertemail");
      const emailid = req.body.userdata[0].email_id;
      const first_person_name = req.body.userdata[0].user_name;
      const branch_id = req.body.userdata[0].organization_id;
      
      await sendEmailConfirmation(emailid, first_person_name, branch_id);
      
      res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'An error occurred while sending the email' });
  }
});

 
// const checkmfa =(mfamode,patient_id)=>{
// console.log(mfamode,"mfamode")
// const command = `select * from phr_login_details  where guid='${patient_id}'  ;`
// execCommand(command)
// .then(result => {
//   res.json(result)
//   if(result[0].authenticator==1){
//     const command = `select * from phr_login_details  where guid='${patient_id}'  ;`
// execCommand(command)
// .then(result => {
//   res.json(result)
//   })
// }
// })
// .catch(err => logWriter(command, err));
// }
async function sendEmailConfirmation(patient_email_id, patient_name, branchID) {
  try {
      console.log(patient_email_id, patient_name, branchID, "check function");

      // Extract required data
      const first_person_id = patient_email_id;
      const first_person_name = patient_name;
      const branch_id = branchID;

      // Check if required data is available
      if (!first_person_name) {
          console.log("Patient name is empty");
          return;
      }

      // Fetch email template from master_email_template
      let mailhtml = await getEmailTemplate(branch_id);

      // If no template found or inactive, fetch from email_template_permission
      if (!mailhtml) {
          console.log("Master email template not found or inactive, trying email_template_permission");
          mailhtml = await getEmailTemplateFallback();
      }

      // If still no template found, return
      if (!mailhtml) {
          console.log("Email template not found or inactive in both master_email_template and email_template_permission");
          return;
      }

      // Replace placeholders in HTML with actual values
      const processedHtml = replacePlaceholders(mailhtml, first_person_name);

      // Set up email options
      const mailOptions = {
     
          to: first_person_id,
          subject: 'New device sign in',
          html: processedHtml
      };

      // Send email
      const info = await sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

async function getEmailTemplate(branch_id) {
  const command = `SELECT * FROM master_email_template 
                   WHERE permission_name='NewDevicealert' 
                   AND branchid='${branch_id}' AND active='1'`;
  const result = await execCommand(command);
  if (result && result.length > 0) {
      return result[0].html;
  }
  return null;
}

async function getEmailTemplateFallback() {
  const command = `SELECT * FROM email_templates_permissions 
                   WHERE permission_name='NewDevicealert' AND active='1'`;
  const result = await execCommand(command);
  if (result && result.length > 0) {
      return result[0].html;
  }
  return null;
}

// Other functions remain the same


function replacePlaceholders(html, first_person_name) {
  return html.replace('${first_person_name}', first_person_name);
}

async function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              reject(error);
          } else {
              resolve(info);
          }
      });
  });
}


module.exports = router;


// router.post('/Phrlogin', (req, res) => {
//   console.log(req.body, "check login msg ");
//   const Email = req.body.data.email;
//   const Password = req.body.data.password;
//   const ip = req.body.ip;

//   const loginQuery = SELECT * FROM phr_login_details WHERE email_id='${Email}' AND password='${Password}';;
//   console.log(loginQuery);

//   execCommand(loginQuery)
//     .then(rows => {
//       if (rows.length > 0) {
//         const guid = rows[0].guid;

//         // Check for active sessions
//         const activeSessionsQuery = SELECT * FROM phr_active_sessions WHERE patient_id='${guid}';;
//         console.log(activeSessionsQuery);

//         execCommand(activeSessionsQuery)
//           .then(result => {
//             console.log(result.length, 'active sessions');

//             // Assuming the maximum allowed active sessions is 2
//             if (result.length < 1) {
//               // Check if the IP is allowed
//               const ipQuery = SELECT * FROM phr_allowed_ip WHERE patient_id='${guid}' AND ip_address='${ip}';;
//               console.log(ipQuery);

//               execCommand(ipQuery)
//                 .then(ipResult => {
//                   if (ipResult.length === 0) {
//                     console.log('IP allowed');
//                     res.json(rows);
//                   } else {
//                     console.log('IP not allowed');
//                     res.status(403).json({ error: 'IP address not allowed' });
//                   }
//                 })
//                 .catch(err => {
//                   console.error('Error checking IP:', err);
//                   res.status(500).json({ error: 'Internal server error' });
//                 });
//             } else {
//               console.log('Maximum active sessions reached');
//               res.status(403).json({ error: 'Maximum active sessions reached' });
//             }
//           })
//           .catch(err => {
//             console.error('Error checking active sessions:', err);
//             res.status(500).json({ error: 'Internal server error' });
//           });
//       } else {
//         console.log('Invalid email or password');
//         res.status(401).json({ error: 'Invalid email or password' });
//       }
//     })
//     .catch(err => {
//       console.error('Error executing login query:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });