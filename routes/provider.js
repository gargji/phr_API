const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const nodemailer = require('nodemailer');
const {generatePass} = require('./../config/common_functions')

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

router.post("/getSelectedResourcesForProvider", (req, res) => {
  var provider_id = req.body.provider_id
  var command = `select guid, (select concat(providertitle, ' ', firstname, ' ', lastname) as title from provider_personal_identifiers where guid = provider_schedular.guid) as title ,id, opentime, closetime, opentype, closetype, days, Holiday, day_id from provider_schedular where guid = '${provider_id}' and holiday = '0' order by day_id`
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
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/gettreatmentdata", (req, res) => {
  console.log(req.body);
  const guid = req.body.providerid;



  const command = `SELECT * FROM provider_treatment WHERE doctor_id='${guid}'`;
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

            command = `insert into transation_placeofpractise ( Provider_id, Hospitalname, clinicName, Address, phone)
         values('${guid}','${PlacesOfPraciticedata[i].Hospitalname}','${PlacesOfPraciticedata[i].clinicName}','${PlacesOfPraciticedata[i].phone}', '${PlacesOfPraciticedata[i].phone}')`;
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

router.post("/getHospitalData", (req, res) => {
  const guid = req.body.hospital_id;
  console.log(req.body);
  const command = `select * from hosptal_registration where organzation_id='${guid}' order by clinicName `;
  console.log('', command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
})

router.post("/personal_identifiersSubmit", (req, res) => {
  const hospital_id = req.body.guid;
  const brachId = req.body.branchId;
  const formState = req.body.formState;
  var Id = req.body.personal_identifiers.Id
  const { provider_guid, providertitle, firstname, middlename, lastname, bloodgroup, genders, age, dateOfBirth, language, communication, notifications } = req.body.personal_identifiers;
  var command = ``;
  if (Id == '' || Id == null || Id == undefined) {
    command = `insert into provider_personal_identifiers (guid,hospital_id,branchId, Provider_picture, providertitle, Firstname, Middlename, Lastname, bloodgroup, Gender, dateOfBirth, Age, Language, communication, Notifications)
values('${provider_guid}','${hospital_id}','${brachId}','${provider_guid}.jpg','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}')`;
  }
  else {
    command = `update provider_personal_identifiers set Provider_picture='${provider_guid}.jpg', providertitle = '${providertitle}',   Firstname='${firstname}', Middlename = '${middlename}', Lastname = '${lastname}', bloodgroup = '${bloodgroup}', Gender = '${genders}', Age = '${age}', dateOfBirth = '${dateOfBirth}', language = '${language}', communication = '${communication}', notifications = '${notifications}' where guid ='${provider_guid}';`
  }
  execCommand(command.replace(/null/g, ''))
    .then((result) => {
      var command = `delete from master_provider_id where providerGuid='${provider_guid}'`;
      execCommand(command.replace(/null/g, ''))
      if (result.affectedRows) {

        var { providerId } = req.body.personal_identifiers
        var providerIdQuery = '';
        var i = 0;
        setTimeout(() => {

          (function loop() {
            if (i < providerId.length) {
              providerIdQuery += `insert into master_provider_id (providerGuid, type, number, file) values('${provider_guid}','${providerId[i].type.replace("'", "")}','${providerId[i].number}','${providerId[i].file}');`
              i++;
              loop();
            }
            else {
              execCommand(providerIdQuery)
                .then(result => {
                  res.json({ msg: 'success', provider_guid: provider_guid })
                })
                .catch(err => logWriter(providerIdQuery, err));
            }
          }())
        }, 1000);
      }
    })
    .catch((err) => logWriter(command, err));
});



// router.post("/personal_identifiersSubmit", (req, res) => {
//   const hospital_id = req.body.guid;
//   const brachId = req.body.branchId;
//   const formState = req.body.formState;
//   var Id = req.body.personal_identifiers.Id
//   console.log('Aman', req.body);
//   const { provider_guid, providertitle, firstname, middlename, lastname, bloodgroup, genders, age, dateOfBirth, language, communication, notifications } = req.body.personal_identifiers;
//   console.log(req.body.personal_identifiers.providerId);
//   var command = ``;
//   if (Id == '' || Id == null || Id == undefined) {
//     command = `insert into provider_personal_identifiers (guid,hospital_id,branchId, Provider_picture, providertitle, Firstname, Middlename, Lastname, bloodgroup, Gender, dateOfBirth, Age, Language, communication, Notifications)
// values('${provider_guid}','${hospital_id}','${brachId}','${provider_guid}.jpg','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}')`;


//   }
//   else {
//     command = `update provider_personal_identifiers set Provider_picture='${provider_guid}.jpg', providertitle = '${providertitle}',   Firstname='${firstname}', Middlename = '${middlename}', Lastname = '${lastname}', bloodgroup = '${bloodgroup}', Gender = '${genders}', Age = '${age}', dateOfBirth = '${dateOfBirth}', language = '${language}', communication = '${communication}', notifications = '${notifications}' where guid ='${provider_guid}';`

//     // comands='  update provider_personal_identifiers set providertitle = 'Mrs.',  Firstname='Gaurang', Middlename = 'Ghazibad', Lastname = 'Vishnoi', bloodgroup = 'AB +ve', Gender = 'Male', dateOfBirth = '2000-03-17', Age = '23', language = 'farshi', communication = 'Phone', notifications = 'Phone' where guid ='d2b33a01-8883-43be-b08b-9f11194d9125';
//     // command = `update provider_personal_identifiers set providertitle = '${providertitle}',  Firstname='${firstname}', Middlename = '${middlename}', Lastname = '${lastname}', bloodgroup = '${bloodgroup}', Gender = '${genders}', Age = '${age}', dateOfBirth = '${dateOfBirth}', language = '${language}', communication = '${communication}', notifications = '${notifications}' where guid ='${provider_guid}'  `
//   }
//   console.log(command.replace(/null/g, ''));
//   execCommand(command.replace(/null/g, ''))
//     .then((result) => {
//     var command= `delete from master_provider_id where providerGuid='${provider_guid}'`
//     // delete from provider_contact where provider_id='${guid}'`;
//       execCommand(command.replace(/null/g, ''))
//       if (result.affectedRows) {

//         var { providerId } = req.body.personal_identifiers
//         console.log('wertyuuuuuuuuuuuuuuuuuuuuuu',providerId);
//         var providerIdQuery = '';
//         for (var i = 0; i < providerId.length; i++) {
//           providerIdQuery += `insert into master_provider_id (providerGuid, type, number, file) values('${provider_guid}','${providerId[i].type.replace("'","")}','${providerId[i].number}','${providerId[i].fileqw}');`
//           if(i == providerId.length-1){
//             execCommand(providerIdQuery)
//             .then(result => {
//               console.log('hitting');
//               res.json({ msg: 'success', provider_guid: provider_guid })})
//             .catch(err => logWriter(providerIdQuery, err));
//           }
//         }
//         console.log(providerIdQuery);


//       }

//       // res.json("success")
//     })
//     .catch((err) => logWriter(command, err));

// });


router.post('/insertProviderContact', (req, res) => {
  console.log(req.body);
  const country = req.body.form.country.countrycode
  const postalcode = req.body.form.postalcode.postalcode
  const { guid, addressLine1, addressLine2, area, district, state, city, landmark, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone } = req.body.form;
  const formsState = req.body.formState;
   var Work=req.body.form.Work
   var Office=req.body.form.Office
  
  // //console.log(formsState);
  let sql;
  // if(formsState == 'edit'){
  //   sql = `update provider_contact set  addressLine1 = '${addressLine1}', addressLine2 = '${addressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', emergencyContactNumber = '${emergencyContactNumber}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' where provider_id = '${guid}';`

  // }
  // else{
  //   sql = `insert into provider_contact (provider_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone)
  //   values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalCode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}')`
  // }
  // //console.log(sql);
  // execCommand(sql.replace(/null/g,''))
  // .then(result => res.json('success'))
  // .catch(err => logWriter(sql, err));
  const command1 = `delete from provider_contact where provider_id='${guid}'`;
  //console.log(command1)
  execCommand(command1)

    .then(result => {
      if (result) {


        command = `insert into provider_contact (Work,Office,provider_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone)
         values('${Work}','${Office}','${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalcode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}')`
        //console.log(command);
        execCommand(command.replace(/null/g, '').replace(/undefined/g,''))

          .then(result => res.json('success'))
          // 
          .catch(err => logWriter(command, err));
      }

    })
    .catch(err => logWriter(command1, err));
})



// router.post('/insertProviderProfessionalInformation', (req, res) => {
//   //console.log(req.body);
//   var formsState = req.body.formState
//   //console.log(formsState);
//   const countryOfPractice = req.body.form.country.countrycode
//   const { guid, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, state, RegistrationNumber, professionalSocietyMembership, profile, bookchapterpublications, JobTitle } = req.body.form;

//   const command1 = `delete from provider_professional_information where provider_id='${guid}'`;
//   //console.log(command1)
//   execCommand(command1)

//     .then(result => {
//       if (result) {


//         var command = `INSERT INTO provider_professional_information (provider_id, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, country_of_practice, state_medical_council, registration_number, professional_society_memberships, profile, publications_and_bookchapters,JobTitle) 
//    VALUES('${guid}', '${type_of_practice}', '${speciality}', '${sub_speciality}', '${graduation_year}', '${qualification}', '${experience}', '${countryOfPractice}', '${state}', '${RegistrationNumber}', '${professionalSocietyMembership}', '${profile}', '${bookchapterpublications}','${JobTitle}');`

//         //console.log(command);
//         execCommand(command)

//           .then(result => res.json('success'))
//           // 
//           .catch(err => logWriter(command, err));
//       }

//     })
//     .catch(err => logWriter(command1, err));
// })
router.post('/getcountryofpractice', (req, res) => {
  var sql = `select * from master_country1 where countryName like '${req.body.query}%'`;
  //console.log(sql);


  execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));

});
router.post('/getStateMedicalCouncilAccToCountry', (req, res) => {
  var sql = `select * from master_state_medical_council where country_id = '${req.body.countryId}'`;
  //console.log(sql);


  execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));

});



