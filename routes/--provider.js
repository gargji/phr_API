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


// router.get("/getAllProvider", (req, res) => {
//   const command = `SELECT * from provider_personal_identifiers`;

//   execCommand(command)
//     .then((result) => res.json(result))
//     .catch((err) => logWriter(command, err));
// });


router.post("/getAllProvidersOfhospital", (req, res) => {
  console.log(req.body);
  var hospitalId = req.body.hospitalId
  var branchId = req.body.branchId
  const command = `SELECT *,(select emailId1 from  provider_contact where provider_id=provider_personal_identifiers.guid) as emailid,(select mobilePhone from  provider_contact where provider_id=provider_personal_identifiers.guid) as mobilePhone 
  ,(select speciality  from provider_professional_information where provider_id=provider_personal_identifiers.guid) as specility ,(select experience  from provider_professional_information where provider_id=provider_personal_identifiers.guid) as experience ,(select qualification  from provider_professional_information where provider_id=provider_personal_identifiers.guid) as qualification from provider_personal_identifiers where hospital_id = '${hospitalId}' and branchId = '${branchId}'`;
  console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/getAllStaffshospital", (req, res) => {
  console.log(req.body);
  var hospitalId = req.body.hospitalId
  var branchId = req.body.branchId
  const command = `SELECT *,(select emailId1 from  master_staffcontact where provider_id=master_staffpersonalidentifiers.guid) as emailid,(select mobilePhone from  master_staffcontact where provider_id=master_staffpersonalidentifiers.guid) as mobilePhone 
  ,(select speciality  from master_staffprofessionalinformation where provider_id=master_staffpersonalidentifiers.guid) as specility ,(select experience  from master_staffprofessionalinformation where provider_id=master_staffpersonalidentifiers.guid) as experience ,(select qualification  from master_staffprofessionalinformation where provider_id=master_staffpersonalidentifiers.guid) as qualification from master_staffpersonalidentifiers where hospital_id = '${hospitalId}' and branchId = '${branchId}' `;
  console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
})

router.post("/getProviderSlotsForCalendar", (req, res) => {
  console.log('provider slots', req.body);
  var hospital_id = req.body.hospital_id
  var branch_id = req.body.branch_id
  var provider_id = req.body.provider_id
  const command = `select * from provider_hours where slot = '1' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
                   select * from provider_hours where slot = '2' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
                   select * from provider_hours where slot = '3' and branch_id = '${branch_id}' and provider_id = '${provider_id}';
                   select * from provider_hours where slot = '4' and branch_id = '${branch_id}' and provider_id = '${provider_id}';`
  console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});





// get details for edit getPersonalIdentifiersForEdit

router.post("/getPersonalIdentifiersForEdit", (req, res) => {
  // console.log('hit');
  var { guid } = req.body
  const command = `SELECT * from provider_personal_identifiers where guid = '${guid}'`; `SELECT * FROM master_provider_id where providerGuid='${guid}'`;
  console.log(command);

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/getProviderContactDataForEdit", (req, res) => {
  // console.log('hit');
  var { guid } = req.body
  const command = `SELECT * from provider_contact where provider_id = '${guid}'`;
  console.log(command);

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/getProviderProfessionalInfoForEdit", (req, res) => {
  // console.log('hit');
  var { guid } = req.body
  const command = `SELECT * from provider_professional_information where provider_id = '${guid}'`;
  console.log(command);

  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});


// // addnew hospital form

router.post('/Hospital_Registration', (req, res) => {
  console.log(req.body);
  console.log(req.body);
  var { hospitalname, addressline1, addressline2, areaaround, cityname, area, state, country, landmarkss, postalcode } = req.body.registrationForm
  var guid = req.body.guid;

  // console.log(hospitalname,addressline1,addressline2,areaaround,cityname,area,state,country,landmarkss,postalcode);
  command = `INSERT INTO hosptal_registration(guid, clinicName,addressLine1,addressLine2,area,city,district,state,country,landmark,postalcode) 
       values('${guid}','${hospitalname}','${addressline1}','${addressline2}','${areaaround}','${cityname}','${area}','${state}','${country}','${landmarkss}','${postalcode}')`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));

})


