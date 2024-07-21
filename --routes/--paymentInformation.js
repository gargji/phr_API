const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');


// router.post("/PremisesFormSubmit", (req, res) => {
//     var { parking, accessibledisablepeople, publictransport, DisabledParking, PatientBathroom,
//       wirelessaccess, onSitePharmacyname, wheelchairaccessibletailet, AccessWithoutsteps, parking1, accessibledisablepeople1, publictransport1, DisabledParking1,
//       PatientBathroom1, wirelessaccess1, onSitePharmacyname1, wheelchairaccessibletailet1, AccessWithoutsteps1 } = req.body.premisesform;
//     console.log(req.body)
//     var guid = req.body.hospitalId;
  
//     var sql = `Insert into hospital_premises(guid, parkingVal,parkingDes,accessToDisabledPeopleVal,accessToDisabledPeopleDes,publicTransportAccessVal,
//           publicTransportAccessDes,disabledParkingVal, disabledParkingDes,patientBathroomVal,patientBathroomDes,wirelessAccessVal,wirelessAccessDes
//           ,onsitePharmacyVal,onsitePharmacyDes,wheelchairAccessibletoiletVal,accessWithoutstepsVal,wheelchairAccessibletoiletDes,accessWithoutStepsdesDes)values('${guid}''${parking1}','${parking}','${accessibledisablepeople1}','${accessibledisablepeople}',
//           '${publictransport1}','${publictransport}','${DisabledParking1}','${DisabledParking}','${PatientBathroom1}','${PatientBathroom}',
//          '${wirelessaccess1}','${wirelessaccess}','${onSitePharmacyname1}','${onSitePharmacyname}','${wheelchairaccessibletailet1}','${AccessWithoutsteps1}','${wheelchairaccessibletailet}','${AccessWithoutsteps}')`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
//         console.log("heating");
//       } else {
//         res.json("submit");
//       }
//     });
//   });
//   router.get("/getPrimicedata", (req, res) => {
  
//     var sql = `select * from hospital_premises  WHERE guid='k12'`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json(rows);
//       }
//     });
//   });
  
  
  
  
//   router.post("/ClinicServicessubmit", (req, res) => {
//     console.log(req.body);
//     var { emergencyService1, TextMessageReminder1, homeVisit1, OpenHour1, OpenWeekend1, pickUpServiceHotel1, serviceformairport1,
//       emergencyService, TextMessageReminder, homeVisit, OpenHour, OpenWeekend, pickUpServiceHotel, serviceformairport, } = req.body.ClinicServices;
//     var sql = `Insert into clinicservices(EmergencyServiceVal, EmergencyServiceDes, TextMessageRemVal, TextMessageRemDes,
//                 HomeVisitsVal, HomeVisitsDes, OpenHoursVal, OpenHoursDes, OpenWeekendsVal, 
//                 OpenWeekendsDes, ServiceFromHotelVal, ServiceFromHotelDes, ServiceFromAirportVal, 
//                 ServiceFromAirportDes)values('${emergencyService1}','${emergencyService}','${TextMessageReminder1}','${TextMessageReminder}','${homeVisit1}','${homeVisit}',
//                 '${OpenHour1}','${OpenHour}','${OpenWeekend1}','${OpenWeekend}','${pickUpServiceHotel1}',
//                 '${pickUpServiceHotel}','${serviceformairport1}','${serviceformairport}')`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
//         console.log("heating");
//       } else {
//         res.json("submit");
//       }
//     });
//   });
//   router.get("/getServiceData", (req, res) => {
  
//     var sql = `select * from clinicservices  WHERE guid='k12'`;
//     db.query(sql, (err, rows) => {
//       console.log('getservicedata');
//       if (err) {
//         console.log('vaibhav', err);
//       } else {
//         res.json(rows);
//       }
//     });
//   });
  
//   router.post("/PaymentInformationsubmit", (req, res) => {
//     console.log(req.body);
//     var { discounts1, discounts, cash1, cash, FreeInitialConsulation1, FreeInitialConsulation, Cheques1, Cheques,
//       CreditCards1, CreditCards, PublicHealth1, PublicHealth, currency } = req.body.PaymentInformation;
//     var sql = `Insert into paymentinformation(discountsVal, discountsDes, cashVal, cashDes, FreeInitialConsulationVal, FreeInitialConsulation1Des, ChequesVal, ChequesDes, CreditCardsVal,
//        CreditCardsDes, PublicHealthVal, PublicHealthDes,currency)values('${discounts1}','${discounts}','${cash1}','${cash}','${FreeInitialConsulation1}','${FreeInitialConsulation}',
//        '${Cheques1}','${Cheques}','${CreditCards1}','${CreditCards}','${PublicHealth1}','${PublicHealth}','${currency}')`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
//         console.log("heating");
//       } else {
//         res.json("submit");
//       }
//     });
//   });
  
  
//   router.get("/getPaymentInformation", (req, res) => {
  
