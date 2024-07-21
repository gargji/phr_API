const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/AddUpdateTransactionTobacco_use', (req,res)=>{
   console.log("tobacco",req.body.data);

    console.log('save',req.body.patientguid);
    var convertedDate = new Date(req.body.date).toLocaleString('en-US');
    var patientId = req.body.patientguid
    var branchId=req.body.branchID;
    var hospital_Id=req.body.hospitalId;
  var Tobacco_use_Status=req.body.data.Tobacco_use_Status;
  var Smoking_Status=req.body.data.Smoking_Status;
  var Source=req.body.data.Source;
  var Recordedby=req.body.data.Recordedby
  var recorded_date= req.body.data.recorded_date
 var  SmokedTobaccoStartDate=req.body.data.SmokedTobaccoStartDate
  var  SmokedTobaccoQuitDate=req.body.data.SmokedTobaccoQuitDate
  var  SmokelessTobaccoStartDate=req.body.data.SmokelessTobaccoStartDate
  var  SmokelessTobaccoQuitDate=req.body.data.SmokelessTobaccoQuitDate
  var  Electronic_Cigarette_VapingStartDate=req.body.data.Electronic_Cigarette_VapingStartDate
  var  Electronic_Cigarette_VapingQuitDate=req.body.data.Electronic_Cigarette_VapingQuitDate
  var type=req.body.data.type;
  var PackPerDays=req.body.data.PackPerDays;
  var PackYears=req.body.data.PackYears;
  var smokingType=req.body.data.smokingType
  var vaping_status=req.body.data.vaping_status
  console.log("vb",PackYears);
  var Year=req.body.data.Year
  var  SmokedTobacco_Counselling=req.body.data.SmokedTobacco_Counselling
   var  ElectronicCigarette_VapingCounseling=req.body.data.ElectronicCigarette_VapingCounseling
   var  SmokedTobacco_Notes=req.body.data.SmokedTobacco_Notes
    var Electronic_Cigarette_VapingNotes=req.body.data.Electronic_Cigarette_VapingNotes
  var SmokelessTobaccoType=req.body.data.SmokelessTobaccoType
  var SmokelessTobaccoStatus=req.body.data.SmokelessTobaccoStatus;
  var Last30day_status=req.body.data.Last30day_status
  var E_LiquidContainsNicotine=req.body.data.E_LiquidContainsNicotine
  var E_LiquidContainsCannabis=req.body.data.E_LiquidContainsCannabis
  var NumberofUnitsPerDay=req.body.data.NumberofUnitsPerDay
  var DisposableE_Cigarette=req.body.data.DisposableE_Cigarette
  var PrefilledCartridge_Cigarette=req.body.data.PrefilledCartridge_Cigarette
