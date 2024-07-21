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
console.log('postal',req.body);
  var hospitalId = req.body.hospitalId;
  var organzation_id = req.body.data.organization_name;
  var guid = req.body.data.guid
  var clinicName=req.body.data.Clinicname
  var addressLine1=req.body.data.addressLine1
  var addressLine2=req.body.data.addressLine2
  // var area=req.body.data.area
  // var city=req.body.data.city.id;
  var state=req.body.data.State
  var District=req.body.data.District
  var phone=req.body.data.Work_Phone
  var Work_Mobile=req.body.data.Work_Mobile
  var EmailId=req.body.data.Work_Email_Id
  var district=req.body.data.District
  var latitude=req.body.data.Latitude
  var longitude=req.body.data.Longitude
  var countryMobilecode=req.body.data.mobilecode
  var countrycode=req.body.data.Country?.countrycode
  var Maplink=req.body.data.Maplink
  var WebSitelink=req.body.data.WebSitelink
  // var Organization_Description=req.body.data.Organization_Description
  var country=req.body.data.Country?.Country
  var postalCode=req.body.data.Postal_Code?.postalcode
  var postalcode_id=req.body.data.Postal_Code?.postalcode_id
  var mobile=req.body.data.mobile
  var clinicDescription=req.body.data.Organization_Description.replace("'"," ");
  var GST_no=req.body.data.GST_no
  var tin=req.body.data.Tin_No
  var cin=req.body.data.Cin_No
  var id=req.body.data.id
var commandInsert=''
  if(id==undefined || id==null || id=='' ){
          commandInsert = `insert into hosptal_registration(guid,branch_id,organzation_id,postalcode_id,email_id, clinicName, addressLine1, addressLine2, district_name, states_name, Country, postalCode, phone, mobile, clinicDescription, latitude, longitude, countryMobilecode, countrycode, WebSitelink, Maplink,GSTIN,TIN,CIN, transaction_time) 
          values('${guid}','${guid}','${organzation_id}','${postalcode_id}','${EmailId}','${clinicName}','${addressLine1}','${addressLine2}','${district}','${state}','${country}','${postalCode}','${phone}','${Work_Mobile}','${clinicDescription}','${latitude}','${longitude}','${countryMobilecode}','${countrycode}','${WebSitelink}','${Maplink}','${GST_no}','${tin}','${cin}',now());`;
          // insert into user_registration (guid, branchId, FirstName, LastName, Email, Password, PracticeName, Speciality, mobileNo) values('${hospitalId}', '${newBranchId}','${user_registrationDataObj.firstname.FirstName}', '${user_registrationDataObj.firstname.LastName}', '${EmailId}', 'Dnpl@2015','${user_registrationDataObj.firstname.PracticeName}', '${user_registrationDataObj.firstname.Speciality}', '${mobile}')
          console.log(commandInsert);
          execCommand(commandInsert)
          .then(result => res.json('successs'))
          .catch(err => logWriter(commandInsert, err));
  }else{
    commandInsert = `UPDATE hosptal_registration set  organzation_id='${organzation_id}',postalcode_id='${postalcode_id}',email_id='${EmailId}',clinicName='${clinicName}',addressLine1='${addressLine1}',addressLine2='${addressLine2}',district_name='${district}',states_name='${state}',Country='${country}',postalCode='${postalCode}',phone='${phone}',mobile='${Work_Mobile}',clinicDescription='${clinicDescription}',latitude='${latitude}',longitude='${longitude}',countryMobilecode='${countryMobilecode}',countrycode='${countrycode}',WebSitelink='${WebSitelink}',Maplink='${Maplink}',GSTIN='${GST_no}',TIN='${tin}',CIN='${cin}',transaction_time=now() where id='${id}';`;
          // insert into user_registration (guid, branchId, FirstName, LastName, Email, Password, PracticeName, Speciality, mobileNo) values('${hospitalId}', '${newBranchId}','${user_registrationDataObj.firstname.FirstName}', '${user_registrationDataObj.firstname.LastName}', '${EmailId}', 'Dnpl@2015','${user_registrationDataObj.firstname.PracticeName}', '${user_registrationDataObj.firstname.Speciality}', '${mobile}')
         console.log(commandInsert);
          execCommand(commandInsert)
          .then(result => res.json('update'))
          .catch(err => logWriter(commandInsert, err));
  }
        
        
      
       
    })




