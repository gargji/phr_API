const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')


router.post("/getvisittypebasedonprovider", (req, res) => {
    var id = req.body.id
    const command = `SELECT providers, mvtp.visit_type as Id, mvt.visit_type
    FROM master_vist_type_to_providers mvtp
    left join master_visit_type mvt on mvt.id = mvtp.visit_type
    where  providers =  '${id}'`;
    console.log(command);
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});


router.post('/AddInsertScheduleRules', async (req, res) => {
    console.log('AddInsertScheduleRules', req.body);
    const facility = req.body.facility;
    const Provider = req.body.provider;
    const Visittypes = req.body.visittype;
    const days = req.body.data;
    const update = req.body.update.Providerid;

    if (!update) {
        console.log('insert');
        command = `select 1+1;`
        execCommand(command)
            .then(() => {
                return Insertschedule(facility, Provider, Visittypes, days);
            })
            .then(() => {
                res.json('S');
            })
            .catch(err => logWriter(command, err));
    } else {
        // If id is provided and it's an update operation
        console.log('update');
        command = `DELETE FROM master_visit_schedule WHERE Provider = '${update}';`
        console.log(command);
        execCommand(command)
            .then(() => {
                return Insertschedule(facility, Provider, Visittypes, days);
            })
            .then(() => {
                res.json('U');
            })
            .catch(err => logWriter(command, err));
    }
});


function Insertschedule(facility, Provider, Visittypes, days) {
    return new Promise((resolve, reject) => {
        let i = 0;
        (function loop() {
            if (i < days.length) {
                console.log('Insertschedule=>>>>>>>>>', days);
                let query = `  INSERT INTO master_visit_schedule (Facility, Provider, VisitType, days_id, daysname, checked, appontment_count) VALUES ('${facility}', '${Provider}', '${Visittypes}', '${days[i].id}','${days[i].name}', '${days[i].checked}','${days[i].scheduler}');`
                console.log(query);
                execCommand(query)
                    .then((result) => {
                        i++;
                        loop();
                    })
                    .catch(err =>
                        logWriter(query, err)
                    )
            } else {
                resolve();
            }
        })();
    });
}



// Function to execute SQL command with parameters
function execCommandWithParams(command, values) {
    return new Promise((resolve, reject) => {
        // Assuming you have a database connection pool or client, replace 'db' with your database client
        db.query(command, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}




router.get('/Getmaster_visit_type_scheduleAPI', (req, res) => {
    const command = `SELECT
    MVS.ID,
    hr.clinicName as Facility,
    CONCAT(p.firstname, ' ', p.Lastname) AS Provider,
    p.Id as Providerid,
    mvt.visit_type as Visittypes,
    GROUP_CONCAT(CONCAT(MVS.daysname, ' (', MVS.appontment_count, ')') ORDER BY MVS.days_id) AS Schedule_rules
FROM
    MASTER_VISIT_SCHEDULE MVS
JOIN
    hosptal_registration HR ON HR.ID = MVS.FACILITY
LEFT JOIN
    provider_personal_identifiers P ON P.ID = MVS.Provider
LEFT JOIN
    master_visit_type MVT ON MVT.ID = MVS.VisitType
GROUP BY MVS.Provider;
`
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

});

router.post('/getallfacilities', (req, res) => {
    // console.log('getallfacilities',req.body.data);
    var organzation_id = req.body.data;
    // console.log(branchid);
    const command = `select *,(select organization_name from transaction_organization where guid= hosptal_registration.organzation_id) as organization from hosptal_registration where organzation_id='${organzation_id}'`;

    console.log('getallfacilities', command);
    db.query(command, (err, result) => {
        if (err) {
            res.json({ status: 'fail', error: err });
        } else {
            res.json(result);

        }
    });
})



router.post('/deletetable_master_schedulevisitTypeAPI', (req, res) => {
    console.log('deletetable_master_schedulevisitTypeAPI=>>>>>>>>>>', req.body);
    var id = req.body.data;

    const command = `delete from master_visit_schedule where Provider = ${id};`;
    console.log(command);

    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err));
})

router.post('/getmaster_schedulerulepatchAPI', (req, res) => {
    console.log('getmaster_schedulerulepatchAPI=>>>>>>>>>>', req.body);
    var id = req.body.data.Providerid;

    const command = `SELECT ID, Facility, Provider , VisitType, days_id, daysname, checked, appontment_count FROM master_visit_schedule where Provider = '${id}';`

    console.log(command);

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


module.exports = router;