var RefillableTankE_Cigarette=req.body.data.RefillableTankE_Cigarette
var HeatNotBurnTobacco_Device=req.body.data.HeatNotBurnTobacco_Device
AnyCurrentPassiveExposure_toE_Cigarette=req.body.data.AnyCurrentPassiveExposure_toE_Cigarette
    var id = req.body.data.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
        command = `INSERT INTO transaction_tobacco_use(patientId,branchId,hospital_Id,Tobacco_use_Status,Smoking_Status,Source,Recordedby,recorded_date,SmokedTobaccoStartDate,SmokedTobaccoQuitDate,SmokelessTobaccoStartDate,SmokelessTobaccoQuitDate,Electronic_Cigarette_VapingStartDate,Electronic_Cigarette_VapingQuitDate,type,PackPerDays,Year,PackYears,SmokedTobacco_Counselling,ElectronicCigarette_VapingCounseling,SmokedTobacco_Notes,Electronic_Cigarette_VapingNotes,SmokelessTobaccoType,SmokelessTobaccoStatus,vaping_status,E_LiquidContainsNicotine,E_LiquidContainsCannabis,NumberofUnitsPerDay,DisposableE_Cigarette,PrefilledCartridge_Cigarette,RefillableTankE_Cigarette,HeatNotBurnTobacco_Device,AnyCurrentPassiveExposure_toE_Cigarette,smokingType,notes_date,tranasaction_time) values
        ('${patientId}','${branchId}','${hospital_Id}','${Tobacco_use_Status}','${Smoking_Status}','${Source}','${Recordedby}','${recorded_date}','${SmokedTobaccoStartDate}','${SmokedTobaccoQuitDate}','${SmokelessTobaccoStartDate}','${SmokelessTobaccoQuitDate}','${Electronic_Cigarette_VapingStartDate}','${Electronic_Cigarette_VapingQuitDate}','${type}','${PackPerDays}','${Year}','${PackYears}','${SmokedTobacco_Counselling}','${ElectronicCigarette_VapingCounseling}','${SmokedTobacco_Notes}','${Electronic_Cigarette_VapingNotes}','${SmokelessTobaccoType}','${SmokelessTobaccoStatus}','${vaping_status}','${E_LiquidContainsNicotine}','${E_LiquidContainsCannabis}','${NumberofUnitsPerDay}','${DisposableE_Cigarette}','${PrefilledCartridge_Cigarette}','${RefillableTankE_Cigarette}','${HeatNotBurnTobacco_Device}','${AnyCurrentPassiveExposure_toE_Cigarette}','${smokingType}',now(),now())`;
    }
    else{
         command = `update transaction_tobacco_use set Tobacco_use_Status='${Tobacco_use_Status}',Smoking_Status='${Smoking_Status}',Recordedby='${Recordedby}',recorded_date='${recorded_date}',Source='${Source}',SmokedTobaccoStartDate='${SmokedTobaccoStartDate}',SmokedTobaccoQuitDate='${SmokedTobaccoQuitDate}',SmokelessTobaccoStartDate='${SmokelessTobaccoStartDate}',SmokelessTobaccoQuitDate='${SmokelessTobaccoQuitDate}',Electronic_Cigarette_VapingStartDate='${Electronic_Cigarette_VapingStartDate}',SmokelessTobaccoStatus='${SmokelessTobaccoStatus}',Electronic_Cigarette_VapingQuitDate='${Electronic_Cigarette_VapingQuitDate}',type='${type}',PackPerDays='${PackPerDays}',Year='${Year}',PackYears='${PackYears}',SmokedTobacco_Counselling='${SmokedTobacco_Counselling}',ElectronicCigarette_VapingCounseling='${ElectronicCigarette_VapingCounseling}',SmokedTobacco_Notes='${SmokedTobacco_Notes}',Electronic_Cigarette_VapingNotes='${Electronic_Cigarette_VapingNotes}',SmokelessTobaccoType='${SmokelessTobaccoType}',vaping_status='${vaping_status}',E_LiquidContainsNicotine='${E_LiquidContainsNicotine}',E_LiquidContainsCannabis='${E_LiquidContainsCannabis}',NumberofUnitsPerDay='${NumberofUnitsPerDay}',DisposableE_Cigarette='${DisposableE_Cigarette}',PrefilledCartridge_Cigarette='${PrefilledCartridge_Cigarette}',RefillableTankE_Cigarette='${RefillableTankE_Cigarette}',HeatNotBurnTobacco_Device='${HeatNotBurnTobacco_Device}',AnyCurrentPassiveExposure_toE_Cigarette='${AnyCurrentPassiveExposure_toE_Cigarette}',tranasaction_time=now() where id='${id}'`;
        returnmessage="U"
    }
   console.log("tobaccooupdate",command);
    execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
    .then(result => 

        {
            if(result){
                if(id=='' || id=='0' || id==undefined || id==null){
                    var Aid=result.insertId
                    command=`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospital_Id}','${Recordedby}','${SmokedTobacco_Notes}','${Aid}','TobaccoUse',now())`
            
                }else{
                    var notes_date=req.body.data.notes_date
                    console.log('notesdate',notes_date);
                    command=`update allergy_notes set  notes='${SmokedTobacco_Notes}',date=now() where date='${notes_date}'`
    
                }
            execCommand(command.replace(/null/g, ''))
          
            .then(result =>{
                console.log(command);
                console.log('success');
                res.json(returnmessage)
    
            })
            .catch(err => logWriter(command, err));
         
            }
            // console.log(result);
        })
        // res.json(returnmessage))
    .catch(err => logWriter(command, err));
    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(returnmessage);
    //     }
    // });
    
});
router.post('/getTransactionTobaccoUse', (req,res)=>{
    console.log('petgcdgf',req.body);
    var Patientguid=req.body.patientguid
    const command = `Select *,(select name from master_smoking_status where id=transaction_tobacco_use.Smoking_Status) as SmokeStatusName,(select name from master_smoking_category where id=transaction_tobacco_use.smokingType) as smokingCategory,(select name from master_smoking_type where id=transaction_tobacco_use.type) as smokingTypeName,(select name from master_smoking_type where id=transaction_tobacco_use.type) as Smokingtypes  from transaction_tobacco_use where patientId='${Patientguid}'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_smokeless_tobocoo_status', (req,res)=>{
    console.log('petgcdgf',req.body);

    const command = `Select * from master_smoking_status where type='2'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_smoking_category', (req,res)=>{
    console.log('petgcdgf',req.body);

    const command = `Select * from master_smoking_category`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/GetMaster_smokeless_tobacco_type', (req,res)=>{
    console.log('petgcdgf',req.body);

    const command = `Select * from master_smoking_type where type='2'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_smoking_status', (req,res)=>{
    console.log('petgcdgf',req.body);
   
    const command = `Select * from master_smoking_status where type='1'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_smoking_types', (req,res)=>{
    console.log('petgcdgf',req.body);
   
    const command = `Select * from master_smoking_type where type='1'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.post('/deleteTobaccoUse', (req,res)=>{
    const id =req.body.id;

    const command =`delete from transaction_tobacco_use where id=${id};`;

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
router.post('/insertTobaccoUseNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.patientId
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes.replace('"','""').replace("'","''")
    var allergyId=req.body.data.id
    var categeory= 'TobaccoUse'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;
    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/getTobaccoUseNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='TobaccoUse'`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/lockUnlocktransactionTobaccoUse', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_tobacco_use set lockStatus='${status}' where id='${id}';`;

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

module.exports=router;