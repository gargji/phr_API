const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');
const { request } = require('express');
const con = require('../config/db');
const command = require('nodemon/lib/config/command');


// SELECT REASON OF  VISIT
router.post('/phr_Reasonoffvisit', (req, res) => {
    var patientID = req.body.patientID
    var command = `select * from phr_transaction_reason_of_visit  where patient_id='${patientID}' group by chief_complan_name ORDER BY id DESC;`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})
router.post('/phr_submit_reasonofvisitservice', (req, res) => {


    console.log(req.body);
    console.log(req.body.reasonofvisitinsert.reasonofvisit_insert.id, 'hh');

    var resan_visit_id = req.body.reasonofvisitinsert.reasonofvisit_insert.id

    var patientID = req.body.patientID;
    var patientIDsec = req.body.patientID;

    var reasonofvisit = req.body.reasonofvisitinsert.reasonofvisit_insert.name
        // var ResionOfVisitID=req.body.ResionOfVisitID
    var dateantime = req.body.datetime

    var command = `INSERT INTO phr_transaction_reason_of_visit (patient_id,chief_complan_ID, chief_complan_name,  transaction_by, transaction_time) values ('${patientID}','${resan_visit_id}','${reasonofvisit}', '${patientIDsec}', '${dateantime}')  `;
    console.log(command, "104")
    execCommand(command)
        .then(result => res.json('Sucess'))
        .catch(err => logWriter(command, err));
});
router.post('/phr_Patientprobl', (req, res) => {
    var patientID = req.body.patientID;
    const command = `DELETE FROM phr_transaction_reason_of_visit WHERE id='${patientID}' `;

    console.log(command);

    execCommand(command)    
        .then(result => {
            if (result.affectedRows > 0) {
                res.json('success');
            } else {
                res.json('failed');
            }
        })
        .catch(err => {
            logWriter(command, err);
            res.json('failed: Internal server error');
        });
});
// SELECT REASON OF  VISIT END
router.post('/phr_filterreasonofvisitservices', (req, res) => {
    var display_name = req.body.text;
    const command = `select * from master_chief_complaints where name like '%${display_name}%' ;`;
    console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


// provider data Start Hear


// const command = `SELECT *,(select emailId1 from provider_contact where provider_id=provider_personal_identifiers.guid) as emailid,(select mobilePhone from provider_contact where provider_id=provider_personal_identifiers.guid) as mobilePhone 
//  ,(select speciality from provider_professional_information where provider_id=provider_personal_identifiers.guid) as specility ,(select experience from provider_professional_information where provider_id=provider_personal_identifiers.guid) as experience ,(select qualification from provider_professional_information where provider_id=provider_personal_identifiers.guid) as qualification from provider_personal_identifiers where hospital_id = '${hospitalId}' and branchId = '${branchId}'`;
// console.log(command);
//  execCommand(command)



router.post("/phr_getAllProvidersOfhospital", (req, res) => {

    var PatientId = req.body.patientID
    var newhospitalid = req.body.newhospitalid
    const command = `SELECT *,(select experience from provider_professional_information where provider_id=phr_transaction_prvider.provider_ID) as experience ,(select qualification from provider_professional_information where provider_id=phr_transaction_prvider.provider_ID) as qualification,(select profile from provider_professional_information where provider_id=phr_transaction_prvider.provider_ID) as Profile from phr_transaction_prvider where Patient_Id='${PatientId}' and hospital_ID='${newhospitalid}' group by provider_ID`;

    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});

router.post("/phr_providernamedata", (req, res) => {

    var newhospitalid = req.body.newhospitalid
    const command = `SELECT * from provider_personal_identifiers where branchId='${newhospitalid}'`;
    console.log('phr', command);
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});



router.post("/phr_gethospitaldata", (req, res) => {
    var patientID = req.body.patientID;
    const command = `select phr_transaction_location.id,patient_id,hospital_id,hospital_name,loaction_address ,concat(addressLine1,"  ",district_name,"  ",states_name," ",Country) as address from phr_transaction_location  inner join hosptal_registration on phr_transaction_location.hospital_id=hosptal_registration.guid  where patient_id='${patientID}' GROUP BY hospital_id  `;
    // console.log('fdsdsddfsdfsdsd', command);
    // select * from phr_transaction_location  where patient_id='${patientID}' GROUP BY hospital_id 
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});
router.post('/phr_hospital', (req, res) => {
    var patientID = req.body.patientID
    const command = `delete from phr_transaction_location where id='${patientID}'`;
    console.log(command,"this is delete location data")
    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err))
})


