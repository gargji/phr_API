const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')
router.post('/InsertEpisodeOFcare', (req,res)=>{
    console.log('episode',req.body);
    var patientid=req.body.patientId;
    var hospitalId=req.body.hospitalID;
    var branchId=req.body.branchId;
  var languageid=req.body.languageId
var episodeName=req.body.data.episodeName
var episodeType=req.body.data.episodeType
var createdDate=req.body.data.createdDate
var convertedDate = new Date(req.body.data.createdDate);
//  console.log('+++++++=======>',convertedDate)

 let isoDate = convertedDate;
 var d = new Date(isoDate);
 let time=d.toLocaleTimeString('en-GB');

let dateFor = d.toLocaleDateString('en-GB');
let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
var notes=req.body.data.notes

    const command = `INSERT INTO episode_of_care(patientid, hospitalId, branchId, episodeName, episodeType,createdDate, notes, languageid) values
    ('${patientid}','${hospitalId}','${branchId}','${episodeName}','${episodeType}','${databaseDate}','${notes}','${languageid}')`;

    console.log(command);
    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    
    
})
router.post('/InsertEpisodeOFcareOftrackAPI', (req,res)=>{
  console.log('episode',req.body);
  var patientid=req.body.patientId;
  var hospitalId=req.body.hospitalID;
  EpisodeId=req.body.id
  var branchId=req.body.branchId;
var languageid=req.body.languageId
var episodeName=req.body.data.episode_name
var episodeType=req.body.data.Episode_type
var createdDate=req.body.data.created_on
// var convertedDate = new Date(req.body.data.createdDate);
// //  console.log('+++++++=======>',convertedDate)

// let isoDate = convertedDate;
// var d = new Date(isoDate);
// let time=d.toLocaleTimeString('en-GB');

// let dateFor = d.toLocaleDateString('en-GB');
// let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
var notes=req.body.data.Description

  const command = `INSERT INTO episode_of_care(patientid, hospitalId, branchId, episodeName, episodeType,createdDate, notes, languageid) values
  ('${patientid}','${hospitalId}','${branchId}','${episodeName}','${episodeType}',now(),'${notes}','${languageid}')`;

  console.log(command);
  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
  
  
})
router.post('/gettransactionEpisodeOfCare', (req,res)=>{

  var patientId=req.body.patientguid
  var branchId=req.body.branchId
  var hospitalId=req.body.hospitalId


  const command = `Select *,(select name from  master_episode_care_action where id=episode_of_care.Status) as action  from episode_of_care where patientid='${patientId}' AND branchId='${branchId}' AND hospitalId='${hospitalId}'`;

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  
  
})
router.get('/getmaster_episode_care_action', (req,res)=>{

  const command = `Select *  from master_episode_care_action;`;

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  
  
})

router.post("/updateStatusofEpisode",(req,res)=>{
  console.log(req.body);
  var status=req.body.status
  var Data=req.body.data

  let i = 0;
    (function loop(){
      if (i < Data.length) {
       var command = ''
         command = `update episode_of_care set Status='${status}' where id='${Data[i].id}';`
 console.log(command);
        
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
   

})
module.exports=router