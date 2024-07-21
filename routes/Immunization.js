const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')



router.post('/Get_vaccine',(req,res)=>{
    var text=req.body.text;
    console.log(text);
    const command =`Select * from master_vaccine_cvx where CVXShortDescription like '%${text}%'`;
 
  
     console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  
    
 })
 
 router.post('/Get_routes',(req,res)=>{
     var text=req.body.text;
     console.log(text);
     const command =`Select * from master_routes where CVX Vaccine Description like '%${text}%'`;
  
   
      
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
  router.post('/Get_Site',(req,res)=>{
     var text=req.body.text;
     console.log('Get_Site',text);
     const command =`Select * from master_site where shortname like '%${text}%'`;
     console.log('Get_Indication',command);
   
      
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
 
  router.post('/Get_Indication',(req,res)=>{
     var text=req.body.text;
     console.log('Get_Indication',text);
     const command =`Select * from master_reason_administerd where name like '%${text}%' AND type='1'`;
    //  Select * from master_reason_administerd where type='${type}'
  
   
      console.log(command);
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
 
 
 
 router.post('/deleteTransaction_Problem',(req,res)=>{
     // var display_name = req.body.event; 
     var hospitalId = req.body.hospitalId;
    var patientGuid=req.body.patientguid;
     var  branchId=req.body.branchId;
     var  ids=req.body.id;
    
     const command =`delete from transaction_problem where HospitalId='${hospitalId}' AND Branch_Id='${branchId}' AND Patient_Id='${patientGuid}' AND id='${ids}' `;
     // delete from master_appointment where HospitalId='1442f75b-2d1f-41a1-9680-4867476fab85' AND Branch_Id='1442f75b-2d1f-41a1-9680-4867476fab85' AND Patient_Id='b5f0bd19-496d-4ecf-894d-24a2cabe245f' AND id='6' 
     console.log('vaibhav',command);
   
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
 })
 
 
 router.post('/SaveImunisationFormAPI',(req,res)=>{
     console.log(req.body);
     var hospitalId=req.body.hospitalId;
     var branchId=req.body.branchId;
     var patientGuid=req.body.patientguid;
     var Vaccine=req.body.ImunisationForm.Vaccine.CVXCode;
     var routes=req.body.ImunisationForm.Routes;
     var Site=req.body.ImunisationForm.Site.id;
     var Indication=req.body.ImunisationForm.Indication.id;
     var immunizationformtype=req.body.splitbuttonids;
     var immunizationformtype=req.body.splitbuttonids;
     var displayheadername=req.body.displayheadername;
     var { id, Manufacture, Lotnumber, Expiredate, DoseSerise, DoseUnit,DoseType,  Funding, DateAdministerd, Source, Notes,MinAge,MaxAge,DueDate,DOB,NuAlertBeforeDueDate,NuAlertAfterDueDate,CatageryName}=req.body.ImunisationForm;
     var command ='';
     let date=new Date();
     var DueDates = formatDate(req.body.ImunisationForm.DueDate);
     Expiredate=date.toISOString().split('T')[0];
     DateAdministerd=date.toISOString().split('T')[0];
     if(id=='' || id=='0' || id==undefined || id==null){
      command =`INSERT INTO  master_immunisation(hospital_Id, branch_Id, patient_Id, Vaccine, Manufacturer, Lot_Number, Expire_date, Dose_Serise, DoseUnit, Routes, Site, Indication, Funding, Date_Administerd, Source, Notes, MinAge ,MaxAge, DueDate, DOB, NuAlertBeforeDueDate, NuAlertAfterDueDate,DoseType,CategaryName,immunizationformtype,status) 
      values('${hospitalId}','${branchId}','${patientGuid}','${Vaccine}','${Manufacture}','${Lotnumber}','${Expiredate}','${DoseSerise}','${DoseUnit}','${routes}','${Site}','${Indication}','${Funding}','${DateAdministerd}','${Source}','${Notes}','${MinAge}','${MaxAge}','${DueDates}','${DOB}','${NuAlertBeforeDueDate}','${NuAlertAfterDueDate}','${DoseType}','${CatageryName}','${immunizationformtype}','${displayheadername}')`;

     console.log('master_immunisation',  command);
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
 }
 else{
     command = `update master_immunisation set hospital_Id='${hospitalId}',branch_Id='${branchId}',patient_Id='${patientGuid}',Vaccine='${Vaccine}',Manufacturer='${Manufacture}',Lot_Number='${Lotnumber}',Expire_date='${Expiredate}',Dose_Serise='${DoseSerise}',DoseUnit='${DoseUnit}',Site='${Site}',Indication='${Indication}',Funding='${Funding}',Date_Administerd='${DateAdministerd}',Source='${Source}',Notes='${Notes}', MinAge='${MinAge}' ,MaxAge='${MaxAge}', DueDate='${DueDate}', DOB='${DOB}', NuAlertBeforeDueDate='${NuAlertBeforeDueDate}', NuAlertAfterDueDate='${NuAlertAfterDueDate}',DoseType='${DoseType}',CategaryName='${CatageryName}',immunizationformtype='${immunizationformtype}',status='${displayheadername}' where id='${id}'`;
     console.log(command);
     execCommand(command)
     .then(result => res.json('update'))
     .catch(err => logWriter(command, err));
    }
     
 })
 router.post('/SaveScheduleImunisationForm',(req,res)=>{
    console.log('chouhan shab111',req.body);

    var hospitalId=req.body.hospitalId;
    var branchId=req.body.branchId;
    var patientGuid=req.body.patientguid;
    var idss=req.body.ImunisationForm.id;
    var displayheadername=req.body.displayheadername;
    // var Site=req.body.ImunisationForm.Site.id;
    // var Indication=req.body.ImunisationForm.Indication.id;
    // var immunizationformtype=req.body.splitbuttonids;
    // var immunizationformtype=req.body.splitbuttonids;
    console.log('1111111111111',displayheadername);
    // var displayheadername=req.body.displayheadername;
    var {ids,  Manufacture, Lotnumber, Expiredate, DoseSerise, DoseUnit,DoseType,  Funding, DateAdministerd, Source, Notes,MinAge,MaxAge,DueDate,DOB,NuAlertBeforeDueDate,NuAlertAfterDueDate,CatageryName}=req.body.ImunisationForm;
    var command ='';
    let date=new Date();
    var DueDates = formatDate(req.body.ImunisationForm.DueDate);
    Expiredate=date.toISOString().split('T')[0];
    DateAdministerd=date.toISOString().split('T')[0];
    if(ids=='' || ids=='0' || ids==undefined || ids==null){
      command =`INSERT INTO  immunization_schedule_tranzation(pattientid,hospitalid, branchid, vaccinid,statusid) 
      values('${patientGuid}','${hospitalId}','${branchId}','${idss}','${displayheadername}')`;
    }else{
      command=`update immunization_schedule_tranzation set vaccinid='${idss}',statusid='${displayheadername}' where ids='${ids}'`
    }
    console.log(command);
    execCommand(command)
    .then(result => res.json('update'))
    .catch(err => logWriter(command, err));
   
    
})
 
 router.post('/GetImunisationFormAPI',(req,res)=>{
     // var display_name = req.body.event; 
     var hospitalId = req.body.hospitalId;
     var branchId=req.body.branchId
     var patientguid=req.body.patientguid;
    
     const command =`Select *,(Select CVXShortDescription from master_vaccine_cvx where CVXCode=master_immunisation.Vaccine) as VaccineName ,(Select manufacturer_name from product_mappng_cvx_mvx where CVXCode='24') as Manufacturer, (Select name from master_Routes where id=master_immunisation.Routes) as RoutesName ,(Select shortname from master_Site where id=master_immunisation.Site) as SiteName ,(Select name from master_reason_administerd where id=master_immunisation.Indication) as IndicationName from master_immunisation where patient_Id='${patientguid}'`;
  
     console.log('master_immunisation',command);
   
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
 })
 router.post('/GetImmunizationOther',(req,res)=>{
    // var display_name = req.body.event; 
    var hospitalId = req.body.hospitalId;
    var branchId=req.body.branchId
    var patientguid=req.body.patientguid;
   
    const command =`Select *,(Select CVXShortDescription from master_vaccine_cvx where CVXCode=master_immunisation.Vaccine) as VaccineName ,(Select manufacturer_name from product_mappng_cvx_mvx where CVXCode='24') as Manufacturer, (Select name from master_Routes where id=master_immunisation.Routes) as RoutesName ,(Select shortname from master_Site where id=master_immunisation.Site) as SiteName ,(Select name from master_reason_administerd where id=master_immunisation.Indication) as IndicationName from master_immunisation where  immunizationformtype='${'1'}' && patient_Id='${patientguid}'`;
 
    console.log('master_immunisation',command);
  
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
})
 router.post('/delete_ImmunisationAPI',(req,res)=>{
     // var display_name = req.body.event; 
     var hospitalId = req.body.hospitalId;
    var patientGuid=req.body.patientguid;
     var  branchId=req.body.branchId;
     var  ids=req.body.id;
     
     
    
     const command =`delete from master_immunisation where hospital_Id='${hospitalId}' AND branch_Id='${branchId}' AND patient_Id='${patientGuid}' AND id='${ids}' `;
     console.log('vaibhav',command);
   
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
 })
 
 router.post('/lockUnlock_ImmunisationAPI', (req,res)=>{
     var id=req.body.id;
     var status=req.body.status;
 
     const command =`Update master_immunisation set lockStatus='${status}' where id='${id}';`;
 
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
     
 
 })
 
 router.get('/master_routes', (req,res)=>{
    
     console.log('master_routes');
     
      const command =`Select * from master_routes`;
  
     
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
  })
  router.get('/getmastervaccine', (req,res)=>{
    console.log('master_routes');
     const command =`Select *,(select CVXShortDescription from master_vaccine_cvx where CVXCode=master_recimendation_vaccine.CVX_Code) as vaccinename, (select name from master_routes where id=master_recimendation_vaccine.Route)as routesname ,(select Schedulename from master_schedulename where id=master_recimendation_vaccine.ImmunizationSchedule)as schedulename from master_recimendation_vaccine`;
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
    
 })
 
  router.get('/master_question', (req,res)=>{
    
     console.log('master_question');
     
      const command =`Select * from master_question_mfs `;
  
     
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
  })
 
  router.get('/master_answer', (req,res)=>{
    
     console.log('master_answer');
     
      const command =`Select * from master_answer_mfs`;
  
     
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
  })
 
  router.post('/Save_PainForm',(req,res)=>{
     var hospitalId=req.body.hospitalId;
     var branchId=req.body.branchId;
     var patientGuid=req.body.patientguid;
 
     var id=req.body.painform.id;
     console.log('id',id)
     var Pain=req.body.painform.Pain;
     var Site=req.body.painform.Site;
     var Orientation=req.body.painform.Orientation;
     var VAS=req.body.painform.VAS;
     var WongBakerFaces=req.body.painform.WongBakerFaces;
     var Source=req.body.painform.Source;
     var notes=req.body.painform.notes;
     var command ='';
     if(id=='' || id=='0' || id==undefined || id==null){
     const command =`INSERT INTO  transaction_pain (hospital_Id, branch_Id, patient_Id,Pain,Site,Orientation,VAS,WongBakerFaces,Source,notes) values('${hospitalId}','${branchId}','${patientGuid}', '${Pain}','${Site}','${Orientation}','${VAS}','${WongBakerFaces}','${Source}','${notes}')`;
     console.log(command);
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
 }
 
 else{
     command = `update transaction_pain set  hospital_Id='${hospitalId}',branch_Id='${branchId}',patient_Id='${patientGuid}', Pain='${Pain}',Site='${Site}',Orientation='${Orientation}',VAS='${VAS}',WongBakerFaces='${WongBakerFaces}',Source='${Source}',notes='${notes}' where id='${id}'`;
     console.log(command);
     execCommand(command)
     .then(result => res.json('update'))
     .catch(err => logWriter(command, err));
    }
 
  }) 
 
  router.post('/Get_PainFormData', (req,res)=>{
     var hospitalId = req.body.hospitalId;
     var branchId=req.body.branchId
     var patientguid=req.body.patientguid;
    
     console.log('Get_PainFormData');
     
     //  const command =`Select * from transaction_pain`;
       const command =`Select * from transaction_pain where hospital_Id='${hospitalId}' AND branch_Id='${branchId}' AND patient_Id='${patientguid}'`;
     console.log(command)
      execCommand(command)
      
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  })
 
  router.post('/delete_PainDataAPI',(req,res)=>{
     console.log('Api hit');
    
     var  ids=req.body.id;
 
     const command =`delete from transaction_pain where id='${ids}' `;
     console.log('vaibhav',command);
   
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
 })
 
 router.post('/Get_Orientation',(req,res)=>{
     var text=req.body.text;
     console.log('Get_Orientation',text);
     const command =`Select * from master_painorientation`;
  
   
      
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
 
  router.post('/Get_PainDataSiteAPI',(req,res)=>{
     var text=req.body.text;
     console.log('Get_PainDataSiteAPI',text);
     const command =`Select * from master_Painformsite`;
  
   
      
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
 
  router.post('/lockUnlock_PainAPI', (req,res)=>{
     var id=req.body.id;
     var status=req.body.status;
 
     const command =`Update transaction_pain set lockStatus='${status}' where id='${id}';`;
 
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
     
 
 })
 
 
 router.post('/getpointsfromtransationMFS',(req,res)=>{
     var Patientguid = req.body.patientguid
     var branchId = req.body.branchId;
     var hospitalId = req.body.hospitalId;
     getPointsofMFS(Patientguid, branchId, hospitalId,(result)=>{
         console.log(result);
         res.json(result[0]);
     })
 
 })
 
 
 
 router.post('/InsertQuestionAnswerPAINMFSTransactiontable', (req, res) => {
     console.log('asdf');
     var Patientguid = req.body.patientguid
     var branchId = req.body.branchId;
     var hospitalId = req.body.hospitalId;
     // var typeForm = req.body.formType;
     var answerQuestion = req.body.answerQuestion
     getQuestionAnswerPoints(answerQuestion, (points) => {
         console.log("pointslllll",points);
         const command = `INSERT INTO transaction_question_answertable_mfs(patientId, branchId, HospitalId,points, TransactionTime) values('${Patientguid}','${branchId}','${hospitalId}','${points}',now())`;
 
         console.log(command);
         execCommand(command)
             .then(result => {
                 getPointsofMFS(Patientguid, branchId, hospitalId,(result)=>{
                     res.json(result[0]);
                 })
             })
             .catch(err => logWriter(command, err));
     })
 })
 
 function getQuestionAnswerPoints(answerQuestion, callback) {
     console.log("answerQuestionCage", answerQuestion);
     let i = 0;
     let points = 0;
     (function loop() {
         if (i < answerQuestion.length) {
             let commond = `SELECT points from master_answer_mfs WHERE QuestionId='${answerQuestion[i].Question}' AND id='${answerQuestion[i].Answer}';`
             console.log(commond);
             execCommand(commond)
                 .then((result) => {
                     //  console.log(result);
                     points = Number(points) + Number(result[0].points);
                     console.log("pointsssssss",points);
                     i++;
                     loop();
                 })
         }
 
         if (i == answerQuestion.length) {
             console.log("pointskkkk",points);
             return callback(points)
         }
     })();
 
 }
 
 
 function getPointsofMFS(Patientguid, branchId, hospitalId, callback){
     let command= `select points from transaction_question_answertable_mfs  WHERE patientId = '${Patientguid}' AND branchId = '${branchId}' AND HospitalId= '${hospitalId}' order by id desc`
     console.log(command);
     execCommand(command)
     .then(result =>{
         console.log(result);
        return callback(result); 
     } )
     .catch(err => logWriter(command, err));
 }
 
 
 
 
 
 
 router.post('/insertPainNotesAPI',(req,res)=>{  
     console.log(req.body.data);
 
     var patientId = req.body.Patientguid
     var hospitalId = req.body.hospitalId
     var doctorId = req.body.userName
     var notes = req.body.notes
     var allergyId=req.body.id
     var categeory= req.body.categeory
 
  
     const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;
 console.log(command)
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
 })
 
 
 router.post('/updatePainnotesAPI', (req,res)=>{
     
     var convertedDate = new Date(req.body.date).toLocaleString('en-US');
     
     console.log(convertedDate);
 console.log('update',req.body.data);
 
     var id =req.body.notesID;
     var notes=req.body.notes
    var date=req.body.date
     const command =`update allergy_notes set  notes='${notes}',date='${convertedDate}' where id=${id}`;
     console.log(command);
     execCommand(command)
     .then(result => res.json('success'))
     .catch(err => logWriter(command, err));
     
 
 })
 
 router.post('/get_Manufacrure_data',(req,res)=>{
     var text=req.body.text;
     console.log(text);
     // const command =`Select * from master_vaccine_cvx where CVXShortDescription like '%${text}%'`;
     const command =`Select * from product_mappng_cvx_mvx where CVXCode='${text}'`;
   
      console.log(command)
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
  router.post('/get_Documents_Data',(req,res)=>{
     var text=req.body.text;
     console.log('get_Documents_Data',text);
     // // const command =`Select * from master_vaccine_cvx where CVXShortDescription like '%${text}%'`;
     const command =`SELECT PDF_URL FROM master_vis_url where concept_code = (select substring(VISFullycode, 4, 13) FROM cvx_vis_mapping  where CVX_code = '${text}' limit 1);`;
   
      console.log(command)
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
  router.post('/vaccince_patch_data',(req,res)=>{
     var text=req.body.vaccine;
     console.log('get_Documents_Data',text);
     const command =`Select * from master_vaccine_cvx where CVXShortDescription = '${text}'`;
      console.log(command)
     execCommand(command)
     .then(result => res.json(result))
     .catch(err => logWriter(command, err));
   
     
  })
  
  router.get('/get_master_immunizationdata',(req,res)=>{
    const command =`Select * from master_immunizationformtype`;
     console.log('command',command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  
    
 })
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
  router.post('/DeleteRecords',(req,res)=>{
    console.log('Api hit');
   
    var  id=req.body.id;

    const command =`delete from master_immunisation where id='${id}' `;
    console.log('vaibhav',command);
  
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/selectresiondataAPI',(req,res)=>{
    var type=req.body.value
    const command =`Select * from master_reason_administerd where type='${type}'`;
     console.log('command',command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  
    
 })
 
 router.post('/SaveImunisationForm',(req,res)=>{
    console.log('chouhan shab',req.body);
    var hospitalId=req.body.hospitalId;
    var branchId=req.body.branchId;
    var patientGuid=req.body.patientguid;
    var Vaccine=req.body.ImunisationForm.Vaccine.CVXCode;
    var displayheadername=req.body.displayheadername
   
   

    var { id, Manufacture, Lotnumber, Expiredate, DoseSerise, DoseUnit,DoseType,  Funding, DateAdministerd, Source, Notes,MinAge,MaxAge,DueDate,DOB,NuAlertBeforeDueDate,NuAlertAfterDueDate,CatageryName,}=req.body.ImunisationForm;
    
    var command ='';
    let date=new Date();
    var DueDates = formatDate(req.body.ImunisationForm.DueDate);
    Expiredate=date.toISOString().split('T')[0];
    DateAdministerd=date.toISOString().split('T')[0];
    if(id=='' || id=='0' || id==undefined || id==null){
     command =`INSERT INTO  master_immunisation(hospital_Id, branch_Id, patient_Id, Vaccine,  Dose_Serise, Date_Administerd, Notes) values('${hospitalId}','${branchId}','${patientGuid}','${Vaccine}','${DoseSerise}','${DateAdministerd}','${Notes}')`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
}
else{
    command = `update master_immunisation set hospital_Id='${hospitalId}',branch_Id='${branchId}',patient_Id='${patientGuid}',Vaccine='${Vaccine}',Manufacturer='${Manufacture}',Lot_Number='${Lotnumber}',Expire_date='${Expiredate}',Dose_Serise='${DoseSerise}',DoseUnit='${DoseUnit}',Funding='${Funding}',Date_Administerd='${DateAdministerd}',Source='${Source}',Notes='${Notes}', MinAge='${MinAge}' ,MaxAge='${MaxAge}', DueDate='${DueDate}', DOB='${DOB}', NuAlertBeforeDueDate='${NuAlertBeforeDueDate}', NuAlertAfterDueDate='${NuAlertAfterDueDate}',DoseType='${DoseType}',CategaryName='${CatageryName}', status='${displayheadername}' where id='${id}'`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('update'))
    .catch(err => logWriter(command, err));
   }
})
router.get('/getmasterfrequency',(req,res)=>{
  console.log('getmasterfrequency');
    const command =`Select * from master_frequencymedication`;
     console.log('command',command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err)); 
 })
 router.post('/saveschedulename',(req,res)=>{
    console.log('getmasterfrequency',req.body);
var id=req.body.Schedulerform.id
var schedulername=req.body.Schedulerform.Scedulername
var creadetdates=req.body.Schedulerform.creadetedate
console.log(schedulername,creadetdates);
if (id == '' || id == null || id == undefined) {
      const command =`INSERT INTO  master_schedulename(Schedulename, crededate,transationdate) values('${schedulername}','${creadetdates}',now())`;
}else{
     command=`update master_schedulename set Schedulename='${schedulername}',crededate='${creadetdates}',transationdate=now() where id='${id}'`
}
       console.log('command',command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err)); 
   })
   router.get('/getSchedulerdata',(req,res)=>{
    console.log('getmasterfrequency');
      const command =`Select * from master_schedulename`;
       console.log('command',command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err)); 
   })
   router.get('/getVaccinevis',(req,res)=>{
    console.log('getmasterfrequency');
      const command =`Select * from master_vis_url`;
       console.log('command',command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err)); 
   })
   router.post('/save_Reciindation_vaccine',(req,res)=>{
    console.log('getmasterfrequency',req.body);
    var Id=req.body.Vaccine_remomendationform.id
    var vaccine=req.body.Vaccine_remomendationform.Vaccine.CVXCode;
    var vaccinenames=req.body.Vaccine_remomendationform.Vaccine.CVXShortDescription;
    var {Vaccine_description,CVX_Code,Manufacture,durationofprotection,Diagnosiscode,VIS,ImmunizationSchedule,billingcode,dose,frequency}=req.body.Vaccine_remomendationform;
 var Route=req.body.Vaccine_remomendationform.Route.id
 if (Id == '' || Id == null || Id == undefined) {
      const command =`Insert into master_recimendation_vaccine(vaccine, CVX_Code, ManufactureDose,Vaccine_description, durationofprotection, Diagnosiscode, VIS, Route, dose, ImmunizationSchedule, billingcode,frequency,vaccinenames)
      values('${vaccine}','${CVX_Code}','${Manufacture}','${Vaccine_description}','${durationofprotection}','${Diagnosiscode}','${VIS}','${Route}','${dose}','${ImmunizationSchedule}','${billingcode}','${frequency}','${vaccinenames}')` 
 }
 else{
    command = `update master_recimendation_vaccine set vaccine='${vaccine}',CVX_Code='${CVX_Code}',ManufactureDose='${Manufacture}',Vaccine_description='${Vaccine_description}',durationofprotection='${durationofprotection}'
    ,Diagnosiscode='${Diagnosiscode}',VIS='${VIS}',Route='${Route}',dose='${dose}',ImmunizationSchedule='${ImmunizationSchedule}',billingcode='${billingcode}',frequency='${frequency}',vaccinenames='${vaccinenames}' where id='${Id}'`;

 }
      console.log('command',command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err)); 
   })
   router.post('/getMasterVaccineRecomendationData',(req,res)=>{
    var text=req.body.text;
    console.log(text);
    // const command =`Select * from master_vaccine_cvx where CVXShortDescription like '%${text}%'`;
    const command =`Select *,(select CVXShortDescription from master_vaccine_cvx where CVXCode=master_recimendation_vaccine.CVX_Code) as vaccinename, (select name from master_routes where id=master_recimendation_vaccine.Route)as routesname ,(select Schedulename from master_schedulename where id=master_recimendation_vaccine.ImmunizationSchedule)as schedulename from master_recimendation_vaccine  where vaccinenames like '%${text}%'`;
   
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
 })
 router.post('/SaveScheduleVaccine',(req,res)=>{
    
    console.log(req.body);
   var  Vaccine=req.body.Schedulenames.Vaccine.CVX_Code;
   var Routes=req.body.Schedulenames.Routes.id
   Indication=req.body.Schedulenames.Indication.id
   Site=req.body.Schedulenames.Site.id

  
   var {id,CatageryName , numberDoseSerise, numbersDoseType, DoseSerise, DoseType, MinAge, minagetype, MaxAge, DueDate, NuAlertBeforeDueDate, NuAlertAfterDueDate} =req.body.Schedulenames
  if(id=='' || id==null || id==undefined){
   var command =`Insert into master_vaccinescheduler(scheduless, Vaccine, numberDoseSerise, numbersDoseType, DoseSerise, DoseType, Routes, Site, MinAge, minagetype, MaxAge, NuAlertBeforeDueDate, NuAlertAfterDueDate, Indication)
      values('${CatageryName}','${Vaccine}','${numberDoseSerise}','${numbersDoseType}','${DoseSerise}','${DoseType}','${Routes}','${Site}','${MinAge}','${minagetype}','${MaxAge}','${NuAlertBeforeDueDate}','${NuAlertAfterDueDate}','${Indication}')` 
  }else{
    command=`update master_vaccinescheduler set Vaccine='${Vaccine}',numberDoseSerise='${numberDoseSerise}',numbersDoseType='${numbersDoseType}',DoseSerise='${DoseSerise}', DoseType='${DoseType}', MinAge='${MinAge}',
    MaxAge='${MaxAge}'  where id='${id}'`
  }
       console.log('command',command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err)); 
   })


   router.post('/getVaccicescheduledata',(req,res)=>{
    var text=req.body.schedulenames;
    // console.log(text);
    const command=` Select * ,(select CVXShortDescription from master_vaccine_cvx where CVXCode=master_vaccinescheduler.Vaccine) as vaccinename, (select name from master_routes where id=master_vaccinescheduler.Routes)as routesname , (select shortname from master_site where id=master_vaccinescheduler.Site)as sitename ,  (select name from master_reason_administerd where id=master_vaccinescheduler.Indication) as Indicationname FROM immunization_schedule_tranzation INNER JOIN master_vaccinescheduler group by vaccinid;`

    // const command =`Select * ,(select CVXShortDescription from master_vaccine_cvx where CVXCode=master_vaccinescheduler.Vaccine) as vaccinename, (select name from master_routes where id=master_vaccinescheduler.Routes)as routesname , (select shortname from master_site where id=master_vaccinescheduler.Site)as sitename , (select name from master_reason_administerd where id=master_vaccinescheduler.Indication) as Indicationname   from master_vaccinescheduler`;
    // const command =`Select *,(select CVXShortDescription from master_vaccine_cvx where CVXCode=master_recimendation_vaccine.CVX_Code) as vaccinename, (select name from master_routes where id=master_recimendation_vaccine.Route)as routesname ,(select Schedulename from master_schedulename where id=master_recimendation_vaccine.ImmunizationSchedule)as schedulename from master_recimendation_vaccine  where vaccinenames like '%${text}%'`;
   console.log('1111'.command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
 })
 module.exports =router;