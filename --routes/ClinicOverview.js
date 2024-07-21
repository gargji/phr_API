const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const multer = require('multer')

const fs = require("fs");
const { text } = require('express');


// ___________________-clinic Overview

router.post('/InsertClinicOverview', (req,res)=>{
// console.log(req.body);
  var hospitalId = req.body.guid;
  var branchId = req.body.branchId;
  var componentstate = req.body.state
  
  var clinicName=req.body.data.clinicName
  var addressLine1=req.body.data.addressLine1
  var addressLine2=req.body.data.addressLine2
  var area=req.body.data.area
  var city=req.body.data.city.id;
  var state=req.body.data.state
  var landmark=req.body.data.landmark
  var phone=req.body.data.phone
  var EmailId=req.body.data.EmailId
  var district=req.body.data.district
  var country=req.body.data.country
  var postalCode=req.body.data.postalCode
  var mobile=req.body.data.mobile
  var clinicDescription=req.body.data.clinicDescription;
  
  
  
  var user_registrationDataObj = req.body.user_registrationDataObj;


  var getNoOfBranchesSQL = `select count(*) as count from user_registration where guid = '${hospitalId}';`;

    execCommand(getNoOfBranchesSQL)
    .then(result => {
      if(result[0].count>0){
        // ____________________________________________________________________________
        
        if (componentstate == 'addnew') {
          var newBranchId = req.body.guid + '_' + result[0].count;
          commandInsert = `insert into hosptal_registration (guid, branch_id, clinicName, addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, phone, mobile, clinicDescription) values('${hospitalId}','${newBranchId}','${clinicName}','${addressLine1}','${addressLine2}','${area}','${city}','${district}','${state}','${country}','${landmark}','${postalCode}','${phone}','${mobile}','${clinicDescription}'); insert into user_registration (guid, branchId, FirstName, LastName, Email, Password, PracticeName, Speciality, mobileNo) values('${hospitalId}', '${newBranchId}','${user_registrationDataObj.firstname.FirstName}', '${user_registrationDataObj.firstname.LastName}', '${EmailId}', 'Dnpl@2015','${user_registrationDataObj.firstname.PracticeName}', '${user_registrationDataObj.firstname.Speciality}', '${mobile}');`;
          execCommand(commandInsert)
          .then(result => res.json('added'))
          .catch(err => logWriter(commandInsert, err));
        }
        
        // ____________________________________________________________________________
        
        if (componentstate == 'main' || componentstate == 'edit') {
          const commandUpdate = `update hosptal_registration set clinicName='${clinicName}',addressLine1='${addressLine1}',addressLine2='${addressLine2}',area='${area}',city='${city}',state='${state}',landmark='${landmark}',phone='${phone}',district='${district}',country='${country}',postalCode='${postalCode}',mobile='${mobile}',clinicDescription='${remove_single_quote_from_text(clinicDescription)}' where branch_id='${branchId}'; update  user_registration set Email='${EmailId}' where branchId='${branchId}';`;
          execCommand(commandUpdate)
          .then(result => res.json('success'))
          .catch(err => logWriter(commandUpdate, err));

        }
      }
    })
//     .catch(err => logWriter(getNoOfBranchesSQL, err));

    // var guid=req.body.guid
    // var clinicName=req.body.data.clinicName
    // var addressLine1=req.body.data.addressLine1
    // var addressLine2=req.body.data.addressLine2
    // var area=req.body.data.area
    // var city=req.body.data.city.id;
    // var state=req.body.data.state
    // var landmark=req.body.data.landmark
    // var phone=req.body.data.phone
    // var EmailId=req.body.data.EmailId
    // var district=req.body.data.district
    // var country=req.body.data.country
    // var postalCode=req.body.data.postalCode
    // var mobile=req.body.data.mobile
    // var clinicDescription=req.body.data.clinicDescription
    

   
    
    // execCommand(command)
    // .then(result => res.json('success'))
    // .catch(err => logWriter(command, err));
   
});

router.post('/GetHospitalRegistrationtableData',(req,res)=>{
  var guid=req.body.id
  console.log(guid);

  const command=`SELECT *,(select city_name from master_city where id=hosptal_registration.city) as CityName,(select countryName from master_country1 where conceptId = hosptal_registration.country) as countryName,(select state_name from master_state where id=hosptal_registration.state) as StateName,(select pincode from master_pincode where id=hosptal_registration.postalCode)as postalCode1 from hosptal_registration where branch_id='${guid}';select Email from user_registration where branchId = '${guid}';`;
  console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})

