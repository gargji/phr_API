const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')




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

router.post("/personal_identifiersSubmit", (req, res) => {
  const hospital_id = req.body.guid;
  const brachId = req.body.branchId;

  var {provider_guid,
    providertitle,
    firstname,
    middlename,
    lastname,
    bloodgroup,
    genders,
    age,
    dateOfBirth,
    language,
    communication,
    notifications,

  } = req.body.personal_identifiers;
  console.log(req.body.personal_identifiers.providerId);

  const command = `insert into provider_personal_identifiers ( guid,hospital_id, branchId, Provider_picture, Title, Firstname, Middlename, Lastname, Blood_Group, Gender, DOB, Age, Language, Communication, Notifications)
     values('${provider_guid}','${hospital_id}','${brachId}','${provider_guid}.jpg','${providertitle}','${firstname}', '${middlename}', '${lastname}','${bloodgroup}','${genders}', '${age}', '${dateOfBirth}','${language}','${communication}','${notifications}')`;
  console.log(command);

  execCommand(command)
    .then((result) => {
      if(result.affectedRows){

        var {providerId} = req.body.personal_identifiers
        var providerIdQuery = '';
        for(var i = 0; i< providerId.length; i++){
          providerIdQuery +=  `insert into master_provider_id (providerGuid, type, number, file) values('${provider_guid}','${providerId[i].type}','${providerId[i].number}','${providerId[i].fileqw}');`
        }
        console.log(providerIdQuery);

        execCommand(providerIdQuery)
        .then(result => res.json({msg:'success',provider_guid: provider_guid}))
        .catch(err => logWriter(providerIdQuery, err));
      }

      // res.json("success")
    })
    .catch((err) => logWriter(command, err));
  
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
  console.log('11111111111',name);
  const command =`delete from provider_treatment where name='${name}';`;
  console.log(command);

  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
 
  
});

module.exports = router;


module.exports =router;