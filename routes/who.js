const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const con = require('../config/db');
const multer = require('multer');
const Globals=require('../config/configs')
const fs = require('fs')
// var baseurl = '\\\\192.168.1.123\\ngdata\\healaxyapp\\'



router.post('/findAddress', (req, res) => {
    console.log(req.body.text);
    const cityname = req.body.text
    const command = `select * from master_city where city_name like '%${cityname}%';`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

})

router.post('/findCountry', (req, res) => {
    console.log(req.body.text);
    const countryName = req.body.text
    const command = `select * from master_country_code1 where Country like '%${countryName}%';`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

})

router.post('/findPostalCode', (req, res) => {
    // console.log(req.body.text);
    const postalcode = req.body.text
    const command = `select * from master_coutry_postalcode where postalcode like '%${postalcode}%' group by postalcode;`;
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

router.post('/getStates', (req, res) => {
    // console.log(req.body);
    const country_id = req.body.countryId
    const command = `select * from master_coutry_postalcode where countrycode = '${country_id}' group by states_name;`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/getmobilecodeAPI', (req, res) => {
    // console.log(req.body);
    const country_id = req.body.countryId
    const command = `select * from master_country_code1 where countrycode = '${country_id}';`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/getTimeZoneAPI', (req, res) => {
    // console.log(req.body);
    const country_id = req.body.countryId
    const command = `SELECT CONCAT(Time_Zone, ' ', GMT_Offset) AS Time_Zone_And_Offset
    FROM master_timezone
    WHERE Country_code = '${country_id}';`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/getCountryName', (req, res) => {
    console.log(req.body, 'aman');
    const countryCode = req.body.countryCode
    const command = `select * from master_country_code1 where countrycode = '${countryCode}';`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post('/getDisrict', (req, res) => {
    const states_name = req.body.states_name
    const command = `select * from master_coutry_postalcode where states_name = '${states_name}' group by district_name;`;
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


router.post('/saveDemographicsWhoFormData', (req, res) => {
    // var guid = newGuid()uploadProfile
    console.log(req.body);
    var hospitalId = req.body.hospitalId;
    var branchId = req.body.branchId;
    var formState = req.body.formState
    var sql = '';
    var { guid, deceasedStatus, deceasedDate, deceasedReason, prefix, firstName, middleName, lastName, suffix, displayName, nickName, completeName, previousName, previousName1, previousName2, previousName3, phone_no, dobOrAge, dateOfBirth, age, sex, sogiDeclaration, maritalStatus, sexualOrientation, familySize, monthlyIncome, preferredLanguage, bloodGroup, smokingStatus, imgSrc, mobilecodes } = req.body.formData;

    if (formState == 'new') {
        sql = `insert into master_patient(guid,hospitalId, branchId, active, prefix, firstName, middleName, lastName, suffix, displayName, nickName,completeName, previousName, phone_no, dateOfBirth, smokingStatus, patientsId, deceasedStatus, deceasedDate, deceasedReason, maritalStatus, familySize, monthlyIncome, preferredLanguage, bloodGroup, sex, sogiDeclaration, sexualOrientation, age, imgSrc,mobilecodes) 
        values('${guid}', '${hospitalId}', '${branchId}', '1','${prefix}','${firstName}', '${middleName}','${lastName}', '${suffix}' , '${displayName}', '${nickName}','${firstName} ${middleName} ${lastName} ', '${previousName}', '${phone_no}', '${dateOfBirth}', '${smokingStatus}','${guid}','${deceasedStatus}','${deceasedDate}','${deceasedReason}','${maritalStatus}','${familySize}','${monthlyIncome}','${preferredLanguage}','${bloodGroup}','${sex}','${sogiDeclaration}','${sexualOrientation}','${age}','${imgSrc}','${mobilecodes}' );`;
    }
    else {
        sql = `update master_patient set  prefix = '${prefix}', firstName = '${firstName}', middleName ='${middleName}', lastName = '${lastName}', suffix = '${suffix}', displayName = '${displayName}', nickName = '${nickName}',completeName = '${firstName} ${middleName} ${lastName}', previousName = '${previousName}', phone_no = '${phone_no}', dateOfBirth = '${dateOfBirth}', smokingStatus = '${smokingStatus}', deceasedStatus = '${deceasedStatus}', deceasedDate = '${deceasedDate}', deceasedReason = '${deceasedReason}', maritalStatus ='${maritalStatus}', familySize = '${familySize}', monthlyIncome = '${monthlyIncome}', preferredLanguage = '${preferredLanguage}', bloodGroup = '${bloodGroup}', sex = '${sex}', sogiDeclaration = '${sogiDeclaration}', sexualOrientation = '${sexualOrientation}', age = '${age}', imgSrc = '${imgSrc}',mobilecodes='${mobilecodes}' where guid = '${guid}';`
    }

    var duplicationCheckQuery = `select * from master_patient where phone_no = '${phone_no}';`;
    execCommand(duplicationCheckQuery)
        .then(result => {
            if (result.length > 0 && formState == 'new') {
                res.json({ msg: 'duplicate' })
            }
            else {
                db.query(sql.replace(/null/g, ''), (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.affectedRows) {
                            var { patientId } = req.body.formData
                            console.log('AMan',patientId);
                            var patientIdQuery = '';
                            for (var i = 0; i < patientId.length; i++) {
                                if (patientId[i].fileqw != null && patientId[i].fileqw != 'null' && patientId[i].fileqw != undefined && patientId[i].fileqw != '') {

                                    patientIdQuery += `delete from master_patient_id where patientGuid = '${guid}' and file = '${patientId[i].fileqw}';insert into master_patient_id (patientGuid, type, number, file) values('${guid}','${patientId[i].type.replace('"', '""').replace("'", "''")}','${patientId[i].number}','${patientId[i].fileqw}');`
                                    console.log(patientIdQuery);

                                }
                            }
                            if (patientIdQuery != '') {
                                execCommand(patientIdQuery)
                                    .then(result => res.json({ msg: 'success', patientsGuid: guid }))
                                    .catch(err => logWriter(patientIdQuery, err));
                            }
                            else {
                                res.json({ msg: 'success', patientsGuid: guid })
                            }
                        }
                        else {
                            res.json({ msg: 'success', patientsGuid: guid })
                        }
                    }
                });
            }
        })
        .catch(err => logWriter(command, err));
});
router.post('/employerInsertion', (req, res) => {
    console.log(req.body);
    const country = req.body.formData.country.countrycode
    const postalCode = req.body.formData.postalCode.postalcode
    const id = req.body.formData.id
    const { guid, occupation, employerName, employerAddressLine1, employerAddressline2, area, city, district, state, landmark, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone, mobilecodes, mobile,home,work } = req.body.formData
    const { formState } = req.body;
    let sql;

    if (id == '' || id == null || id == undefined) {
        sql = `insert into master_employer (guid,occupation, employerName, employerAddressLine1, employerAddressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone,mobilecodes,mobile,home,work)
     values('${guid}','${occupation}','${employerName}','${employerAddressLine1}', '${employerAddressline2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${industry}','${mobilePhone}','${homePhone}','${workPhone}','${mobilecodes}','${mobile}','${home}','${work}')`

    }
    else {

        sql = `update master_employer set occupation = '${occupation}', employerName = '${employerName}', employerAddressLine1 = '${employerAddressLine1}', employerAddressLine2 = '${employerAddressline2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' ,mobilecodes='${mobilecodes}',mobile= '${mobile}',home = '${home}',work= '${work}'
        where guid = '${guid}';`
    }
    console.log(sql);
    db.query(sql.replace(/null/g, ''), (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});

router.post('/getPatientWhoDataForEdit', (req, res) => {
    console.log(req.body.id);

    var sql = `select * from master_patient where guid = '${req.body.id}'; select * from master_patient_id where patientGuid = '${req.body.id}';`
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));


})

// router.post('/contactForm', (req, res) => {
//     console.log(req.body);
//     const country = req.body.formData.country.countrycode
//     const postalcode = req.body.formData.postalCode.postalcode
//     // const postal_code = req.body.value?.Postal_Code?.postalcode;
//     const postal_code_id = req.body.formData?.postalCode.id;
//     const { id, guid, addressLine1, addressLine2, area, district, state, city, landmark, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone, mobilecodes,mobile,home,work } = req.body.formData;
//     const { formState } = req.body;
//     console.log(formState);
//     let sql;
//     if (id == '' || id == null || id == undefined) {

//         sql = `insert into patientcontact (patient_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone,mobilecodes,postalcode_id,mobile,home,work)
//     values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalcode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}','${mobilecodes}','${postal_code_id}','${mobile}','${home}','${work}')`
//     }
//     else {
//         console.log('going for else');
//         sql = `update patientcontact set  addressLine2 = '${addressLine1}', addressLine2 = '${addressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalcode}',postalcode_id='${postal_code_id}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', emergencyContactNumber = '${emergencyContactNumber}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}',mobilecodes='${mobilecodes}',mobile= '${mobile}',home = '${home}',work= '${work}'
//         where patient_id = '${guid}';`
//     }
//     console.log(sql.replace(/null/g, ''));
//     execCommand(sql.replace(/null/g, ''))
//         .then(result => res.json('success'))
//         .catch(err => logWriter(sql, err));

// });

router.post('/contactForm', (req, res) => {
    console.log(req.body);
    const country = req.body.formData.country.countrycode
    const postalcode = req.body.formData.postalCode.postalcode
    // const postal_code = req.body.value?.Postal_Code?.postalcode;
    const postal_code_id = req.body.formData?.postalCode.id;
    const { id, guid, addressLine1, addressLine2, area, district, state, city, landmark, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone, mobilecodes,mobile,home,work } = req.body.formData;
    const { formState } = req.body;
    console.log(formState);
    var command1 = `delete from patientcontact where patient_id = '${guid}';`;
    console.log(command1)
    execCommand(command1)
        .then(result => {
            if (result) {
            var   command = `insert into patientcontact (patient_id, addressLine1, addressLine2, area, landmark, city, district, state, country, postalCode, emailId1, emailId2, emergencyContactNumber, mobilePhone, homePhone, workPhone,mobilecodes,postalcode_id,mobile,home,work)
                 values('${guid}','${addressLine1}','${addressLine2}','${area}', '${landmark}', '${city}', '${district}' , '${state}', '${country}', '${postalcode}', '${emailId1}', '${emailId2}','${emergencyContactNumber}','${mobilePhone}','${homePhone}','${workPhone}','${mobilecodes}','${postal_code_id}','${mobile}','${home}','${work}')`
                console.log(command);
                execCommand(command.replace(/null/g, ''))
                    .then(result => res.json('success'))
                    .catch(err => logWriter(command, err));

            }
        })
        .catch(err => logWriter(command1, err));

});

router.post('/getPatientContactDetailsForEdit', (req, res) => {
    console.log(req.body.id);

    var sql = `select * from patientcontact where patient_id = '${req.body.id}';`
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));

});

// router.post('/employerInsertion', (req, res) => {
//     const { guid, occupation, employerName, employerAddressLine1, employerAddressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone } = req.body.formData
//     const {formState }= req.body;
//     let sql;

//     if(formState == 'new'){
//         sql = `insert into master_employer (guid,occupation, employerName, employerAddressLine1, employerAddressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone)
//         values('${guid}','${occupation}','${employerName}','${employerAddressLine1}', '${employerAddressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${industry}','${mobilePhone}','${homePhone}','${workPhone}')`

//     }
//     else{

//         sql = `update master_employer set occupation = '${occupation}', employerName = '${employerName}', employerAddressLine1 = '${employerAddressLine1}', employerAddressLine2 = '${employerAddressLine2}', area ='${area}', landmark = '${landmark}', city = '${city}', district = '${district}', state = '${state}', country = '${country}', postalCode = '${postalCode}', emailId1 = '${emailId1}', emailId2 = '${emailId2}', mobilePhone = '${mobilePhone}', homePhone = '${homePhone}', workPhone = '${workPhone}' where guid = '${guid}';`
//     }
//     db.query(sql.replace(/null/g,''), (err, result) => {
//         if (err) {
//             console.log(err);

//         } else {
//             res.json('success');
//         }
//     });
// });
router.post('/getEmployerDetailsForEdit', (req, res) => {
    var sql = `select * from master_employer where guid = '${req.body.id}';`
    execCommand(sql)
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));

});

