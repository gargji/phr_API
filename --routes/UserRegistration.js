const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');



router.post('/InsertUserRegistration', (req,res)=>{
    var guid = newGuid()
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
    
   const  command = `INSERT INTO user_registration(guid,branchId,FirstName,LastName,Email,Password,PracticeName,Speciality,mobileNo,Terms_and_conditions,Marketing_and_promotion) values('${guid}','${guid}','${FirstName}','${LastName}','${Email}','${Password}','${PracticeName}','${Speciality}','${mobileNo}','${Terms_and_conditions}','${Marketing_and_promotion}');`;
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
router.post('/user_login',(req,res)=>{
  var Email = req.body.Email
  var Password = req.body.Password  

  const command =`select Email, FirstName, LastName, PracticeName, Speciality, guid, branchId, id, mobileNo from user_registration where Email='${Email}' and Password='${Password}';`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err)); 
});
module.exports =router;