// // place of practice
router.post("/getplaceofpractises", (req, res) => {
  console.log(req.body);
  const guid = req.body.guid;



  const command = `SELECT * FROM transation_placeofpractise WHERE Provider_id='${guid}'`;
  console.log('dddddddddddddddddddddddddddddd', command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/gettreatmentdata", (req, res) => {
  console.log(req.body);
  const guid = req.body.providerid;



  const command = `SELECT * FROM provider_treatment WHERE doctor_id='${guid}'`;
  console.log('dddddddddddddddddddddddddddddd', command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post('/PlacesOfPraciticeformsubmit', (req, res) => {
  // console.log(req.body);

  var { workplace, Hospitalname, addreshline1, addreshline2, areas, area, state, country, landmark, landmark, postalcode, phone, mobile, emailid, department, Latitude, Longitude } = req.body.PlacesOfPraciticeform
  var cityname = req.body.PlacesOfPraciticeform.cityname.id;
  var guid = req.body.guid;
  var hospital_id = req.body.hospital_id;
  var placeNum = req.body.placeNum;
  //  console.log('rrr',guid,hospital_id,placeNum);
  //console.log(workplace,Hospitalname,addreshline1,addreshline2,city_name,text,distict1,state,country,landmark,landmark,postalcode1,phone,mobile,emailid,department);
  const command1 = `delete from transaction_place_of_practice where doctor_guid='${guid}' and hospital_id='${guid}' and priority='${placeNum}'`;
  console.log(command1)
  execCommand(command1)
    // console.log(command1)
    .then(result => {
      if (result) {
        // .catch(err => logWriter(command1, err));
        // if(result){

        const command = `INSERT INTO transaction_place_of_practice(doctor_guid, hospital_id,priority, workplace_type, clinic_name, addressline1, addressline2, area, city, district, state, country, landmark, postalCode, phone, mobile, emailId, department ,Latitude,Longitude) 
       values('${guid}','${hospital_id}','${placeNum}','${workplace}','${Hospitalname}','${addreshline1}','${addreshline2}','${areas}','${cityname}','${area}','${state}','${country}','${landmark}','${postalcode}','${phone}','${mobile}','${emailid}','${department}','${Latitude}','${Longitude}')`;
        console.log(command);
        execCommand(command)

          .then(result => res.json('success'))
        // .catch(err => logWriter(command, err));
      }

    })
    .catch(err => logWriter(command1, err));
})

router.post('/PlacesOfPraciticeformupdate', (req, res) => {
  var { workplace, Hospitalname, addreshline1, addreshline2, areas, area, state, country, landmark, landmark, postalcode,
    phone, mobile, emailid, department, Latitude, Longitude } = req.body.PlacesOfPraciticeform
  var cityname = req.body.PlacesOfPraciticeform.cityname.id;
  var guid = req.body.guid; placeNum;
  var hospital_id = req.body.hospital_id;
  var placeNum = req.body.placeNum;
  // console.log('rrr',guid,hospital_id,placeNum);
  // console.log('PlacesOfPraciticeformupdate');
  command = `update transaction_place_of_practice set workplace_type='${workplace}',clinic_name='${Hospitalname}',addressline1='${addreshline1}',addressline2='${addreshline2}',area='${areas}',city='${cityname}' ,district='${area}' ,state='${state}',country='${country}',landmark='${landmark}', postalCode='${postalcode}', phone='${phone}', mobile='${mobile}'  , emailId='${emailid}', department='${department}', Latitude='${Latitude}', Longitude='${Longitude}' WHERE hospital_id='${hospital_id}'  and doctor_guid='${guid}' and priority='${placeNum}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    // console.log(result);
    .catch(err => logWriter(command, err));
});








// router.post('/personal_identifiersSubmit', (req, res) => {personal_identifiersSubmit

//     const guid=req.body.guid

//     var {providerpicture, providertitle, firstname, middlename, lastname,bloodgroup,genders,age,dateOfBirth,language,communication,notifications,patientid,patientid1} = req.body.personal_identifiers
//     // console.log(providerpicture, providertitle, firstname, middlename, lastname,bloodgroup,genders,age,dateOfBirth,language,communication,notifications,patientid,patientid1);
//     const command = `insert into provider_personal_identifiers ( guid,Provider_picture, Title, Firstname, Middlename, Lastname, Blood_Group, Gender, DOB, Age, Language, Commun, Notifications, PatientIDs,PatientIDsnumber)
//      values('${guid}','${providerpicture}','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}','${patientid}', '${patientid1}')`;
//     console.log(command);

//     execCommand(command)
//     .then(result => res.json('success'))
//     .catch(err => logWriter(command, err))
//     // db.query(command, (err, result) => {
//     //     if (err) {
//     //         console.log(err);

//     //     } else {
//     //         res.json('success');
//     //     }
//     // });


// });


const multer = require("multer");
const { log } = require('console');

let nameCache = {};



// place of practice 

router.post("/getplaceofpractiseofdata", (req, res) => {
  const guid = req.body.providerid;
  const hospital_id = req.body.hospital_id;
  var placeNum = req.body.placeNum;

  const command = `SELECT *,(select city_name from master_city where id=transaction_place_of_practice.city ) as cityname  FROM transaction_place_of_practice WHERE doctor_guid='${guid}' and hospital_id='${hospital_id}' order by priority`;
  console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/Saveplaceofpractise", (req, res) => {
  console.log(req.body);
  var guid = req.body.guid
  var PlacesOfPraciticedata = req.body.PlacesOfPraciticeform;
  const command1 = `delete from transation_placeofpractise where provider_id='${guid}'`;
  console.log(command1)
  execCommand(command1)

    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {

          if (i < PlacesOfPraciticedata.length) {

            command = `insert into transation_placeofpractise ( Provider_id, Hospitalname, OrganizationName, Address, phone)
         values('${guid}','${PlacesOfPraciticedata[i].Hospitalname}','${PlacesOfPraciticedata[i].OrganizationName}','${PlacesOfPraciticedata[i].phone}', '${PlacesOfPraciticedata[i].phone}')`;
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
router.post("/PlacesOfPraciticeformsubmit", (req, res) => {


  var {
    workplace,
    Hospitalname,
    addreshline1,
    addreshline2,
    areas,
    area,
    state,
    country,
    landmark,
    landmark,
    postalcode,
    phone,
    mobile,
    emailid,
    department,
    Latitude,
    Longitude,
  } = req.body.PlacesOfPraciticeform;
  var cityname = req.body.PlacesOfPraciticeform.cityname.id;
  var guid = req.body.guid;
  placeNum;
  var hospital_id = req.body.hospital_id;
  var placeNum = req.body.placeNum;
  //  console.log('rrr',guid,hospital_id,placeNum);

  //console.log(workplace,Hospitalname,addreshline1,addreshline2,city_name,text,distict1,state,country,landmark,landmark,postalcode1,phone,mobile,emailid,department);

  command = `INSERT INTO transaction_place_of_practice(doctor_guid, hospital_id,priority, workplace_type, clinic_name, addressline1, addressline2, area, city, district, state, country, landmark, postalCode, phone, mobile, emailId, department ,Latitude,Longitude) 
       values('${guid}','${hospital_id}','${placeNum}','${workplace}','${Hospitalname}','${addreshline1}','${addreshline2}','${areas}','${cityname}','${area}','${state}','${country}','${landmark}','${postalcode}','${phone}','${mobile}','${emailid}','${department}','${Latitude}','${Longitude}')`;

  execCommand(command)
    .then((result) => res.json("success"))
    .catch((err) => logWriter(command, err));
});

router.post("/PlacesOfPraciticeformupdate", (req, res) => {
  var {
    workplace,
    Hospitalname,
    addreshline1,
    addreshline2,
    areas,
    area,
    state,
    country,
    landmark,
    landmark,
    postalcode,
    phone,
    mobile,
    emailid,
    department,
    Latitude,
    Longitude,
  } = req.body.PlacesOfPraciticeform;
  var cityname = req.body.PlacesOfPraciticeform.cityname.id;
  var guid = req.body.guid;
  placeNum;
  var hospital_id = req.body.hospital_id;
  var placeNum = req.body.placeNum; hosptal_registration
  // console.log('rrr',guid,hospital_id,placeNum);
  // console.log('PlacesOfPraciticeformupdate');
  command = `update transaction_place_of_practice set workplace_type='${workplace}',clinic_name='${Hospitalname}',addressline1='${addreshline1}',addressline2='${addreshline2}',area='${areas}',city='${cityname}' ,district='${area}' ,state='${state}',country='${country}',landmark='${landmark}', postalCode='${postalcode}', phone='${phone}', mobile='${mobile}'  , emailId='${emailid}', department='${department}', Latitude='${Latitude}', Longitude='${Longitude}' WHERE hospital_id='${hospital_id}'  and doctor_guid='${guid}' and priority='${placeNum}'`;
  // console.log(command);
  execCommand(command)
    .then((result) => res.json("success"))
    // console.log(result);
    .catch((err) => logWriter(command, err));
});

router.get("/getHospitalData", (req, res) => {
  // const guid = req.body.guid;
  const command = `select * from hosptal_registration `;
  console.log('', command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/personal_identifiersSubmit", (req, res) => {
  const hospital_id = req.body.guid;
  const brachId = req.body.branchId;
  const formState = req.body.formState;
  var Id = req.body.personal_identifiers.Id
  console.log('Aman', req.body);
  const { provider_guid, providertitle, firstname, middlename, lastname, bloodgroup, genders, age, dateOfBirth, language, communication, notifications } = req.body.personal_identifiers;
  console.log(req.body.personal_identifiers.providerId);
  var command = ``;
  if (Id == '' || Id == null || Id == undefined) {
    command = `insert into provider_personal_identifiers (guid,hospital_id,branchId, Provider_picture, providertitle, Firstname, Middlename, Lastname, bloodgroup, Gender, dateOfBirth, Age, Language, communication, Notifications)
values('${provider_guid}','${hospital_id}','${brachId}','${provider_guid}.jpg','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}')`;


  }
  else {
    command = `update provider_personal_identifiers set providertitle = '${providertitle}',  Firstname='${firstname}', Middlename = '${middlename}', Lastname = '${lastname}', bloodgroup = '${bloodgroup}', Gender = '${genders}', Age = '${age}', dateOfBirth = '${dateOfBirth}', language = '${language}', communication = '${communication}', notifications = '${notifications}' where guid ='${provider_guid}'  `

    // comands='  update provider_personal_identifiers set providertitle = 'Mrs.',  Firstname='Gaurang', Middlename = 'Ghazibad', Lastname = 'Vishnoi', bloodgroup = 'AB +ve', Gender = 'Male', dateOfBirth = '2000-03-17', Age = '23', language = 'farshi', communication = 'Phone', notifications = 'Phone' where guid ='d2b33a01-8883-43be-b08b-9f11194d9125';
    // command = `update provider_personal_identifiers set providertitle = '${providertitle}',  Firstname='${firstname}', Middlename = '${middlename}', Lastname = '${lastname}', bloodgroup = '${bloodgroup}', Gender = '${genders}', Age = '${age}', dateOfBirth = '${dateOfBirth}', language = '${language}', communication = '${communication}', notifications = '${notifications}' where guid ='${provider_guid}'  `
  }
  console.log(command.replace(/null/g, ''));
  execCommand(command.replace(/null/g, ''))
    .then((result) => {
      if (result.affectedRows) {

        var { providerId } = req.body.personal_identifiers
        var providerIdQuery = '';
        for (var i = 0; i < providerId.length; i++) {
          providerIdQuery += `insert into master_provider_id (providerGuid, type, number, file) values('${provider_guid}','${providerId[i].type}','${providerId[i].number}','${providerId[i].fileqw}');`
        }
        console.log(providerIdQuery);

        execCommand(providerIdQuery)
          .then(result => res.json({ msg: 'success', provider_guid: provider_guid }))
          .catch(err => logWriter(providerIdQuery, err));
      }

      // res.json("success")
    })
    .catch((err) => logWriter(command, err));

});


router.post('/insertProviderContact', (req, res) => {
  console.log(req.body);
  const country = req.body.form.country.countrycode
  const postalcode = req.body.form.postalcode.postalcode
  const { guid, addressLine1, addressLine2, area, district, state, city, landmark, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone } = req.body.form;
  const formsState = req.body.formState;
  console.log(formsState);
  let sql;
  // if(formsState == 'edit'){
  //   sql = `update provider_contact set  addressLine1 = '${addressLine1}', addressLine2 = '${addressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', emergencyContactNumber = '${emergencyContactNumber}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' where provider_id = '${guid}';`

  // }
  // else{
  //   sql = `insert into provider_contact (provider_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone)
  //   values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalCode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}')`
  // }
  // console.log(sql);
  // execCommand(sql.replace(/null/g,''))
  // .then(result => res.json('success'))
  // .catch(err => logWriter(sql, err));
  const command1 = `delete from provider_contact where provider_id='${guid}'`;
  console.log(command1)
  execCommand(command1)

    .then(result => {
      if (result) {


        command = `insert into provider_contact (provider_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone)
         values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalcode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}')`
        console.log(command);
        execCommand(command)

          .then(result => res.json('success'))
          // 
          .catch(err => logWriter(command, err));
      }

    })
    .catch(err => logWriter(command1, err));
})



router.post('/insertProviderProfessionalInformation', (req, res) => {
  console.log(req.body);
  var formsState = req.body.formState
  console.log(formsState);
  const countryOfPractice = req.body.form.country.countrycode
  const { guid, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, state, RegistrationNumber, professionalSocietyMembership, profile, bookchapterpublications, JobTitle } = req.body.form;

  const command1 = `delete from provider_professional_information where provider_id='${guid}'`;
  console.log(command1)
  execCommand(command1)

    .then(result => {
      if (result) {


        var command = `INSERT INTO provider_professional_information (provider_id, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, country_of_practice, state_medical_council, registration_number, professional_society_memberships, profile, publications_and_bookchapters,JobTitle) 
   VALUES('${guid}', '${type_of_practice}', '${speciality}', '${sub_speciality}', '${graduation_year}', '${qualification}', '${experience}', '${countryOfPractice}', '${state}', '${RegistrationNumber}', '${professionalSocietyMembership}', '${profile}', '${bookchapterpublications}','${JobTitle}');`

        console.log(command);
        execCommand(command)

          .then(result => res.json('success'))
          // 
          .catch(err => logWriter(command, err));
      }

    })
    .catch(err => logWriter(command1, err));
})
router.post('/getcountryofpractice', (req, res) => {
  var sql = `select * from master_country1 where countryName like '${req.body.query}%'`;
  console.log(sql);


  execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));

});
router.post('/getStateMedicalCouncilAccToCountry', (req, res) => {
  var sql = `select * from master_state_medical_council where country_id = '${req.body.countryId}'`;
  console.log(sql);


  execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));

});



// router.get('/treatmenttype', (req, res) => {

// const command= `SELECT * FROM master_treatment` ;
// const command= `SELECT * FROM transaction_place_of_practice WHERE doctor_guid='${guid}' and hospital_id='${hospital_id}' and priority='${placeNum}' ` ;
//console.log(result);

//   execCommand(command)
//   .then(result => res.json(result))
//   .catch(err => logWriter(command, err));

// });

router.get("/treatmenttype", (req, res) => {
  // const guid = req.body.guid;
  const command = `select * from master_treatment_type `;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
  console.log(command);
});

router.post("/treatmentDataGet", (req, res) => {
  var type_id_treatment = req.body.type_id_treatment;
  const command = `select * from master_treatment where typeId = ${type_id_treatment};`;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log('Nowwww',file);
    //   cb(null, "\\\\192.168.1.123\\ngdata\\healaxyapp\\Hospital_data\\patientData\\profilepicture")
    // cb(null, './uploads');
    cb(
      null,
      "\\\\192.168.1.123\\ngdata\\healaxyapp\\Hospital_data\\patientData\\provider"
    );
    // .then(result => res.json('success'))
    // .catch(err => logWriter(command, err))
  },

  filename: function (req, file, cb) {
    const newGenName = newGuid();
    if (Object.keys(nameCache).length == 0) {
      nameCache;
    }

    cb(null, `${newGenName}.${file.originalname.split(".")[1]}`);
  },
});

const upload = multer({ storage: storage, preservePath: true });

const imgFileUpload = upload.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 1 },
]);

function fileupload(req, res, next) {
  //   upload.single("profile")(req,res,next);
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]);
  next();
  // res.json('')
}

router.post("/uploadProfilePic2", (req, res) => {
  const currentGen = newGuid();
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ])(req, res, () => {
    // console.log("req.files[0]",req.files.file1[0],req.files.file2[0]);
    if (req.files.file1 != undefined || req.files.file2 != undefined) {
      if (req.files.file1 != undefined && req.files.file2 == undefined) {
        console.log({ imgs: [req.files.file1[0].filename] });
        res.status(200).json({ images: [req.files.file1[0].filename, ''] });
      } else if (req.files.file1 == undefined && req.files.file2 != undefined) {
        console.log({ imgs: [req.files.file2[0].filename] });
        res.status(200).json({ images: ['', req.files.file2[0].filename] });
      } else if (req.files.file1 != undefined && req.files.file2 != undefined) {
        console.log({
          imgs: [req.files.file1[0].filename, req.files.file2[0].filename],
        });
        res
          .status(200)
          .json({
            images: [req.files.file1[0].filename, req.files.file2[0].filename],
          });
      }
    } else {
      console.log("else image undefined");
      res.status(200).json({ images: ["", ""] });
    }
  });
});

function newGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

router.post("/savetreatmentdata", (req, res) => {
  const { details, imgs } = req.body;
  //  console.log('details',details);

  // console.log('imgs',imgs);
  const { name, describetion } = req.body.details;
  // console.log(name,describetion);
  const img1 = req.body.imgs.images[0];
  // console.log('111',img1);
  const img2 = req.body.imgs.images[1];
  // console.log('222',img2)
  const doctor_id = req.body.doctor_id;
  const hospital_id = req.body.hospital_id;
  const branch_id = req.body.branch_id;
  console.log(doctor_id, hospital_id, branch_id);

  //  doctor_id:any,hospital_id:any,branch_id:any

  // var {providerpicture, providertitle, firstname, middlename, lastname,bloodgroup,genders,age,dateOfBirth,language,communication,notifications,patientid,patientid1} = req.body.personal_identifiers
  // console.log(providerpicture, providertitle, firstname, middlename, lastname,bloodgroup,genders,age,dateOfBirth,language,communication,notifications,patientid,patientid1);
  const command = `insert into provider_treatment ( doctor_id,hospital_id, branch_id, name, description, image_1_id, image_2_id)
      values('${doctor_id}','${hospital_id}','${branch_id}','${name}', '${describetion}', '${img1}','${img2}')`;
  //  console.log(command);

  execCommand(command)
    .then((result) => res.json("success"))
    .catch((err) => logWriter(command, err));
});


