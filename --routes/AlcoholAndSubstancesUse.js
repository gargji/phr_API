const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')


router.post('/getTransaction_alcohol_and_substances_use', (req, res) => {
    console.log('petgcdgf', req.body);
    var patientId = req.body.patientguid
    const command = `Select * from transaction_alcohol_and_substances_use where patientId='${patientId}'`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.post('/AddUpdateTransaction_alcohol_and_substances_use', (req, res) => {
    console.log("judsvhjug", req.body.data);
    console.log('hdbhjd', req.body);
    var Patientguid = req.body.patientguid
    var branchId = req.body.branchId;
    var hospitalId = req.body.hospitalId;
    var DrugUse = req.body.data.DrugUse
    var SubstanceUseType = req.body.data.SubstanceUseType
    var UsePerweek = req.body.data.UsePerweek
    var SubstanceUseCounselling = req.body.data.SubstanceUseCounselling
    var SubstanceUseNotes = req.body.data.SubstanceUseNotes
    var AlcoholUse = req.body.data.AlcoholUse
    var Glassesofwine = req.body.data.Glassesofwine
    var Cansofbeer = req.body.data.Cansofbeer
    var ShotsofLiquor = req.body.data.ShotsofLiquor
    var StandardDrinksOrEquivalent = req.body.data.StandardDrinksOrEquivalent
    var AlcoholCounselling = req.body.data.AlcoholCounselling
    var AlcoholNotes = req.body.data.AlcoholNotes
    var id = req.body.data.id
    var command = '';
    var returnmessage = "S"
    if (id == '' || id == '0' || id == undefined || id == null) {

        command = `INSERT INTO transaction_alcohol_and_substances_use(patientId, branchId, HospitalId, DrugUse, SubstanceUseType, UsePerweek, SubstanceUseCounselling, SubstanceUseNotes, AlcoholUse,Glassesofwine, Cansofbeer, ShotsofLiquor, StandardDrinksOrEquivalent, AlcoholCounselling, AlcoholNotes,transaction_time) values
        ('${Patientguid}','${branchId}','${hospitalId}','${DrugUse}','${SubstanceUseType}','${UsePerweek}','${SubstanceUseCounselling}','${SubstanceUseNotes}','${AlcoholUse}','${Glassesofwine}','${Cansofbeer}','${ShotsofLiquor}','${StandardDrinksOrEquivalent}','${AlcoholCounselling}','${AlcoholNotes}', now())`;
    }
    else {
        command = `update transaction_alcohol_and_substances_use set DrugUse='${DrugUse}',SubstanceUseType='${SubstanceUseType}',UsePerweek='${UsePerweek}',SubstanceUseCounselling='${SubstanceUseCounselling}',SubstanceUseNotes='${SubstanceUseNotes}',AlcoholUse='${AlcoholUse}',Glassesofwine='${Glassesofwine}',Cansofbeer='${Cansofbeer}',ShotsofLiquor='${ShotsofLiquor}',StandardDrinksOrEquivalent='${StandardDrinksOrEquivalent}',AlcoholCounselling='${AlcoholCounselling}',AlcoholNotes='${AlcoholNotes}',transaction_time=now() where id='${id}'`;
        returnmessage = "U"
    }

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
router.get('/getQuestionAnswer', (req, res) => {
    console.log('petgcdgf', req.body);
    var Patientguid = req.body.patientguid
    const command = `Select * from master_answer_alcohol_and_substances_use order by priority; Select * from master_question_alcohol_and_substances_use_ order by priority`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})

router.post('/InsertQuestionAnswerTransactiontable', (req, res) => {
    console.log('asdf');
    var Patientguid = req.body.patientguid
    var branchId = req.body.branchId;
    var hospitalId = req.body.hospitalId;
    var typeForm = req.body.formType;
    var answerQuestionCage = req.body.answedQuestionsAuditC
    getQuestionAnswerPoints(answerQuestionCage, (points) => {
        console.log("pointslllll",points);
        const command = `INSERT INTO transaction_question_answertable_alcohol_and_substances_use( patientId, branchId, HospitalId,typeForm, points,TransactionTime) values('${Patientguid}','${branchId}','${hospitalId}','${typeForm}','${points}',now())`;

        console.log(command);
        execCommand(command)
            .then(result => res.json('success'))
            .catch(err => logWriter(command, err));
    })

})

function getQuestionAnswerPoints(answerQuestionCage, callback) {
    console.log("answerQuestionCage", answerQuestionCage);
    let i = 0;
    let points = 0;
    (function loop() {
        if (i < answerQuestionCage.length) {
            let commond = `SELECT points from master_answer_alcohol_and_substances_use WHERE QuestionId='${answerQuestionCage[i].Question}' AND id='${answerQuestionCage[i].Answer}';`
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

        if (i == answerQuestionCage.length) {
            console.log("pointskkkk",points);
            return callback(points)
        }
    })();

}
// router.post('/getpointsfromtransationMFS',(req,res)=>{
//      var Patientguid = req.body.patientguid
//      var branchId = req.body.branchId;
//      var hospitalId = req.body.hospitalId;
//     getPointsofMFS(Patientguid, branchId, hospitalId,(result)=>{
//     console.log(result);
//     res.json(result[0]);
//     })
    
//     })
router.post('/getpointsfromtransationmaster' , (req,res)=>{
    // console.log(req.body);
 var patientId=req.body.patientguid
var typeForm=req.body.formType
getPointsoftransatctionmaster(patientId, typeForm,(result)=>{
    console.log(result);
    res.json(result[0]);
    })
})

    function getPointsoftransatctionmaster(patientId, typeForm,callback){
        
     let command= `Select points from  transaction_question_answertable_alcohol_and_substances_use where patientId='${patientId}' and typeForm='${typeForm}' order by id desc;`
    console.log(command);
    execCommand(command)
    .then(result =>{
 console.log(result);
    return callback(result); 
    } )
 .catch(err => logWriter(command, err));
    }
    


router.post('/get_master_procedure_history', (req, res) => {
    console.log(req.body.text);
    const display_name = req.body.text

    const command = `select * from master_procedure_history where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.post('/get_masterclinichospital', (req, res) => {
    console.log(req.body.text);
    const display_name = req.body.text

    const command = `select * from masterclinichospital where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.post('/getAllergyNotesToAlcoholAndSubstancesUse', (req, res) => {
    console.log(req.body.allergyId);
    var allergyId = req.body.allergyId
    const command = `Select * from allergy_notes where allergyId='${allergyId}' and categeory='AlcoholAndSubstancesUse'`;

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.post('/insertAlcoholAndSubstancesUseNotes', (req, res) => {
    console.log(req.body.data);

    var patientId = req.body.data.Patientguid
    var hospitalId = req.body.hospitalId
    var doctorId = req.body.doctorName
    var notes = req.body.notes
    var allergyId = req.body.data.id
    var categeory = 'AlcoholAndSubstancesUse'


    const command = `INSERT INTO  allergy_notes(patientId,hospitalId,doctorId,notes,allergyId,categeory,date) values('${patientId}','${hospitalId}','${doctorId}','${notes}','${allergyId}','${categeory}',now())`;

    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
})
router.post('/get_master_performer', (req, res) => {
    console.log(req.body.text);
    const display_name = req.body.text

    const command = `select * from master_performer where name like '%${display_name}%';`;

    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));


})
router.post('/deleteTransaction_alcohol_and_substances_use', (req, res) => {
    const id = req.body.id;

    const command = `delete from transaction_alcohol_and_substances_use where id=${id};`;

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

router.post('/lockUnlocktransaction_alcohol_and_substances_use', (req, res) => {
    var id = req.body.id;
    var status = req.body.status;

    const command = `Update transaction_alcohol_and_substances_use set lockStatus='${status}' where id='${id}';`;
console.log(command);
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
module.exports = router