const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

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


router.get("/getAllProvider", (req, res) => {
  const command = `SELECT * from provider_personal_identifiers`;
 
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});


router.post("/getAllProvidersOfhospital", (req, res) => {

  const command = `SELECT * from provider_personal_identifiers where hospital_id = '${req.body.hospitalId}' and branchId = '${req.body.branchId}'`;
 console.log(command);
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});


router.post("/getProviderSlotsForCalendar", (req, res) => {
  console.log('provider slots',req.body);
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
  var {guid} = req.body
  const command = `SELECT * from provider_personal_identifiers where guid = '${guid}'`;
  console.log(command);
 
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/getProviderContactDataForEdit", (req, res) => {
  // console.log('hit');
  var {guid} = req.body
  const command = `SELECT * from provider_contact where provider_id = '${guid}'`;
  console.log(command);
 
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});
router.post("/getProviderProfessionalInfoForEdit", (req, res) => {
  // console.log('hit');
  var {guid} = req.body
  const command = `SELECT * from provider_professional_information where provider_id = '${guid}'`;
  console.log(command);
 
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});


// // addnew hospital form

// router.post('/Hospital_Registration', (req,res)=>{
//     console.log(req.body);
//      console.log(req.body);
//     var {hospitalname,addressline1,addressline2,areaaround,cityname,area,state,country,landmarkss,postalcode} = req.body.registrationForm
//     var guid = req.body.guid;
    
//      // console.log(hospitalname,addressline1,addressline2,areaaround,cityname,area,state,country,landmarkss,postalcode);
//        command = `INSERT INTO hosptal_registration(guid, clinicName,addressLine1,addressLine2,area,city,district,state,country,landmark,postalcode) 
//        values('${guid}','${hospitalname}','${addressline1}','${addressline2}','${areaaround}','${cityname}','${area}','${state}','${country}','${landmarkss}','${postalcode}')`;
//         console.log(command);
//         execCommand(command)
//         .then(result => res.json('success'))
//         .catch(err => logWriter(command, err));

// })


// // place of practice

// router.post('/getplaceofpractiseofdata', (req, res) => {
//     const guid = req.body.guid;
//     const hospital_id=req.body.hospital_id;
//     var placeNum=req.body.placeNum;
   
//     const command= `SELECT * FROM transaction_place_of_practice WHERE doctor_guid='${guid}' and hospital_id='${hospital_id}' order by priority` ;
//     // const command= `SELECT * FROM transaction_place_of_practice WHERE doctor_guid='${guid}' and hospital_id='${hospital_id}' and priority='${placeNum}' ` ;
//     //console.log(result);
//     execCommand(command)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err)); 
//   });


// router.post('/PlacesOfPraciticeformsubmit', (req,res)=>{
//     // console.log(req.body);
    
//      var {workplace,Hospitalname,addreshline1,addreshline2,areas,area,state,country,landmark,landmark,postalcode,phone,mobile,emailid,department,Latitude,Longitude}= req.body.PlacesOfPraciticeform
//      var cityname=req.body.PlacesOfPraciticeform.cityname.id;
//      var guid = req.body.guid;placeNum;
//      var hospital_id=req.body.hospital_id;
//      var placeNum=req.body.placeNum;
//     //  console.log('rrr',guid,hospital_id,placeNum);
    

//     //console.log(workplace,Hospitalname,addreshline1,addreshline2,city_name,text,distict1,state,country,landmark,landmark,postalcode1,phone,mobile,emailid,department);
     
//         command = `INSERT INTO transaction_place_of_practice(doctor_guid, hospital_id,priority, workplace_type, clinic_name, addressline1, addressline2, area, city, district, state, country, landmark, postalCode, phone, mobile, emailId, department ,Latitude,Longitude) 
//        values('${guid}','${hospital_id}','${placeNum}','${workplace}','${Hospitalname}','${addreshline1}','${addreshline2}','${areas}','${cityname}','${area}','${state}','${country}','${landmark}','${postalcode}','${phone}','${mobile}','${emailid}','${department}','${Latitude}','${Longitude}')`;
      
//         execCommand(command)
//         .then(result => res.json('success'))
//         .catch(err => logWriter(command, err));
// })