router.post('/getBranchDatawithSpecificID',(req,res)=>{
  guid=req.body.id

  const command=`SELECT *,(select city_name from master_city where id=hosptal_registration.city) as CityName,(select countryName from master_country1 where conceptId = hosptal_registration.country) as countryName,(select state_name from master_state where id=hosptal_registration.state) as StateName,(select pincode from master_pincode where id=hosptal_registration.postalCode)as postalCode1 from hosptal_registration where branch_id='${guid}';select Email from user_registration where guid = '${guid}';`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})
// const path = "{{hospitalname}}/{{hospitalId}}";

// ___________________ MEDIA _______________



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    var filepath = `./uploads`
    var filepath = `//192.168.1.123/ngdata/healaxyapp/aman_media/${file.originalname.split('_').splice(0, file.originalname.split('_').length - 1).join('_')}`
console.log('filepath',filepath);
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
      cb(null, filepath);
    } else {
      cb(null, filepath);
    }
  },

  filename: function (req, file, cb) {

    // cb(null, file.originalname.split('_').splice(-1)[0])
    cb(null, file.originalname.split('_').splice(-1)[0])

  }
})

const upload = multer({ storage: storage })

router.post('/upload_clinic_files', upload.array('FILES', 1000), (req,res) => {
  // next();
  res.json("success");

})

router.post("/InsertImageData", (req, res) => {
  let fileDetals = req.body;

  let i = 0;
  (function loop(){
    if (i < fileDetals.length) {
      command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) 
      VALUES ('${fileDetals[i].hospitalGuid}','${fileDetals[i].docPath}','${fileDetals[i].docName}','${fileDetals[i].docType}','${fileDetals[i].hospitalId}','1', now());`

      execCommand(command)
        .then(() => {
          i++; 
          loop()
        })
        .catch(err => logWriter(command, err));
    }
    else{
      res.json('success')
    }
  }())

  // for (let i = 0; i < fileDetals.length; i++) {
  //   const element = fileDetals[i];

  
  // }
});

router.post("/getImageDetails", (req, res) => {
  var hospitalId = req.body.hospitalId

  command = `Select * from hospital_media where hospitalGuid='${hospitalId}'and docType <> 'video';`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/DeleteImge_hospital_media', (req,res)=>{
  var id =req.body.id;

  const command =`delete from hospital_media where id=${id};`;


  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
  

})

router.get("/GetvideolinkData", (req, res) => {

  command = `Select * from hospital_media where docType='video';`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});



router.post("/InsertVideoLink", (req, res) => {
  var docName = req.body.docName;
  var docType = req.body.docType;
  var hospitalId = req.body.hospitalId;
  var docPath = req.body.docPath.videolink;
  var hospitalGuid = req.body.hospitalGuid;

  command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) VALUES ('${hospitalGuid}','${docPath}','${docName}','${docType}','${hospitalId}','1', now());`

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
});

router.post('/UpdateVideolink', (req, res) => {
  var docPath = req.body.videolink;
  command = `update hospital_media set docPath='${docPath}' where docType='video'`;
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})


// ___________________ OPENING HOURS _______________



router.post('/OpenHoursubmit', (req, res) => {
  var { timeData } = req.body
  var guid = req.body.guid;
  var branchId = req.body.branchId;
  console.log('hit');

  for (let i = 0; i < timeData.length; i++) {
    const element = timeData[i];

    for (const key in element) {
      let slots = element[`${key}`]
      for (let day in slots) {
        let slotName = key
        let commond = `UPDATE hospital_opening_hours SET ${day} = '${slots[`${day}`]}' WHERE Slot ='${slotName}' and guid = '${guid}' and branch_id = '${branchId}'`
        console.log(commond);
        db.query(commond, (err, rows) => {
          if (err) {
            console.log('ppp',err);
          } else {
            // console.log('success');
          }
        });
      }
    }
  }
})


router.post('/OpenHourgetData', (req, res) => {
  var guid=req.body.guid;
  var sql = `select * from hospital_opening_hours WHERE guid='k12';`;
  execCommand(sql)
  .then(result => {
    res.json(result)
  })
  .catch(err => logWriter(sql, err));
});

// ___________________ PREMISES _______________


router.post("/PremisesFormSubmit", (req, res) => {
  var { parking, accessibledisablepeople, publictransport, DisabledParking, PatientBathroom,
    wirelessaccess, onSitePharmacyname, wheelchairaccessibletailet, AccessWithoutsteps, parking1, accessibledisablepeople1, publictransport1, DisabledParking1,
    PatientBathroom1, wirelessaccess1, onSitePharmacyname1, wheelchairaccessibletailet1, AccessWithoutsteps1 } = req.body.premisesform;
  var guid = req.body.hospitalId;
  var branchid = req.body.branchid;


  var sql = `Insert into hospital_premises(guid,branchId,parkingVal,parkingDes,accessToDisabledPeopleVal,accessToDisabledPeopleDes,publicTransportAccessVal,
        publicTransportAccessDes,disabledParkingVal, disabledParkingDes,patientBathroomVal,patientBathroomDes,wirelessAccessVal,wirelessAccessDes
        ,onsitePharmacyVal,onsitePharmacyDes,wheelchairAccessibletoiletVal,accessWithoutstepsVal,wheelchairAccessibletoiletDes,accessWithoutStepsdesDes)values('${guid}','${branchid}','${parking1}','${parking}','${accessibledisablepeople1}','${accessibledisablepeople}',
        '${publictransport1}','${publictransport}','${DisabledParking1}','${DisabledParking}','${PatientBathroom1}','${PatientBathroom}',
       '${wirelessaccess1}','${wirelessaccess}','${onSitePharmacyname1}','${onSitePharmacyname}','${wheelchairaccessibletailet1}','${AccessWithoutsteps1}','${wheelchairaccessibletailet}','${AccessWithoutsteps}')`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json("submit");
    }
  });
});
router.post("/getPrimicedata", (req, res) => {
  var {hospitalId}=req.body;
  // console.log('hospitalId',hospitalId);
  var sql = `select * from hospital_premises  WHERE guid='${hospitalId}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
});



router.post("/premisesformUpdate", (req, res) => {
  var { parking, accessibledisablepeople, publictransport, DisabledParking, PatientBathroom,
    wirelessaccess, onSitePharmacyname, wheelchairaccessibletailet, AccessWithoutsteps, parking1, accessibledisablepeople1, publictransport1, DisabledParking1,
    PatientBathroom1, wirelessaccess1, onSitePharmacyname1, wheelchairaccessibletailet1, AccessWithoutsteps1 } = req.body.premisesform;
  var guid = req.body.hospitalId;
  var branchid = req.body.branchid;
  var sql = `UPDATE hospital_premises set parkingVal = '${parking1}',parkingDes = '${parking}',accessToDisabledPeopleVal ='${accessibledisablepeople1}'
    ,accessToDisabledPeopleDes ='${accessibledisablepeople}',publicTransportAccessVal ='${publictransport1}',publicTransportAccessDes ='${publictransport}',disabledParkingVal ='${DisabledParking1}',
    disabledParkingDes ='${DisabledParking}',patientBathroomVal ='${PatientBathroom1}', patientBathroomDes='${PatientBathroom}'
    ,wirelessAccessVal ='${wirelessaccess1}',wirelessAccessDes ='${wirelessaccess}', onsitePharmacyVal ='${onSitePharmacyname1}',onsitePharmacyDes='${onSitePharmacyname}'
    ,wheelchairAccessibletoiletVal ='${wheelchairaccessibletailet1}',accessWithoutstepsVal ='${AccessWithoutsteps1}' ,wheelchairAccessibletoiletDes ='${wheelchairaccessibletailet}' ,accessWithoutstepsdesDes ='${AccessWithoutsteps}' WHERE guid='${guid}' and branchId = '${branchid}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);

    } else {
      res.json("submit1");

    }
  });
});