router.post('/GetClinicOverviewtableAllDataAPI', (req, res) => {
  var organzation_id=req.body.branchId;
  // console.log(branchid);
    const command  = `select *,(select organization_name from transaction_organization where guid= hosptal_registration.organzation_id) as organization from hosptal_registration where organzation_id='${organzation_id}'`;
  
  console.log('GetClinicOverviewtableAllDataAPI',command);
    db.query(command, (err, result) => {
      if (err) {
        res.json({ status: 'fail', error: err});
      } else {
        res.json(result);
  
      }
    });
  })

router.post('/GetHospitalRegistrationtableData',(req,res)=>{
  var guid=req.body.id
  console.log(guid);

  const command=`SELECT *,(select city_name from master_city where id=hosptal_registration.city) as CityName,(select countryName from master_country1 where conceptId = hosptal_registration.Country) as countryName,(select state_name from master_state where id=hosptal_registration.states_name) as StateName,(select pincode from master_pincode where id=hosptal_registration.postalCode)as postalCode1 from hosptal_registration where branch_id='${guid}';select Email from user_registration where branchId = '${guid}';`;
  console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
})

router.post('/getBranchDatawithSpecificID',(req,res)=>{
  guid=req.body.id

  const command=`SELECT *,(select city_name from master_city where id=hosptal_registration.city) as CityName,(select countryName from master_country1 where conceptId = hosptal_registration.country) as countryName,(select state_name from master_state where id=hosptal_registration.states_name) as StateName,(select pincode from master_pincode where id=hosptal_registration.postalCode)as postalCode1 from hosptal_registration where branch_id='${guid}';select Email from user_registration where guid = '${guid}';`;
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
console.log(req.body);
  let i = 0;
  (function loop(){
    if (i < fileDetals.length) {
      command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) 
      VALUES ('${fileDetals[i].hospitalGuid}','${fileDetals[i].docPath.replace(/\\/g, '/')}','${fileDetals[i].docName}','${fileDetals[i].docType}','${fileDetals[i].hospitalId}','1', now());`

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

router.post("/GetvideolinkData", (req, res) => {
    var id= req.body.id
  command = `Select * from hospital_media where docType='video' and hospitalGuid='${id}';`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});



router.post("/InsertVideoLink", (req, res) => {
  // console.log(req.body);
  var docName = req.body.docName;
  var docType = req.body.docType;
  var hospitalId = req.body.hospitalId;
  var docPath = req.body.docPath;
  var hospitalGuid = req.body.hospitalGuid;
   var id=docPath[0]?.id
   console.log(req.body.docPath);
   var command=``
   if(id==null || id==undefined || id==''){
    let i = 0;
    (function loop(){
    if (i < docPath.length) { 
    // console.log(timeData.length);
   command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) VALUES ('${hospitalGuid}','${docPath[i].value}','${docName}','${docType}','${hospitalId}','1', now());`;
   console.log('insert',command);
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
   }else{
    const commands =`delete from hospital_media where  hospitalGuid='${hospitalGuid}' And docType='video'`;
    console.log('',commands);
    execCommand(commands)
     .then(result => {
      // console.log(result);
      if(result){
    let i = 0;
    (function loop(){
      if (i < docPath.length) { 
     
     command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) VALUES ('${hospitalGuid}','${docPath[i].value}','${docName}','${docType}','${hospitalId}','1', now());`;
     console.log('insert',command);
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
    }

   })
  
}
})

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

router.post("/OpenHoursubmitHospitals", (req, res) => {
 console.log('OpenHoursubmitHospitals',req.body);
//   var provider = req.body.provider_id;
//   var provider = req.body.provider_id;
var guid =req.body.guid
var branchId=req.body.branchId
var timeData = req.body.timeData;
 var timeData = req.body.timeData;
const commands =`delete from hospital_opening_hour_current where Branchid='${branchId}'`;
console.log('',commands);
execCommand(commands)
 .then(result => {
  // console.log(result);
  if(result){
   let i = 0;
 (function loop(){
 if (i < timeData.length) { 
 console.log(timeData.length);
const command = `INSERT INTO hospital_opening_hour_current(Hospitalid, Branchid, id, opentime, closetime, opentype, closetype, Holiday, open24hours,days) values('${guid}','${branchId}','${timeData[i].id}','${timeData[i].opentime}','${timeData[i].closetime}','${timeData[i].opentype}','${timeData[i].closetype}',${timeData[i].Holiday},${timeData[i].open24hours},'${timeData[i].days}')`;
console.log('insert',command);
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
 }

 })
.catch(err => logWriter(commands, err));

// var guid = req.body.providerid;
 // var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact  WHERE provider_id='${guid}'`;
// console.log(command);
 // execCommand(command)
 // .then(result => res.json(result))
 // .catch(err => logWriter(command, err));
});
router.post("/getcontacteditdata", (req, res) => {
 console.log(req.body);
 var guid = req.body.providerid;
 var command = `select *,(select city_name from master_city where id=provider_contact.city ) as cityname from provider_contact WHERE provider_id='${guid}'`;
console.log(command);
 execCommand(command)
.then(result => res.json(result))
 .catch(err => logWriter(command, err));
});
router.post("/getScheduledata", (req, res) => {
console.log(req.body);
var guid = req.body.Hospitalid;
var command = `select * From hospital_opening_hour_current WHERE Branchid='${guid}'`;
 
execCommand(command)
 .then(result => res.json(result))
.catch(err => logWriter(command, err));
});

router.post('/OpenHourgetData', (req, res) => {
  var guid=req.body.guid;
  var sql = `select * from hospital_opening_hours WHERE guid='k12';`;
  execCommand(sql)``
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
  console.log(sql);
       db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json("submit");
    }
  });
});
router.post("/getPrimicedata", (req, res) => {
  var hospitalId=req.body.hospitalId;
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
  
  console.log(req.body);
  var { parking, accessibledisablepeople, publictransport, DisabledParking, PatientBathroom,
    wirelessaccess, onSitePharmacyname, wheelchairaccessibletailet, AccessWithoutsteps, parking1, accessibledisablepeople1, publictransport1, DisabledParking1,
    PatientBathroom1, wirelessaccess1, onSitePharmacyname1, wheelchairaccessibletailet1, AccessWithoutsteps1,emergencyService1,homeVisit1,pickUpServiceHotel1,serviceformairport1 } = req.body.premisesform;
  var guid = req.body.hospitalId;
  var branchid = req.body.branchid;
  var id=req.body.premisesform.id

   if(id==undefined || id==null || id==''){
    // var sql = `Insert into hospital_premises(parkingVal, parkingDes, accessToDisabledPeopleVal, accessToDisabledPeopleDes, publicTransportAccessVal, publicTransportAccessDes, disabledParkingVal, disabledParkingDes, patientBathroomVal, 
    //   patientBathroomDes, wirelessAccessVal, wirelessAccessDes, onsitePharmacyVal, onsitePharmacyDes, wheelchairAccessibletoiletVal, accessWithoutstepsVal, wheelchairAccessibletoiletDes, accessWithoutstepsdesDes,guid)
    // values('${parking1}','${parking}','${accessibledisablepeople1}','${accessibledisablepeople}','${publictransport1}','${publictransport}','${DisabledParking1}','${DisabledParking}','${PatientBathroom1}',
    // '${PatientBathroom}','${wirelessaccess1}','${wirelessaccess}','${onSitePharmacyname1}','${onSitePharmacyname}','${wheelchairaccessibletailet1}','${AccessWithoutsteps1}','${wheelchairaccessibletailet}','${AccessWithoutsteps}','${guid}')`;
   

    var sql = `Insert into hospital_premises(parkingVal,accessToDisabledPeopleVal, publicTransportAccessVal,  disabledParkingVal,  
      wirelessAccessVal,  onsitePharmacyVal,  wheelchairAccessibletoiletVal, accessWithoutstepsVal,emergencyServiceVal,homeVisitVal,pickUpServiceHotelVal,serviceformairportVal, guid)
    values('${parking1}','${accessibledisablepeople1}','${publictransport1}','${DisabledParking1}',
    '${wirelessaccess1}','${onSitePharmacyname1}','${wheelchairaccessibletailet1}','${AccessWithoutsteps1}','${emergencyService1}','${homeVisit1}','${pickUpServiceHotel1}','${AccessWithoutsteps1}','${guid}')`;
   
   console.log(sql);
    execCommand(sql)
    .then(result => {
      res.json('success')
    })
    .catch(err => logWriter(sql, err));
   }else{

    // var sql = `UPDATE hospital_premises set parkingVal='${parking1}',parkingDes='${parking}',accessToDisabledPeopleVal='${accessibledisablepeople1}'
    // ,accessToDisabledPeopleDes ='${accessibledisablepeople}',publicTransportAccessVal ='${publictransport1}',publicTransportAccessDes ='${publictransport}',disabledParkingVal ='${DisabledParking1}',
    // disabledParkingDes='${DisabledParking}',patientBathroomVal='${PatientBathroom1}',patientBathroomDes='${PatientBathroom}'
    // ,wirelessAccessVal='${wirelessaccess1}',wirelessAccessDes='${wirelessaccess}',onsitePharmacyVal='${onSitePharmacyname1}',onsitePharmacyDes='${onSitePharmacyname}'
    // ,wheelchairAccessibletoiletVal='${wheelchairaccessibletailet1}',accessWithoutstepsVal='${AccessWithoutsteps1}',wheelchairAccessibletoiletDes='${wheelchairaccessibletailet}',accessWithoutstepsdesDes='${AccessWithoutsteps}' WHERE guid='${guid}';`;

  var sql = `UPDATE hospital_premises set parkingVal='${parking1}',accessToDisabledPeopleVal='${accessibledisablepeople1}'
    ,publicTransportAccessVal ='${publictransport1}',disabledParkingVal ='${DisabledParking1}',
    wirelessAccessVal='${wirelessaccess1}',onsitePharmacyVal='${onSitePharmacyname1}',
    emergencyServiceVal='${emergencyService1}',homeVisitVal='${homeVisit1}',pickUpServiceHotelVal='${pickUpServiceHotel1}',serviceformairportVal='${serviceformairport1}'
    ,wheelchairAccessibletoiletVal='${wheelchairaccessibletailet1}',accessWithoutstepsVal='${AccessWithoutsteps1}', emergencyServiceVal='${emergencyService1}', homeVisitVal='${homeVisit1}',
    emergencyServiceVal='${emergencyService1}', emergencyServiceVal='${emergencyService1}', emergencyServiceVal='${emergencyService1}' WHERE guid='${guid}';`;
    console.log(sql);
    execCommand(sql)
    .then(result => {
      res.json('update')
    })
    .catch(err => logWriter(sql, err));
  }
  });



// ___________________ CLINIC SERVICES _______________


router.post("/ClinicServicesupdate", (req, res) => {
  var { emergencyService1, TextMessageReminder1, homeVisit1, OpenHour1, OpenWeekend1, pickUpServiceHotel1, serviceformairport1,
    emergencyService, TextMessageReminder, homeVisit, OpenHour, OpenWeekend, pickUpServiceHotel, serviceformairport, } = req.body.ClinicServices;
  var guid = req.body.hospitalId;
  var branchId = req.body.branchId;
  var id=req.body.ClinicServices.id
  var sql = `UPDATE hospital_clinicservices set EmergencyServiceVal = ${emergencyService1},EmergencyServiceDes = '${emergencyService}',TextMessageRemVal =${TextMessageReminder1},TextMessageRemDes ='${TextMessageReminder}',HomeVisitsVal =${homeVisit1},HomeVisitsDes ='${homeVisit}',OpenHoursVal =${OpenHour1}, OpenHoursDes ='${OpenHour}',OpenWeekendsVal =${OpenWeekend1}, OpenWeekendsDes='${OpenWeekend}',ServiceFromHotelVal =${pickUpServiceHotel1},ServiceFromHotelDes ='${pickUpServiceHotel}',ServiceFromAirportVal=${serviceformairport1},ServiceFromAirportDes='${serviceformairport}' WHERE guid='${guid}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);

    } else {
      res.json("update");

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


router.post("/getAllHospitalForpatch", (req, res) => {

  
  var guid = req.body.id;
  var sql = `select * from hosptal_registration  WHERE guid='${guid}'`;
  execCommand(sql)
  .then(result => res.json(result))
  .catch(err => logWriter(sql, err));
});
// router.get("/getAllHospitalForadmin", (req, res) => {
// console.log('vaibhav');
//   // var guid = req.body.id;
//   var sql = `select * from hosptal_registration`;
//   console.log(sql);
//   execCommand(sql)
//   .then(result => res.json(result))
//   .catch(err => logWriter(sql, err));
// });
// router.get("/getAllHospitalForpatchss", (req, res) => {
 
//   var command = `select * from hosptal_registration  WHERE guid='${guid}'`;
//   // var command = `select * from master_rolesadmine`;
//   console.log(command);
//   execCommand(command)
//   .then(result => res.json(result))
 
//   .catch(err => logWriter(command, err));

// })


router.post("/activedeactiveclinicprofile", (req, res) => {

  
  var guid = req.body.id;
  var sql = `Update hosptal_registration set active='1' where id='${guid}'`;
  console.log(sql);
  execCommand(sql)
  .then(result => res.json(result))
  .catch(err => logWriter(sql, err));
});
module.exports=router;