const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.post('/getTransaction_alergiesData', (req,res)=>{
    var patientguid=req.body.patientguid;
    console.log(patientguid);

    const command = `Select *,(select name from master_severity where guid=transaction_allergies.Severity) as SeverityName,(select shortname from master_source where id=transaction_allergies.source) as SourceName,(select name from master_allergy_intolerance_type where id=transaction_allergies.AllergyIntoleranceType) as AllergyIntoleranceTypeName,(select displayname from master_manifestation_long where guid=transaction_allergies.manifastation) as manifastationName,(select name from master_allergens_new where auto_id=transaction_allergies.AllergyId) as AllergenName from transaction_allergies where patientguid='${patientguid}' and Resolve_status=0 order by priority`;

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
    const command = `Select * from master_allergens_new where defaults=1`;

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
    var display_name = req.body.text
    var type=req.body.type
    console.log(type);
    var command=''
   
        command = `select * from master_allergens_new where name like '${display_name}%' and type='${type}';`;
    

    
  

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
    var AllergyId = req.body.data.allergyId.auto_id
    let DateOfOnSet = formatDate(req.body.data.DateOfOnSet)

    // // let DateOfOnSet = req.body.data.DateOfOnSet
    //     var convertedDate = new Date(req.body.data.DateOfOnSet)
    //  let isoDate = convertedDate;
    //  var d = new Date(isoDate);
    //  let time = d.toLocaleTimeString('en-GB');
    //  let timeWithoutSeconds = time.slice(0, 5);
    //  let timeWithoutSecondsFormatted = timeWithoutSeconds.split(':').join('');
    // let dateFor = d.toLocaleDateString('en-GB');
    // let databaseDate = `${dateFor.split('/')[0]}-${dateFor.split('/')[1]}-${dateFor.split('/')[2]}`
    var manifastation = req.body.data.manifastation
    var clinicStatus=req.body.data.clinicStatus
    var DateOfResolution=req.body.data.DateOfResolution
    
    var Severity=req.body.data.Severity
    var Exposure_routes=req.body.data.Exposure_routes;
    var First_occurance=req.body.data.First_occurance
    var last_occurance=formatDate(req.body.data.last_occurance)
    var source=req.body.data.source
    var recorded_by=req.body.data.recorded_by
    var recorded_date=req.body.data.recorded_date
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
        command = `INSERT INTO transaction_allergies(patientguid,branch_Id,hospital_id,AllergyIntoleranceType,criticality,AllergyId,DateOfOnSet,manifastation,clinicStatus,DateOfResolution,Severity,Exposure_routes,First_occurance,last_occurance,source,recorded_by,recorded_date,notes,priority,notes_date,transaction_time) values
        ('${patientguid}','${branch_Id}','${hospitalId}','${AllergyIntoleranceType}','${criticality}','${AllergyId}','${DateOfOnSet}','${manifastation}','${clinicStatus}','${DateOfResolution}','${Severity}','${Exposure_routes}','${First_occurance}','${last_occurance}','${source}','${recorded_by}','${recorded_date}','${notes}','${priority}', now(), now())`;
    }
    

    else{
         command = `update transaction_allergies set AllergyIntoleranceType='${AllergyIntoleranceType}',criticality='${criticality}',AllergyId='${AllergyId}',DateOfOnSet='${DateOfOnSet}',manifastation='${manifastation}',clinicStatus='${clinicStatus}',DateOfResolution='${DateOfResolution}',Severity='${Severity}',Exposure_routes='${Exposure_routes}',First_occurance='${First_occurance}',last_occurance='${last_occurance}',source='${source}',recorded_by='${recorded_by}',recorded_date='${recorded_date}',notes='${notes}',transaction_time=now() where id='${id}'`;
        returnmessage="U"
    }
    console.log(command);
    console.log('DateOfOnSet',DateOfOnSet);
   execCommand(command.replace(/null/g, '').replace(/undefined/g,''))
    .then(result => {
        if(result){
            if(id=='' || id=='0' || id==undefined || id==null){
                var Aid=result.insertId
                command=`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientguid}','${hospitalId}','${recorded_by}','${notes}','${Aid}','Allergy',now())`
        
            }else{
                var notes_date=req.body.data.notes_date
                console.log('notesdate',notes_date);
                command=`update allergy_notes set  notes='${notes}',date=now() where date='${notes_date}'`

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
    .catch(err => {
        logWriter(command, err)
    });
    // console.log(sql);

    // command=`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`

    // db.query(command, (err, result) => {
    //     if (err) {
    //         res.json({ status: 'fail', error: err });
    //     } else {
    //         res.json(returnmessage);
    //     }
    // });
    
});

function formatDate(dateToBeFormatted){
    if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
        var convertedDate = new Date(dateToBeFormatted)
        let isoDate = convertedDate;
        var d = new Date(isoDate);
        let time = d.toLocaleTimeString('en-GB');
        let timeWithoutSeconds = time.slice(0, 5);
        let timeWithoutSecondsFormatted = timeWithoutSeconds.split(':').join('');
       let dateFor = d.toLocaleDateString('en-GB');
       let databaseDate = `${dateFor.split('/')[0]}-${dateFor.split('/')[1]}-${dateFor.split('/')[2]}`
        return databaseDate
    }
    else{
        return ''
    }
 }

router.post('/insertAllergyNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.patientguid
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes.replace('"','""').replace("'","''")
    var allergyId=req.body.data.id
    var categeory= 'Allergy'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command.replace(/null/g, ''))
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})