//     var sql = `select * from paymentinformation  WHERE guid='k12'`;
//     db.query(sql, (err, rows) => {
//       console.log('get');
//       if (err) {
//         console.log('vaibhav00000000000', err);
//       } else {
//         res.json(rows);
//       }
//     });
//   });
  
  
//   router.post("/PaymentInformationUpdate", (req, res) => {
//     console.log(req.body);
//     var { discounts1, discounts, cash1, cash, FreeInitialConsulation1, FreeInitialConsulation, Cheques1, Cheques,
//       CreditCards1, CreditCards, PublicHealth1, PublicHealth, text1, currency } = req.body.PaymentInformation;
//     var guid = req.body.guid;
  
//     var sql = `UPDATE paymentinformation set discountsVal = '${discounts1}',discountsDes = '${discounts}',cashVal ='${cash1}',cashDes ='${cash}',FreeInitialConsulationVal ='${FreeInitialConsulation1}',FreeInitialConsulation1Des ='${FreeInitialConsulation}',ChequesVal ='${Cheques1}', ChequesDes='${Cheques}',CreditCardsVal ='${CreditCards1}',CreditCardsDes ='${CreditCards}', PublicHealthVal ='${PublicHealth1}',PublicHealthDes='${PublicHealth}',text='${text1}',currency='${currency}' WHERE guid='${guid}'`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
  
//       } else {
//         res.json("submit1");
  
//       }
//     });
//   });
  
  
  
//   router.post("/premisesformUpdate", (req, res) => {
//     console.log(req.body);
//     var { parking, accessibledisablepeople, publictransport, DisabledParking, PatientBathroom,
//       wirelessaccess, onSitePharmacyname, wheelchairaccessibletailet, AccessWithoutsteps, parking1, accessibledisablepeople1, publictransport1, DisabledParking1,
//       PatientBathroom1, wirelessaccess1, onSitePharmacyname1, wheelchairaccessibletailet1, AccessWithoutsteps1 } = req.body.premisesform;
//     var guid = req.body.guid;
//     console.log(req.body)
//     var sql = `UPDATE hospital_premises set parkingVal = '${parking1}',parkingDes = '${parking}',accessToDisabledPeopleVal ='${accessibledisablepeople1}'
//       ,accessToDisabledPeopleDes ='${accessibledisablepeople}',publicTransportAccessVal ='${publictransport1}',publicTransportAccessDes ='${publictransport}',disabledParkingVal ='${DisabledParking1}',
//       disabledParkingDes ='${DisabledParking}',patientBathroomVal ='${PatientBathroom1}', patientBathroomDes='${PatientBathroom}'
//       ,wirelessAccessVal ='${wirelessaccess1}',wirelessAccessDes ='${wirelessaccess}', onsitePharmacyVal ='${onSitePharmacyname1}',onsitePharmacyDes='${onSitePharmacyname}'
//       ,wheelchairAccessibletoiletVal ='${wheelchairaccessibletailet1}',accessWithoutstepsVal ='${AccessWithoutsteps1}' ,wheelchairAccessibletoiletDes ='${wheelchairaccessibletailet}' ,accessWithoutstepsdesDes ='${AccessWithoutsteps}' WHERE guid='${guid}'`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
  
//       } else {
//         res.json("submit1");
  
//       }
//     });
//   });
  
  
  
  
//   router.post("/ClinicServicesupdate", (req, res) => {
//     console.log(req.body);
//     var { emergencyService1, TextMessageReminder1, homeVisit1, OpenHour1, OpenWeekend1, pickUpServiceHotel1, serviceformairport1,
//       emergencyService, TextMessageReminder, homeVisit, OpenHour, OpenWeekend, pickUpServiceHotel, serviceformairport, } = req.body.ClinicServices;
//     var guid = req.body.guid;
//     console.log(req.body)
//     var sql = `UPDATE clinicservices set EmergencyServiceVal = '${emergencyService1}',EmergencyServiceDes = '${emergencyService}',TextMessageRemVal ='${TextMessageReminder1}',TextMessageRemDes ='${TextMessageReminder}',HomeVisitsVal ='${homeVisit1}',HomeVisitsDes ='${homeVisit}',OpenHoursVal ='${OpenHour1}', OpenHoursDes ='${OpenHour}',OpenWeekendsVal ='${OpenWeekend1}', OpenWeekendsDes='${OpenWeekend}',ServiceFromHotelVal ='${pickUpServiceHotel1}',ServiceFromHotelDes ='${pickUpServiceHotel}',ServiceFromAirportVal='${serviceformairport1}',ServiceFromAirportDes='${serviceformairport}' WHERE guid='${guid}'`;
//     db.query(sql, (err, rows) => {
//       if (err) {
//         console.log(err);
  
