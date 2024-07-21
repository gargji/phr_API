const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/Hospital_Registration', (req,res)=>{
    var {hospitalname,addressline1,addressline2,areaaround,cityname,area,state,country,landmarkss,postalcode} = req.body.data
    var guid = req.body.guid;
        // console.log("data",data);
        command = `INSERT INTO hosptal_registration(guid,branch_id,clinicName,addressLine1,addressLine2,area,city,district,state,country,landmark,postalcode) 
        values('${guid}','${guid}','${hospitalname}','${addressline1}','${addressline2}','${areaaround}','${cityname}','${area}','${state}','${country}','${landmarkss}','${postalcode}')`;
        console.log(command);
        execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));

})
router.get('/getHospitalregistrationData', (req,res)=>{
    const command = `select *,(select countryName from master_country1 where conceptId=hosptal_registration.country ) as CountryName, (Select state_name from master_state where id=hosptal_registration.state )as statename, (select city_name from master_city where id=hosptal_registration.city)as cityname, (select speciality from master_clinical_speciality where id=(select speciality from user_registration where guid = hosptal_registration.guid)) as Specialityname,(select Email from user_registration where guid=hosptal_registration.guid)as emailId,(select FirstName from user_registration where guid=hosptal_registration.guid)as userId,(select LastName from user_registration where guid=hosptal_registration.guid)as userId2,(select mobileNo from user_registration where guid=hosptal_registration.guid)as mobile from hosptal_registration;`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
});
router.post('/statusChangeHospitalresigration', (req,res)=>{
    var guid=req.body.guid;
    var status=req.body.status;
    console.log(req.body);


    const command =`Update hosptal_registration set verfyStatus='${status}' where guid='${guid}';`;
console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    

})

module.exports =router;


























module.exports =router;