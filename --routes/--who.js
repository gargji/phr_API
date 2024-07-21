const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const con = require('../config/db');

const multer  = require('multer');
const e = require('express');

// router.get('/Sexual_Orientation', (req,res)=>{
//     const command = `SELECT * FROM sexual_orientation`;

//     console.log(command);
//     execCommand(command)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err));
//     // db.query(command, (err, result) => {
//     //     if (err) {
//     //         res.json({ status: 'fail', error: err });
//     //     } else {
//     //         res.json(result);
//     //     }
//     // });
    
// });
// router.get('/Smokingstatus', (req,res)=>{
//     const command = `SELECT * FROM smoking_status`;

//     console.log(command);
    
//     db.query(command, (err, result) => {
//         if (err) {
//             res.json({ status: 'fail', error: err });
//         } else {
//             res.json(result);
//         }
//     });
    
// });




// router.post('/Addsmokingstatus', (req,res)=>{
//     console.log(req.body);
//     const {SmokingStatus,conceptid,moduleid} = req.body
//     const command = `INSERT INTO smoking_status(smoking_status,conceptId,active) values('${SmokingStatus}','${conceptid}',1)`;
       
//     db.query(command, (err, result) => {
//         if (err) {
//             res.json({ status: 'fail', error: err });
//         } else {
//             res.json('success');
//         }
//     });
    
// });

// router.post('/deletetablesmokingstatus', (req,res)=>{
//     const {id} =req.body;

//     const command =`delete from smoking_status where id=${id};`;
//     console.log(command);
//     db.query(command,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             res.json('deleted')
//         }                                    
//     })

// })

// router.post('/updatesmokingstatustable', (req,res)=>{
//     console.log(req.body);
//     const {SmokingStatus,conceptid,moduleid,id} =req.body

//     const command =`update smoking_status set smoking_status='${SmokingStatus}',conceptId='${conceptid}' where id='${id}'`;
//     const command2 =`SELECT * from smoking_status where smoking_status = '${SmokingStatus}'and conceptId='${conceptid}'`;
//     db.query(command2,(err,result)=>{
//         if(err){
//             console.log(err);
//         } else {
//             if(result.length>0) {
//                 res.json('exist');
//             } else {
//                 db.query(command, (err, result) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         res.json('success');
//                     }
//                 });
//             }
//         }
//     })    

// })
// router.post('/activedeactivesmokingstatus', (req,res)=>{
//     const {id, active} =req.body;

//     const command =`Update smoking_status set active='${active}' where id='${id}';`;
//     console.log(command);
//     db.query(command,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             res.json('success')
//         }                                    
//     })

// })

router.post('/findAddress', (req, res) => {
        console.log(req.body.text);
        const cityname = req.body.text
        const command = `select * from master_city where city_name like '%${cityname}%';`;
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
        
})    

router.post('/getDistrictWithCity', (req, res) => {
        const cityId = req.body.city_id
        const command = `select * from master_pincode where city_id = '${cityId}' group by area; select *, (select state_name from master_state where id = master_city.state_id) as statename, (select countryName  from master_country1 where conceptId = master_city.country_id) as countryname from master_city where id = '${cityId}'; `;
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})    
router.post('/getPincodesAccToDistrict', (req, res) => {
        const district = req.body.district;
        console.log(district);
        const command = `select * from master_pincode where area = '${district}'`
        execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})  

router.post('/getparticularPatientData', (req, res) => {
    const guid = req.body.guid;
    const command = `select * from master_patient where guid = '${guid}'`
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})  


router.post('/saveDemographicsWhoFormData', (req,res)=>{
    // var guid = newGuid()
    console.log(req.body);
    var hospitalId = req.body.hospitalId;
    var branchId = req.body.branchId;
    var formState = req.body.formState
    var sql = '';

    var {guid, deceasedStatus, deceasedDate, deceasedReason, prefix,firstName,middleName,lastName,suffix,displayName,nickName,completeName, previousName,previousName1,previousName2,previousName3,dobOrAge,dateOfBirth,age,sex,sogiDeclaration,maritalStatus,sexualOrientation,familySize,monthlyIncome,preferredLanguage,bloodGroup,smokingStatus} = req.body.formData;
    if(formState == 'new'){
        sql = `insert into master_patient(guid,hospitalId, branchId, active, prefix, firstName, middleName, lastName, suffix, displayName, nickName,completeName, previousName, dateOfBirth, smokingStatus, patientsId, deceasedStatus, deceasedDate, deceasedReason, maritalStatus, familySize, monthlyIncome, preferredLanguage, bloodGroup, sex, sogiDeclaration, sexualOrientation, age) 
        values('${guid}', '${hospitalId}', '${branchId}', '1','${prefix}','${firstName}', '${middleName}','${lastName}', '${suffix}' , '${displayName}', '${nickName}','${firstName} ${middleName } ${lastName} ', '${previousName}', '${dateOfBirth}', '${smokingStatus}','${guid}','${deceasedStatus}','${deceasedDate}','${deceasedReason}','${maritalStatus}','${familySize}','${monthlyIncome}','${preferredLanguage}','${bloodGroup}','${sex}','${sogiDeclaration}','${sexualOrientation}','${age}' )`

    }
    else{
        sql = `update master_patient set  prefix = '${prefix}', firstName = '${firstName}', middleName ='${middleName}', lastName = '${lastName}', suffix = '${suffix}', displayName = '${displayName}', nickName = '${nickName}',completeName = '${firstName} ${middleName = 'null'? '' : ''} ${lastName} ', previousName = '${previousName}', dateOfBirth = '${dateOfBirth}', smokingStatus = '${smokingStatus}', deceasedStatus = '${deceasedStatus}', deceasedDate = '${deceasedDate}', deceasedReason = '${deceasedReason}', maritalStatus ='${maritalStatus}', familySize = '${familySize = 'null'? '' : ''}', monthlyIncome = '${monthlyIncome}', preferredLanguage = '${preferredLanguage}', bloodGroup = '${bloodGroup}', sex = '${sex}', sogiDeclaration = '${sogiDeclaration}', sexualOrientation = '${sexualOrientation}', age = '${age = 'null'? '' : ''}' where guid = '${guid}';`
    }
    console.log(sql.replace(/null/g,''));
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if(result.affectedRows){
                var {patientId} = req.body.formData
                console.log(patientId);
                var patientIdQuery = '';
                for(var i = 0; i< patientId.length; i++){
                    patientIdQuery +=  `insert into master_patient_id (patientGuid, type, number, file) values('${guid}','${patientId[i].type}','${patientId[i].number}','${patientId[i].fileqw}');`
                    console.log(patientIdQuery);
                }
                execCommand(patientIdQuery)
                .then(result => res.json({msg:'success',patientsGuid: guid}))
                .catch(err => logWriter(patientIdQuery, err));


            }
            
        }
    });
    
});

