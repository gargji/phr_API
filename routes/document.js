const express = require('express')
const router = express.Router()
const db = require("../config/db")
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
router.post('/saveFolder', (req, res) => {
  console.log(req.body);
  Folder_name = req.body.formvalue.Foldername
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  const command = `Insert into master_my_document_folder (Folder_name,hospitalId,branchId) value('${Folder_name}','${hospitalId}','${branchId}')`
  // db.query(command,(err,results)=>{
  //     if(err){
  //         console.log(err);
  //     }else{
  //         res.json(results)
  //     }
  // })
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));

})
router.post('/getFolderName', (req, res) => {
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  // Folder_name=req.body.formvalue.Foldername
  const command = `select * from master_my_document_folder where hospitalId='${hospitalId}' AND branchId='${branchId}' and upload_by = 'EHR'; `

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})

router.get('/getDocumentType', (req, res) => {

  const command = `select * from master_my_document_folder where hospitalId='null'`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})
router.post('/saveFolderuplods', (req, res) => {
  console.log(req.body);
  var filename = req.body.formvalue.filename
  var DocType = req.body.formvalue.DocType
  var FolderName = req.body.formvalue.FolderName
  var Documentcategory = req.body.formvalue.Documentcategory.id
  var Date = req.body.formvalue.Date

  var fullPath = req.body.fullpath.replace(/\\/g, '/')
  var hospital_id = req.body.hospitalId
  var branch_id = req.body.branchId
  var docSize = req.body.imgData
  var filename = req.body.filename
  const command = `insert into  transaction_my_document_folder(fileName,branch_id, hospital_id, documentType, document_categories, Folder_name, Date_uplods,full_path,docSize, transaction_time) 
    values('${filename}','${branch_id}','${hospital_id}','${DocType}','${Documentcategory}','${FolderName}','${Date}','${fullPath}','${docSize} KB',now())`
  console.log(command);
  execCommand(command)
    .then(result => res.json('result'))
    .catch(err => logWriter(command, err));


})

router.post('/getAllDocument', (req, res) => {
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  // Folder_name=req.body.formvalue.Foldername
  const command = `select * from transaction_my_document_folder where hospital_id='${hospitalId}' AND branch_id='${branchId}' and document_categories = 2;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})


router.post('/zipfolder', (req, res) => {
  debugger
  console.log(req.body)
  const encodedUrl = req.body.file;
  const decodedUrl = decodeURIComponent(encodedUrl);
  console.log(decodedUrl);
  const output = fs.createWriteStream('Aman.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });

  console.log('Starting zipping process...');

  archive.on('error', (err) => {
    console.error('Archiver error:', err);
    res.status(500).send({ error: err.message });
  });

  archive.pipe(output);

  // Make sure folderPath is a valid absolute path
  const absoluteFolderPath = path.resolve(__dirname, folderPath);

  // Add the contents of the specified folder to the archive
  archive.directory(absoluteFolderPath, false);

  archive.finalize();

  output.on('close', () => {
    res.download('Aman.zip', 'Aman.zip', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).send({ error: err.message });
      }

      // Clean up the temporary zip file
      fs.unlinkSync('Aman.zip');
      console.log('Temporary zip file deleted.');
    });
  });
});

router.post('/getAllpracticeDocument', (req, res) => {
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  // Folder_name=req.body.formvalue.Foldername
  const command = `select * from transaction_my_document_folder where hospital_id='${hospitalId}' AND branch_id='${branchId}' and document_categories = 1;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})

router.post('/Mpvedfiletoanother', (req, res) => {
  console.log('Mpvedfiletoanother', req.body);
  folder = req.body.data.FolderName;
  id = req.body.id;
  category = req.body.category;
  // Folder_name=req.body.formvalue.Foldername
  const command = `UPDATE transaction_my_document_folder SET Folder_name = '${folder}' WHERE id = '${id}' and document_categories ='${category}' ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));

})


router.post('/deletefile', (req, res) => {
  id = req.body.id;
  category = req.body.category;
  const command = `delete FROM transaction_my_document_folder where id = '${id}' and document_categories ='${category}' ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})



