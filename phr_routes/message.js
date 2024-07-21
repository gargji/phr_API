const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const multer = require('multer')
const config = require('../config/configs')
const fs = require('fs')

// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const { execCommand } = require('../config/cmdExecution');
// const { logWriter } = require('../config/errorWrite');
// const { request } = require('express');
// const con = require('../config/db');

// uploading files to the main server
const storagemain = multer.diskStorage({
    destination: (req, file, cb) => {

        let destinationPath = `${config.baseurl}${file.originalname}`;
        let fileUploadPath = destinationPath.split('/').splice(0, destinationPath.split('/').length - 1).join('/');

        console.log("destinationPath", destinationPath);

        if (!fs.existsSync(fileUploadPath)) {
            fs.mkdir(fileUploadPath, { recursive: true }, (err) => {

                cb(null, fileUploadPath);
            });
        } else {
            cb(null, fileUploadPath);
        }
    },

    filename: function (req, file, cb) {
        let originalname = file.originalname;
        console.log("originalname", originalname);
        // multerFileLog(originalname);
        cb(null, originalname.split('/').splice(-1)[0]);
    },
})



// uploading files to the backup server
// const storageBack = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // DIR4 = DIR4 + collectionPath.substring(1)
//         let destinationPath = `${config.itempath}${file.originalname}`;
//         // console.log("3_", DIR4);
//         let fileUploadPath = destinationPath.split('/').splice(0, destinationPath.split('/').length - 1).join('/');

//         if (!fs.existsSync(fileUploadPath)) {
//             fs.mkdir(fileUploadPath, { recursive: true }, (err) => {
//                 cb(null, fileUploadPath);
//             });
//         } else {
//             cb(null, fileUploadPath);
//         }
//     },

//     filename: function(req, file, cb) {
//         let originalname = file.originalname;
//         cb(null, originalname.split('/').splice(-1)[0]);
//     },

// })

const destmain = multer({ storage: storagemain, preservePath: true })
// const destBack = multer({ storage: storageBack, preservePath: true })
// 

function fileUpload(req, res, next) {
    destmain.any('DATA', 1000)(req, res, next);
    // if (config.enablebackup == "Y") {
    //     destBack.any('DATA', 1000)(req, res, next);
    // }
    next();
}


// uploading actual file on server through multer
router.post('/UPLOAD_FILES', function (req, res, next) {
    console.log("HRTreeView/UPLOAD_FILES");
    // console.log("HRTreeView/UPLOAD_FILES", req);

    var noofserver = 1;
    // if (config.enablebackup == "Y") {
    //     noofserver = 2;
    // }
    var status = false;
    fileUpload(req, res, function (err) {
        // var filelength = req.query.length
        if (err instanceof multer.MulterError) {
            //console.log(err)
            res.status(500).send({ error: err })
            throw err;
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log("err2", err);
        } else {
            // if (Number(filelength) == req.files.length / noofserver && status == false) {
            //     status = true;
            //     res.json("Success");
            // }
            // res.json("Success");
        }

    });
})



//   function newGuid() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){ 
//       var r = Math.random() * 16 | 0,
//       v = c == 'x' ? r : (r & 0x3 | 0x8);
//       return v.toString(16);
//     })

// }

router.post("/Save_message", (req, res) => {
    console.log(req.body, 'vaibhav couhan')
    var Reciver_id = req.body.replyMessage.sender.guid
    var hospital_id = req.body.hospital_ID
    var branch_id = req.body.branchID
    var Subject = req.body.replyMessage.To_Subject;
    var message = req.body.replyMessage.message;
    var messagid = req.body.messagid;
    var documents = req.body.documents;
    var sender_id = req.body.sender_id
    uniqeID1 = req.body.Conversation_id;
    console.log('documents,sender_id', documents, sender_id)
    // var hospital_id='fortise123'
    // var branch_id='fortisenoida'
    if (documents == '' || documents == undefined || documents == null) {
        var document = '0'
    } else {
        var document = '1'
    }
    if (uniqeID1 == '' || uniqeID1 == '0' || uniqeID1 == undefined || uniqeID1 == null) {
        // var uniqeID1 =  newGuid();
    }
    console.log('document11111112222', document);

    console.log('uniqeID1', uniqeID1);
    // id, hospital_id, branch_id, patient_id, Reciver_id, subject_patient, sender_documents, reciver_document, sender_contant, reciver_contant, subject_reciver
    const command = `Insert into message_send_recive(messageid,hospital_id,branch_id,Reciver_id,Conversation_id,subject,document,message,SenderType,Sender_id)values('${messagid}','${hospital_id}','${branch_id}','${Reciver_id}','${uniqeID1}','${Subject}','${document}','${message}','PHR','${sender_id}')`;
    console.log(command,)
    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));
});

