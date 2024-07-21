const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')


router.post("/getallproviders", (req, res) => {
    console.log('getallproviders===================', req.body);
    var hospitalId = req.body.hospitalid
    var branchId = req.body.branchid
    const command = `SELECT *,
    CONCAT_WS(' ', COALESCE(firstname, ''), COALESCE(lastname, '')) AS providername,(select emailId1 from  provider_contact where provider_id=provider_personal_identifiers.guid) as emailid,(select mobilePhone from  provider_contact where provider_id=provider_personal_identifiers.guid) as mobilePhone 
    ,(select speciality  from provider_professional_information where provider_id=provider_personal_identifiers.guid) as specility ,(select experience  from provider_professional_information where provider_id=provider_personal_identifiers.guid) as experience ,(select qualification  from provider_professional_information where provider_id=provider_personal_identifiers.guid) as qualification from provider_personal_identifiers where hospital_id = '${hospitalId}' and branchId = '${branchId}'`;
    //    console.log(command);
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});

router.get("/getallVisittypes", (req, res) => {
    console.log('getallVisittypes===================', req.body);
    const command = `SELECT * FROM master_visit_type where status = 'A';`;
    console.log(command);
    execCommand(command)
        .then((result) => res.json(result))
        .catch((err) => logWriter(command, err));
});

router.post('/AddInsertmapVisitType', (req, res) => {
    console.log('AddInsertmapVisitType', req.body);
    var id = req.body.id;
    var Providers = req.body.data.Providers;
    var visit_type = req.body.data.visit_type;
    var update = req.body.update;

    if (update !== 'update') {
        // If id is empty, 0, or undefined, and it's not an update operation
        console.log('insert');
        command = `DELETE FROM master_vist_type_to_providers WHERE providers = '${Providers}';`
        execCommand(command)
            .then(() => {
                return InsertmapVisitType(Providers, visit_type);
            })
            .then(() => {
                res.json('S');
            })
            .catch(err => logWriter(command, err));
    } else {
        // If id is provided and it's an update operation
        console.log('update');
        command = `DELETE FROM master_vist_type_to_providers WHERE providers = '${Providers}';`
        execCommand(command)
            .then(() => {
                return InsertmapVisitType(Providers, visit_type);
            })
            .then(() => {
                res.json('U');
            })
            .catch(err => logWriter(command, err));
    }
});



function InsertmapVisitType(Providers, visit_typeArray) {
    return new Promise((resolve, reject) => {
        let i = 0;
        (function loop() {
            if (i < visit_typeArray.length) {
                const visit_type = visit_typeArray[i];
                let query = ` INSERT INTO master_vist_type_to_providers (providers, visit_type) VALUES ('${Providers}', '${visit_type}');`
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

// function update(Providers, visit_typeArray) {
//     return new Promise((resolve, reject) => {
//         let i = 0;
//         (function loop() {
//             if (i < visit_typeArray.length) {
//                 const visit_type = visit_typeArray[i];
//                 let query = `UPDATE master_vist_type_to_providers SET visit_type = '${visit_type}' WHERE providers = '${Providers}';`;
//                 console.log(query);
//                 execCommand(query)
//                     .then((result) => {
//                         i++;
//                         loop();
//                     })
//                     .catch(err =>
//                         logWriter(query, err)
//                     )
//             } else {
//                 resolve();
//             }
//         })();
//     });
// }


router.get('/Getmaster_visit_type_of_providers', (req, res) => {
    const command = `SELECT 
    mvp.visit_id,
    mvp.providers AS Id,
    mvp.visit_type AS id,
    CONCAT(ppi.firstname, ' ', ppi.lastname) AS providers,
    GROUP_CONCAT(mvt.visit_type SEPARATOR ', ') AS visit_type
FROM 
    master_vist_type_to_providers mvp
LEFT JOIN 
    provider_personal_identifiers ppi ON ppi.id = mvp.providers
LEFT JOIN 
    master_visit_type mvt ON mvt.id = mvp.visit_type 
GROUP BY 
    mvp.providers;`;
    // console.log(command);
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

});


router.post('/deletetable_master_Visit_type_for_providers', (req, res) => {
    console.log('deletetable_master_Visit_type_for_providers=>>>>>>>>>>', req.body);
    var id = req.body.id;

    const command = `delete from master_vist_type_to_providers where providers = ${id};`;
    console.log(command);

    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err));
})

router.post('/getmaster_VisitTypedatapatchAPI', (req, res) => {
    console.log('getmaster_VisitTypedatapatchAPI=>>>>>>>>>>', req.body);
    var id = req.body.id.Id;

    const command = `SELECT  visit_id, providers AS Id, GROUP_CONCAT(visit_type SEPARATOR ', ') AS id , lang_id FROM master_vist_type_to_providers where providers = '${id}';`;
    console.log(command);

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


module.exports = router;