router.post('/getTransactionAllpubliclibrary', (req, res) => {
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  // Folder_name=req.body.formvalue.Foldername
  const command = `select * from transaction_my_document_folder where hospital_id='${hospitalId}' AND branch_id='${branchId}' and public_library = 1;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})

router.post('/getcategorynameforpatching', (req, res) => {
  console.log('getcategorynameforpatching', req.body);
  id = req.body.id;
  // Folder_name=req.body.formvalue.Foldername
  const command = `select * from master_my_document_folder where hospitalId='null' and id ='${id}';`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/insertnewcategoryname', (req, res) => {
  console.log('insertnewcategoryname', req.body);
  id = req.body.id;
  FileName = req.body.name.FileName
  const command = `UPDATE master_my_document_folder SET Folder_name = '${FileName}' WHERE (id = '${id}');`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})


router.post('/InsertpatientDocumentdata', (req, res) => {
  console.log(req.body);
  var filename = req.body.formvalue.filename
  var DocType = req.body.formvalue.DocType
  var sms = req.body.formvalue.sms
  var phr = req.body.formvalue.phr
  var Date = req.body.formvalue.Date
  var Filefrreview = req.body.formvalue.Filefrreview
  var reviewer = req.body.formvalue.Reviewer
  // var patient_id = req.body.formvalue.patient_id
  var patient_id = req.body.formvalue.patient_id

  var fullPath = req.body.fullpath.replace(/\\/g, '/')
  var hospital_id = req.body.hospitalId
  var branch_id = req.body.branchId
  var docSize = req.body.imgData
  var filename = req.body.filename

  const command = `INSERT INTO transaction_my_patient_docs (branch_id, hospital_id, documentType, Date_uplods, transaction_time, full_path, docSize, fileName, fileforreview,patient_id, phr, sms,reviewer)
  VALUES ('${branch_id}', '${hospital_id}', '${DocType}', '${Date}', now(), '${fullPath}', '${docSize}KB', '${filename}',
          CASE WHEN '${Filefrreview}' = 'true' THEN 1 ELSE 0 END,'${patient_id}',
          CASE WHEN '${phr}' = 'true' THEN 1 ELSE 0 END,
          CASE WHEN '${sms}' = 'true' THEN 1 ELSE 0 END, '${reviewer}');`
  console.log(command);
  execCommand(command)
    .then(result => res.json('inserted'))
    .catch(err => logWriter(command, err));


})


router.post('/getallpatientsdocument', (req, res) => {
  console.log(req.body);

  var hospital_id = req.body.hospitalId
  var branch_id = req.body.branchId
  var docSize = req.body.imgData
  var patient_id = req.body.patientguid

  const command = `SELECT tpd.id, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
  CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
FROM transaction_my_patient_docs tpd
left join master_patient mp on mp.guid = tpd.patient_id
left join provider_personal_identifiers pi on pi.Id = tpd.reviewer where tpd.branch_id = '${branch_id}' and tpd.hospital_id = '${hospital_id}' and tpd.patient_id = '${patient_id}';`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/Moveddocumenttoanother', (req, res) => {
  console.log('Moveddocumenttoanother', req.body);
  id = req.body.data;
  DocType = req.body.id.DocType;
  const command = `UPDATE transaction_my_patient_docs SET documentType = '${DocType}' WHERE (id = '${id}');`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})


router.post('/deletedocument', (req, res) => {
  console.log('deletedocument', req.body);
  id = req.body.id;
  const command = `delete from  transaction_my_patient_docs where id = '${id}';`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})

router.post('/locakunlockdocument', (req, res) => {
  console.log('locakunlockdocument', req.body);
  id = req.body.id;
  const command = `UPDATE transaction_my_patient_docs SET lockunlock = '1' WHERE (id = '${id}');`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})

router.post('/insertreviewerdata', (req, res) => {
  console.log('insertreviewerdata', req.body);
  id = req.body.id;
  reviewername = req.body.data.reviewername;
  comment = req.body.data.comment;
  const command = `UPDATE transaction_my_patient_docs SET reviewer_id = '${reviewername}', comment = '${comment}' WHERE (id = '${id}');`
  console.log('insertreviewerdata>>>>>>>>>>>>>>', command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));

})

router.post('/getAlllocalDocument', (req, res) => {
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  category_id = req.body.category_id
  // Folder_name=req.body.formvalue.Foldername
  const command = `select * from transaction_my_document_folder where hospital_id='${hospitalId}' AND branch_id='${branchId}' and document_categories = '${category_id}';`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/uploadlibrary', async (req, res) => {
  try {
    const { patient_id, data } = req.body;
    const sqlCommand = 'SELECT 1 + 1;';
    await execCommand(sqlCommand);
    await postUploadLibrary(patient_id, data);
    res.json('S');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('Error');
  }
});


async function postUploadLibrary(patient_id, data) {
  for (const document of data) {
    try {
      const query = `
        INSERT INTO transaction_my_patient_docs (
          branch_id, hospital_id, documentType, Date_uplods, transaction_time, full_path, docSize, fileName, patient_id
        ) VALUES (
          '${document.branch_id}', '${document.hospital_id}', '${document.documentType}', '${document.Date_uplods}', now(), '${document.full_path}', '${document.docSize}', '${document.fileName}', '${patient_id}'
        );
      `;
      await execCommand(query);
    } catch (error) {
      logWriter(query, error);
    }
  }
}


router.post('/documentlinkform', (req, res) => {
  console.log('documentlinkform=>>>>', req.body);
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  patient_id = req.body.patient_id
  referencetodocument = req.body.data.referencetodocument
  linktodocument = req.body.data.linktodocument

  const command = `INSERT INTO transaction_my_patient_docs (hospital_id,branch_id,patient_id,referencetodocument, linktodocument) VALUES ('${hospitalId}', '${branchId}','${patient_id}','${referencetodocument}','${linktodocument}');`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})

router.post('/getallpatientsdocumentFilter', (req, res) => {
  console.log(req.body);

  var hospital_id = req.body.hospitalId
  var branch_id = req.body.branchId
  var docSize = req.body.imgData
  var patient_id = req.body.patientguid
  var filter = req.body.filter
  if (filter == 'L') {
    const command = `SELECT tpd.id, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
     CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
   FROM transaction_my_patient_docs tpd
   left join master_patient mp on mp.guid = tpd.patient_id
   left join provider_personal_identifiers pi on pi.Id = tpd.reviewer where tpd.branch_id = '${branch_id}' and tpd.hospital_id = '${hospital_id}' and tpd.patient_id = '${patient_id}' and  tpd.lockunlock = 1;`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  } else if (filter == 'R') {
    const command = `SELECT tpd.id, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
       CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
     FROM transaction_my_patient_docs tpd
     left join master_patient mp on mp.guid = tpd.patient_id
     left join provider_personal_identifiers pi on pi.Id = tpd.reviewer where tpd.branch_id = '${branch_id}' and tpd.hospital_id = '${hospital_id}' and tpd.patient_id = '${patient_id}' and  tpd.fileforreview = 0;`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  } else if (filter == 'A') {
    const command = `SELECT tpd.id, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
       CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
     FROM transaction_my_patient_docs tpd
     left join master_patient mp on mp.guid = tpd.patient_id
     left join provider_personal_identifiers pi on pi.Id = tpd.reviewer where tpd.branch_id = '${branch_id}' and tpd.hospital_id = '${hospital_id}' and tpd.patient_id = '${patient_id}';`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  } else if (filter == 'unsigned') {
    const command = `SELECT tpd.id, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
       CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
     FROM transaction_my_patient_docs tpd
     left join master_patient mp on mp.guid = tpd.patient_id
     left join provider_personal_identifiers pi on pi.Id = tpd.reviewer where tpd.branch_id = '${branch_id}' and tpd.hospital_id = '${hospital_id}' and tpd.patient_id = '${patient_id}' and tpd.reviewer_id IS NULL;`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  } else {
    const command = `SELECT tpd.id, tpd.branch_id, tpd.hospital_id, tpd.documentType, tpd.Date_uplods, tpd.transaction_time, tpd.full_path, tpd.docSize, tpd.fileName, tpd.fileforreview, tpd.patient_id, tpd.phr, tpd.sms, tpd.reviewer,mp.id as patient_id, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,pi.Id, pi.guid, pi.hospital_id, pi.branchId, pi.Provider_picture, pi.providertitle, pi.firstname, pi.middlename, pi.Lastname, pi.bloodgroup, pi.gender, pi.dateOfBirth, pi.age, pi.language, pi.communication, pi.notifications, pi.Phonenumber, pi.Emailid, pi.role, 
  CONCAT_WS(' ', COALESCE(pi.firstname, ''), COALESCE(pi.lastname, '')) AS providername
FROM transaction_my_patient_docs tpd
left join master_patient mp on mp.guid = tpd.patient_id
left join provider_personal_identifiers pi on pi.Id = tpd.reviewer where tpd.branch_id = '${branch_id}' and tpd.hospital_id = '${hospital_id}' and tpd.patient_id = '${patient_id}';`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  }
})

router.post('/GetPatientDocument', (req, res) => {
  console.log('GetPatientDocument=>>>>', req.body);
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId

  const command = `SELECT  tpd.id,  tpd.branch_id,   tpd.hospital_id,  tpd.documentType,  tpd.Date_uplods as docdate,  tpd.transaction_time,  tpd.full_path,  tpd.docSize,tpd.fileName,CONCAT(tpd.documentType, ' : ',tpd.fileName)  as Documentname,  tpd.fileforreview,  tpd.patient_id,  tpd.phr,  tpd.sms,  tpd.reviewer,  tpd.lockunlock,  tpd.reviewer_id,  tpd.comment as doccomment,   tpd.referencetodocument,  tpd.linktodocument, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,   CONCAT(mp.firstname, ' ', mp.lastname) AS patientname
  FROM transaction_my_patient_docs tpd
  LEFT JOIN  master_patient mp ON tpd.patient_id = mp.guid;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/Reviewerfilter', (req, res) => {
  console.log('Reviewerfilter=>>>>', req.body);
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  reviewerid = req.body.reviewerid

  const command = `SELECT  tpd.id,  tpd.branch_id,   tpd.hospital_id,  tpd.documentType,  tpd.Date_uplods as docdate,  tpd.transaction_time,  tpd.full_path,  tpd.docSize,tpd.fileName,CONCAT(tpd.documentType, ' : ',tpd.fileName)  as Documentname,  tpd.fileforreview,  tpd.patient_id,  tpd.phr,  tpd.sms,  tpd.reviewer,  tpd.lockunlock,  tpd.reviewer_id,  tpd.comment as doccomment,   tpd.referencetodocument,  tpd.linktodocument, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,   CONCAT(mp.firstname, ' ', mp.lastname) AS patientname
  FROM transaction_my_patient_docs tpd
  LEFT JOIN  master_patient mp ON tpd.patient_id = mp.guid Where tpd.branch_id = '${branchId}' and tpd.hospital_id = '${hospitalId}' and tpd.reviewer = '${reviewerid}';`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/Statusfilter', (req, res) => {
  console.log('Statusfilter=>>>>', req.body);
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  reviewerid = req.body.reviewerid
  stat = req.body.status

  if (stat == 'S') {
    const command = `SELECT  tpd.id,  tpd.branch_id,   tpd.hospital_id,  tpd.documentType,  tpd.Date_uplods as docdate,  tpd.transaction_time,  tpd.full_path,  tpd.docSize,tpd.fileName,CONCAT(tpd.documentType, ' : ',tpd.fileName)  as Documentname,  tpd.fileforreview,  tpd.patient_id,  tpd.phr,  tpd.sms,  tpd.reviewer,  tpd.lockunlock,  tpd.reviewer_id,  tpd.comment as doccomment,   tpd.referencetodocument,  tpd.linktodocument, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,   CONCAT(mp.firstname, ' ', mp.lastname) AS patientname
  FROM transaction_my_patient_docs tpd
  LEFT JOIN  master_patient mp ON tpd.patient_id = mp.guid Where tpd.branch_id = '${branchId}' and tpd.hospital_id = '${hospitalId}' and tpd.reviewer_id IS NOT NULL;`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  } else if (stat == 'U') {
    const command = `SELECT  tpd.id,  tpd.branch_id,   tpd.hospital_id,  tpd.documentType,  tpd.Date_uplods as docdate,  tpd.transaction_time,  tpd.full_path,  tpd.docSize,tpd.fileName,CONCAT(tpd.documentType, ' : ',tpd.fileName)  as Documentname,  tpd.fileforreview,  tpd.patient_id,  tpd.phr,  tpd.sms,  tpd.reviewer,  tpd.lockunlock,  tpd.reviewer_id,  tpd.comment as doccomment,   tpd.referencetodocument,  tpd.linktodocument, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,   CONCAT(mp.firstname, ' ', mp.lastname) AS patientname
    FROM transaction_my_patient_docs tpd
    LEFT JOIN  master_patient mp ON tpd.patient_id = mp.guid Where tpd.branch_id = '${branchId}' and tpd.hospital_id = '${hospitalId}' and tpd.reviewer_id IS NULL ;`
    console.log(command);
    execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  }


})

