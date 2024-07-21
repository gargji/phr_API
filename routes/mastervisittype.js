const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')


router.post('/AddInsertVisitType', (req, res) => {
    console.log('AddInsertVisitType', req.body);
    var id = req.body.id;
    var returnmessage = "S";

    // Function to handle null or undefined values and convert them to empty strings
    const handleNull = (value) => {
        return (value === null || value === undefined) ? '' : value;
    };

    // Use the handleNull function to convert potential null values to empty strings
    const visitType = handleNull(req.body.data.visit_type);
    const langId = handleNull(req.body.langid);
    const color = handleNull(req.body.data.color);
    const charge = handleNull(req.body.data.charge);
    const duration = handleNull(req.body.data.duration);
    const procedureCode = handleNull(req.body.data.procedurecode);
    const defaultTemplate = handleNull(req.body.data.defaulttemplate);
    const appointment = handleNull(req.body.data.appointment);

    var command;

    if (id == '' || id == '0' || id == undefined) {
        command = `INSERT INTO master_visit_type (visit_type, lang_id, color, charge, duration, procedurecode, defaulttemplate, appointment) VALUES ('${visitType}', '${langId}', '${color}', '${charge}', '${duration}', '${procedureCode}', '${defaultTemplate}', '${appointment}')`;
    } else {
        command = `UPDATE master_visit_type SET visit_type = '${visitType}', lang_id = '${langId}', color = '${color}', charge = '${charge}', duration = '${duration}', procedurecode = '${procedureCode}', defaulttemplate = '${defaultTemplate}', appointment = '${appointment}' WHERE (id = '${id}')`;
        returnmessage = "U";
    }

    console.log(command);

    execCommand(command)
        .then(result => res.json(returnmessage))
        .catch(err => logWriter(command, err));
});






router.get('/Getmaster_visit_type', (req, res) => {
    const command = `Select * from master_visit_type; `;
    // console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

});


router.post('/activedeactivemaster_VisitTypeAPI', (req, res) => {
    console.log('activedeactivemaster_VisitTypeAPI=>', req.body);
    var id = req.body.id;
    var active = req.body.active

    const command = `Update master_visit_type set status='${active}' where id='${id}';`;
    console.log(command);

    execCommand(command)
        .then(result => res.json('success'))
        .catch(err => logWriter(command, err));

});

router.post('/deletetable_master_Visit_type', (req, res) => {
    var id = req.body.id;

    const command = `delete from master_visit_type where id=${id};`;
    console.log(command);

    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err));
})

module.exports = router;