// router.post('/PlacesOfPraciticeformupdate', (req, res) => {
//     var {workplace,Hospitalname,addreshline1,addreshline2,areas,area,state,country,landmark,landmark,postalcode,
//       phone,mobile,emailid,department,Latitude,Longitude}= req.body.PlacesOfPraciticeform
//     var cityname=req.body.PlacesOfPraciticeform.cityname.id;
//     var guid = req.body.guid;placeNum;
//     var hospital_id=req.body.hospital_id;
//     var placeNum=req.body.placeNum;
//     // console.log('rrr',guid,hospital_id,placeNum);
//     // console.log('PlacesOfPraciticeformupdate');
//     command = `update transaction_place_of_practice set workplace_type='${workplace}',clinic_name='${Hospitalname}',addressline1='${addreshline1}',addressline2='${addreshline2}',area='${areas}',city='${cityname}' ,district='${area}' ,state='${state}',country='${country}',landmark='${landmark}', postalCode='${postalcode}', phone='${phone}', mobile='${mobile}'  , emailId='${emailid}', department='${department}', Latitude='${Latitude}', Longitude='${Longitude}' WHERE hospital_id='${hospital_id}'  and doctor_guid='${guid}' and priority='${placeNum}'`;
//    // console.log(command);
//     execCommand(command)
//     .then(result => res.json('success'))
//     // console.log(result);
//     .catch(err => logWriter(command, err)); 
//   });

//   router.get('/getHospitalData', (req, res) => {
//     const guid = req.body.guid;
//     const command = `select * from hosptal_registration `
//     execCommand(command)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err));
// })  

 




// router.post('/personal_identifiersSubmit', (req, res) => {
    
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

let nameCache = {};



// place of practice

router.post("/getplaceofpractiseofdata", (req, res) => {
  const guid = req.body.guid;
  const hospital_id = req.body.hospital_id;
  var placeNum = req.body.placeNum;

  const command = `SELECT * FROM transaction_place_of_practice WHERE doctor_guid='${guid}' and hospital_id='${hospital_id}' order by priority`;
 
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

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
  var placeNum = req.body.placeNum;
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
  const guid = req.body.guid;
  const command = `select * from hosptal_registration `;
  execCommand(command)
    .then((result) => res.json(result))
    .catch((err) => logWriter(command, err));
});

router.post("/staff_identifiersSubmit", (req, res) => {
  console.log('staff_identifiersSubmit');
  const hospital_id = req.body.guid;
  const brachId = req.body.branchId;
  const formState = req.body.formState;

console.log(req.body.personal_identifiers);
  const { provider_guid, providertitle, firstname, middlename, lastname, bloodgroup, genders, age, dateOfBirth, language, communication, notifications } = req.body.personal_identifiers;
  console.log(req.body.personal_identifiers.providerId);
var command = ``;
const command1 =`delete from master_staffpersonalidentifiers where guid='${provider_guid}'`;
console.log(command1)
execCommand(command1)

.then(result => {"a017227b-81cb-4dcb-9ddb-df599bf1019f"
  if(result){


    command = `insert into master_staffpersonalidentifiers ( guid,hospital_id, branchId, Provider_picture,providertitle, firstname, middlename, lastname, bloodgroup, gender, dateOfBirth, age, language, communication, notifications)
    values('${provider_guid}','${hospital_id}','${brachId}','${provider_guid}.jpg','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}')`;

  console.log(command);
    execCommand(command)

    .then(result => res.json('success'))
   
}

})
.catch(err => logWriter(command1, err));
})

// if(formState == 'new'){
//   command = `insert into master_staffpersonalidentifiers ( guid,hospital_id, branchId, Provider_picture,providertitle, firstname, middlename, lastname, bloodgroup, gender, dateOfBirth, age, language, communication, notifications)
//               values('${provider_guid}','${hospital_id}','${brachId}','${provider_guid}.jpg','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}')`;

