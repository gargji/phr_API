const express =require('express');
const router =express.Router();
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');


router.post('/getmaster_Routes', (req,res)=>{
    var text=req.body.text;
console.log('vaibhav')
    const command =`Select * from master_routes where name like '%${text}%'`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/getInstructionforPatient', (req,res)=>{
console.log('vaibhav')
    const command =`Select * from master_patientinstruction`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/getMasterRoutes_ButtonActive', (req,res)=>{
    console.log('vaibhav')
        const command =`Select * from master_routes where active ='0'`;
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    })
router.post('/getmaster_ClinicDrug', (req,res)=>{
    var text=req.body.text;
console.log('vaibhav')
const command =`Select * from master_drug where name like '%${text}%'`;
    // const command =`Select * from master_drug_brand where BrandName like '%${text}%'`;
    console.log(command)
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/getMaster_Brand', (req,res)=>{
    // var id=req.body.id;
    var text=req.body.text;
    var GenericIdentifier=req.body.GenericIdentifiers
     console.log('vaibhav',GenericIdentifier)
    // const command =`Select * from master_drug where generic_name like '%${text}%'`;GenericIdentifiers
    const command =`Select * from master_drug_brand where GenericIdentifier='${GenericIdentifier}'`;
    console.log(command)
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/getMaster_Frequency', (req,res)=>{
    var text=req.body.text;
console.log('vaibhav',text)
    const command =`Select * from master_frequencymedication `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/SaveMeditationData', (req,res)=>{
    console.log(req.body)
    var patientguid=req.body.patientguid
    var branchid=req.body.branchId
    var hospitalid=req.body.hospitalId
    var Indication=req.body.meditation.Indication.id
    var ClinicalDrug=req.body.meditation.ClinicalDrug.identifier
    var substanceidentifier=req.body.meditation.ClinicalDrug.substance_identifier
    var Brand=req.body.meditation.Brand
    var primaryindication=req.body.meditation.primaryindication
    console.log('+++++++=======>',primaryindication)
    var Route=req.body.meditation.Route.guid
    var EndDate=req.body.EndDate
    var {id,Typeoftherapy, Strength, DosePriority, Dose,DoseUnit, shift,  Frequency, DurationFor,DurationType, StartingDat, FirstDose, NextDose, Schedules, Instructionsforpatient, Pharmacyinternalhospital, Dispensequantity, Refills, Substitution,  notes,Morning,Afternoon,Evening,Night,Datess,Time}=req.body.meditation
    // console.log('qqqqqqqqqq',Indication,Brand)
    var NextDose= new Date(req.body.meditation.NextDose)

     var convertedDate = new Date(req.body.meditation.NextDose);
     var StartingDat = formatDate(req.body.meditation.StartingDat);
     var firstdate = formatDate(req.body.meditation.FirstDose);
     var nextdate = formatDate(req.body.meditation.NextDose);
    //  {StartingDat}','${firstdate}','${nextdate}
    //  console.log('+++++++=======>',convertedDate,starttimes)
    //  let isoDate = convertedDate;
    // var d = new Date(isoDate);
    // let time=d.toLocaleTimeString('en-GB');
    // console.log("================================================",d.toLocaleDateString('en-GB') ,d.toLocaleTimeString('en-GB')); // dd/mm/yyyy
    // var nextdate=(d.toLocaleDateString('en-GB') + ' ' +d.toLocaleTimeString('en-GB'))
    // console.log('nextdate',nextdate)
    //  let dateFor = d.toLocaleDateString('en-GB');
    //  let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
    //  var changedate = new Date(req.body.meditation.NextDose);
    //  console.log('+++++++=======>',changedate)
    //  let isoDates = changedate;
    // var t = new Date(isoDates);
    // let times=t.toLocaleTimeString('en-GB');
    // console.log("================================================",t.toLocaleDateString('en-GB') ,t.toLocaleTimeString('en-GB')); // dd/mm/yyyy
    // var firstdate=(t.toLocaleDateString('en-GB') + ' ' +t.toLocaleTimeString('en-GB'))
    // console.log('nextdate',firstdate)
    //  let dateForcange = t.toLocaleDateString('en-GB');
    
    let date=new Date();
    StartingDat=date.toISOString().split('T')[0];
    // FirstDose=date.toISOString().split('T')[0];
    // EndDate=date.toISOString().split('T')[0];
    //   console.log('if resolution',EndDate);
    if(id=='' || id=='0' || id==undefined || id==null){
      var sat = new Date(NextDose).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
      console.log('command',sat)
    command = `INSERT INTO transation_meditation(hospitalId, branchId, patientId, Indication, Typeoftherapy,ClinicalDrug,brand, Strength, DosePriority, Dose, doseUnit, shift, Route, Frequency, DurationFor,DurationType, StartingDat, FirstDose, NextDose, Schedules, Instructionsforpatient, Dispensequantity, Refills, Substitution,  notes,EndDate, Datetime, lockStatus,drug_substance_id,primaryindication,Morning,Afternoon,Evening,Night,Date,Time) values('${hospitalid}','${branchid}','${patientguid}','${Indication}','${Typeoftherapy}','${ClinicalDrug}','${Brand}','${Strength}','${DosePriority}','${Dose}','${DoseUnit}','${shift}','${Route}','${Frequency}','${DurationFor}','${DurationType}','${StartingDat}','${firstdate}','${nextdate}','${Schedules}','${Instructionsforpatient}','${Dispensequantity}','${Refills}','${Substitution}','${notes}','${EndDate}','${'23-12-2022'}','${'1'}','${substanceidentifier}','${primaryindication}','${Morning}','${Afternoon}','${Evening}','${Night}','${Datess}','${Time}')`;
  console.log(command)
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    }
  else
  {
    const command =`Update transation_meditation set Indication='${Indication}',Typeoftherapy='${Typeoftherapy}', ClinicalDrug='${ClinicalDrug}', Brand='${Brand}',Strength='${Strength}',DosePriority='${DosePriority}' ,Dose='${Dose}',doseUnit='${DoseUnit}',shift='${shift}', Route='${Route}', Frequency='${Frequency}',DurationFor='${DurationFor}',DurationType='${DurationType}',StartingDat='${StartingDat}',FirstDose='${firstdate}',NextDose='${nextdate}',Instructionsforpatient='${Instructionsforpatient}',Dispensequantity='${Dispensequantity}',Refills='${Refills}',Substitution='${Substitution}',notes='${notes}',EndDate='${EndDate}' where id='${id}';`;
    console.log(command)
    execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
    .then(result => res.json('succes'))
    .catch(err => logWriter(command, err));
}
})
router.post('/getMeditationData', (req,res)=>{
    var patientguid=req.body.patientguid
    var branchid=req.body.branchId
    var hospitalid=req.body.hospitalId
    
console.log('')
    // const command =`Select *,(select term from description_snapshot where id=transation_meditation.Indication) as IndicationName,(select name from master_drug where identifier=transation_meditation.ClinicalDrug) as ClinicalDrugName,(select BrandName from master_drug_brand where identifier=transation_meditation.Brand) as BrandName,(select name from master_routes where id=transation_meditation.Route) as RouteName,(select name from master_frequencymedication where guid=transation_meditation.Frequency) as FrequencyName,(select name from master_dosepriority where id=transation_meditation.DosePriority) as DosePriorityName
    // ,(select medication_sig from master_medicationsig where id=transation_meditation.status) as statusName ,(select term from description_snapshot where id=transation_meditation.primaryindication) as primaryindication from transation_meditation where hospitalId='${hospitalid}'AND branchId='${branchid}'AND patientId='${patientguid}'`;
    const command=` SELECT tm.*,
    ds1.term AS IndicationName,
    md.name AS ClinicalDrugName,
    mdb.BrandName,
    mr.name AS RouteName,
    mfm.name AS FrequencyName,
    mdp.name AS DosePriorityName,
    mms.medication_sig AS statusName,
    ds2.term AS primaryindication
    FROM transation_meditation AS tm
    LEFT JOIN description_snapshot AS ds1 ON ds1.id = tm.Indication
    LEFT JOIN master_drug AS md ON md.identifier = tm.ClinicalDrug
    LEFT JOIN master_drug_brand AS mdb ON mdb.identifier = tm.Brand
    LEFT JOIN master_routes AS mr ON mr.id = tm.Route
    LEFT JOIN master_frequencymedication AS mfm ON mfm.guid = tm.Frequency
    LEFT JOIN master_dosepriority AS mdp ON mdp.id = tm.DosePriority
    LEFT JOIN master_medicationsig AS mms ON mms.id = tm.status
    LEFT JOIN description_snapshot AS ds2 ON ds2.id = tm.primaryindication
    WHERE tm.hospitalId = '${hospitalid}'
    AND tm.branchId = '${branchid}'
    AND tm.patientId = '${patientguid}';`
    console.log(command)
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/deletemedicationgrid_api', (req,res)=>{
    var id=req.body.id
    const command =`delete  from transation_meditation where id='${id}'`;
    console.log(command)
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

router.post('/UpdatedMedicationdata', (req,res)=>{
    var ClinicalDrug=req.body.meditationgrid.ClinicalDrug.name
    var Brand=req.body.meditationgrid.Brand.BrandName
    var routes=req.body.meditationgrid.Route.name
    // var Route=req.body.meditation.Route.name
    // console.log('qqqqqqqqqq',Indication)
    var {id, Frequency,Route, Duration, StartingDat, FirstDose, }=req.body.meditationgrid
   console.log('if resolution',StartingDat,FirstDose);
    // let date=new Date(StartingDat);
    // let dates=new Date(FirstDose);
    // StartingDat=date.toISOString().split('T')[0];
    // FirstDose=dates.toISOString().split('T')[0];
      console.log('if resolution',StartingDat,FirstDose);
    const command =`Update transation_meditation set ClinicalDrug='${ClinicalDrug}', Brand='${Brand}',Route='${Route}', Frequency='${Frequency}',DurationFor='${Duration}' where id='${id}';`;
   console.log('',command)
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

router.get('/get_frequencyShortData', (req,res)=>{
    var text=req.body.text;
    const command =`Select * from master_frequencymedication where active='0'`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/Get_frequencydata', (req,res)=>{
    var text=req.body.text;
    const command =`Select * from master_frequencymedication where guid='${text}'`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_Type_ofthearpy', (req,res)=>{
    const command =`Select * from master_typeoftherapy`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_ScheduleTime', (req,res)=>{
    const command =`Select * from master_schuduletime`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_quantity', (req,res)=>{
    const command =`Select * from master_quantity`;
      execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_master_schedule', (req,res)=>{
   
    const command =`Select * from master_schedule`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_master_startingdate', (req,res)=>{
   
    const command =`Select * from master_startingdate`;
     execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})
router.get('/get_master_dosepriority', (req,res)=>{
    const command =`Select * from master_dosepriority`;
     execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_master_substitution', (req,res)=>{
    const command =`Select * from master_substitution`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/get_master_durationtype', (req,res)=>{
   const command =`Select * from master_durationtype`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

//////////get_medicationsigndata/////////////
router.get('/get_medicationsigndata', (req,res)=>{
   const command =`Select * from master_medicationsig`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/Updatereviewmedication', (req,res)=>{
 var medicationdata=req.body.medicationreview.reviewMedication.length
for (let i = 0; i < medicationdata; i++) {
    
    var id=req.body.medicationreview.reviewMedication[i].id
    var status=req.body.medicationreview.reviewMedication[i].status
    var reason=req.body.medicationreview.reviewMedication[i].reason
    var lastdate=req.body.medicationreview.reviewMedication[i].lastdate
       let date=new Date(lastdate);
   var lastdate=date.toISOString().split('T')[0];
     const command =`Update transation_meditation set status='${status}', Resion='${reason}',lastdosedate='${lastdate}' where id='${id}';`;
     console.log('',command)
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
}
})
router.get('/get_Interactiondata', (req,res)=>{
   const command =`Select * from master_drug_interaction`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/checkInteraction', (req,res)=>{
    var patientguid=req.body.patientguid
    var branchid=req.body.branchId
    var hospitalid=req.body.hospitalId
    
console.log('')
    const command =`Select *,(select term from description_snapshot where id=transation_meditation.Indication) as IndicationName,(select name from master_drug where identifier=transation_meditation.ClinicalDrug) as ClinicalDrugName,(select BrandName from master_drug_brand where identifier=transation_meditation.Brand) as BrandName,(select name from master_routes where guid=transation_meditation.Route) as RouteName,(select name from master_frequencymedication where guid=transation_meditation.Frequency) as FrequencyName,(select name from master_dosepriority where id=transation_meditation.DosePriority) as DosePriorityName from transation_meditation where hospitalId='${hospitalid}'AND branchId='${branchid}'AND patientId='${patientguid}'`;
    console.log(command)
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.post('/stopClinicDrugA', (req,res)=>{
    var id=req.body.clinicdrugstop;
   
        const command =`Update transation_meditation set status='${'stop'}' where id='${id}';`;
        console.log('',command)
        execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
   
   })
   
   router.post('/saveTemplatedata', (req,res)=>{
    var templatename=req.body.templatename;
    var patientguid=req.body.patientguid;
    var branchId=req.body.branchId;
    var hospitalId=req.body.hospitalId;
    var createtemplat=req.body.createtemplat;
   
   console.log(req.body);
        
        let i = 0;
  (function loop() {

    if (i < createtemplat.length) {
      console.log(createtemplat[i].id);
    //   if (createtemplat[i].id == 0) {

        console.log('vaibhav');
        // const command = `INSERT INTO  master_flowsheettime(Patient_Id, date, times) values('${patientid}','${flowsheetdatas[i].date}','${flowsheetdatas[i].times}')`;
        command = `INSERT INTO transaction_medicationtemplate( Hospital_id, Branch_id, Patient_id, Clinica_Drug, Brand, Dose, Route, Frequency, Durationfor,templateName,durationType)values
        ('${hospitalId}','${branchId}','${patientguid}','${createtemplat[i].ClinicalDrug}','${createtemplat[i].Brand}','${createtemplat[i].Dose}','${createtemplat[i].Route}','${createtemplat[i].Frequency}','${createtemplat[i].DurationFor}','${templatename}','${createtemplat[i].durationType}')`;

        console.log(command);
        execCommand(command)
          .then(() => {
            i++;
            loop()
          })
          .catch(err => logWriter(command, err));
      }

      else {
        i++;
        loop();
        res.json('success')

      }

    // }

  }())
})    

router.post('/getTemplatedata_data', (req,res)=>{
     var patientid=req.body.patientguid;
    const command =`Select * from transaction_medicationtemplate where Patient_id='${patientid}' GROUP BY templateName `;
    console.log(command);
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
 })
 
router.post('/stopmedication_data', (req,res)=>{
    var stopmedicationdata=req.body.stopmedicationdata;
    console.log(req.body);
    let i = 0;
    (function loop() {
      if (i < stopmedicationdata.length) {
        console.log(stopmedicationdata[i].id);
          console.log('vaibhav');
          const command = `update transation_meditation set medication_stop ='1' where id='${stopmedicationdata[i].id}'`;
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
}) 
router.post('/RenewMedication', (req,res)=>{
    var createtemplatss=req.body.createtemplatss;
    console.log(req.body);

    let i = 0;
    (function loop() {
  
      if (i < createtemplatss.length) {
          console.log(createtemplatss[i].id);
        // var convertedDate = new Date(req.body.createtemplatss[i].EndDate);
        //  console.log('+++++++=======>',convertedDate)
        //   let isoDate = convertedDate;
        //   var d = new Date(isoDate);
        //   let time=d.toLocaleTimeString('en-GB');
        // //  console.log("================================================",d.toLocaleDateString('en-GB') ,d.toLocaleTimeString('en-GB')); // dd/mm/y
        // var enddate=d.toLocaleDateString('en-GB');
        var enddate = formatDate(req.body.createtemplatss[i].EndDate);
        var startdate = formatDate(req.body.createtemplatss[i].startdate);
          console.log('vaibhav');
        //   const command = `update transation_meditation set medication_stop ='0' where id='${stopmedicationdata[i].id}'`;
          const command = `update transation_meditation set medication_stop ='0', StartingDat='${startdate}',FirstDose='${startdate}',EndDate='${enddate}' where id='${createtemplatss[i].id}'`;

        //   `Update transation_meditation set status='${'stop'}' where id='${id}';`
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
  
      // }
  
    }())
})

router.post('/importTemplate', (req,res)=>{
  var patientid=req.body.patientguid;
  var templatename=req.body.templatenames;
  const command =`Select * from transaction_medicationtemplate where Patient_id='${patientid}'  AND templateName='${templatename}' `;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
 })
 function formatDate(dateToBeFormatted){
  if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
      var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
      date = new Date(date);
      var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
      console.log(dateReturn);
      return dateReturn
  }
  else{
      return ''
  }
}
router.post('/saveHomemedication', (req,res)=>{
  console.log(req.body);
var ClinicalDrug=req.body.meditationhome.ClinicalDrug.identifier;
var Dose=req.body.meditationhome.Dose;
var Route=req.body.meditationhome.Route.id;
var DurationFor=req.body.meditationhome.DurationFor;
var Frequency=req.body.meditationhome.Frequency;
var patientId=req.body.patientguid;
var branchId=req.body.branchId;
var hospitalId=req.body.hospitalId;
command = `INSERT INTO transation_meditation(hospitalId, branchId, patientId, ClinicalDrug, Dose, Route, Frequency,DurationFor) values('${hospitalId}','${branchId}','${patientId}','${ClinicalDrug}','${Dose}','${Route}','${Frequency}','${DurationFor}')`;
console.log(command)
execCommand(command)
.then(result => res.json('success'))
.catch(err => logWriter(command, err));
})
router.post('/savetemplateSig', (req,res)=>{
  console.log(req.body);

  var id=req.body.meditationSIG.id;
  var Dose=req.body.meditationSIG.Dose;
  var Route=req.body.meditationSIG.Route.guid;
  var Duration=req.body.meditationSIG.Duration;
  var Frequency=req.body.meditationSIG.Frequency;
  var Reason=req.body.meditationSIG.Reason;
  // var Frequency=req.body.meditationSIG.Frequency;
  // var Frequency=req.body.meditationSIG.Frequency;
  var patientId=req.body.patientguid;
  var branchId=req.body.branchId;
  var hospitalId=req.body.hospitalId;
  const command = `update transation_meditation set Dose ='${Dose}', Route='${Route}',DurationFor='${Duration}',Frequency='${Frequency}',Reason='${Reason}'where id='${id}'`;
// command = `INSERT INTO transation_meditation(hospitalId, branchId, patientId, ClinicalDrug, Dose, Route, Frequency) values('${hospitalId}','${branchId}','${patientId}','${ClinicalDrug}','${Dose}','${Route}','${Frequency}','${DurationFor}')`;
console.log(command)
execCommand(command)
.then(result => res.json('success'))
.catch(err => logWriter(command, err));
})
function formatDate(dateToBeFormatted){
  if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
      var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
      date = new Date(date);
      var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
      console.log(dateReturn);
      return dateReturn
  }
  else{
      return ''
  }
}

router.post('/saveimportTemplate', (req,res)=>{
  var patientguid=req.body.patientguid;
  var branchId=req.body.branchId;
  var hospitalId=req.body.hospitalId;
  var importtemplatedatas=req.body.importtemplatedatas;

  console.log('import template',req.body);
  let i = 0;
  (function loop() {
    if (i < importtemplatedatas.length) {
      console.log(importtemplatedatas[i].id);
      // var enddate = formatDate(req.body.createtemplatss[i].EndDate);
      //   var startdate = formatDate(req.body.createtemplatss[i].startdate);
        console.log('vaibhav');
        // id, hospitalId, branchId, patientId, Indication, Typeoftherapy, ClinicalDrug, Brand, Strength, DosePriority, Dose, doseUnit, shift, Route, Frequency, DurationFor, DurationType, StartingDat, FirstDose, NextDose, Schedules, Instructionsforpatient, Pharmacyinternalhospital, Dispensequantity, Refills, Substitution, notes, Datetime, lockStatus, transation_meditationcol, EndDate, status, Resion, drug_substance_id, medication_stop, primaryindication, lastdosedate, Morning, Afternoon, Evening, Night, Date, Time, favorite, Reason
        command = `INSERT INTO transation_meditation( hospitalId, branchId, patientId, ClinicalDrug, Brand, Dose, Route, Frequency, Durationfor,durationType)values
        ('${hospitalId}','${branchId}','${patientguid}','${importtemplatedatas[i].Clinica_Drug}','${importtemplatedatas[i].Brand}','${importtemplatedatas[i].Dose}','${importtemplatedatas[i].Route}','${importtemplatedatas[i].Frequency}','${importtemplatedatas[i].DurationFor}','${importtemplatedatas[i].durationType}')`;

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
}) 

module.exports = router;