// router.post('/caregiverInsertion', (req, res) => {
//     console.log(req.body);
//     let { formState } = req.body;
//     const postalCode = req.body.formData.postalCode.postalcode
//     const country = req.body.formData.country.countrycode
//     const type = req.body.type
//     let { guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, landmark, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone, mobilecodes } = req.body.formData

//     const command1 = `delete from master_caregiver where guid='${guid}' and type='${type}'`;
//     console.log(command1)
//     execCommand(command1)
//         .then(result => {

//             if (result) {
//                 const command = `insert into master_caregiver (guid, relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone,type,mobilecodes)
//             values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}','${type}','${mobilecodes}')`;
//                 console.log(command);
//                 execCommand(command)
//                     .then(result => res.json('success'))
//                     .catch(err => logWriter(command, err));

//             }
//         })
//         .catch(err => logWriter(command1, err));
// })

router.post('/caregiverInsertion', (req, res) => {
    console.log(req.body);
    let { formState } = req.body;
    const postalCode = req.body.formData.postalCode.postalcode
    const country = req.body.formData.country.countrycode
    const type = req.body.type
    let { guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, landmark, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone, mobilecodes,home,mobile,work } = req.body.formData

    const command1 = `delete from master_caregiver where guid='${guid}' and type='${type}'`;
    console.log(command1)
    execCommand(command1)
        .then(result => {

            if (result) {
            
                const command = `insert into master_caregiver (guid, relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone,type,mobilecodes,home,mobile,work)
            values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}','${type}','${mobilecodes}','${home}','${mobile}','${work}')`;
                console.log(command);
                execCommand(command)
                    .then(result => res.json('success'))
                    .catch(err => logWriter(command, err));

            }
        })
        .catch(err => logWriter(command1, err));
})
router.post('/guarantorInsertion', (req, res) => {
    console.log(req.body);
    const country = req.body.formData.country.countrycode
    //   const id=req.body.formData.id
    const postalCode = req.body.formData.postalCode.postalcode
    const { id, guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, landmark, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone,mobile,home,work } = req.body.formData;
    let { formState } = req.body
    console.log(formState);
    let sql = ``;
    if (id == '' || id == null || id == undefined) {
        sql = `insert into master_guarantor (guid,relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone,mobile,home,work)
        values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}','${mobile}','${home}','${work}')`
    }
    else {
        sql = `update master_guarantor set relationship='${relationship}',firstName='${firstName}',middleName='${middleName}', lastName='${lastName}', dob='${dob}',sex='${sex}', addressLine1='${addressLine1}', addressLine2='${addressLine2}', area='${area}', city='${city}', district='${district}', state='${state}', country='${country}', landmark='${landmark}', postalCode='${postalCode}',emailId1='${emailId1}',emailId2='${emailId2}',mobilePhone='${mobilePhone}',homePhone='${homePhone}',workPhone='${workPhone}',mobile= '${mobile}',home = '${home}',work= '${work}' where guid = '${guid}'`
    }
    console.log(sql);
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json('success'))
        .catch(err => logWriter(sql, err));
});