router.post("/getDoctor_user_registration", (req, res) => {
    console.log('vaibhav couhan')
    var text = req.body.text;
    console.log('vaibhav', text)
const command =`Select * from provider_personal_identifiers  
inner join master_provider_mypreferences on  provider_personal_identifiers.guid=master_provider_mypreferences.guid where firstname like '%${text}%' and recive_message='Yes'`;

    // const command = `Select * from provider_personal_identifiers where FirstName like '%${text}%'`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

router.post("/getmessage_detail", (req, res) => {
    console.log(req.body, 'vaibhav couhan')
    var providername = req.body.providername
    var uniqeID1 = req.body.Conversation_id;
    const command1=`SELECT message_send_recive.*, 
    CASE 
        WHEN SenderType = 'ehr' THEN ppi.firstname 
        ELSE ppi2.firstname
    END AS FirstName
FROM message_send_recive
LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = message_send_recive.Sender_id AND SenderType = 'ehr'
LEFT JOIN provider_personal_identifiers ppi2 ON ppi2.guid = message_send_recive.Reciver_id AND SenderType <> 'ehr'
WHERE  Conversation_id='${uniqeID1}' 
AND message_send_recive.Trash_by_phr = '0';select * from message_documents where  Conversation_id='${uniqeID1}'`


// const command1=`SELECT message_send_recive.*,
// CASE 
//     WHEN SenderType = 'ehr' THEN ppi.firstname
//     ELSE ppi2.firstname
// END AS FirstName,
// CASE 
//     WHEN SenderType = 'ehr' THEN ppi.Provider_picture
//     ELSE ppi2.Provider_picture
// END AS ProviderPicture
// FROM message_send_recive
// LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = message_send_recive.Sender_id AND SenderType = 'ehr'
// LEFT JOIN provider_personal_identifiers ppi2 ON ppi2.guid = message_send_recive.Reciver_id AND SenderType <> 'ehr'
// WHERE message_send_recive.Conversation_id = '${uniqeID1}' 
// AND message_send_recive.Trash_by_phr = '0';select * from message_documents where  Conversation_id='${uniqeID1}'`
    // const command1 = `select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName from message_send_recive where  Conversation_id='${uniqeID1}' ORDER BY id DESC;select * from message_documents where  Conversation_id='${uniqeID1}' `;
    //  const command2 =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName from message_send_recive where  Conversation_id='${uniqeID1}' AND sender_trash!='trsh' ORDER BY id DESC `;
    console.log('vaibhav couhan', command1)
    execCommand(command1)
        .then(result => res.json(result))
        .catch(err => logWriter(command1, err));

})
router.post("/getmessage_documents_filename", (req, res) => {
    console.log('vaibhav couhan')
    var providername = req.body.providername
    uniqeID1 = req.body.Conversation_id;
    const command = `select * from message_documents where  Conversation_id='${uniqeID1}' `;
    console.log('vaibhav couhan', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post("/getMessage_Inboxdetail", (req, res) => {
    console.log(req.body, "dddddddddddddddddddddddddddddddddddddd")
    var patientID = req.body.patientID
    console.log('vaibhav couhan1111')

    // const command = `SELECT m.*, u.completeName as FirstName, u.guid
    //     FROM message_send_recive m
    //     JOIN master_patient u ON u.guid = '${patientID}'
    //     WHERE ( Sender_id='${patientID}' or Reciver_id= '${patientID}')
        
        
    //       AND m.sender_trash <> 'trsh' 
        
       
    //     GROUP BY m.Conversation_id  
    //     ORDER BY m.id DESC    ; `;
    // const command=`select *, IF(SenderType = 'phr',(select FirstName from user_registration where guid = message_send_recive.sender_id), (select completeName from master_patient where
    //     guid = message_send_recive.sender_id) )
    //     as sender from message_send_recive where ( Sender_id='${patientID}' or Reciver_id= '${patientID}') and sender_trash<>'trsh' GROUP BY Conversation_id  ORDER BY id DESC`
    // console.log('vaibhav couhan', command)

    let command = `select *,ppi.firstname as FirstName from message_send_recive msr 
    left join provider_personal_identifiers ppi on ppi.guid=msr.Sender_id
    inner  JOIN transaction_appointment ta ON ta.patient_id = msr.Reciver_id
    where ( 
        msr.Reciver_id= '${patientID}') and msr.Trash_by_phr ='0' AND msr.SenderType='ehr'  GROUP BY msr.Conversation_id  ORDER BY msr.id DESC;`
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})



// for sentmsg
router.post("/getsentmsg", (req, res) => {
    console.log(req.body, "dddddddddddddddddddddddddddddddddddddd")
    var patientID = req.body.patient_Id
    console.log('vaibhav couhan1111')

    // const command = `SELECT m.*, u.completeName as FirstName, u.guid
    //     FROM message_send_recive m
    //     JOIN master_patient u ON u.guid = '${patientID}'
    //     WHERE ( Sender_id='${patientID}' or Reciver_id= '${patientID}')
        
        
    //       AND m.sender_trash <> 'trsh' 
        
       
    //     GROUP BY m.Conversation_id  
    //     ORDER BY m.id DESC    ; `;
    const command=`select *,ppi.firstname from message_send_recive msr
    left join provider_personal_identifiers ppi on ppi.guid=msr.Reciver_id
     where
            msr. Sender_id='${patientID}' and msr.SenderType='PHR' And msr.Trash_by_phr='0' and msr.draft is null  ORDER BY msr.id DESC;`
         
         
    console.log('vaibhav couhan', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post("/bookmark_message", (req, res) => {
    console.log('vaibhav couhan')
    uniqeID1 = req.body.Conversation_id;
    messagetype = req.body.messagetype;
    const command = `UPDATE message_send_recive
      SET Reciver_bookmark = '${messagetype}',
         
          Bookmark_by_phr = 1
      WHERE Conversation_id = '${uniqeID1}';
      `;
    console.log(command)

    console.log('vaibhav couhan', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post("/get_BookMarked_Data", (req, res) => {
    message = req.body.message;
    uniqeID1 = req.body.Conversation_id;
    patientID = req.body.patientID
    console.log('vaibhav couhan')
    // const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  sender_trash='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
    // const command = `SELECT *
    //         FROM message_send_recive
    //     WHERE ( Sender_id='${patientID}' or Reciver_id= '${patientID}')
    //     and            message_send_recive.sender_trash <> 'trsh' 
              
    //            and  Bookmark_by_phr = 1;
    //         `;

            const command = ` SELECT message_send_recive.*, 
            CASE 
                WHEN SenderType = 'ehr' THEN ppi.firstname 
                ELSE ppi2.firstname
            END AS FirstName
     FROM message_send_recive
     LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = message_send_recive.Sender_id AND SenderType = 'ehr'
     LEFT JOIN provider_personal_identifiers ppi2 ON ppi2.guid = message_send_recive.Reciver_id AND SenderType <> 'ehr'
     WHERE (Sender_id = '${patientID}' OR Reciver_id = '${patientID}')
     AND message_send_recive.Trash_by_phr = '0'
     
                    and  Bookmark_by_phr = 1;
            `;
    console.log('vaibhav couhan', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


router.post("/get_BookMarked_Datalength", (req, res) => {
  
    patientID = req.body.patientID
    console.log('vaibhav couhan')
    // const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  sender_trash='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
    // const command = `SELECT *
    //         FROM message_send_recive
    //     WHERE ( Sender_id='${patientID}' or Reciver_id= '${patientID}')
    //     and            message_send_recive.sender_trash <> 'trsh' 
              
    //            and  Bookmark_by_phr = 1;
    //         `;

            const command = ` SELECT message_send_recive.*, 
            CASE 
                WHEN SenderType = 'ehr' THEN ppi.firstname 
                ELSE ppi2.firstname
            END AS FirstName
     FROM message_send_recive
     LEFT JOIN provider_personal_identifiers ppi ON ppi.guid = message_send_recive.Sender_id AND SenderType = 'ehr'
     LEFT JOIN provider_personal_identifiers ppi2 ON ppi2.guid = message_send_recive.Reciver_id AND SenderType <> 'ehr'
     WHERE (Sender_id = '${patientID}' OR Reciver_id = '${patientID}')
     AND message_send_recive.Trash_by_phr = '0'
     
                    and  Bookmark_by_phr = 1;
            `;
    console.log('vaibhav couhan', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post("/Trash_message", (req, res) => {
    console.log('vaibhav couhan')
    uniqeID1 = req.body.Conversation_id;
    messagetype = req.body.trashmessage;
    const command = `Update message_send_recive set sender_trash='${messagetype}',
    Trash_by_phr='1'
      where  Conversation_id='${uniqeID1}';`;
    console.log(command)

    console.log('vaibhav couhan', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


router.post("/getTrashmessage_detail", (req, res) => {
    message = req.body.trshmessage;
    uniqeID1 = req.body.Conversation_id;
    patient_Id=req.body.patient_Id
    console.log('')

  const command =`  select message_send_recive.*,master_patient.completeName from message_send_recive
                       join master_patient on master_patient.guid='${patient_Id}'
   where ( Sender_id='${patient_Id}' or Reciver_id= '${patient_Id}')
    and Trash_by_phr='1'`
    // const command = `select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  sender_trash='${message}' and Trash_by_phr="1" and GROUP BY Conversation_id ORDER BY id DESC  `;
    console.log('getTrashmessage_detail', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post("/get_appointment_Data", (req, res) => {
    message = req.body.message;
    uniqeID1 = req.body.Conversation_id;
    console.log('')

    const command = `select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  SenderType='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
    console.log('getTrashmessage_detail', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post("/Draft_message", (req, res) => {
    console.log(req.body, 'vaibhav couhan draft')
    var sender = req.body.replyMessage?.sender?.guid
    var Subject = req.body.replyMessage.To_Subject;
    var message = req.body.replyMessage.message;
    var draftmessage = req.body.Draftmessage
    uniqeID1 = req.body.Conversation_id;
    var hospital_id = req.body.hospital_ID
    var branch_id = req.body.branchID
    var patient_id = req.body.patientID
    if (uniqeID1 == '' || uniqeID1 == '0' || uniqeID1 == undefined || uniqeID1 == null) {
        //   var uniqeID1 =  newGuid();
    }

    console.log('uniqeID1', uniqeID1);
    // id, hospital_id, branch_id, patient_id, Reciver_id, subject_patient, sender_documents, reciver_document, sender_contant, reciver_contant, subject_reciver
    var command = `Insert into message_send_recive(hospital_id,branch_id,Reciver_id,Conversation_id,subject,message,draft,SenderType,Sender_id)values('${hospital_id}','${branch_id}','${sender}','${uniqeID1}','${Subject}','${message}','${draftmessage}','PHR','${patient_id}')`;
    console.log('command111111111111111111111222222222222', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

});
router.post("/getmessagedraft_detail", (req, res) => {
    message = req.body.drafts;
    patientID = req.body.patientID
    console.log('draft message');
    // uniqeID1=req.body.Conversation_id;
    console.log('message', message)

    //   const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  draft='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;

    const command = `
                    select msr.*,mp.completeName from message_send_recive msr
                    join master_patient mp on mp.guid=msr.Sender_id 
                 
                     where     msr.sender_trash <> 'trsh'  and Sender_id="${patientID}" and draft="PHR_Draft"group by id;`
    //   console.log('draftmessage',command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post("/get_Riminder_data", (req, res) => {
    message = req.body.RiminderData;
    // uniqeID1=req.body.Conversation_id;
    console.log('message', message)

    const command = `select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  SenderType='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
    console.log('getTrashmessage_detail', command)
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post("/upload_documents_files", (req, res) => {
    console.log(req.body.replyMessage,'vaibhav couhan')
    var sender = req.body.replyMessage.sender?.guid
    var formdata = req.body.formDataArray;
    var id = req.body.messagid;
    var sender_id = req.body.sender_id
    uniqeID1 = req.body.Conversation_id;
    var Reciver_id = req.body.replyMessage.sender.guid
    console.log('documents,sender_id', sender_id, sender, formdata, sender_id)
    var hospital_id = 'fortise123'
    var branch_id = 'fortisenoida'
    for (var i = 0; i < formdata.length; i++) {
        var document = formdata[i].filename
        var filePath = formdata[i].filepath
        console.log('filename', formdata[i].filename, document, filePath);
        // var command=


        console.log('uniqeID1', uniqeID1);
        // id, hospital_id, branch_id, patient_id, Reciver_id, subject_patient, sender_documents, reciver_document, sender_contant, reciver_contant, subject_reciver
        var command = `Insert into message_documents( conversation_id, Message_id, sender_id, reciver_id, Document_name, Document_path)values('${uniqeID1}','${id}','${sender}','${Reciver_id}','${document}','${filePath}')`;
        execCommand(command)
            .then(result => res.json('success'))
            .catch(err => logWriter(command, err));
    }
});
router.post("/cleartrash", (req, res) => {
    console.log('rahul')
    var id = req.body.id;

    const command = `delete  from message_send_recive where id='${id}'`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

/* Patient Message New Api Start*/
router.post('/getPatientMessageReminder', (req, res) => {
    let data = req.body.payload;
    let patientId = data.patientID;
    let type = data.type;
    let command = `Select * From message_send_recive where Reciver_id='${patientId}' and Message_type='${type}'order by id desc;`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
/* Patient Message New Api End*/

//   formDataArray,Conversation_id,sender_id,replyMessage
module.exports = router;