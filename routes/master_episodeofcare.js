const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite')


router.get('/getmasterEpisodeOfcare', (req,res)=>{
   
    const command = `select * from master_episode_of_care;`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
    
});
router.get('/masterepisodetype', (req,res)=>{
   
    const command = `select * from master_episode_type;`;

    
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
    
});
router.post('/InsertmasaterEpisodeOFcare', (req,res)=>{
    console.log('episode',req.body);
    
    var hospitalId=req.body.hospitalID;
    var branchId=req.body.branchId;
  var languageid=req.body.languageId
var episodeName=req.body.data.episode_name
var episodeType=req.body.data.Episode_type
var created_by=req.body.data.created_by
var createdDate=req.body.data.createdDate
var convertedDate = new Date(req.body.data.created_on);
//  console.log('+++++++=======>',convertedDate)

 let isoDate = convertedDate;
 var d = new Date(isoDate);
 let time=d.toLocaleTimeString('en-GB');

let dateFor = d.toLocaleDateString('en-GB');
let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
var Description=req.body.data.Description
var id = req.body.data.id
var command ='';
var returnmessage="S"
if(id=='' || id==null || id==undefined){
     command = `INSERT INTO master_episode_of_care(branchid, hospital_id, episode_name, Episode_type, Description, created_on, created_by) values
    ('${branchId}','${hospitalId}','${episodeName}','${episodeType}','${Description}',now(),'${created_by}')`;

    
    
}else{
    command =`update master_episode_of_care set episode_name='${episodeName}',Episode_type='${episodeType}',Description='${Description}',created_on=now(),created_by='${created_by}' where id='${id}'`;
    returnmessage="U"
}
console.log(command);
    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
})
router.post('/changestatusofmasterEpisodeOfcare', (req,res)=>{
    var id =req.body.id;
    var status=req.body.status

    const command =`Update master_episode_of_care set active='${status}' where id='${id}';`;
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
router.post('/DeletemasterEpisodeOfCare', (req,res)=>{
    var id =req.body.id;


    const command =`Delete from master_episode_of_care where id='${id}'`;
    console.log(command);

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})
router.post('/saveEpisodeType', (req,res)=>{
    console.log('episode',req.body);
var episodeType=req.body.fromvalue.Episode_type
var created_by=req.body.fromvalue.created_by
var Description=req.body.fromvalue.Description
var id = req.body.fromvalue.id
var command ='';
var returnmessage="S"
if(id=='' || id==null || id==undefined){
     command = `INSERT INTO master_episode_type(Episode_type, created_date, created_by,Description) values
    ('${episodeType}',now(),'${created_by}','${Description}')`;

    
}else{
    command =`update master_episode_type set Episode_type='${episodeType}',Description='${Description}',created_date=now(),created_by='${created_by}' where id='${id}'`;
    returnmessage="U"
}
console.log(command);
    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
})
module.exports=router