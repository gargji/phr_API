const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')
const multer = require('multer')
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.file);
    // console.log("file", file.originalname.split('_').splice(0, file.originalname.split('_').length - 1).join('_'));

    var filepath = `//192.168.1.123/ngdata/healaxyapp/aman_media/${file.originalname.split('_').splice(0, file.originalname.split('_').length - 1).join('_')}`

    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
      cb(null, filepath);
    } else {
      cb(null, filepath);
    }
  },

  filename: function (req, file, cb) {
    // console.log(file.originalname.split('_').splice(-1));

    cb(null, file.originalname.split('_').splice(-1)[0])
  }
})

const upload = multer({ storage: storage })

router.all('/upload_clinic_files', upload.array('FILES', 1000), (req, res) => {
  console.log("success", req.file);
  res.json("success");

})

router.post("/InsertImageData", (req, res) => {
  let fileDetals = req.body;
  // console.log('aman pandey');
  // console.log(req.body);
//   var docName=req.body.docName;
//  var docType=req.body.docType;
//  var hospitalId=req.body.hospitalId;
//   var docPath=req.body.docPath;
//   var hospitalGuid=req.body.hospitalGuid;
     for (let i = 0; i < fileDetals.length; i++) {
      const element = fileDetals[i];
      
   
       command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) 
      VALUES ('${fileDetals[i].hospitalGuid}','aman_media/${fileDetals[i].docPath}','${fileDetals[i].docName}','${fileDetals[i].docType}','${fileDetals[i].hospitalId}','1', now());`
      
    

    
      execCommand(command)
      .then(() => console.log('Inserted'))
      .catch(err => logWriter(command, err));
     }   
     res.json('success')  
});

router.post("/getImageDetails",(req,res)=>{
  console.log('gff',req.body);
 var hospitalId=req.body.hospitalId
 


  command=`Select * from hospital_media where hospitalGuid='${hospitalId}'and docType <> 'video';`
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});


router.post('/DeleteImge_hospital_media', (req,res)=>{
  var id =req.body.id;

  const command =`delete from hospital_media where id=${id};`;
  console.log(command);

  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
  

})

router.get("/GetvideolinkData",(req,res)=>{
  console.log('gff',req.body);

 


  command=`Select * from hospital_media where docType='video';`
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
});



router.post("/InsertVideoLink", (req, res) => {
  
 
  var docName=req.body.docName;
 var docType=req.body.docType;
 var hospitalId=req.body.hospitalId;
  var docPath=req.body.docPath.videolink;
  var hospitalGuid=req.body.hospitalGuid;
  
    
      
   
       command = `INSERT INTO hospital_media (hospitalGuid,docPath, docName,docType, hospitalId,  userId, transactionTime) 
      VALUES ('${hospitalGuid}','${docPath}','${docName}','${docType}','${hospitalId}','1', now());`
      
    console.log(command);

    
      execCommand(command)
      .then(result => res.json('success'))
      .catch(err => logWriter(command, err));
        
      
});

router.post('/UpdateVideolink', (req,res)=>{
  
 

   var docPath=req.body.videolink;
   
   
  
    command =`update hospital_media set docPath='${docPath}' where docType='video'`;
      console.log(command);

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
  

  })

module.exports = router;