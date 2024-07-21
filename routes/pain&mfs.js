const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


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
var Literality=req.body.painform.Literality
    var id=req.body.painform.id;
    console.log('id',id)
    var Pain=req.body.painform.Pain;
    var Site=req.body.painform.Site.id;
    var Orientation=req.body.painform.Orientation;
    var VAS=req.body.painform.VAS;
    var WongBakerFaces=req.body.painform.WongBakerFaces;
    var Source=req.body.painform.Source;
    var notes=req.body.painform.notes;
    var recorded_date=req.body.painform.recorded_date
    var recorded_by=req.body.painform.recorded_by
    // var notes_date=req.body.painform.notes_date
    var command ='';
    var returnmessage='S'
    if(id=='' || id=='0' || id==undefined || id==null){
     command =`INSERT INTO  transaction_pain (hospital_Id, branch_Id, patient_Id,Pain,Site,Orientation,Literality,VAS,WongBakerFaces,Source,notes,recorded_date,recorded_by,transaction_time,notes_date) values('${hospitalId}','${branchId}','${patientGuid}', '${Pain}','${Site}','${Orientation}','${Literality}','${VAS}','${WongBakerFaces}','${Source}','${notes}','${recorded_date}','${recorded_by}',now(),now())`;
}
else{
    command = `update transaction_pain set  hospital_Id='${hospitalId}',branch_Id='${branchId}',patient_Id='${patientGuid}',recorded_date='${recorded_date}', Pain='${Pain}',Site='${Site}',Orientation='${Orientation}',Literality='${Literality}',VAS='${VAS}',WongBakerFaces='${WongBakerFaces}',Source='${Source}',notes='${notes}',notes_date=now(),recorded_by='${recorded_by}',transaction_time=now() where id='${id}'`;
    returnmessage="U"
   }
   execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
   .then(result => {
    if(result){
        if(id=='' || id=='0' || id==undefined || id==null){
            var Aid=result.insertId
            command=`INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientGuid}','${hospitalId}','${recorded_by}','${notes}','${Aid}','pain',now())`
    
        }else{
            var notes_date=req.body.painform.notes_date
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
   .catch(err => logWriter(command, err));


 }) 

 router.post('/Get_PainFormData', (req,res)=>{
    var hospitalId = req.body.hospitalId;
    var branchId=req.body.branchId
    var patientguid=req.body.patientguid;
   
    console.log('Get_PainFormData');
    
    //  const command =`Select * from transaction_pain`;
      const command =`Select *,(select shortname from master_source where id=transaction_pain.Source) as SourceName,
      (select name from master_laterality where guid=transaction_pain.Literality) as LiteralityName,
      (select short_name from master_body_pain_site where id=transaction_pain.Site) as siteName from transaction_pain where hospital_Id='${hospitalId}' AND branch_Id='${branchId}' AND patient_Id='${patientguid}'`;
  
 
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
    const command =`Select * from master_painorientation where active='1'`;
 
  
     
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  
    
 })
 
 router.get('/Get_PainDataSiteAPI',(req,res)=>{
    var text=req.body.text;
    console.log('Get_PainDataSiteAPI',text);
    const command =`Select * from master_body_pain_site`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  
    
 })
 router.post('/members_lateralizablebodystructures',(req,res)=>{
    console.log(req.body);
    var data=req.body.data.referencedComponentId;
    // console.log('Get_PainDataSiteAPI',text);
    const command =`Select * from members_lateralizablebodystructures where referencedComponentId='${data}'`;
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
    var recorded_by=req.body.recorded_by
    getQuestionAnswerPoints(answerQuestion, (points) => {
        console.log("pointslllll",points);
        const command = `INSERT INTO transaction_question_answertable_mfs(patientId, branchId, HospitalId,points,recorded_by,TransactionTime) values('${Patientguid}','${branchId}','${hospitalId}','${points}','${recorded_by}',now())`;

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

router.post('/get_transactionPointsMFS', (req, res) => {
    console.log(req.body.text);
    var patientId = req.body.patientguid
    const command = `select * from transaction_question_answertable_mfs where patientId='${patientId}';`;

    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})

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
    
    var convertedDate = new Date(req.body.updateDate).toLocaleString('en-US');
    
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
router.post('/getpainNotes', (req, res) => {
    console.log(req.body.allergyId);
    var allergyId = req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='pain'`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})

router.post('/DeleteMFSpointData', (req, res) => {
    console.log(req.body.data);
    var id = req.body.data.id
    const command = `delete from transaction_question_answertable_mfs where id='${id}'`;

    execCommand(command)
        .then(result => res.json('delete'))
        .catch(err => logWriter(command, err));


})
module.exports=router;