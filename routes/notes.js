const express =require('express');
const router =express.Router();
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const multer  = require('multer');
const fs = require('fs');
const { log } = require('console');
var baseurl = 'F:\\ngdata\\healaxyapp\\'



router.get('/Getmaster_onset_duration', (req,res)=>{
    const command = `Select * from master_onset_duration`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_frequency_Pattern_Timing', (req,res)=>{
    const command = `Select * from master_frequency_pattern`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_Progression', (req,res)=>{
    const command = `Select * from master_progression`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_Quality_Character', (req,res)=>{
    const command = `Select * from maste_quality_character`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_Associated_Symptoms', (req,res)=>{
    const command = `Select * from master_associated_symptoms`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_RiskModifying_Factors', (req,res)=>{
    const command = `Select * from master_risk_modifying_factors`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})
router.get('/Getmaster_Constitutional', (req,res)=>{
    const command = `Select * from master_ros_constitutional`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
    
})

router.get('/Getmaster_endocrine', (req,res)=>{
    const command = `Select * from master_ros_endocrine`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_cardiovascular', (req,res)=>{
    const command = `Select * from master_ros_cardiovascular`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_breast', (req,res)=>{
    const command = `Select * from master_ros_breast`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_eye', (req,res)=>{
    const command = `Select * from master_ros_eyes`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_Gi', (req,res)=>{
    const command = `Select * from master_ros_gi`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_Gu', (req,res)=>{
    const command = `Select * from master_ros_gu`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    
})
router.get('/Getmaster_haematologyandlymphatics', (req,res)=>{
    const command = `Select * from master_ros_haematologyandlymphatics`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_musculoskeletalsystem', (req,res)=>{
    const command = `Select * from master_ros_musculoskeletalsystem`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_hent', (req,res)=>{
    const command = `Select * from master_ros_hent`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
    
router.get('/Getmaster_womensHealth', (req,res)=>{
    const command = `Select * from master_ros_womenshealth`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
   
router.get('/Getmaster_psychiatry', (req,res)=>{
    const command = `Select * from master_ros_psychiatry`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_pulmonary', (req,res)=>{
    const command = `Select * from master_ros_pulmonary`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_pulmonary', (req,res)=>{
    const command = `Select * from master_ros_skin`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_skin', (req,res)=>{
    const command = `Select * from master_ros_skin`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_neurology', (req,res)=>{
    const command = `Select * from master_ros_neurology`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_PhysicalExam', (req,res)=>{
    const command = `Select * from master_physicalexam_constitutional`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_PhysicalExamhentHead', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_head `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamhentEars', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_ears `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_PhysicalExamhentNose', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_nose `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamhentMouth', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_mouth `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentEyes', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_eyes `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.get('/Getmaster_PhysicalExamHentNeck', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_neck `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentEyesRightLeft', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_eyes_right_left `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentCVS', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_cvs_rate `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentPulmonary', (req,res)=>{
    const command = `Select * from master_physicalexam_pulmonary `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentAbdominal', (req,res)=>{
    const command = `Select * from master_physicalexam_abdominal `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentGU', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_gu `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentCVSRhythm', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_cvsrhythm `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentCVSHeartsounds', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_cvsheartsounds `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentCVSPulses', (req,res)=>{
    const command = `Select * from master_physicalexam_hentcvs_pulses `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamHentSkin', (req,res)=>{
    const command = `Select * from master_physicalexam_hent_skin `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamNeurological', (req,res)=>{
    const command = `Select * from master_physicalexam_neurological `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamBehavioural', (req,res)=>{
    const command = `Select * from master_physicalexam_behavioural `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_PhysicalExamMusculoskeletal', (req,res)=>{
    const command = `Select * from master_physicalexam_musculoskeletal `;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})
router.get('/Getmaster_Notes_Procedure', (req,res)=>{
    const command = `Select * from master_procedures_consent_buttons;Select * from master_procedures_consent;`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})





router.post('/getnotes_formdata', (req,res)=>{
    var formtype=req.body.data

    console.log(formtype);
   var  command=''
    if(formtype=='HPI FEVER'){
         command = `SELECT * FROM master_notes_form  where main_type='${formtype}' group by header;select * from master_notes_form where main_type='${formtype}';`;         
    }else if(formtype=='HPIHARD'){
         command = `SELECT * FROM master_notes_form  where main_type='${formtype}' group by header;select * from master_notes_form where main_type='${formtype}';`;


    }
    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})







router.post('/physicalformselectvaleu', (req,res)=>{
    var formtype=req.body.data

    
   var  command=''
    if(formtype=='physicalexam'){


         command = `SELECT * FROM physicalexam  where formname='${formtype}' group by header;select * from physicalexam where formname='${formtype}';`;
    }else {
         command = `SELECT * FROM physicalexam   WHERE formname = 'physicalexam' group by header;select * from physicalexam WHERE formname = 'physicalexam';  SELECT * FROM physicalexam WHERE formname <> 'physicalexam' GROUP BY header  ; SELECT * FROM physicalexam WHERE formname <> 'physicalexam'; SELECT * FROM physicalexam WHERE formname <> 'physicalexam'   GROUP BY formname       `;


    }
    console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

















router.get('/getRos_formdata', (req,res)=>{
    const command = `SELECT * FROM master_ros_notes_form group by header;select * from master_ros_notes_form;`;
   
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/insert_notes_data', (req,res)=>{    

    
var Hospital_Id=req.body?.Hospital_Id;
var Branch_id=req.body?.Branch_id
var Patient_id=req.body?.Patient_id
var Notes_html=req.body?.Notes_html
var Notes_Json=req.body?.Notes_Json
var notes_tabformnamee=req.body?.notestypeform
var speclityname=req.body?.speclityname
var patienttotldetail=req.body?.patientfullname_name
var finalnotes=req.body?.finallvalue_notes
var buttonname=req.body?.buttontypename

    const command = `INSERT INTO transaction_notes(Hospital_Id, Branch_id, Patient_id, Notes_html, Notes_Json,speclityname,patienhtmvalue,notestabname,save_status,finalnotes_total) values('${Hospital_Id}','${Branch_id}','${Patient_id}','${Notes_html}','${Notes_Json}','${speclityname}','${patienttotldetail}','${notes_tabformnamee}','${buttonname}','${finalnotes}')`;
    execCommand(command)
    .then(result => res.json('success'))

    .catch(err => logWriter(command, err));
})



router.post('/updateallnotesvalue_total', (req,res)=>{    

    

    var id=req.body.cardvalue.id
    var hosptialid=req.body.cardvalue.Hospital_Id
    var brancid=req.body.cardvalue.Branch_id
    var patientid=req.body.cardvalue.Patient_id
    var noteshtm=req.body.cardvalue.Notes_html
    var notesjson=req.body.cardvalue.Notes_Json
    var datetime=req.body.cardvalue.Date
    var patienthtmlvalue=req.body.cardvalue.patienhtmvalue
    var savestaus=req.body.cardvalue.save_status
    var speclityname=req.body.cardvalue.speclityname
    var notestabname=req.body.cardvalue.notestabname
    var finalnotes=req.body.cardvalue.finalnotes_total
const command=`update  transaction_notes  set Hospital_Id='${hosptialid}', Branch_id='${brancid}', Patient_id='${patientid}', Notes_html='${noteshtm}',Notes_Json='${notesjson}', Date='${datetime}', patienhtmvalue='${patienthtmlvalue}', save_status='${savestaus}', speclityname='${speclityname}', notestabname='${notestabname}', finalnotes_total='${finalnotes}'  where id='${id}'`

console.log(command);
    
    execCommand(command)
    .then(result => res.json('success'))

    .catch(err => logWriter(command, err));
})









router.post('/signnotesdisplay', (req,res)=>{    
    var patientguid=req.body.patientguid
    
    const command = `Select * from  transaction_notes  where save_status='sign' AND Patient_id='${patientguid}' order by id desc `;
    execCommand(command)
    .then(result => res.json(result))

    .catch(err => logWriter(command, err));
})





router.post('/notesalldatadisplay', (req,res)=>{    
    var patientid=req.body?.patientid
 
        const command = `Select * from  transaction_notes  where save_status='save'  and Patient_id='${patientid}'  order by id desc  `;
        execCommand(command)
        .then(result => res.json(result))
    
        .catch(err => logWriter(command, err));
    })



    router.post('/deletenotes', (req,res)=>{   
        
        notesid=req.body.id
 
        const command = `delete from  transaction_notes  where id='${notesid}'`;
        execCommand(command)
        .then(result => res.json('delete'))
    
        .catch(err => logWriter(command, err));
    })



    




router.get('/getphysical_formdata', (req,res)=>{
    const command = `SELECT * FROM physicalexam_notes group by header;select * from physicalexam_notes;`;
   
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/post_search_api', (req,res)=>{
    var form_name=req.body.form_name
    const command = `SELECT * FROM master_hpi_form  where form_name like '${form_name}%' `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



router.post('/geprocedure_note', (req,res)=>{
    var formtype=req.body.data

  var  command=''

if(formtype=='Preanesthetic checkup (PAC)'){
     command = `SELECT * FROM master_procedure_data_v  where main_form_name='${formtype}'  group by header  ;select * from master_procedure_data_v   where main_form_name='${formtype}'  ;select * from master_procedure_data_v where main_form_name='${formtype}'  group by formname ORDER BY ordersequence `;
    
}

else if(formtype=='Procedure-Anesthesia'){

    command = `SELECT * FROM master_procedure_data_v  where main_form_name='${formtype}'  group by header  ;select * from master_procedure_data_v   where main_form_name='${formtype}'  ;select * from master_procedure_data_v where main_form_name='${formtype}'  group by formname ORDER BY ordersequence `;
}

else{
    command = `SELECT * FROM master_procedure_data_v  where main_form_name='${formtype}' or sametype = '1'   group by header  ;select * from master_procedure_data_v   where main_form_name='${formtype}'  or sametype = '1'  ;select * from master_procedure_data_v where main_form_name='${formtype}' or sametype = '1' group by formname ORDER BY ordersequence `;

}
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})








router.post('/provider_search_api', (req,res)=>{
    names=req.body.name

    const command = `SELECT * FROM master_refering_provider  where name like '${names}%' `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



router.post('/indication_search_api', (req,res)=>{
    terms=req.body.term


    const command = `SELECT * FROM description_snapshot  where term like '${terms}%' `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.get('/ml_search_api', (req,res)=>{


    const command = `SELECT * FROM master_quantity   `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})






router.post('/procedureform_search', (req,res)=>{
    form_name=req.body.formname

    
    const command = `SELECT * FROM masterprocedureform  where formname like '${form_name}%' `;

    
    execCommand(command)    
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.get('/procedureform_search_all', (req,res)=>{


    const command = `SELECT * FROM masterprocedureform   `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



router.get('/hpiselectform', (req,res)=>{


    const command = `SELECT * FROM master_hpi_form`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.get('/physicalexamformall', (req,res)=>{


    const command = `SELECT * FROM physicalexamm_form`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})








router.get('/getphysicalexamall', (req,res)=>{
    const command = `SELECT * FROM physicalexam   WHERE formname = 'physicalexam' group by header;select * from physicalexam WHERE formname = 'physicalexam';  SELECT * FROM physicalexam WHERE formname <> 'physicalexam' GROUP BY header  ; SELECT * FROM physicalexam WHERE formname <> 'physicalexam'; SELECT * FROM physicalexam WHERE formname <> 'physicalexam'   GROUP BY formname       `;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})





router.get('/getneckvalue', (req,res)=>{
    const command = `SELECT * FROM master_neckvalue `;
   
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/uploadProfile',fileupload, (req, res) => {
    console.log(fileupload);
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        var path = baseurl + file.originalname
       path =  path.substring(0, path.lastIndexOf("\\"));
        
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        //   cb(null, "\\\\192.168.1.123\\ngdata\\healaxyapp\\Hospital_data\\patientData\\profilepicture")
        cb(null, path);
    },
    filename: function (req, file, cb) {
        var name =   file.originalname.replace(/^.*[\\\/]/, '')     
      cb(null, name )
      
    }
  })
  
  const upload = multer({ storage: storage,preservePath:true })

  function fileupload(req,res,next){
      upload.array("profile")(req,res,next);
      next();
      res.json('success')
  }



  
router.get('/get_notes_id', (req,res)=>{


    const command = `SELECT * FROM transaction_notes ORDER BY id DESC LIMIT 1;`;

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})










router.post('/updatenotes_sign', (req,res)=>{
    value_id=req.body.value_id_notes
    signstatus=req.body.noteslockstatus

    sign_by_userid=req.body.sign_by

    
    // const command = `SELECT * FROM masterprocedureform  where formname like '${form_name}%' `;
    const command =`Update transaction_notes set noteslockstatus='${signstatus}',sign_by='${sign_by_userid}' where id='${value_id}';`;
    
    
    execCommand(command)    
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



module.exports = router;