router.post("/phr_hospitalClinicData", (req, res) => {
    console.log(req.body)
    var organization_id = req.body.organization_id
    console.log("hit", organization_id);
    const command = `
    SELECT hr.guid as hospitalid,tro.organization_name,hr.*, CONCAT(hr.addressLine1, ' ', hr.district_name, ' ', hr.states_name, ' ',hr.Country) AS address
    FROM hosptal_registration hr
    INNER JOIN transaction_organization tro ON hr.organzation_id = tro.guid
    WHERE hr.organzation_id ='${organization_id}'`;
    console.log('fdsdsddfsdfsdsdnsjdnjsdnjsndjsndjsndj', command);
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});








router.post('/phr_submit_Hospitaladdressdata', (req, res) => {


    var patientID = req.body.patientID;
    var clinic = req.body.Hospitallocationinsert.Hospital_name_insert.clinicName;
    var clinic_address = req.body.Hospitallocationinsert.Hospital_name_insert.addressLine1;
    var patientIDsec = req.body.patientID;
    var seletedHospitalId = req.body.seletedHospitalId
    var command = `INSERT INTO phr_transaction_location(patient_id,hospital_id, hospital_name, loaction_address, transaction_time, transaction_by) values ('${patientID}','${seletedHospitalId}' ,'${clinic}', '${clinic_address}', now(), '${patientIDsec}')  `;
    console.log(command, 'hospital name inter');
    execCommand(command)
        .then(result => res.json('Sucess'))
        .catch(err => logWriter(command, err));
});

router.post('/phr_submit_Provider_data', (req, res) => {
    console.log(req.body);
    var patientID = req.body.patientID;
    var providername = req.body.providerdatainsert.provider_name_insert.firstname
    var patientIDsec = req.body.patientID;
    var Provider_id = req.body.providerdatainsert.provider_name_insert.guid;
    var seletedHospitalproviderId = req.body.providerdatainsert.provider_name_insert.branchId;

    var command = `INSERT INTO phr_transaction_prvider(Patient_Id,hospital_ID,provider_ID, Provider_name, transation_Provider_time,provider_transation_by) values ('${patientID}','${seletedHospitalproviderId}','${Provider_id}', '${providername}', now(), '${patientIDsec}')  `;
    console.log(command, 'provider name inter');
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

router.post('/phr_delprovider', (req, res) => {
    var patientID = req.body.patientID
    const command = `delete from phr_transaction_prvider where id='${patientID}'`;
    console.log(command)
    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err))
})