router.post('/seachbyname', (req, res) => {
  console.log('seachbyname=>>>>', req.body);
  hospitalId = req.body.hospitalId
  branchId = req.body.branchId
  patient = req.body.patient

  const command = `SELECT  tpd.id,  tpd.branch_id,   tpd.hospital_id,  tpd.documentType,  tpd.Date_uplods as docdate,  tpd.transaction_time,  tpd.full_path,  tpd.docSize,tpd.fileName,CONCAT(tpd.documentType, ' : ',tpd.fileName)  as Documentname,  tpd.fileforreview,  tpd.patient_id,  tpd.phr,  tpd.sms,  tpd.reviewer,  tpd.lockunlock,  tpd.reviewer_id,  tpd.comment as doccomment,   tpd.referencetodocument,  tpd.linktodocument, mp.guid, mp.active, mp.hospitalId, mp.branchId, mp.prefix, mp.firstName, mp.middleName, mp.lastName, mp.suffix, mp.completeName, mp.displayName, mp.nickName, mp.previousName, mp.dateOfBirth, mp.smokingStatus, mp.patientsId, mp.deceasedStatus, mp.deceasedDate, mp.deceasedReason, mp.maritalStatus, mp.familySize, mp.monthlyIncome, mp.preferredLanguage, mp.bloodGroup, mp.tag, mp.sex, mp.sogiDeclaration, mp.sexualOrientation, mp.age, mp.phone_no, mp.imgSrc, mp.mobilecodes,   CONCAT(mp.firstname, ' ', mp.lastname) AS patientname
  FROM transaction_my_patient_docs tpd
  LEFT JOIN  master_patient mp ON tpd.patient_id = mp.guid Where tpd.branch_id = '${branchId}' and tpd.hospital_id = '${hospitalId}' and mp.firstname  Like '%${patient}%' or mp.lastname  Like '%${patient}%' ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/patientsharedocument', (req, res) => {
  console.log('patientsharedocument=>>>>', req.body);
  const data = req.body.data;
  const id = req.body.id;

  // Check if phr and sms are true, and convert to '1' if true
  const phrValue = data.phr ? '1' : '0';
  const smsValue = data.sms ? '1' : '0';

  const command = `UPDATE transaction_my_patient_docs SET phr = '${phrValue}', sms = '${smsValue}' WHERE (id = '${id}');`
  console.log(command);

  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
});


router.post('/movetopublic', (req, res) => {
  console.log('movetopublic=>>>', req.body);
  id = req.body.row.id;
  category = req.body.row.document_categories;
  const command = `UPDATE transaction_my_document_folder SET public_library = '1' WHERE id = '${id}' and document_categories = '${category}' ;`
  console.log(command);
  execCommand(command)
    .then(result => res.json('S'))
    .catch(err => logWriter(command, err));
})


module.exports = router