router.post('/getPatientWhoDataForEdit', (req,res)=>{
    console.log(req.body.id);

    var sql = `select * from master_patient where guid = '${req.body.id}'; select * from master_patient_id where patientGuid = '${req.body.id}';`
    execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));


})

router.post('/contactForm', (req,res)=>{
    const {guid,addressLine1,addressLine2,area,district,state,city,country,landmark, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone,} = req.body.formData;
    const {formsState} = req.body;
    let sql;
    if(formsState == 'new'){

    sql = `insert into patientcontact (patient_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone)
    values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalCode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}')`
}
    else{
        console.log('going for else');
        sql = `update patientcontact set  addressLine1 = '${addressLine1}', addressLine2 = '${addressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', emergencyContactNumber = '${emergencyContactNumber}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' where patient_id = '${guid}';`
    }
    console.log(sql);
    execCommand(sql)
    .then(result => res.json('success'))
    .catch(err => logWriter(sql, err));

});
router.post('/getPatientContactDetailsForEdit', (req,res)=>{
    console.log(req.body.id);

    var sql = `select * from patientcontact where patient_id = '${req.body.id}';`
    execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));

});

router.post('/employerInsertion', (req, res) => {
    const { guid, occupation, employerName, employerAddressLine1, employerAddressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone } = req.body.formData
    const {formState }= req.body.formState
    let sql;
    
    if(formState == 'new'){
        sql = `insert into master_employer (guid,occupation, employerName, employerAddressLine1, employerAddressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone)
        values('${guid}','${occupation}','${employerName}','${employerAddressLine1}', '${employerAddressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${industry}','${mobilePhone}','${homePhone}','${workPhone}')`

    }
    else{

        sql = `update master_employer set occupation = '${occupation}', employerName = '${employerName}', employerAddressLine1 = '${employerAddressLine1}', employerAddressLine2 = '${employerAddressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' where guid = '${guid}';`
    }
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/getEmployerDetailsForEdit', (req, res) => {
    var sql = `select * from master_employer where guid = '${req.body.id}';`
    execCommand(sql)
    .then(result => res.json(result))
    .catch(err => logWriter(sql, err));

});


router.post('/caregiverInsertion', (req, res) => {
    console.log(req.body);
    const {guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone } = req.body
    const sql = `insert into master_caregiver (guid, relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone)
    values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}')`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/guarantorInsertion', (req, res) => {
    console.log(req.body);
    const {guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone } = req.body
    const sql = `insert into master_guarantor (guid,relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone)
    values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}')`
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/ReferralsInsertion', (req, res) => {
    const {id, guid, referralType, referralState, source, specificSource, Name, companyName, emailId, phoneNumber1, phoneNumber2} = req.body

    const command = `insert into transaction_referrals (patient_id, referralType,source,specificSource, referralState, Name, companyName, emailId, phoneNumber1, phoneNumber2) values('${guid}','${referralType}','${source}', '${specificSource}', '${referralState}', '${Name}', '${companyName}', '${emailId}', '${phoneNumber1}', '${phoneNumber2}')`
    db.query(command, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/choicesInsertion', (req, res) => {
    const {guid, phrInvitationSent, hippaNoticeSent, preferredCommunication, emailNotification, voiceNotification, textNotification, pharmacy} = req.body.formData

    const command = `insert into master_choices (guid, phrInvitationSent, hippaNoticeSent, preferredCommunication, emailNotification, voiceNotification, textNotification, pharmacy) values('${guid}', ${phrInvitationSent}, ${hippaNoticeSent}, '${preferredCommunication}', ${emailNotification}, ${voiceNotification}, ${textNotification}, '${pharmacy}')`;
    console.log(command);
    db.query(command, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/PhrRegistration', (req, res) => {
    console.log(req.body);
    const {guid, firstName, lastName, mobileNo, emailId} = req.body.formData


    const command = `insert into phr_registration (guid,  firstName, lastName, mobileNo, emailId) values('${guid}','${firstName}','${lastName}', '${mobileNo}', '${emailId}')`;
    console.log(command);
    db.query(command, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});




router.post('/uploadProfile',fileupload, (req, res) => {
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "\\\\192.168.1.123\\ngdata\\healaxyapp\\Hospital_data\\patientData\\profilepicture")
    },
    filename: function (req, file, cb) {        
      cb(null, file.originalname )
      
    }
  })
  
  const upload = multer({ storage: storage,preservePath:true })

  function fileupload(req,res,next){
      upload.single("profile")(req,res,next);
      next();
      // res.json('')
  }







function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }



module.exports =router;