const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const multer  = require('multer')
// const config  =require('../config/configs')
const fs=require('fs')

// uploading files to the main server
const storagemain = multer.diskStorage({
    destination: (req, file, cb) => {

        let destinationPath = `${config.itempath}${file.originalname}`;
        let fileUploadPath = destinationPath.split('/').splice(0, destinationPath.split('/').length - 1).join('/');

        console.log("destinationPath", destinationPath);

        if (!fs.existsSync(fileUploadPath)) {
            fs.mkdir(fileUploadPath, { recursive: true }, (err) => {

                cb(null, fileUploadPath);
            });
        } else {
            // cb(null, fileUploadPath);
        }
    },

    filename: function(req, file, cb) {
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
    if (config.enablebackup == "Y") {
        destBack.any('DATA', 1000)(req, res, next);
    }
    next();
}


// uploading actual file on server through multer
router.post('/UPLOAD_FILES', function(req, res, next) {
    console.log('',req.body);
   
    // console.log("HRTreeView/UPLOAD_FILES", req);

    var noofserver = 1;
    // if (config.enablebackup == "Y") {
    //     noofserver = 2;
    // }
    var status = false;
    fileUpload(req, res, function(err) {
        // var filelength = req.query.length
        // next();
        // res.json('success')
        if (err instanceof multer.MulterError) {
            //console.log(err)
           
            res.status(200).send({ error: err })
            
            throw err;
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log("err2", err);
        // } else {
            // if (Number(filelength) == req.files.length / noofserver && status == false) {
            //     status = true;
               
            // }
            // res.json("Success");
        }
        else{
            // res.json("Success");
            var result='Success'
            console.log('',result);
        }
        // upload.array("profile")(req,res,next);
        // next();
        // res.json('success')
    })
})

router.post("/Save_message", (req, res) => {
    console.log('deepak dixit')
    var sender=req.body.replyMessage.sender.guid
    var Subject = req.body.replyMessage.To_Subject;
    var message = req.body.replyMessage.message;
    var messagid = req.body.messagid;
    var documents=req.body.documents;
    var sender_id=req.body.sender_id.guid;

    uniqeID1=req.body.Conversation_id;
    console.log('documents,sender_id',documents,sender_id)
    var hospital_id='fortise123'
    var branch_id='fortisenoida'
    if(documents=='' || documents==undefined || documents==null){
      var document='0'
    }else
    {
       var document='1' 
    }
    if(uniqeID1=='' || uniqeID1=='0' || uniqeID1==undefined || uniqeID1==null){
    // var uniqeID1 =  newGuid();
    }
    console.log('document11111112222',document);

    console.log('uniqeID1',uniqeID1);
    // id, hospital_id, branch_id, patient_id, Reciver_id, subject_patient, sender_documents, reciver_document, sender_contant, reciver_contant, subject_reciver
  
    var command = `Insert into message_send_recive(messageid,hospital_id,branch_id,Sender_id,Reciver_id,Conversation_id,subject,document,message,SenderType)values('${messagid}','${hospital_id}','${branch_id}','${sender_id}','${sender}','${uniqeID1}','${Subject}','${document}','${message}','ehr')`;
    console.log(command);
   execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
  });

  router.post("/getDoctor_user_registration", (req, res) => {
    console.log('vaibhav couhan')
    var text=req.body.text;
    console.log('vaibhav',text)
        const command =`Select * from master_patient where displayName like '%${text}%'`;
    console.log(command);
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
  });
  
  router.post("/getmessage_detail",(req,res)=>{
  console.log('vaibhav couhan')
     var providername=req.body.providername
    var uniqeID1=req.body.Conversation_id;
     const command1 =`select *, IF(SenderType = 'ehr',(select FirstName from user_registration where guid = message_send_recive.sender_id), (select completeName from master_patient where guid = message_send_recive.sender_id) ) as sender from message_send_recive where  Conversation_id='${uniqeID1}' ORDER BY id DESC;select * from message_documents `;
    //  const command2 =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName from message_send_recive where  Conversation_id='${uniqeID1}' AND sender_trash!='trsh' ORDER BY id DESC `;
      console.log('vaibhav couhan1111111111111111111',command1)
      execCommand(command1)
      .then(result => res.json(result))
      .catch(err => logWriter(command1, err));

  })
   router.post("/getmessage_documents_filename",(req,res)=>{
  console.log('vaibhav couhan')
     var providername=req.body.providername
     uniqeID1=req.body.Conversation_id;
      const command =`select * from message_documents where  Conversation_id='${uniqeID1}' `;
      console.log('vaibhav couhan',command)
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  })
  
  router.post("/getpatientinformation",(req,res)=>{
    console.log('vaibhav couhan')
       var providername=req.body.providername
          const command =` SELECT guid,completeName FROM master_patient where guid='${providername}'`;  
        console.log('vaibhav couhan',command)
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
      

       }
    
)

  router.get("/getMessage_Inboxdetail",(req,res)=>{
    console.log('getMessage_Inboxdetail')
        // const command1 =`select *,(select FirstName from master_patient where guid=message_send_recive.Reciver_id) as displayName from message_send_recive where  Conversation_id='${uniqeID1}' ORDER BY id DESC; `;
        // const command =`select *,(select FirstName from master_patient where guid=message_send_recive.Reciver_id) as displayName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  SenderType='ehr' AND sender_trash<>'trsh'  AND Reciver_bookmark<>'bookmark'GROUP BY Conversation_id  ORDER BY id DESC  `;
       
        const command =`select *, IF(SenderType = 'ehr',(select FirstName from user_registration where guid = message_send_recive.sender_id), (select completeName from master_patient where guid = message_send_recive.sender_id) ) as sender from message_send_recive where  SenderType='ehr' AND sender_trash<>'trsh'  AND Reciver_bookmark<>'bookmark'GROUP BY Conversation_id  ORDER BY id DESC  `;
        console.log('vaibhav couhan2222222222222222222',command)
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    })
    router.post("/bookmark_message",(req,res)=>{
      console.log('vaibhav couhan')
      uniqeID1=req.body.Conversation_id;
      messagetype=req.body.messagetype;
      const command =`Update message_send_recive set Reciver_bookmark='${messagetype}' where  Conversation_id='${uniqeID1}';`;
      console.log(command)
          console.log('vaibhav couhan',command)
          execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
      })
      
      router.post("/get_BookMarked_Data",(req,res)=>{
        message=req.body.message;
        uniqeID1=req.body.Conversation_id;
        console.log('vaibhav couhan')
        // const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  sender_trash='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
            const command =`select *, IF(SenderType = 'ehr',(select FirstName from user_registration where guid = message_send_recive.sender_id), (select completeName from master_patient where guid = message_send_recive.sender_id) ) as sender from message_send_recive where  Reciver_bookmark='${message}' AND  sender_trash<>'trsh' GROUP BY Conversation_id ORDER BY id DESC  `;
            console.log('vaibhav couhan',command)
            execCommand(command)
            .then(result => res.json(result))
            .catch(err => logWriter(command, err));
        }) 
          router.post("/Trash_message",(req,res)=>{
            console.log('vaibhav couhan')
            uniqeID1=req.body.Conversation_id;
            messagetype=req.body.trashmessage;
            const command =`Update message_send_recive set sender_trash='${messagetype}' where  Conversation_id='${uniqeID1}';`;
            console.log(command)
              
                console.log('vaibhav couhan',command)
                execCommand(command)
                .then(result => res.json(result))
                .catch(err => logWriter(command, err));
            })


            router.post("/getTrashmessage_detail",(req,res)=>{
              message=req.body.trshmessage;
              uniqeID1=req.body.Conversation_id;
              console.log('')
             
                  const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  sender_trash='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
                  console.log('getTrashmessage_detail',command)
                  execCommand(command)
                  .then(result => res.json(result))
                  .catch(err => logWriter(command, err));
              })
              router.post("/get_appointment_Data",(req,res)=>{
                message=req.body.message;
                uniqeID1=req.body.Conversation_id;
                console.log('')
               
                    const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  SenderType='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
                    console.log('getTrashmessage_detail',command)
                    execCommand(command)
                    .then(result => res.json(result))
                    .catch(err => logWriter(command, err));
                })
                router.post("/Draft_message", (req, res) => {
                  console.log('vaibhav couhan draft')
                  var sender=req.body.replyMessage.sender.guid
                  var Subject = req.body.replyMessage.To_Subject;
                  var message = req.body.replyMessage.message;
                  var draftmessage=req.body.Draftmessage
                  uniqeID1=req.body.Conversation_id;
                  var hospital_id='fortise123'
                  var branch_id='fortisenoida'
                  if(uniqeID1=='' || uniqeID1=='0' || uniqeID1==undefined || uniqeID1==null){
                //   var uniqeID1 =  newGuid();
                  }
              
                  console.log('uniqeID1',uniqeID1);
                  // id, hospital_id, branch_id, patient_id, Reciver_id, subject_patient, sender_documents, reciver_document, sender_contant, reciver_contant, subject_reciver
                  var command = `Insert into message_send_recive(messageid,hospital_id,branch_id,Sender_id,Reciver_id,Conversation_id,subject,document,message,SenderType)values('${messagid}','${hospital_id}','${branch_id}','${sender_id}','${sender}','${uniqeID1}','${Subject}','${document}','${message}','ehr')`;
                 console.log('command111111111111111111111222222222222',command)
                 execCommand(command)
                 .then(result => res.json(result))
                 .catch(err => logWriter(command, err));
                
                });
                router.post("/getmessagedraft_detail",(req,res)=>{
                  message=req.body.drafts;
                  // uniqeID1=req.body.Conversation_id;
                  console.log('message',message)
                 
                      const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  SenderType='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
                      console.log('getTrashmessage_detail',command)
                      execCommand(command)
                      .then(result => res.json(result))
                      .catch(err => logWriter(command, err));
                  })
                  router.post("/get_Riminder_data",(req,res)=>{
                    message=req.body.RiminderData;
                    // uniqeID1=req.body.Conversation_id;
                    console.log('message',message)
                   
                        const command =`select *,(select FirstName from user_registration where guid=message_send_recive.Reciver_id) as FirstName ,(select guid from user_registration where guid=message_send_recive.Reciver_id) as guid from message_send_recive where  SenderType='${message}' GROUP BY Conversation_id ORDER BY id DESC  `;
                        console.log('getTrashmessage_detail',command)
                        execCommand(command)
                        .then(result => res.json(result))
                        .catch(err => logWriter(command, err));
                    })

                    router.post("/upload_documents_files", (req, res) => {
                        console.log('vaibhav couhan')
                        var sender=req.body.replyMessage.sender.guid
                        var formdata = req.body.formDataArray;
                        var id=req.body.messagid

                        
                        var sender_id=req.body.sender_id.guid;
                        uniqeID1=req.body.Conversation_id;
                        var Reciver_id=req.body.replyMessage.sender.guid
                        console.log('documents,sender_id11111111111111111111111111111111111111',sender_id,sender,formdata,sender_id)
                     
                       for( var i=0;i<formdata.length;i++){
                        var document=formdata[i].filename
                        var filePath=formdata[i].filepath
                        console.log('filename',formdata[i].filename,document,filePath);
                       
                       }
                    
                        console.log('uniqeID1',uniqeID1);
                        var command = `Insert into message_documents( conversation_id, Message_id, sender_id, reciver_id, Document_name, Document_path)values('${uniqeID1}','${id}','${sender_id}','${Reciver_id}','${document}','${filePath}')`;
                        // var command = `Insert into message_documents( conversation_id, Message_id, sender_id, reciver_id, Document_name, Document_path)values('${uniqeID1}','${id}','${sender}','${Reciver_id}','${document}','${filePath}')`;
                        console.log(command);
                        execCommand(command)
                       
                        .then(result => res.json('success'))
                            .catch(err => logWriter(command, err));
                    
                      });

                    //   formDataArray,Conversation_id,sender_id,replyMessage
                    
module.exports =router;