// router.get('/treatmenttype', (req, res) => {

// const command= `SELECT * FROM master_treatment` ;
// const command= `SELECT * FROM transaction_place_of_practice WHERE doctor_guid='${guid}' and hospital_id='${hospital_id}' and priority='${placeNum}' ` ;
////console.log(result);

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
  //console.log(command);
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
    // //console.log('Nowwww',file);
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
    // //console.log("req.files[0]",req.files.file1[0],req.files.file2[0]);
    if (req.files.file1 != undefined || req.files.file2 != undefined) {
      if (req.files.file1 != undefined && req.files.file2 == undefined) {
        //console.log({ imgs: [req.files.file1[0].filename] });
        res.status(200).json({ images: [req.files.file1[0].filename, ''] });
      } else if (req.files.file1 == undefined && req.files.file2 != undefined) {
        //console.log({ imgs: [req.files.file2[0].filename] });
        res.status(200).json({ images: ['', req.files.file2[0].filename] });
      } else if (req.files.file1 != undefined && req.files.file2 != undefined) {
      
        res
          .status(200)
          .json({
            images: [req.files.file1[0].filename, req.files.file2[0].filename],
          });
      }
    } else {
      //console.log("else image undefined");
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
  // console.log(doctor_id, hospital_id, branch_id);

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
  // console.log(type_of_practice);
  const command = `select * from master_clinical_speciality where type in(${type_of_practice})`;
  // console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/get_sub_speciality", (req, res) => {
  var speciality = req.body.speciality
  // console.log(speciality);
  const command = `select * from master_clinical_sub_speciality where speciality_id in(${speciality})`;
  // console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post("/getProviderContactDataForEdit_", (req, res) => {
  var guid = req.body.guid;
  var command = `select * from provider_contact  WHERE guid='${guid}'`;
  // console.log('command', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
// router.post("/getprofisenalinformationdata", (req, res) => {
//   var guid = req.body.providerid;
//   var command = `select *,(select countryName from master_country1 where conceptId=provider_professional_information.country_of_practice) as countryname from provider_professional_information  WHERE provider_id='${guid}'`;
//   // console.log(command)
//   execCommand(command)

//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err));
// });
router.post("/getprovider_editdata", (req, res) => {
  // console.log(req.body);
  var guid = req.body.providerid;
  // if(req.body.type!='staff'){
  var command = `select * from provider_personal_identifiers  WHERE guid='${guid}';SELECT * FROM master_provider_id where providerGuid='${guid}'`;
  // console.log('vaibhav getprovider_editdata',command);
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
router.post('/insertProviderProfessionalInformation', (req, res) => {
  console.log(req.body);
  var formsState = req.body.formState
  console.log(formsState);
  const countryOfPractice = req.body.form.country.countrycode
  const { guid, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, state, RegistrationNumber, professional_society_memberships, profile, publications_and_bookchapters, JobTitle } = req.body.form;

  const command1 = `delete from provider_professional_information where provider_id='${guid}'`;
  console.log(command1)
  execCommand(command1)

    .then(result => {
      if (result) {


        var command = `INSERT INTO provider_professional_information (provider_id, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, country_of_practice, state_medical_council, registration_number, professional_society_memberships, profile, publications_and_bookchapters,JobTitle) 
   VALUES('${guid}', '${type_of_practice}', '${speciality}', '${sub_speciality}', '${graduation_year}', '${qualification}', '${experience}', '${countryOfPractice}', '${state}', '${RegistrationNumber}', '${professional_society_memberships}', '${profile}', '${publications_and_bookchapters}','${JobTitle}');`

        console.log(command);
        execCommand(command)

          .then(result => res.json('success'))
          // 
          .catch(err => logWriter(command, err));
      }

    })
    .catch(err => logWriter(command1, err));
})
router.post("/getprofisenalinformationdata", (req, res) => {
  var guid = req.body.providerid;
  var command = `select *,(select Country from master_country_code1 where countrycode=provider_professional_information.country_of_practice) as countryname from provider_professional_information WHERE provider_id='${guid}'`;

  console.log(command)
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getcontacteditdata", (req, res) => {
  // console.log(req.body);
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
  // console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/SaveaSlote", (req, res) => {
  // console.log('gsdjshdkksdjks', req.body);
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
            const originalDate =timeData[i].dates;
          

            // Split the original date by '/'
            const dateParts = originalDate.split('/');
            
            // Extract the day, month, and year
            const month = dateParts[0];
            const day = dateParts[1];
            const year = dateParts[2];
            
            // Create a new Date object with the rearranged date parts
            const formattedDate = new Date(`${year}-${month}-${day}`);
            
            // console.log(formattedDate.toISOString().split('T')[0]);
            const formtdates=formattedDate.toISOString().split('T')[0];
          
            
            const command = `INSERT INTO master_slots(Provider_id, Hospital_id, Start_time, End_time, Days, Date, Status, Slot_transaction_time) values('${provider}','${hospitalid}','${timeData[i].starttime}','${timeData[i].Endtime}','${timeData[i].days}','${formtdates}','0',now())`;
          
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
  
  // var id = req.body.timeData.guid;
  var provider = req.body.provider_id;
  var hospitalid = req.body.hospitalid
  var branchId = req.body.branchId
  var timeData = req.body.schedulerproviderdata;
 
  const commands = `delete from provider_schedular where guid='${provider}'`;
  
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < timeData.length) {
            console.log(guid);
            console.log(timeData.length);
            
            const command = `INSERT INTO provider_schedular(guid, Hospitalid, Branchid, id, opentime, closetime,opentype,closetype,days,Holiday,day_id) values('${provider}','${hospitalid}','${branchId}','${timeData[i].id}','${timeData[i].opentime}','${timeData[i].closetime}','${timeData[i].opentype}','${timeData[i].closetype}','${timeData[i].days}',${timeData[i].Holiday},'${timeData[i].day_id}')`;
            console.log('insert111111111111111111', command);
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

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/Savesloteprovider", (req, res) => {

  // var id = req.body.timeData.guid;
  var provider = req.body.provider_id;
  var guid = req.body.guid
  var branchId = req.body.branchId
  var timeData = req.body.schedulerproviderdata;

  // const commands =`delete from provider_schedular where guid='${req.body.guid}'`;

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
  
  var guid = req.body.providerid;
  var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact  WHERE provider_id='${guid}'`;
  
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getScheduledata", (req, res) => {
 
  var guid = req.body.guid;
  var command = `SELECT * FROM hospital_opening_hour_current where Branchid='${guid}'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post("/getSchedular_provider_value", (req, res) => {
 
  var guid = req.body.provider_id;
  var command = `SELECT * FROM provider_schedular where guid='${guid}'`;
 
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

router.get("/gettimezonedata", (req, res) => {

  // var command = `SELECT * FROM masterhealthcareservices_invoice_billing`;
  const command = `SELECT CONCAT(Time_Zone, ' ', GMT_Offset) AS Time_Zone_And_Offset FROM master_timezone;`;
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
  var { guid, membername, Phonenumber, EmailId } = req.body.addmember;
  var hospital_id = req.body.hospitalId;
  var branchid = req.body.branchId;
  var role = req.body.Role;
  var generatedPass = generatePass();
  console.log('_____', generatedPass);
  var url=''
  var command = `INSERT INTO provider_personal_identifiers(guid,hospital_id,branchId,firstname)values('${guid}','${hospital_id}','${branchid}','${membername}'); insert into login_credentials (user_id, hospital_id, branch_id, email_id, password, user_type) values('${guid}','${hospital_id}','${branchid}', '${EmailId}','${generatedPass}' ,'${role}')`;
  console.log(command);
  execCommand(command)
    .then(result => {
      if (result) {
        mailOptions.to = `${EmailId}`
        mailOptions.subject = `Provider verification`
        mailOptions.html = 
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email verification for Provider</title>
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
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Email verification for  provider </h1>
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
                      <p style="margin: 0;">Hi ${membername},</p>'
                      <p>Thank you for choosing Healaxy, please use following link  to activate your Provider Account</p>
                      <a href="http://192.168.1.185/helaaxy" target="_blank">click here to login into healaxy using below credentials</a>
                      <h4 style="width: max-content;padding: 0 10px;color: black"> Email:${EmailId}</h4>
                      <h4 style="width: max-content;padding: 0 10px;color: black;"> Pass:${generatedPass}</h4>
                      
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
router.post("/get_provider_data", (req, res) => {
  console.log(req.body);
  var guid = req.body.hospital_id;
  var command = `SELECT * FROM provider_schedular where guid='${guid}'`;
  var command=`SELECT guid,firstname FROM provider_personal_identifiers where branchId ='${guid}'`
  console.log('getScheduledata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post("/GetProviderdata", (req, res) => {
  console.log(req.body);
  var guid = req.body.hospitalid;

  var command=`SELECT guid,firstname FROM provider_personal_identifiers where branchId ='${guid}'`
  console.log('getproviderdata', command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
module.exports = router;