router.post('/getCaregiverDetailsForEdit', (req, res) => {
    var sql = `select * from master_caregiver where guid = '${req.body.id}';`
    execCommand(sql)
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));

});
router.post('/getGuarantorDetailsForEdit', (req, res) => {
    var sql = `select * from master_guarantor where guid = '${req.body.id}';`
    execCommand(sql)
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));

});
router.post('/getChoicesDataForEdit', (req, res) => {
    var sql = `select * from master_choices where guid = '${req.body.id}';`
    execCommand(sql)
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
});


// router.post('/caregiverInsertion', (req, res) => {
//     // console.log(req.body);
//     let {formState} = req.body;
//     let {guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone } = req.body.formData
//     let sql;
//     if(formState == 'new'){
//         sql = `insert into master_caregiver (guid, relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone)
//         values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}')`
//     }
//     else{
//         sql =  `update master_caregiver set relationship='${relationship}',firstName='${firstName}',middleName='${middleName}', lastName='${lastName}', dob='${dob}', sex='${sex}', addressLine1='${addressLine1}', addressLine2='${addressLine2}', area='${area}', city='${city}' , district='${district}', state='${state}', country='${country}', landmark='${landmark}', postalCode='${postalCode}',emailId1='${emailId1}',emailId2='${emailId2}',mobilePhone='${mobilePhone}',homePhone='${homePhone}',workPhone='${workPhone}' where guid = '${guid}'`
//     }
//     execCommand(sql.replace(/null/g,''))
//     .then(result => res.json('success'))
//     .catch(err => logWriter(sql, err));
// });