// ___________________ CLINIC SERVICES _______________


router.post("/ClinicServicesupdate", (req, res) => {
  var { emergencyService1, TextMessageReminder1, homeVisit1, OpenHour1, OpenWeekend1, pickUpServiceHotel1, serviceformairport1,
    emergencyService, TextMessageReminder, homeVisit, OpenHour, OpenWeekend, pickUpServiceHotel, serviceformairport, } = req.body.ClinicServices;
  var guid = req.body.hospitalId;
  var branchId = req.body.branchId;
  var sql = `UPDATE hospital_clinicservices set EmergencyServiceVal = ${emergencyService1},EmergencyServiceDes = '${emergencyService}',TextMessageRemVal =${TextMessageReminder1},TextMessageRemDes ='${TextMessageReminder}',HomeVisitsVal =${homeVisit1},HomeVisitsDes ='${homeVisit}',OpenHoursVal =${OpenHour1}, OpenHoursDes ='${OpenHour}',OpenWeekendsVal =${OpenWeekend1}, OpenWeekendsDes='${OpenWeekend}',ServiceFromHotelVal =${pickUpServiceHotel1},ServiceFromHotelDes ='${pickUpServiceHotel}',ServiceFromAirportVal=${serviceformairport1},ServiceFromAirportDes='${serviceformairport}' WHERE guid='${guid}' and branchId = '${branchId}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);

    } else {
      res.json("submit1");

    }
  });
});



router.post("/ClinicServicessubmit", (req, res) => {
  var guid = req.body.hospitalId;
  var branchId = req.body.branchId;
  var { emergencyService1, TextMessageReminder1, homeVisit1, OpenHour1, OpenWeekend1, pickUpServiceHotel1, serviceformairport1,
    emergencyService, TextMessageReminder, homeVisit, OpenHour, OpenWeekend, pickUpServiceHotel, serviceformairport, } = req.body.ClinicServices;
  var sql = `Insert into hospital_clinicservices(guid, branchId,EmergencyServiceVal, EmergencyServiceDes, TextMessageRemVal, TextMessageRemDes,
              HomeVisitsVal, HomeVisitsDes, OpenHoursVal, OpenHoursDes, OpenWeekendsVal, 
              OpenWeekendsDes, ServiceFromHotelVal, ServiceFromHotelDes, ServiceFromAirportVal, 
              ServiceFromAirportDes)values('${guid}','${branchId}','${emergencyService1}','${emergencyService}','${TextMessageReminder1}','${TextMessageReminder}','${homeVisit1}','${homeVisit}',
              '${OpenHour1}','${OpenHour}','${OpenWeekend1}','${OpenWeekend}','${pickUpServiceHotel1}',
              '${pickUpServiceHotel}','${serviceformairport1}','${serviceformairport}')`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json("submit");
    }
  });
});

router.post("/getServiceData", (req, res) => {
  var guid = req.body.hospitalId;
  var sql = `select * from hospital_clinicservices  WHERE guid='${guid}'`;
  execCommand(sql)
  .then(result => res.json(result))
  .catch(err => logWriter(sql, err));
});


// ___________________ PAYMENT INFORMATION _______________


router.post("/PaymentInformationsubmit", (req, res) => {
  var guid = req.body.hospitalId;
  var branchId= req.body.branchId;
  var { discounts1, discounts, cash1, cash, FreeInitialConsulation1, FreeInitialConsulation, Cheques1, Cheques,
    CreditCards1, CreditCards, PublicHealth1, PublicHealth, currency } = req.body.PaymentInformation;
  var sql = `Insert into hospital_paymentinformation(guid,branchId,discountsVal, discountsDes, cashVal, cashDes, FreeInitialConsulationVal, FreeInitialConsulation1Des, ChequesVal, ChequesDes, CreditCardsVal,
     CreditCardsDes, PublicHealthVal, PublicHealthDes,currency)values('${guid}','${branchId}','${discounts1}','${discounts}','${cash1}','${cash}','${FreeInitialConsulation1}','${FreeInitialConsulation}',
     '${Cheques1}','${Cheques}','${CreditCards1}','${CreditCards}','${PublicHealth1}','${PublicHealth}','${currency}')`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json("submit");
    }
  });
});


router.post("/getPaymentInformation", (req, res) => {
  var hospitalId = req.body.hospitalId;
  var sql = `select * from hospital_paymentinformation  WHERE guid='${hospitalId}'`;
  console.log(sql);
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
});


router.post("/PaymentInformationUpdate", (req, res) => {
  var { discounts1, discounts, cash1, cash, FreeInitialConsulation1, FreeInitialConsulation, Cheques1, Cheques, CreditCards1, CreditCards, PublicHealth1, PublicHealth, text1, currency } = req.body.PaymentInformation;
  var hospitalId = req.body.hospitalId;
  var branchId = req.body.branchId;

  var sql = `UPDATE hospital_paymentinformation set discountsVal = ${discounts1},discountsDes = '${discounts}',cashVal =${cash1},cashDes ='${cash}',FreeInitialConsulationVal =${FreeInitialConsulation1},FreeInitialConsulation1Des ='${FreeInitialConsulation}',ChequesVal =${Cheques1}, ChequesDes='${Cheques}',CreditCardsVal =${CreditCards1},CreditCardsDes ='${CreditCards}', PublicHealthVal =${PublicHealth1},PublicHealthDes='${PublicHealth}',text='${text1}',currency='${currency}', text = '${text1}' WHERE guid='${hospitalId}' and branchId = '${branchId}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);

    } else {
      res.json("submit1");

    }
  });
});



router.get('/getmaster_currency', (req, res) => {

  const command = `SELECT * FROM master_currency`;

  db.query(command, (err, result) => {
    if (err) {
      res.json({ status: 'fail', error: err });
    } else {

      res.json(result);

    }
  });
})


/*_________________ BRANCH ________________ */

router.post('/getHospitalDataWithBranch',(req,res)=>{
  var hospitalId = req.body.hospitalId;
  const sql = `select *,(select city_name from master_city where id = hosptal_registration.city) as cityname from hosptal_registration where guid ='${hospitalId}' and branch_id <> '${hospitalId}';`
  console.log(sql);
  execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));
})


// comman functions

function remove_single_quote_from_text(text){
  console.log(text);
  var data = '';
  if(text == null || text == undefined || text == ''){

  }else{
    data =  text.replace(/'/g, `''`);

  }

  return data;
}

module.exports=router;