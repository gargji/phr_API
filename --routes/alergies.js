const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/getTransaction_alergiesData', (req,res)=>{
    var patientguid=req.body.patientguid;
    console.log(patientguid);

    const command = `Select *,(select name from master_severity where guid=transaction_allergies.Severity) as SeverityName,(select name from master_source where id=transaction_allergies.source) as SourceName,(select name from master_allergy_intolerance_type where id=transaction_allergies.AllergyIntoleranceType) as AllergyIntoleranceTypeName,(select displayname from master_manifestation_long where guid=transaction_allergies.manifastation) as manifastationName,(select display_name from master_allergy where id=transaction_allergies.AllergyId) as AllergenName from transaction_allergies where patientguid='${patientguid}' and Resolve_status=0 order by priority`;

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
router.get('/getMasterAllergy', (req,res)=>{
    const command = `Select * from master_allergy_intolerance_type where active=1`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/getmaster_alergiesDataDefault' , (req,res)=>{
    const command = `Select * from master_allergy where defaul=1`;

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
router.get('/getallergyCriticality', (req,res)=>{
    const command = `Select * from master_criticality`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/getmaster_exposure_route', (req,res)=>{
    const command = `Select * from master_exposure_route`;

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
router.post('/getmaster_manifestation', (req,res)=>{
    console.log(req.body.text);
    var display_name = req.body.text
    var command ='';
        command = `select * from master_manifestation_short where displayname like '%${display_name}%';`;
    
   
     console.log(command);
     
     execCommand(command)
     .then(result => {
         if(result.length<=0){
             command = `select * from master_manifestation_long where displayname like '%${display_name}%';`;
             console.log(command);
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
        }
        else{
            res.json(result)
        }
    })
    .catch(err => logWriter(command, err));
    
    
})

router.post('/lockUnlocktransaction_allergies', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update transaction_allergies set lockStatus='${status}' where id='${id}';`;

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

router.post('/AddUpdateAllergeyTransaction', (req,res)=>{
   
    console.log('save',req.body);
    var AllergyIntoleranceType = req.body.data.AllergyIntoleranceType
    var AllergyId = req.body.data.allergyId.id
    var DateOfOnSet = req.body.data.DateOfOnSet
    var manifastation = req.body.data.manifastation
    var clinicStatus=req.body.data.clinicStatus
    var DateOfResolution=req.body.data.DateOfResolution
    var Severity=req.body.data.Severity
    var Exposure_routes=req.body.data.Exposure_routes;
    var First_occurance=req.body.data.First_occurance
    var last_occurance=req.body.data.last_occurance
    var source=req.body.data.source
    var recorded_by=req.body.data.recorded_by
    var date_recorded=req.body.data.date_recorded
    var criticality=req.body.data.criticality
    var notes=req.body.data.notes
    var priority=req.body.priority+1
    var patientguid=req.body.patientguid
    var hospitalId=req.body.hospitalId
    var branch_Id=req.body.branchId
    // console.log(patientguid);
    // var transaction_time=NOW();
    var id = req.body.data.id
    // console.log('idfg',id);
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined || id==null){
        command = `INSERT INTO transaction_allergies(patientguid,branch_Id,hospital_id,AllergyIntoleranceType,criticality,AllergyId,DateOfOnSet,manifastation,clinicStatus,DateOfResolution,Severity,Exposure_routes,First_occurance,last_occurance,source,recorded_by,date_recorded,notes,priority,transaction_time) values
        ('${patientguid}','${branch_Id}','${hospitalId}','${AllergyIntoleranceType}','${criticality}','${AllergyId}','${DateOfOnSet}','${manifastation}','${clinicStatus}','${DateOfResolution}','${Severity}','${Exposure_routes}','${First_occurance}','${last_occurance}','${source}','${recorded_by}','${date_recorded}','${notes}','${priority}', now())`;
    }
    else{
         command = `update transaction_allergies set AllergyIntoleranceType='${AllergyIntoleranceType}',criticality='${criticality}',AllergyId='${AllergyId}',DateOfOnSet='${DateOfOnSet}',manifastation='${manifastation}',clinicStatus='${clinicStatus}',DateOfResolution='${DateOfResolution}',Severity='${Severity}',Exposure_routes='${Exposure_routes}',First_occurance='${First_occurance}',last_occurance='${last_occurance}',source='${source}',recorded_by='${recorded_by}',date_recorded='${date_recorded}',notes='${notes}',transaction_time=now() where id='${id}'`;
        returnmessage="U"
    }
    console.log(command);
    console.log('DateOfOnSet',DateOfOnSet);
    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(returnmessage);
    //     }
    // });
    
});
router.post('/insertAllergyNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.patientguid
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes
    var allergyId=req.body.data.id
    var categeory= 'Allergy'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/updateAllergynotes', (req,res)=>{
    // console.log(req.body.date);
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
router.post('/insertfavorites_allergythroughRowdata',(req,res)=>{
    console.log('row',req.body);
  var favorites =req.body.status
    var hospitalId = req.body.hospitalId 
    var allergenName = req.body.data.AllergyId
    var allergeIntoleranceType=req.body.data.AllergyIntoleranceType
    var doctorId='doc-21'
    var  branchId='branch-01'
    var id=req.body.data.id
    var favoritesID=req.body.data.AllergyId
    var command = '';
    if(req.body.data.favorites==0){
         command =`INSERT INTO  favorites_allergy(branchId,hospitalId,doctorId,allergenName,allergeIntoleranceType) values('${branchId}','${hospitalId}','${doctorId}','${allergenName}','${allergeIntoleranceType}');update transaction_allergies set favorites='${favorites}' where id='${id}'`;
    }
    else{
        
        command = `delete from favorites_allergy where allergenName='${favoritesID}';update transaction_allergies set favorites='${favorites}' where id='${id}';`
    }

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

router.post('/getAllergyNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='Allergy'`;

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

router.post('/deleteTransaction_allergies', (req,res)=>{
    const id =req.body.id;

    const command =`delete from transaction_allergies where id=${id};`;

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