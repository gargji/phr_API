const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')

router.post('/Hospital_Registration', (req, res) => {
    
    var { hospitalname, addressline1, addressline2, areaaround, cityname, District, state, country, landmarkss, postalcode } = req.body.data
    var country = req.body.data.country?.Country;
    var CountryCode = req.body.data.country?.countrycode
    var postalcode = req.body.data.Postal_Code.postalcode;
    var guid = req.body.guid
    var displayname = req.body.data.displayname
    var command = `INSERT INTO transaction_organization(guid,organization_name,addressLine1,addressLine2,City,district_name,states_name,Country,countrycode,Land_Mark,Postal_Code,displayname) 
    values('${guid}','${hospitalname}','${addressline1}','${addressline2}','${cityname}','${District}','${state}','${country}','${CountryCode}','${landmarkss}','${postalcode}','${displayname}');update user_registration set organization_id='${guid}' where guid='${guid}'`;
    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
})

router.get('/getHospitalregistrationData', (req, res) => {
    const command = `select *,(select countryName from master_country1 where conceptId=hosptal_registration.country ) as CountryName, (Select state_name from master_state where id=hosptal_registration.state )as statename, (select city_name from master_city where id=hosptal_registration.city)as cityname, (select speciality from master_clinical_speciality where id=(select speciality from user_registration where guid = hosptal_registration.guid)) as Specialityname,(select Email from user_registration where guid=hosptal_registration.guid)as emailId,(select FirstName from user_registration where guid=hosptal_registration.guid)as userId,(select LastName from user_registration where guid=hosptal_registration.guid)as userId2,(select mobileNo from user_registration where guid=hosptal_registration.guid)as mobile from hosptal_registration;`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

router.post('/statusChangeHospitalresigration', (req, res) => {
    var guid = req.body.guid;
    var status = req.body.status;
    const command = `Update hosptal_registration set verfyStatus='${status}' where guid='${guid}';`;
    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
})

module.exports = router;