// router.post('/guarantorInsertion', (req, res) => {
//     const {guid, relationship, firstName, middleName, lastName, dob, sex, addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, industry, mobilePhone, homePhone, workPhone } = req.body.formData;
//     let {formState} = req.body
//     console.log(formState);
//     let sql = ``;
//     if(formState == 'new'){
//         sql = `insert into master_guarantor (guid,relationship, firstName, middleName, lastName, dob, sex , addressLine1, addressLine2, area, city, district, state, country, landmark, postalCode, emailId1, emailId2, mobilePhone, homePhone, workPhone)
//         values('${guid}','${relationship}','${firstName}','${middleName}', '${lastName}', '${dob}', '${sex}', '${addressLine1}', '${addressLine2}', '${area}', '${city}' , '${district}', '${state}', '${country}', '${landmark}', '${postalCode}','${emailId1}','${emailId2}','${mobilePhone}','${homePhone}','${workPhone}')`
//     }
//     else{
//         sql = `update master_guarantor set relationship='${relationship}',firstName='${firstName}',middleName='${middleName}', lastName='${lastName}', dob='${dob}',sex='${sex}', addressLine1='${addressLine1}', addressLine2='${addressLine2}', area='${area}', city='${city}', district='${district}', state='${state}', country='${country}', landmark='${landmark}', postalCode='${postalCode}',emailId1='${emailId1}',emailId2='${emailId2}',mobilePhone='${mobilePhone}',homePhone='${homePhone}',workPhone='${workPhone}' where guid = '${guid}'`
//     }
//     console.log(sql);
//     execCommand(sql.replace(/null/g,''))
//     .then(result => res.json('success'))
//     .catch(err => logWriter(sql, err));
// });
router.post('/ReferralsInsertion', (req, res) => {
    const { id, guid, referralType, referralState, source, specificSource, Name, companyName, emailId, phoneNumber1, phoneNumber2 } = req.body

    const command = `insert into transaction_referral (patient_id, referralType,source,specificSource, referralState, Name, companyName, emailId, phoneNumber1, phoneNumber2) values('${guid}','${referralType}','${source}', '${specificSource}', '${referralState}', '${Name}', '${companyName}', '${emailId}', '${phoneNumber1}', '${phoneNumber2}')`
    db.query(command, (err, result) => {
        if (err) {
            console.log(err);

        } else {
            res.json('success');
        }
    });
});
router.post('/choicesInsertion', (req, res) => {
    const { guid, phrInvitationSent, preferredLanguage, preferredCommunication, emailNotification, voiceNotification, textNotification, pharmacy } = req.body.formData
    const { formState } = req.body
    console.log(req.body.formData);
    let sql = ``
    if (formState == 'new') {
        sql = `insert into master_choices (guid, phrInvitationSent,  preferredCommunication, pharmacy) values('${guid}', ${phrInvitationSent},  '${preferredCommunication}',  '${pharmacy}')`;

    }
    else {
        // sql = `update master_choices set phrInvitationSent=${'phrInvitationSent'}, hippaNoticeSent=${'hippaNoticeSent'}, preferredCommunication='${'preferredCommunication'}', emailNotification=${emailNotification}, voiceNotification=${voiceNotification}, textNotification=${textNotification}, pharmacy='${pharmacy}' where guid = '${guid}'`

        sql = `update master_choices set phrInvitationSent=${'phrInvitationSent'},  preferredCommunication='${preferredCommunication}',preferedlanguage='${preferredLanguage}', pharmacy='${pharmacy}' where guid = '${guid}'`
    }
    console.log(sql);
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json('success'))
        .catch(err => logWriter(sql, err));
});
router.post('/PhrRegistration', (req, res) => {
    console.log(req.body);
    const { guid, firstName, lastName, mobileNo, emailId } = req.body.formData


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

router.post('/uploadProfile', fileupload, (req, res) => {
    console.log(fileupload);
    console.log(req.body);
    res.json('success');
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        var path = Globals.baseurl + file.originalname
        console.log(Globals.baseurl,file.originalname);
        path = path.substring(0, path.lastIndexOf("\\"));
        
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        //   cb(null, "\\\\192.168.1.123\\ngdata\\healaxyapp\\Hospital_data\\patientData\\profilepicture")
        cb(null, path);
    },
    filename: function (req, file, cb) {
        var name = file.originalname.replace(/^.*[\\\/]/, '')
        cb(null, name)

    }
})

const upload = multer({ storage: storage, preservePath: true })

//   function fileupload(req,res,next){
//       upload.array("profile")(req,res,next);
//       next();
//       res.json('success')
//   }

function fileupload(req, res, next) {
    upload.array("profile")(req, res, function (err) {
        if (err) {
            console.error('Error uploading files:', err);
            return res.status(500).json({ error: 'Error uploading files' });
        }
        // At this point, the file upload has been completed and processed.
        // You can perform any additional operations with the uploaded files if needed.

        // Do any additional processing here...

        // Send a response indicating the successful upload.
        res.json('success')
    });
}

router.post('/getSearchedInsuranceProvider', (req, res) => {
    const query = req.body.query
    console.log(query);
    let sql = `select * from insurance_provider where Insurance_providerName like '${query}%'`;
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
})

router.post('/getInsuranceProvidrData', (req, res) => {
    const patient_id = req.body.patient_id

    let sql = `select * from patient_insurance where guid ='${patient_id}'`;
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
})

router.post('/saveInsuranceForm', (req, res) => {
    const value = req.body.value;
    const state = req.body.state;
    const type = req.body.type;
    let query = ``;
    if (state == 'new') {
        query = `insert into patient_insurance (guid, type, payer, planName, startdate, groupnumber, subscriber, relationship, subs_dob, subs_gender, subs_adhaar, memberid, copay, deductibles, coinsurance, cin, tin, gstin, subs_address) 
      values('${value.guid}','${type}','${value.payer.id}','${value.planName}','${value.startdate}','${value.groupnumber}','${value.subscriber}','${value.relationship}','${value.dob}','${value.gender}','${value.adhaar}','${value.memberid}','${value.copay}','${value.deductibles}','${value.coinsurance}','${value.cin}','${value.tin}','${value.gstin}','${value.address}')`
    }
    else {
        query = `delete from patient_insurance where guid = '${value.guid}' and type = '${type}';insert into patient_insurance (guid, type, payer, planName, startdate, groupnumber, subscriber, relationship, subs_dob, subs_gender, subs_adhaar, memberid, copay, deductibles, coinsurance, cin, tin, gstin, subs_address) 
      values('${value.guid}','${type}','${value?.payer?.id}','${value.planName}','${value.startdate}','${value.groupnumber}','${value.subscriber}','${value.relationship}','${value.dob}','${value.gender}','${value.adhaar}','${value.memberid}','${value.copay}','${value.deductibles}','${value.coinsurance}','${value.cin}','${value.tin}','${value.gstin}','${value.address}')`
    }

    execCommand(query.replace(/null/g, ''))
        .then(result => res.json('success'))
        .catch(err => logWriter(query, err));
})


router.post('/getPatientInsuranceDetails', (req, res) => {
    const id = req.body.id;
    const type = req.body.type;
    let query = `SELECT *, (select Insurance_providerName from insurance_provider where id = patient_insurance.payer) as payerName FROM patient_insurance where guid = '${id}' and type = '${type}'`
    execCommand(query.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(query, err));
})

// router.post('/saveInsuranceForm', (req, res) => {
//     const value = req.body.value;
//     const state = req.body.state;
//     const type = req.body.type;
//     let query = ``;
//     if (state == 'new') {

//         query = `insert into patient_insurance (guid, type, productName, planName, startdate, groupnumber, subscriber, relationship, subs_dob, subs_gender, subs_adhaar, memberid, copay, deductibles, coinsurance, cin, tin, gstin, subs_address) 
//       values('${value.guid}','${type}','${value.payer.id}','${value.planName}','${value.startdate}','${value.groupnumber}','${value.subscriber}','${value.relationship}','${value.dob}','${value.gender}','${value.adhaar}','${value.memberid}','${value.copay}','${value.deductibles}','${value.coinsurance}','${value.cin}','${value.tin}','${value.gstin}','${value.subs_address}')`
//         console.log(query);
//     }
//     else {
//         query = `delete from patient_insurance where guid = '${value.guid}' and type = '${type}';insert into patient_insurance (guid, type, productName, planName, startdate, groupnumber, subscriber, relationship, subs_dob, subs_gender, subs_adhaar, memberid, copay, deductibles, coinsurance, cin, tin, gstin, subs_address) 
//       values('${value.guid}','${type}','${value?.payer?.id}','${value.planName}','${value.startdate}','${value.groupnumber}','${value.subscriber}','${value.relationship}','${value.dob}','${value.gender}','${value.adhaar}','${value.memberid}','${value.copay}','${value.deductibles}','${value.coinsurance}','${value.cin}','${value.tin}','${value.gstin}','${value.subs_address}')`

//     }

//     // console.log(query);
//     // let sql = `select * from insurance_provider where Insurance_providerName like '${query}%'`;
//     execCommand(query.replace(/null/g, ''))
//         .then(result => res.json('success'))
//         .catch(err => logWriter(query, err));
// })


// router.post('/getPatientInsuranceDetails', (req, res) => {
//     const id = req.body.id;
//     const type = req.body.type;


//     let query = `select * from patient_insurance where guid = '${id}' and type = '${type}'`


//     console.log(query);
//     // let sql = `select * from insurance_provider where Insurance_providerName like '${query}%'`;
//     execCommand(query.replace(/null/g, ''))
//         .then(result => res.json(result))
//         .catch(err => logWriter(query, err));
// })

router.post('/SelectheaderTrackboardPatient', (req, res) => {
    const gridId = req.body.gridID;
    console.log("req=>", req.body);
    userid = '2',
        component = req.body.grid_id
    selected = req.body.column

    let query = `DELETE from master_billing_common_grid_column_hide  WHERE user_id = '${userid}' and component_name = '${component}';`
    execCommand(query).then((result) => postheader0(selected, component, userid, function callback() {
        res.json('success');
    })).catch(err => logWriter(query, err))
})


function postheader0(selected, component, userid, callback) {
    let i = 0;
    (function loop() {
        if (i < selected.length) {
            let query = `INSERT INTO master_billing_common_grid_column_hide (component_name, header, header_active, field_name, user_id) VALUES 
          ('${component}','${selected[i].header}',if('${selected[i].isseleted}' ='true','1','0') ,'${selected[i].id}','${userid}');`
            // console.log(query);
            execCommand(query).
                then((result) => {
                    i++;
                    loop();
                })
                .catch(err =>
                    logWriter(query, err)
                )
        } else {
            callback();
        }

    })();
}




router.post("/getheader", (req, res, next) => {


    userid = '2',
        component = req.body.gridID

    console.log(req.body);

    var query = `SELECT component_name, header, header_active, field_name as id, user_id FROM  master_billing_common_grid_column_hide   where component_name = '${component}'; `
    execCommand(query)
        .then((result) => res.json(result))
        .catch(err => logWriter(query, err))
})
router.post("/EdCourseSave", (req, res) => {
    console.log('amanKUmar', req.body);
    var patient_id = req.body.patientguid
    var branchId = req.body.branchId
    var hospitalId = req.body.hospitalId
    var editorsValue = req.body.editorsValue.replace(/'/g, "''");
    var date = req.body.EdCOurseDate
    var convertedDate = new Date(date);
    //  console.log('+++++++=======>',convertedDate)

    let isoDate = convertedDate;
    var d = new Date(isoDate);

    let time = d.toLocaleTimeString('en-GB');
    let timeWithoutSeconds = time.slice(0, 5); // Extract first 5 characters
    let timeWithoutSecondsFormatted = timeWithoutSeconds.split(':').join('');

    // console.log("================================================",d.toLocaleDateString('en-GB') ,d.toLocaleTimeString('en-GB')); // dd/mm/yyyy
    let dateFor = d.toLocaleDateString('en-GB');
    console.log(dateFor);
    let databaseDate = `${dateFor.split('/')[2]}-${dateFor.split('/')[1]}-${dateFor.split('/')[0]}`
    console.log(databaseDate, timeWithoutSeconds);

    var edCourseData = req.body.edCourseData?.ParentName

    var query = `Insert into transaction_ed_course(patient_id, hospital_id, branch_id, Ed_course_notes, Date, transaction_time, lab) 
      values('${patient_id}','${hospitalId}','${branchId}','${editorsValue}','${databaseDate} ${timeWithoutSeconds}:00',now(),'${edCourseData}');`
    execCommand(query)
        .then((result) => res.json('suceess'))
        .catch(err => logWriter(query, err))
})

router.post('/getEdCourseData', (req, res) => {
    var hospitalId = req.body.hospitalId
    var branchId = req.body.branchId
    var patient_id = req.body.patientguid

    var sql = `SELECT * FROM transaction_ed_course where patient_id = '${patient_id}' AND hospital_id = '${hospitalId}' AND branch_id = '${branchId}';`
    execCommand(sql)
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
});

router.post('/getDispostionData', (req, res) => {
    const text = req.body.text

    let sql = `select * from master_disposition where disposition_name like '${text}%'`;
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
})
router.post('/master_EpisodeOfCareAPI', (req, res) => {
    const text = req.body.text

    let sql = `select * from master_episode_of_care where episode_name like '${text}%'`;
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
})
router.post('/getTransactionDisposition', (req, res) => {
    console.log(req.body);
    var hospitalId = req.body.hospitalId
    var patientguid = req.body.patientguid
    var branchID = req.body.branchId

    let sql = `select * from transaction_disposition where patient_id ='${patientguid}'AND hospital_id='${hospitalId}' AND  branch_id='${branchID}'`;
    console.log(sql);
    execCommand(sql)
        .then(result => res.json(result))
        .catch(err => logWriter(sql, err));
})

router.post('/saveDisposition', (req, res) => {
    // console.log(req.body);
    var hospitalId = req.body.hospitalId
    var patientguid = req.body.patientguid
    var branchID = req.body.branchID
    var disposition_name = req.body.formvalue.Disposition.disposition_name
    var notes = req.body.formvalue.notes
    var disposition_id = req.body.formvalue.Disposition.id

    let sql = `Insert into transaction_disposition(patient_id, hospital_id, branch_id, disposition_name, comments, disposition_id,transactionTime) 
              values('${patientguid}','${hospitalId}','${branchID}','${disposition_name}','${notes}','${disposition_id}',now())`;
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json('result'))
        .catch(err => logWriter(sql, err));
})

router.post('/saveinternalcomments', (req, res) => {
    console.log(req.body);
    // var hospitalId=req.body.hospitalId
    // var patientguid=req.body.patientguid
    // var branchID=req.body.branchID
    var ineternalcomments = req.body.formvalue.ineternalcomments
    var dispositiondate = req.body.formvalue.dispositiondate
    var disposition_id = req.body.data.id

    let sql = `update transaction_disposition set internal_comment='${ineternalcomments}',  Dispostion_Date='${dispositiondate}' where id ='${disposition_id}'`;
    execCommand(sql.replace(/null/g, ''))
        .then(result => res.json('result'))
        .catch(err => logWriter(sql, err));
})

router.post("/linkingpatientsApi", (req, res) => {
    console.log('linkingpatientsApi', req.body);
    var patient_id = req.body.patient.guid
    var patientsName = req.body.patient.completeName
    var linkingpatientsid = req.body.formvalue.LinkingPatient.guid
    var linkingReason = req.body.formvalue.linkingReason
    var command = `select count(*) as count from master_patient_linking where patientId='${patient_id}' And linking_patientId='${linkingpatientsid}';`
    execCommand(command)
        .then((result) => {
            console.log(result);
            if (result[0].count == 0) {
                if (linkingpatientsid != patient_id) {
                    var query = `Insert into master_patient_linking( patientName, patientId, linking_patientId,linking_reason) 
                    values('${patientsName}','${patient_id}','${linkingpatientsid}','${linkingReason}');`
                    execCommand(query)
                        .then((result) => res.json('suceess'))
                        .catch(err => logWriter(query, err))
                } else {
                    res.json('samepatients')
                }

            } else {
                console.log('alreadylink');
                res.json('alreadylink')
            }

        }
        )
})

router.post("/decesedpatientsApi", (req, res) => {
    console.log('decesedpatientsApi', req.body);
    var patient_id = req.body.patient.guid
    var patientsName = req.body.patient.completeName
    var deceasedDate = req.body.formvalue.deceasedDate
    var deceasedReason = req.body.formvalue.deceasedReason
    var query = `Update  master_patient set deceasedStatus='1' , deceasedDate='${deceasedDate}', deceasedReason='${deceasedReason}' where guid='${patient_id}'`

    execCommand(query)
        .then((result) => res.json('suceess'))
        .catch(err => logWriter(query, err))



})
router.post("/ActiveIncativePatient", (req, res) => {
 console.log(req.body);
    var patient_id = req.body.id
    var active = req.body.active

    var query = `Update  master_patient set active='${active}'  where id='${patient_id}'`

    execCommand(query)
        .then((result) => res.json('suceess'))
        .catch(err => logWriter(query, err))



})

router.post("/getPatientMastertTag", (req, res) => {
    console.log(req.body);
       var text = req.body.text
    
   
       var query = `select * from master_patient_master_tag where tagname like  '${text}%'`
   
       execCommand(query)
           .then((result) => res.json(result))
           .catch(err => logWriter(query, err))
   
   
   
   })

   router.post("/saveCreatedTag", (req, res) => {
    console.log('saveCreatedTag', req.body);
    var patient_id = req.body.patient.guid
    var hospital_id=req.body.patient.hospitalId
    var branchId=req.body.patient.branchId
    var tagname = req.body.formvalue.tagname
    var array = []
    var j = 0;
  
    (function loop() {
      if (j < tagname.length) {
         array.push(tagname[j].tagname)
          j++; 
          loop()
      
        
    }
    else{
        var commaSeparatedTagNames = array.join(',');
        var command= `Update  master_patient set tag='${commaSeparatedTagNames}' Where guid='${patient_id}'`;
        console.log(command);
        execCommand(command)
        .then((result) => res.json('success'))
        .catch(err => logWriter(command, err));
   
    }
  }())
})

router.post("/getpatintlinkDataAll", (req, res) => {
    console.log(req.body);
    patientId=req.body.patient.guid
       var query = `SELECT  master_patient_linking.*, master_patient.guid AS guid,master_patient.displayName AS master_patient_displayName, master_patient.*, CONCAT(master_patient.displayName,' P-',master_patient.id,' ' ' as ', master_patient_linking.linking_reason) AS linkPatientnameReason FROM master_patient_linking INNER JOIN master_patient ON master_patient.guid = master_patient_linking.linking_patientId WHERE master_patient_linking.patientId = '${patientId}'`
   
       execCommand(query)
       .then((result) => res.json(result))
           .catch(err => logWriter(query, err))
   
   
   
   })
   router.post("/getTagNameDataAll", (req, res) => {
    console.log(req.body);
    patientId=req.body.patient.guid
       var query = `SELECT *FROM transaction_patient_tag WHERE patient_id = '${patientId}'`
   
       execCommand(query)
           .then((result) => res.json(result))
           .catch(err => logWriter(query, err))
   
   
   
   })
module.exports = router;