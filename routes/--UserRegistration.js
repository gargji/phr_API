const express =require('express');
const router =express.Router();
const db =require('../config/db');
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



router.post('/InsertUserRegistration', (req,res)=>{
    var guid = newGuid()
    console.log(req.body);
    var FirstName = req.body.FirstName
    var LastName = req.body.LastName
    var Email   =  req.body.Email
    var Password  = req.body. Password          
    var PracticeName = req.body.PracticeName
    var Speciality  = req.body.Speciality
    var mobileNo = req.body.mobileNo
    var Terms_and_conditions= req.body.Terms_and_conditions
    var Marketing_and_promotion= req.body.Marketing_and_promotion
    var id = req.body.id;
    var country=req.body.country.countrycode
    var mobilecode=req.body.mobilecodes
    console.log(guid);
   const  command = `INSERT INTO user_registration(guid,branchId,FirstName,LastName,Email,Password,PracticeName,Speciality,mobileNo,Terms_and_conditions,Marketing_and_promotion,country,mobilecode) values('${guid}','${guid}','${FirstName}','${LastName}','${Email}','${Password}','${PracticeName}','${Speciality}','${mobileNo}','${Terms_and_conditions}','${Marketing_and_promotion}','${country}','${mobilecode}');`;
   console.log(command); 
   execCommand(command)
    .then(result => {
      res.json(guid)})
    .catch(err => logWriter(command, err));

    function newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
})


router.post('/sendOTP', (req,res)=>{
  var email_id = req.body.email_id;
  var otp = Math.floor(1000 + Math.random() * 9000);
  mailOptions.to = `${email_id}`
  mailOptions.subject = `i Email Verification`
  mailOptions.html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Healaxy</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Healaxy. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Best,<br />Healaxy</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Healaxy</p>
      <p>India</p>
    </div>
  </div>
</div>`
 
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    writeLog(error)
  } else {
    console.log('Email sent: ' + info.response);
    res.json({msg: 'success', otp: otp})
  }
});


})


router.post('/checkDuplicationForRegistration',(req,res)=>{
  console.log(req.body);
  var email = req.body.email
  var  phone = req.body.phone  

  const command =`select count(*) as count from user_registration where Email = '${email}';
  select count(*) as count from user_registration where mobileNo = '${phone}';`;
  execCommand(command)
  .then(result => {
    console.log('aman',result, result[0][0].count, result[1][0].count);
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

router.post('/checkDuplicationForOraganization',(req,res)=>{
  console.log(req.body);
  var organizationName = req.body.organizationName


  const command =`select count(*) as count from transaction_organization where organization_name = '${organizationName}'`;
  execCommand(command)
  .then(result => {
    console.log('aman',result, result[0].count);
    if (result[0].count) {
      res.json('hospitalname');
    }  else {
      res.json('success');
    }
  })
  .catch(err => logWriter(command, err)); 
});
router.post('/user_login',(req,res)=>{
  var Email = req.body.Email
  var Password = req.body.Password  

  const command =`select Email, FirstName, LastName, PracticeName, Speciality, guid, branchId, id, mobileNo,country,organization_id,(select Country from master_country_code1 where countrycode = user_registration.country)as countryname from user_registration where Email='${Email}' and Password='${Password}';`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err)); 
});
module.exports =router;