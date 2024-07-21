const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
var nodemailer = require('nodemailer');

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


router.post('/InsertUserRegistration', (req, res) => {
  var guid = newGuid()
  var FirstName = req.body.FirstName
  var LastName = req.body.LastName
  var Email = req.body.Email
  var Password = req.body.Password
  var PracticeName = req.body.PracticeName
  var Speciality = req.body.Speciality
  var mobileNo = req.body.mobileNo
  var Terms_and_conditions = req.body.Terms_and_conditions
  var Marketing_and_promotion = req.body.Marketing_and_promotion
  var id = req.body.id;
  var country = req.body.country.countrycode
  var mobilecode = req.body.mobilecodes
  const command = `INSERT INTO user_registration(guid,branchId,FirstName,LastName,Email,Password,PracticeName,Speciality,mobileNo,Terms_and_conditions,Marketing_and_promotion,country,mobilecode) values('${guid}','${guid}','${FirstName}','${LastName}','${Email}','${Password}','${PracticeName}','${Speciality}','${mobileNo}','${Terms_and_conditions}','${Marketing_and_promotion}','${country}','${mobilecode}');`;
  execCommand(command)
    .then(result => {
      if (result.affectedRows) {
        var loginCredQuery = `insert into login_credentials (user_id, hospital_id, email_id, password, user_type) values('${guid}','${guid}','${Email}','${Password}','admin')`;
        execCommand(loginCredQuery)
          .then(result => {
            res.json(guid)
          })
      }
    })
    .catch(err => logWriter(command, err));
})


router.post('/sendOTP', (req, res) => {
  var email_id = req.body.email_id;
  var otp = Math.floor(1000 + Math.random() * 9000);
  mailOptions.to = `${email_id}`
  mailOptions.subject = `Email Verification`
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

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      writeLog(error)
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ msg: 'success', otp: otp })
    }
  });
})


router.post('/checkDuplicationForRegistration', (req, res) => {
  var email = req.body.email
  var phone = req.body.phone
  const command = `select count(*) as count from user_registration where Email = '${email}';
  select count(*) as count from user_registration where mobileNo = '${phone}';`;
  execCommand(command)
    .then(result => {
      if (result[0][0].count) {
        res.json('email');
      } else if (result[1][0].count) {
        res.json('phone');
      } else {
        res.json('success');
      }
    })
    .catch(err => logWriter(command, err));
});

router.post('/checkDuplicationForOraganization', (req, res) => {
  var organizationName = req.body.organizationName
  const command = `select count(*) as count from transaction_organization where organization_name = '${organizationName}'`;
  execCommand(command)
    .then(result => {
      if (result[0].count) {
        res.json('hospitalname');
      } else {
        res.json('success');
      }
    })
    .catch(err => logWriter(command, err));
});

router.post('/user_login', (req, res) => {
  console.log(req.body);
  var Email = req.body.Email;
  var Password = req.body.Password;
  const check_credentials = `select email_id as Email, user_id as id, user_type from login_credentials where email_id = '${Email}' and password = '${Password}';`
  console.log(check_credentials);
  // const command = `select email_id, FirstName, LastName, PracticeName, Speciality, guid, branchId, id, mobileNo,country,organization_id,(select Country from master_country_code1 where countrycode = user_registration.country)as countryname from user_registration where Email='${Email}' and Password='${Password}';`;
  execCommand(check_credentials)
    .then(result => {
      var command = '';
      if (result.length) {
        if (result[0].user_type == 'admin') {
          command = `select Email, FirstName, LastName, PracticeName, Speciality, guid, branchId, id, mobileNo,country,organization_id,(select Country from master_country_code1 where countrycode = user_registration.country)as countryname from user_registration where guid = '${result[0].id}'`;
        }
        else {
          command = `select guid as id, hospital_id as guid, hospital_id as organization_id, branchId, providertitle, firstname as FirstName, middlename, Lastname as LastName, (select emailId1 from provider_contact where provider_id = provider_personal_identifiers.guid) as Email, (select mobilePhone from provider_contact where provider_id = provider_personal_identifiers.guid) as mobileNo, (select (select Country from master_country_code1 where countrycode = provider_contact.country) as country from provider_contact where provider_id =  provider_personal_identifiers.guid) countrycode from provider_personal_identifiers where guid = '${result[0].id}'`
        }
        console.log(command);
        execCommand(command).then((result) => {
          res.json(result)
        }).catch((err) => {
          logWriter(command, err)
        })
      }else{
        res.json(result)
      }
    })
    .catch(err => logWriter(check_credentials, err));
});

function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}



module.exports = router
