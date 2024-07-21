const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const multer = require('multer');
const fs =require('fs');
const Globals = require('../config/configs');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log(file.originalname);
        console.log(file);
        var filepath = `${Globals.baseurl}phrdata\\Signature`;
        console.log('filepath', filepath);
        if(!fs.existsSync(filepath)){
            fs.mkdirSync(filepath,{recursive:true});
        }
        cb(null,filepath);
    },
    filename:function(req,file,cb){
        cb(null, file.originalname);
    }
})
const upload=multer({storage:storage,preservePath:true})
function fileupload(req,res,next){
    console.log('hit 2');
    upload.any("profile")(req,res,next);
    next();
    res.json('sucess')
}
router.post('/uploadFilesMetadata', fileupload,(req,res)=>{
    console.log(fileupload);
});
router.post('/uploadFilesMetadatastore',(req,res)=>{
        console.log(req.body);
        var patientID=req.body.patient_Id
        var imagepat=req.body.patient_signatures
        // command=`UPDATE master_patient_signatures
        // SET patient_signatures = '${imagepat}'
        // WHERE patient_Id = '${patientID}';
        // `
        command = `delete from master_patient_signatures where patient_Id='${patientID}' ;INSERT INTO master_patient_signatures (patient_signatures, patient_Id) values ('${imagepat}', '${patientID}')`;
        console.log(command)
        execCommand(command)
        .then(result => res.json(result))
        .catch(err=>console.log(err));
    });
    router.post('/phr_patientsignature', (req, res) => {
        var patientID=req.body.patientID
           command =`Select * from master_patient_signatures where patient_Id='${patientID}'` ;
            execCommand(command)
            .then(result => res.json(result))
            .catch(err => logWriter(command, err));
        });



        router.post('/phr_delete_signature', (req,res)=>{
            var patientID=req.body.patientID
            const command =`delete from master_patient_signatures where patient_Id='${patientID}'`;
            console.log(command);
             execCommand(command)
            .then(result => res.json('deleted'))
            .catch(err => logWriter(command, err))
        })

    module.exports = router;