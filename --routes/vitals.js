const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.get('/getMaster_consciousness', (req,res)=>{

    const command = `Select *  from master_consciousness where active=1 `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})


router.get('/getallergy_intolerance_type', (req,res)=>{
    const command = `Select * from master_allergy_intolerance_type where active=1`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.get('/getallergySeverity', (req,res)=>{
    const command = `Select * from master_severity`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.post('/getTransactionVitals', (req, res) => {
    console.log('petgcdgf', req.body);
    var patientId = req.body.patientguid
    const command = `Select * from transaction_vitals where patientId='${patientId}' order by id desc`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.post('/getChartsVitals', (req, res) => {
    console.log('petgcdgf', req.body);
    var patientId = req.body.patientguid
    const command = `Select * from transaction_vitals where patientId='${patientId}' order by id desc limit 10`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.get('/getmaster_source', (req,res)=>{
    const command = `Select * from master_source`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/getmaster_allergy', (req,res)=>{
    console.log(req.body.text);
    const display_name = req.body.text
    const type=req.body.type
    const command = `select * from master_allergy where display_name like '%${display_name}%' && type='${type}';`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/getmaster_site', (req,res)=>{
    
    const command = `select * from master_site where active=1`;

    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})


router.post('/lockUnlocktransaction_vitals', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_vitals set lockStatus='${status}' where id='${id}';`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})
router.post('/ResolvedStatuschangetransaction_allergies', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_allergies set Resolve_status='${status}' where id='${id}';`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})

router.post('/AddUpdateVitalsTransaction', (req,res)=>{
    console.log('+++++++===>',req.body.data.DateAndTime)
//    var mydate = new Date(req.body.data.DateAndTime).toLocaleString('en-US')
//    var newdate = mydate.replace('/','-').replace('/','-').replace(',','')
   
// // var dateformate=new Date(newdate.getFullYear(), DateAndTime.getMonth(), DateAndTime.getDate())
// console.log('+++++++>',dateformate)
   var PatientId= req.body.PatientId
 var HospitalId= req.body.HospitalId
 var  BranchId= req.body.BranchId
   var SBP= req.body.data.SBP
 var  DBP= req.body.data.DBP
 var  MBP= req.body.data.MBP
  var BP_Site= req.body.data.BP_Site
 var  Position= req.body.data.Position
 var Cuff_size= req.body.data.Cuff_size
 var Method= req.body.data.Method
  var Pulse= req.body.data.Pulse
    var Temprature= req.body.data.Temprature
    var Temprature_site= req.body.data.Temprature_site
     var Temprature_Device= req.body.data.Temprature_Device
  var  HpercapnicRF= req.body.data.HpercapnicRF
    var  RR = req.body.data.RR
   var  spO2= req.body.data.spO2
   var  SuplementalO2= req.body.data.SuplementalO2
  var   O2Flow= req.body.data.O2Flow
     var  Weight= req.body.data.Weight
    var  Height= req.body.data.Height
    var   HeadOFC= req.body.data.HeadOFC
  var   BMI = req.body.data.BMI
  var  BSA= req.body.data.BSA
 var   Consciousness= req.body.data.Consciousness
 var   Source= req.body.data.Source
 var DateAndTime= new Date( req.body.data.DateAndTime)

 var convertedDate = new Date(req.body.data.DateAndTime);
 console.log('+++++++=======>',convertedDate)

 let isoDate = convertedDate;
 var d = new Date(isoDate);
 let time=d.toLocaleTimeString('en-GB');
console.log("================================================",d.toLocaleDateString('en-GB') ,d.toLocaleTimeString('en-GB')); // dd/mm/yyyy
let dateFor = d.toLocaleDateString('en-GB');
let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`


console.log("------------------------------------------------------------------------------------------------", databaseDate);

//  var convertedDate = new Date(req.body.data.DateAndTime).toLocaleString('en-US');
  var RecordedBy= req.body.data.RecordedBy
 var Notes= req.body.data.Notes


    // console.log(patientguid);
    // var transaction_time=NOW();
    var id = req.body.data.id
    console.log("sdfghjkdfghjkdfghjk",req.body.data.id);
    // console.log('idfg',id);
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
        command = `INSERT INTO transaction_vitals( PatientId, HospitalId, BranchId, SBP, DBP, MBP, BP_Site, Position, Cuff_size, Method, Pulse, Temprature, Temprature_site, Temprature_Device, HpercapnicRF, RR, spO2, SuplementalO2, O2Flow, Weight, Height, HeadOFC, BMI, BSA, Consciousness, Source, DateAndTime, RecordedBy, Notes,transaction_time) values
        ('${PatientId}','${HospitalId}','${BranchId}','${SBP}','${DBP}','${MBP}','${BP_Site}','${Position}','${Cuff_size}','${Method}','${Pulse}','${Temprature}','${Temprature_site}','${Temprature_Device}','${HpercapnicRF}','${RR}','${spO2}','${SuplementalO2}','${O2Flow}','${Weight}','${Height}','${HeadOFC}','${BMI}','${BSA}','${Consciousness}','${Source}','${databaseDate} ${time}','${RecordedBy}','${Notes}', now())`;
    }
    else{
         command = `update transaction_vitals set SBP='${SBP}',DBP='${DBP}',MBP='${MBP}',BP_Site='${BP_Site}',Position='${Position}',Cuff_size='${Cuff_size}',Method='${Method}',Pulse='${Pulse}',Temprature='${Temprature}',Temprature_site='${Temprature_site}',Temprature_Device='${Temprature_Device}',HpercapnicRF='${HpercapnicRF}',RR='${RR}',spO2='${spO2}',SuplementalO2='${SuplementalO2}',O2Flow='${O2Flow}',Weight='${Weight}',Height='${Height}',HeadOFC='${HeadOFC}',BMI='${BMI}',BSA='${BSA}',Consciousness='${Consciousness}',Source='${Source}',DateAndTime='${databaseDate} ${time}',RecordedBy='${RecordedBy}',Notes='${Notes}',transaction_time=now() where id='${id}'`;
        returnmessage="U"
    }
  //  console.log(command);
   
    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
    // res.json('S')
    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(returnmessage);
    //     }
    // });
    
});
router.post('/insertVitalsNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.PatientId
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes
    var allergyId=req.body.data.id
    var categeory= 'Vitals'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/updateAllergynotes', (req,res)=>{
    console.log(req.body.date);
    // var date = new Date(req.body.date)
    // date = date.getTime()
    // var convertedDate = new Date(date).toLocaleString("en-in",{timeZone: 'GMT +05:30'})
    var convertedDate = new Date(req.body.date).toLocaleString('en-US');
    
    console.log(convertedDate);
console.log('update',req.body.data);
// var patientId=req.body.data.patientId
    var id =req.body.id;
    var notes=req.body.notes
   var date=req.body.date
    const command =`update allergy_notes set  notes='${notes}',date='${convertedDate}' where id=${id}`;
// console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})
router.post('/insertfavorites_allergy',(req,res)=>{
    console.log('dispplaydata',req.body.displayData);

    var hospitalId = req.body.hospitalId 
    var allergenName = req.body.data.allergenName
    var allergeIntoleranceType=req.body.data.allergeIntoleranceType
    var doctorId='doc-21'
    var  branchId='branch-01'
    // var id=req.body.displayData.allergenName;
    // var favorites=req.body.displayData.favorites
    const command =`INSERT INTO  favorites_allergy(branchId,hospitalId,doctorId,allergenName,allergeIntoleranceType) values('${branchId}','${hospitalId}','${doctorId}','${allergenName}','${allergeIntoleranceType}')`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

router.post('/getVitalNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='Vitals'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/deleteAllergy_notes', (req,res)=>{
    const id =req.body.id;

    const command =`delete from allergy_notes where id=${id};`;

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})

router.post('/DeleteTransactionVitals', (req,res)=>{
    const id =req.body.id;

    const command =`delete from transaction_vitals where id=${id};`;

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})
router.post('/DragRowReOrdertransaction_allergies', (req,res)=>{
    console.log(req.body);
    // var id=req.body.displayData
    // var priority=req.body.displayData
    var data = req.body.displayData
    var i = 0;
    let multiQuery = '';

    (function loop(){
        if(i < data.length){
            multiQuery += `Update transaction_allergies set priority='${(i+1)}' where id='${data[i].id}';`;
            i++;
            loop();
        }
        else{
            execCommand(multiQuery)
            .then(result => res.json('success'))
            .catch(err => logWriter(multiQuery, err));
        }
    }());

   

    
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})


module.exports =router;