// }
//   else{
// command = `update master_staffpersonalidentifiers set providertitle = '${providertitle}',  firstname='${firstname}', middlename = '${middlename}', lastname = '${lastname}', bloodgroup = '${bloodgroup}', genders = '${genders}', age = '${age}', dateOfBirth = '${dateOfBirth}', language = '${language}', communication = '${communication}', notifications = '${notifications}' where guid ='${provider_guid}'  `
//   }
// console.log(command);
//   execCommand(command.replace(/null/g,''))
//     .then((result) => {
//       if(result.affectedRows){

//         var {providerId} = req.body.personal_identifiers
//         var providerIdQuery = '';
//         for(var i = 0; i< providerId.length; i++){
//           providerIdQuery +=  `insert into master_provider_id (providerGuid, type, number, file) values('${provider_guid}','${providerId[i].type}','${providerId[i].number}','${providerId[i].fileqw}');`
//         }
//         console.log(providerIdQuery);

//         execCommand(providerIdQuery)
//         .then(result => res.json({msg:'success',provider_guid: provider_guid}))
//         .catch(err => logWriter(providerIdQuery, err));
//       }

//       // res.json("success")
//     })
//     .catch((err) => logWriter(command, err));
  
// });


router.post('/insertStaffContact', (req,res)=>{
  console.log(req.body);
  const {guid,addressLine1,addressLine2,area,district,state,city,country,landmark, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone} = req.body.form;
  const formsState = req.body.formState;
  console.log(formsState);
  let sql;
  if(req.body.form.guid == 'undefined'){

  sql = `insert into master_staffcontact (provider_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone)
  values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalCode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}')`
}
  else{
      console.log('going for else');
      sql = `update master_staffcontact set  addressLine1 = '${addressLine1}', addressLine2 = '${addressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', emergencyContactNumber = '${emergencyContactNumber}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' where provider_id = '${guid}';`
  }
  console.log(sql.replace(/null/g,''));
  execCommand(sql.replace(/null/g,''))
  .then(result => res.json('success'))
  .catch(err => logWriter(sql, err));

});

router.post('/insertStaffProfessionalInformation', (req,res)=>{
  console.log(req.body);

  const {guid,type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, countryOfPractice, stateMedicalCouncil, RegistrationNumber, professionalSocietyMembership, membership, profile, bookchapterpublications} = req.body.form;

  var command = `INSERT INTO master_staffprofessionalinformation (provider_id, type_of_practice, speciality, sub_speciality, graduation_year, qualification, experience, country_of_practice, state_medical_council, registration_number, professional_society_memberships, profile, publications_and_bookchapters) 
  VALUES('${guid}', '${type_of_practice}', '${speciality}', '${sub_speciality}', '${formatDate(graduation_year)}', '${qualification}', '${formatDate(experience)}', '${countryOfPractice}', '${stateMedicalCouncil}', '${RegistrationNumber}', '${professionalSocietyMembership}', '${profile}', '${bookchapterpublications}');`

  console.log(command);
  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(sql, err));
});




router.post('/getcountryofpractice', (req,res)=>{
  var sql = `select * from master_country1 where countryName like '${req.body.query}%'`;
  console.log(sql);
 
 
  execCommand(sql)
  .then(result => res.json(result))
  .catch(err => logWriter(sql, err));

});
router.post('/getStateMedicalCouncilAccToCountry', (req,res)=>{
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
        res.status(200).json({ images: [req.files.file1[0].filename,''] });
      } else if (req.files.file1 == undefined && req.files.file2 != undefined) {
        console.log({ imgs: [req.files.file2[0].filename] });
        res.status(200).json({ images: ['',req.files.file2[0].filename] });
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
  // console.log('222',img2);
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
  const command =`delete from provider_treatment where name='${name}';`;
  console.log(command);

  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
 
  
});

router.get("/get_type_of_practice", (req, res) => {
 
  const command =`select * from type_of_practice where id in(2,3,4,5)`;

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
  
});
router.post("/get_speciality", (req, res) => {
  var type_of_practice = req.body.type_of_practice
  console.log(type_of_practice);
  const command =`select * from master_clinical_speciality where type in(${type_of_practice})`;
console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});
router.post("/get_sub_speciality", (req, res) => {
  var speciality = req.body.speciality
  console.log(speciality);
  const command =`select * from master_clinical_sub_speciality where speciality_id in(${speciality})`;
console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});



module.exports =router;