router.post('/insertAllergyNotes',(req,res)=>{
    console.log(req.body.data);

    var patientId = req.body.data.patientguid
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes.replace('"','""').replace("'","''")
    var allergyId=req.body.data.id
    var categeory= 'Allergy'

 
    const command =`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command.replace(/null/g, ''))
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
})
router.post('/updateAllergynotes', (req,res)=>{
    // console.log(req.body.date);
    // var date = new Date(req.body.date)
    // date = date.getTime()
    // var convertedDate = new Date(date).toLocaleString("en-in",{timeZone: 'GMT +05:30'})
    var convertedDate = new Date(req.body.date);
    //  console.log('+++++++=======>',convertedDate)
    
     let isoDate = convertedDate;
     var d = new Date(isoDate);
     let time=d.toLocaleTimeString('en-GB');
    let dateFor = d.toLocaleDateString('en-GB');
    let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
// var patientId=req.body.data.patientId
    var id =req.body.id;
    var notes=req.body.notes.replace('"','""').replace("'","''")
//    var date=req.body.date
    const command =`update allergy_notes set  notes='${notes}',date='${databaseDate} ${time}' where id=${id}`;
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

router.post('/updateAllergynotesONly', (req,res)=>{
    // console.log(req.body.date);
    // var date = new Date(req.body.date)
    // date = date.getTime()
    // var convertedDate = new Date(date).toLocaleString("en-in",{timeZone: 'GMT +05:30'})
    // var convertedDate = new Date(req.body.date).toLocaleString('en-US');
    var convertedDate = new Date(req.body.date);
    //  console.log('+++++++=======>',convertedDate)
    
     let isoDate = convertedDate;
     var d = new Date(isoDate);
     let time=d.toLocaleTimeString('en-GB');
    let dateFor = d.toLocaleDateString('en-GB');
    let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
    console.log(convertedDate);

// var patientId=req.body.data.patientId
    var id =req.body.id;
    var notes=req.body.notes.replace('"','""').replace("'","''")
   var date=req.body.date
    const command =`update transaction_allergies set  notes='${notes}',notes_date='${databaseDate} ${time}' where id=${id}`;
console.log(command);
    execCommand(command.replace(/null/g, ''))
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

    execCommand(command.replace(/null/g, ''))
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
router.post('/getOnlyAllergyNotes', (req,res)=>{
    console.log(req.body.allergyId);
    var allergyId=req.body.allergyId
    const command = `Select notes,id,branch_Id,patientguid,recorded_by,transaction_time from transaction_allergies where id='${allergyId}';`;

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

    execCommand(command.replace(/null/g, ''))
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
            execCommand(multiQuery.replace(/null/g, ''))
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