//       } else {
//         res.json("submit1");
  
//       }
//     });
//   });
  
  
//   router.get('/getmaster_currency', (req, res) => {
  
//     const command = `SELECT * FROM master_currency`;
  
  
//     //  execCommand(command)
//     // .then(result => res.json(result))
//     // .catch(err => logWriter(command, err));
//     db.query(command, (err, result) => {
//       if (err) {
//         res.json({ status: 'fail', error: err });
//       } else {
  
//         res.json(result);
  
//       }
//     });
  
//   });
//   router.post('/OpenHoursubmit', (req, res) => {
//     var { timeData } = req.body
//     // console.log(timeData.length);
//     for (let i = 0; i < timeData.length; i++) {
//       const element = timeData[i];
//       //console.log(element);
  
//       for (const key in element) {
//         console.log("kry", key);
//         let slots = element[`${key}`]
//         //  console.log("slots",slots);
  
//         for (let j in slots) {
//           //  console.log(j, slots[`${j}`]);
//           // console.log(j, slots[`${j}`].name);
//           let day = j.split('_')[0]
//           let status = j.split('_')[1]
//           let slotNameOpen = `${key}_open`
//           let slotNameClose = `${key}_close`
//           let commond = ""
//           if (status == 'Open') {
//             commond = `UPDATE hospital_opening_hours SET ${slotNameOpen} = '${slots[`${j}`].name}' WHERE day ='${day}'`
//             console.log("commond", commond);
//           } else {
//             commond = `UPDATE hospital_opening_hours SET ${slotNameClose} = '${slots[`${j}`].name}' WHERE day ='${day}'`
//             console.log("commond", commond);
//           }
//           db.query(commond, (err, rows) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log('success');
  
//             }
//           });
//         }
//       }
//     }
//   })
  
  
  // ------------------------------


  
router.post("/PaymentInformationsubmit", (req, res) => {
  console.log(req.body);
  var guid = req.body.guid;
  console.log('ghgh'.guid);
  var { discounts1, discounts, cash1, cash, FreeInitialConsulation1, FreeInitialConsulation, Cheques1, Cheques,
    CreditCards1, CreditCards, PublicHealth1, PublicHealth, currency } = req.body.PaymentInformation;
    var guid = req.body.guid;
  var sql = `Insert into paymentinformation(guid,discountsVal, discountsDes, cashVal, cashDes, FreeInitialConsulationVal, FreeInitialConsulation1Des, ChequesVal, ChequesDes, CreditCardsVal,
     CreditCardsDes, PublicHealthVal, PublicHealthDes,currency)values('${guid}','${discounts1}','${discounts}','${cash1}','${cash}','${FreeInitialConsulation1}','${FreeInitialConsulation}',
     '${Cheques1}','${Cheques}','${CreditCards1}','${CreditCards}','${PublicHealth1}','${PublicHealth}','${currency}')`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      console.log("heating");
    } else {
      res.json("submit");
    }
  });
});


router.post("/getPaymentInformation", (req, res) => {
  var guid = req.body.guid;
  var sql = `select * from paymentinformation  WHERE guid='${guid}'`;
  db.query(sql, (err, rows) => {
    console.log('get');
    if (err) {
      console.log('vaibhav00000000000', err);
    } else {
      res.json(rows);
    }
  });
});


router.post("/PaymentInformationUpdate", (req, res) => {
  console.log(req.body);
  var guid = req.body.guid;
  var { discounts1, discounts, cash1, cash, FreeInitialConsulation1, FreeInitialConsulation, Cheques1, Cheques,
    CreditCards1, CreditCards, PublicHealth1, PublicHealth, text1, currency } = req.body.PaymentInformation;
  var guid = req.body.guid;

  var sql = `UPDATE paymentinformation set discountsVal = '${discounts1}',discountsDes = '${discounts}',cashVal ='${cash1}',cashDes ='${cash}',FreeInitialConsulationVal ='${FreeInitialConsulation1}',FreeInitialConsulation1Des ='${FreeInitialConsulation}',ChequesVal ='${Cheques1}', ChequesDes='${Cheques}',CreditCardsVal ='${CreditCards1}',CreditCardsDes ='${CreditCards}', PublicHealthVal ='${PublicHealth1}',PublicHealthDes='${PublicHealth}',text='${text1}',currency='${currency}' WHERE guid='${guid}'`;
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
  
  
  
  
  
  
  module.exports = router;