//  FOR BOOK APPOINMENT
router.post('/phr_slottimebokking', (req, res) => {
    console.log(req.body);
    var FinalData_PatientID = req.body.finalData.patientid;
    var FinalData_PatientName = req.body.finalData.Patientname;
    var FinalData_ProviderID = req.body.finalData.provideerId;
    var FinalData_hospitalID = req.body.finalData.hospitalID;
    var branchID = req.body.finalData.branchID
    var FinalData_ResonOfVisit = req.body.finalData.inputreasionofvisitValue;
    var FinalData_hospitalname = req.body.finalData.inputhospitalnameValue;
    var FinalData_providername = req.body.finalData.inputprovidernameValue;
    var FinalData_Slot_time = req.body.finalData.Slot_time;
    var FinalData_Slot_Datetime = req.body.finalData.Slot_time;
    console.log(FinalData_Slot_time, "this is slot date");

    var FinalData_Slot__End_time = req.body.finalData.Slot_End_time;
    var FinalData_Slot__DateEnd_time = req.body.finalData.Slot_End_time;
    var FinalData_Slot_days = req.body.finalData.Slot_days;
    var FinalData_Slot_date = req.body.finalData.Slot_date;
    console.log(FinalData_Slot_date, "this is slot date");
    var FinalData_DataTimeType = req.body.finalData.Data_Time_Type;
    var FinalData_AppointmentType = req.body.finalData.Appointment_Type;
    var FinalData_VisitType = req.body.finalData.Visit_Type;
    var FinalData_Duration = req.body.finalData.Duration;
    var FinalData_reason_of_visit_ID = req.body.finalData.Reasion_Of_visit;
    var visit_status = req.body.finalData.visit_status

    // for slot status changes
    var slot_id = req.body.finalData.slotid

    console.log(slot_id, "slot_id")

    // for breck slot time 
    // Splitting using string manipulation
    const [datePart, timePart] = FinalData_Slot_time.split(' ');
    console.log("Date:", datePart); // Output: Date: 2023-08-24
    console.log("Time:", timePart); // Output: Time: 15:30:00

    const command = `INSERT INTO transaction_appointment(patient_id,patient_name, provider_id, hospital_id,branch_id, reason, Facility, provider_name,start_time, time_preferance, start_date, data_time_type,Appointment_type, visit_type, Duration, end_time, end_date, reason_of_visit,visit_status,uploaded_by) values ('${FinalData_PatientID}','${FinalData_PatientName}','${FinalData_ProviderID}', '${FinalData_hospitalID}', '${branchID}','${FinalData_ResonOfVisit}', '${FinalData_hospitalname}','${FinalData_providername}', '${FinalData_Slot_time}','${FinalData_Slot_days}','${FinalData_Slot_Datetime}','${FinalData_DataTimeType}', '${FinalData_AppointmentType}','${FinalData_VisitType}','${FinalData_Duration}','${FinalData_Slot__End_time}','${FinalData_Slot__DateEnd_time}','${FinalData_reason_of_visit_ID}','${visit_status}','PHR')  `;
    console.log(command, 'slotinsert name inter');
    execCommand(command)
        .then((result) => {
            // let command2 = `UPDATE master_slots
            // SET Status =1
            // WHERE provider_id='${FinalData_ProviderID}' AND  Date='${FinalData_Slot_date}' AND Start_time='${timePart}'`

            let command2 = `UPDATE master_slots
            SET Status ='1'
            WHERE id='${slot_id}'`
            console.log(command2)
            execCommand(command2).then(result => res.json('sucess')).catch(err => logWriter(command2, err));



            // res.json('Sucess')
        })
        .catch(err => logWriter(command, err));
});

router.post("/phr_getSlot_Booking", (req, res) => {
    console.log('phhbnhhnhnhjn', req.body);
    var PatientID = req.body.patientID
    // console.log(PatientID, 'Deepak Dixit Patient id');
    var HospitalID = req.body.newhospitalid2
    // console.log(HospitalID, 'Deepak Dixit HospitalID id');
    var Provider_ID = req.body.ProviderID
    // console.log(Provider_ID, 'Deepak dixit providerID');
    // for current date
    const date = new Date();

    let currentDay = String(date.getDate());

    let currentMonth = String(date.getMonth() + 1);

    let currentYear = date.getFullYear();

    // we will display the date as DD-MM-YYYY 

    let currentDate = `${currentMonth}/${currentDay}/${currentYear}`;
    console.log(currentDate)
        // 
    const command = `SELECT * from master_slots where Provider_id='${Provider_ID}' AND Status='0'   and    concat(Date,' ',Start_time ) >= NOW() order by Date,Start_time ; `;
    
   
    console.log('get slot booking', command);
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));

        //  AND   STR_TO_DATE(CONCAT(Date, ' ', Start_time), '%m/%d/%Y %H:%i') >= NOW() ORDER BY Date
});