router.post("/deletetreatmentdata", (req, res) => {
  // const command = `insert into provider_treatment ( doctor_id,hospital_id, branch_id, name, description, image_1_id, image_2_id)
  //     values('${doctor_id}','${hospital_id}','${branch_id}','${name}', '${describetion}', '${img1}','${img2}')`;
  //  console.log(command);
  var name = req.body.details;
  const command = `delete from provider_treatment where name='${name}';`;
  console.log(command);

  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


});

router.get("/get_type_of_practice", (req, res) => {

  const command = `select * from type_of_practice where id in(2,3,4,5)`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post("/get_speciality", (req, res) => {
  var type_of_practice = req.body.type_of_practice
  console.log(type_of_practice);
  const command = `select * from master_clinical_speciality where type in(${type_of_practice})`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/get_sub_speciality", (req, res) => {
  var speciality = req.body.speciality
  console.log(speciality);
  const command = `select * from master_clinical_sub_speciality where speciality_id in(${speciality})`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post("/getProviderContactDataForEdit_", (req, res) => {
  var guid = req.body.guid;
  var command = `select * from provider_contact  WHERE guid='${guid}'`;
  console.log('command', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getprofisenalinformationdata", (req, res) => {
  var guid = req.body.providerid;
  var command = `select *,(select countryName from master_country1 where conceptId=provider_professional_information.country_of_practice) as countryname from provider_professional_information  WHERE provider_id='${guid}'`;
  console.log(command)
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getprovider_editdata", (req, res) => {
  console.log(req.body);
  var guid = req.body.providerid;
  // if(req.body.type!='staff'){
  var command = `select * from provider_personal_identifiers  WHERE guid='${guid}'`; `SELECT * FROM master_provider_id where providerGuid='${guid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

  // }else
  // {
  //   var command = `select * from master_staffpersonalidentifiers  WHERE guid='${guid}'`;
  //   console.log(command);
  //   execCommand(command)
  //   .then(result => res.json(result))
  //   .catch(err => logWriter(command, err));
  // }
});
router.post("/getcontacteditdata", (req, res) => {
  console.log(req.body);
  var guid = req.body.providerid;
  var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact  WHERE provider_id='${guid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getcontacteditdata", (req, res) => {

  var guid = req.body.providerid;
  var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact  WHERE provider_id='${guid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/SaveaSlote", (req, res) => {
  console.log('gsdjshdkksdjks', req.body);
  // var id = req.body.timeData.guid;
  var provider = req.body.provider_id;
  var hospitalid = req.body.guid
  var branchId = req.body.branchId
  var timeData = req.body.allslote;
  // console.log(guid);
  const commands = `delete from master_slots where Provider_id='${provider}'`;
  console.log(commands);
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < timeData.length) {

            console.log(timeData.length);
            
            const command = `INSERT INTO master_slots(Provider_id, Hospital_id, Start_time, End_time, Days, Date, Status, Slot_transaction_time) values('${provider}','${hospitalid}','${timeData[i].starttime}','${timeData[i].Endtime}','${timeData[i].days}','${timeData[i].dates}','0',now())`;
            console.log('insert', command);
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
    .catch(err => logWriter(commands, err));
});
router.post("/OpenHoursubmitProvider", (req, res) => {
  console.log('gsdjshdkksdjks', req.body);
  // var id = req.body.timeData.guid;
  var provider = req.body.provider_id;
  var hospitalid = req.body.hospitalid
  var branchId = req.body.branchId
  var timeData = req.body.schedulerproviderdata;
  console.log(guid);
  const commands = `delete from provider_schedular where guid='${provider}'`;
  console.log(commands);
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < timeData.length) {
            console.log(guid);
            console.log(timeData.length);
            const command = `INSERT INTO provider_schedular(guid, Hospitalid, Branchid, id, opentime, closetime,opentype,closetype,days,Holiday) values('${provider}','${hospitalid}','${branchId}','${timeData[i].id}','${timeData[i].opentime}','${timeData[i].closetime}','${timeData[i].opentype}','${timeData[i].closetype}','${timeData[i].days}',${timeData[i].Holiday})`;
            console.log('insert', command);
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
    .catch(err => logWriter(commands, err));

  var guid = req.body.providerid;
  var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact  WHERE provider_id='${guid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/Savesloteprovider", (req, res) => {
  console.log('gsdjshdkksdjks', req.body);
  // var id = req.body.timeData.guid;
  var provider = req.body.provider_id;
  var guid = req.body.guid
  var branchId = req.body.branchId
  var timeData = req.body.schedulerproviderdata;
  console.log(guid);
  // const commands =`delete from provider_schedular where guid='${req.body.guid}'`;
  console.log(commands);
  execCommand(commands)
  // .then(result => {
  //   if(result){
  //     let i = 0;
  //     (function loop(){
  //       if (i < timeData.length) {  
  //         console.log(guid);
  //         console.log(timeData.length);
  //         const command = `INSERT INTO provider_schedular(guid, Hospitalid, Branchid, id, opentime, closetime,opentype,closetype,days,Holiday) values('${req.body.guid}','${provider}','${branchId}','${timeData[i].id}','${timeData[i].opentime}','${timeData[i].closetime}','${timeData[i].opentype}','${timeData[i].closetype}','${timeData[i].days}',${timeData[i].Holiday})`;
  //        console.log('insert',command);
  //         execCommand(command)
  //           .then(() => {
  //             i++; 
  //             loop()
  //           })
  //       .catch(err => logWriter(command, err));
  //       }
  //       else{
  //         res.json('success')
  //       }
  //     }())
  //   }
  // })
});
router.post("/getcontacteditdata", (req, res) => {
  console.log(req.body);
  var guid = req.body.providerid;
  var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact  WHERE provider_id='${guid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getScheduledata", (req, res) => {
  console.log(req.body);
  var guid = req.body.guid;
  var command = `SELECT * FROM hospital_opening_hour_current where Branchid='${guid}'`;
  console.log('getScheduledata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getSchedular_provider_value", (req, res) => {
  console.log(req.body);
  var guid = req.body.provider_id;
  var command = `SELECT * FROM provider_schedular where guid='${guid}'`;
  console.log('getScheduledata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get("/Treatmenttypedata", (req, res) => {
  var guid = req.body.guid;
  var command = `SELECT * FROM masterhealthcareservices_invoice_billing`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post("/saveTreatmenttypedata", (req, res) => {
  console.log(req.body);
  var provider = req.body.providerid;
  var treatmentdata = req.body.placeofpractise
  const commands = `delete from provider_treatment where doctor_id='${req.body.provider}'`;
  console.log(commands);
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < treatmentdata.length) {

            console.log(treatmentdata.length);
            const command = `INSERT INTO provider_treatment(doctor_id, display_local_name) values('${provider}','${treatmentdata[i].display_local_name}')`;
            console.log('insert', command);
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
});
router.post("/createusersavedata", (req, res) => {
  console.log(req.body);
  var { guid, membername, Phonenumber, EmailId } = req.body.addmember;
  var hospital_id = req.body.hospitalId;
  var branchid = req.body.branchId;
  var command = `INSERT INTO provider_personal_identifiers(guid,hospital_id,branchId,firstname)values('${guid}','${hospital_id}','${branchid}','${membername}')`;
  console.log('getScheduledata', command);
  execCommand(command)
    .then(result => {
      if (result) {
        mailOptions.to = `${EmailId}`
        mailOptions.subject = `I Email for Provider visit`
        mailOptions.html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Healaxy</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Healaxy. we use follow link to click</p>http://localhost:4200/healaxy#/Approved/patient_dicom
        <a href="http://localhost:4200/registration?hopitalID=${hospital_id}&patientID=${Phonenumber}" target="_blank">http://localhost:4200/healaxy#/Approved/patient_dicom</a>
        &aman=addNewPatient
        Email:
        <h2 style="width: max-content;padding: 0 10px;color: #fff;">${EmailId}</h2>
        password:
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">{{Phonenumber}}</h2>
        <p style="font-size:0.9em;">Best,<br />Healaxy</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Healaxy</p>
          <p>India</p>
        </div>
      </div>
    </div>`

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.json('success')
          } else {
            console.log('Email sent: ' + info.response);
            res.json('success')
            console.log(res.json,'success');
          }
        });
      }
    })
    .catch(err => logWriter(command, err));
})
module.exports = router;