// for reqest for visit
router.post("/phr_reqestforvisit", (req, res) => {
    console.log('reqestfor visit', );


    var FinalData_PatientID = req.body.obj.patientid;
    var FinalData_PatientName = req.body.obj.Patientname;
    var FinalData_ProviderID = req.body.obj.provideerId;
    var FinalData_hospitalID = req.body.obj.hospitalID;
    var branchID = req.body.obj.branchID
    var FinalData_ResonOfVisit = req.body.data.reason;
    var FinalData_hospitalname = req.body.data.location;
    var FinalData_providername = req.body.data.provider;
    var anytimecheck = req.body.data.anytime_data;
    var FinalData_reason_of_visit_ID = req.body.obj.Reasion_Of_visit;
    var Appointment_Type = req.body.data.Appoinment_type
        // console.log('hhhh', req.body.data.Appoinment_type)
    var starttime = req.body.data.time
    var endtime = req.body.data.endtime
    var dateString = req.body.data.date
        // for date formate
    var date = new Date(req.body.data.date);
    // console.log(dateString)


    var formattedDates = '';

    console.log(formattedDates);



    // var year = date.getFullYear();
    // var month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-based
    // var day = String(date.getDate()).padStart(2, '0');
    // var hours = String(date.getHours()).padStart(2, '0');
    // var minutes = String(date.getMinutes()).padStart(2, '0');
    // var seconds = String(date.getSeconds()).padStart(2, '0');

    // const formattedDates = date.map(dateString => {
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString('en-US'); // Change 'en-US' to your desired locale
    // });

    // const datechnagedformated = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    // console.log(datechnagedformated)
    // console.log(datechnagedformated)
    var formattedTime = ''
    var formattedendTime = ''


    console.log(formattedTime, "this is start time")
    console.log(formattedendTime, "this is end time")
    var command = ''

    if (anytimecheck == true) { // anytime is true
        console.log("1")
        var command = `INSERT INTO phr_reqestforvisit(patient_id,patient_name, provider_id, hospital_id,branch_id,start_time,start_date , end_time,  reason_of_visit, Appointment_type) values ('${FinalData_PatientID}','${FinalData_PatientName}','${FinalData_ProviderID}', '${FinalData_hospitalID}', '${branchID}', '${formattedTime}','${formattedDates}','${formattedendTime}','${FinalData_reason_of_visit_ID}','${Appointment_Type}')  `;
    } else {
        console.log("2")
        formattedTime = forchnagetimeformate(starttime);
        formattedendTime = forchnagetimeformate(endtime);
        formattedDates = dateString.map(dateString => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            // Format as 'YYYY-MM-DD' (or your desired format)
            return `${year}-${month}-${day}`;
        });
        var command = `INSERT INTO phr_reqestforvisit(patient_id,patient_name, provider_id, hospital_id,branch_id,start_time,start_date , end_time,  reason_of_visit, Appointment_type) values ('${FinalData_PatientID}','${FinalData_PatientName}','${FinalData_ProviderID}', '${FinalData_hospitalID}', '${branchID}', '${formattedTime}','${formattedDates}','${formattedendTime}','${FinalData_reason_of_visit_ID}','${Appointment_Type}')  `;
    }

    console.log(command, 'reqest for visit');
    execCommand(command)
        .then((result) => {
            res.json("sucess")
        })
        .catch((err) => logWriter(command, err));
});
// for reqest for visit end

function forchnagetimeformate(data) {
    var utcTime = data;

    // Create a Date object from the UTC time
    var utcDate = new Date(utcTime);

    // Set the time zone to IST (Indian Standard Time)
    utcDate.setUTCHours(utcDate.getUTCHours() + 5); // Add 5 hours for UTC to IST
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() + 30); // Add 30 minutes for UTC to IST

    // Format the date and time in IST as a string
    return utcDate.toISOString().replace('T', ' ').slice(0, 19);

    // console.log(istTime);
}

// for appoinment type
router.get('/phr_appoinmenttype', (req, res) => {


    var command = `SELECT * FROM master_appointment_type  `;
    console.log(command, 'provider name inter');
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

// for appoinment type end

module.exports = router;