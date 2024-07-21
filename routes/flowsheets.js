

const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')


router.post('/changetimeof_flowsheet', (req, res) => {
  var id=req.body.id
  var time=req.body.date1
  var patientguid=req.body.patientguid
  var command;
  if(id == ' ' || id == null || id == undefined){
    

    var command = `INSERT INTO transaction_vitals (PatientId,DateAndTime) values ('${patientguid}','${time}') `
  }else{
    var command = `update transaction_vitals set DateAndTime='${time}' where id='${id}'`;
  }
 
  // transaction_vitals DateAndTime  where PatientId='${patientguid}'
  console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
});
router.post('/deletevitalflowsheetdata', (req, res) => {
  var id=req.body.id
  var time=req.body.date1
  const command = `delete FROM transaction_vitals  where id='${id}'`;
  // transaction_vitals DateAndTime  where PatientId='${patientguid}'
  console.log(command);
  execCommand(command)
    .then(result => res.json('delete'))
    .catch(err => logWriter(command, err));
});
router.get('/getflowsheetdata', (req, res) => {
  // SELECT * FROM hospital7.master_flowsheetvitalheader group by flowsheetheader;
  // const command = `SELECT * FROM master_headervitals`;
  const command = `SELECT * FROM master_flowsheetvitalheader group by flowsheetheader`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.get('/flowsheetheaderdata', (req, res) => {
  const command = `SELECT * FROM master_flowsheetvitalheader `;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
// router.post('/flowsheetsave_data', (req, res) => {
//   console.log(req.body.flowsheetdatas);

//   var patientid = req.body.patientguid;
//   var flowsheetdatass = req.body.flowsheetdatas;

//   const commands = `delete from transaction_flowsheet where pattient_id='${patientid}'`;
//   execCommand(commands)
//     .then(result => {
//       if (result) {
//         let i = 0;
//         (function loop() {
//           if (i < flowsheetdatass.length) {
//             const command = `INSERT INTO  transaction_flowsheet(ids,pattient_id, colm, rowss, contant,header,subheader,datetime) values('${flowsheetdatass[i].ids}','${patientid}','${flowsheetdatass[i].colm}','${flowsheetdatass[i].rowss}','${flowsheetdatass[i].contant}','${flowsheetdatass[i].header}','${flowsheetdatass[i].subheader}','${flowsheetdatass[i].datetime}')`;
//             console.log(command);
//             execCommand(command)
//               .then(() => {
//                 i++;
//                 loop()
//               })
//               .catch(err => logWriter(command, err));
//           }
//           else {
//             res.json('success')
//           }
//         }())
//       }
//     })


// })


router.post('/get_transation_vital_data', (req, res) => {
  // SELECT * FROM hospital7.master_flowsheetvitalheader group by flowsheetheader;
  // const command = `SELECT * FROM master_headervitals`;
  patientguid = req.body.patientguid
  const command = `SELECT *,(SELECT shortName from master_consciousness where id=transaction_vitals.Consciousness)as Consciousness FROM transaction_vitals where PatientId='${patientguid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.get('/flowsheetheaderdata', (req, res) => {
  const command = `SELECT * FROM master_flowsheetvitalheader `;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
router.post('/flowsheetsave_data', (req, res) => {
  console.log(req.body.flowsheetdatas);
  console.log();
  var patientid = req.body.patientguid;
  var flowsheetdatass = req.body.flowsheetdatas;
  console.log(flowsheetdatass);
  let i = 0;
  (function loop() {
    if (i < flowsheetdatass.length) {
      // var date = req.body.flowsheetdatas[i].date;
      console.log('dfghjk');
      // console.log(date);
      const commands = `SELECT * FROM transaction_vitals where PatientId='${patientid}'AND DateAndTime='${req.body.flowsheetdatas[i].date}'`
      console.log(commands);
      execCommand(commands)
        .then(result => {
          var command= `update transaction_vitals set `;
          if (result.length) {
            // for(var i = 0;i < flowsheetdatass.length; i++){
              var tempobj =req.body.flowsheetdatas[i].values
              for (let x in tempobj) {
                command += `${x}= '${tempobj[x]}',` 
            }
            command = command.substring(0, command.length - 1) + ` where DateAndTime='${req.body.flowsheetdatas[i].date}' and patientid = '${patientid}'`
          // }
            // var command = `INSERT INTO transaction_vitals(PatientId, SBP, DBP, MBP, BP_Site, Position, Cuff_size, Method, Pulse, Temprature, Temprature_site, Temprature_Device, HpercapnicRF, RR, spO2, SuplementalO2, O2Flow, Weight, Height, HeadOFC, BMI, BSA, Consciousness, Source, DateAndTime, RecordedBy, Notes,heighttype,weighttype,temptype,recorded_date,recorded_time,transaction_time) values
            // ('${patientid}','${flowsheetdatass[i].values.SBP}','${flowsheetdatass[i].values.DBP}','${flowsheetdatass[i].values.MBP}','${flowsheetdatass[i].values.BP_Site}','${flowsheetdatass[i].values.Position}','${flowsheetdatass[i].values.Cuff_size}','${flowsheetdatass[i].values.Method}','${flowsheetdatass[i].values.Pulse}','${flowsheetdatass[i].values.Temprature}','${flowsheetdatass[i].values.Temprature_site}','${flowsheetdatass[i].values.Temprature_Device}','${flowsheetdatass[i].values.HpercapnicRF}','${flowsheetdatass[i].values.RR}','${flowsheetdatass[i].values.spO2}','${flowsheetdatass[i].values.SuplementalO2}','${flowsheetdatass[i].values.O2Flow}','${flowsheetdatass[i].values.Weight}','${flowsheetdatass[i].values.Height}','${flowsheetdatass[i].values.HeadOFC}','${flowsheetdatass[i].values.BMI}','${flowsheetdatass[i].values.BSA}','${flowsheetdatass[i].values.Consciousness}','${req.body.flowsheetdatas[i].date}','${req.body.flowsheetdatas[i].date} ${flowsheetdatass[i].values.timeWithoutSeconds}','${flowsheetdatass[i].values.RecordedBy}','${flowsheetdatass[i].values.Notes}', '${flowsheetdatass[i].values.heighttype}','${flowsheetdatass[i].values.weighttype}','${flowsheetdatass[i].values.temptype}','${flowsheetdatass[i].databaseDate}','${flowsheetdatass[i].values.timeWithoutSeconds}',now())`;

            // var command = 
          } else {
            console.log('INSERT INTO transaction_vitals');
            var command = `INSERT INTO transaction_vitals(PatientId, SBP, DBP, MBP, BP_Site, Position, Cuff_size, Method, Pulse, Temprature, Temprature_site, Temprature_Device, HpercapnicRF, RR, spO2, SuplementalO2, O2Flow, Weight, Height, HeadOFC, BMI, BSA, Consciousness, Source, DateAndTime, RecordedBy, Notes,heighttype,weighttype,temptype,recorded_date,recorded_time,transaction_time) values
            ('${patientid}','${flowsheetdatass[i].values.SBP}','${flowsheetdatass[i].values.DBP}','${flowsheetdatass[i].values.MBP}','${flowsheetdatass[i].values.BP_Site}','${flowsheetdatass[i].values.Position}','${flowsheetdatass[i].values.Cuff_size}','${flowsheetdatass[i].values.Method}','${flowsheetdatass[i].values.Pulse}','${flowsheetdatass[i].values.Temprature}','${flowsheetdatass[i].values.Temprature_site}','${flowsheetdatass[i].values.Temprature_Device}','${flowsheetdatass[i].values.HpercapnicRF}','${flowsheetdatass[i].values.RR}','${flowsheetdatass[i].values.spO2}','${flowsheetdatass[i].values.SuplementalO2}','${flowsheetdatass[i].values.O2Flow}','${flowsheetdatass[i].values.Weight}','${flowsheetdatass[i].values.Height}','${flowsheetdatass[i].values.HeadOFC}','${flowsheetdatass[i].values.BMI}','${flowsheetdatass[i].values.BSA}','${flowsheetdatass[i].values.Consciousness}','${flowsheetdatass[i].values.Source}','${req.body.flowsheetdatas[i].date}','${flowsheetdatass[i].values.RecordedBy}','${flowsheetdatass[i].values.Notes}', '${flowsheetdatass[i].values.heighttype}','${flowsheetdatass[i].values.weighttype}','${flowsheetdatass[i].values.temptype}','${flowsheetdatass[i].databaseDate}','${flowsheetdatass[i].values.timeWithoutSeconds}',now())`;
          }
          console.log(command.replace(/null/g, '').replace(/undefined/g, ''));
          execCommand(command.replace(/null/g, '').replace(/undefined/g, ''))
            .then(() => {
              i++;
              loop()
            })
            .then(result =>{
              // res.json('result')
            })
            .catch(err => logWriter(command, err));
          // .then(result => res.json(result))

        }).catch(err => logWriter(command, err));
    }
    else{
      res.json('result')
    }
  }())


})

router.post('/Labsflowsheetsave', (req, res) => {
  console.log(req.body.flowsheetdatas);

  var patientid = req.body.patientguid;
  var flowsheetdatass = req.body.flowsheetdatas;
  var labsname=req.body.labsname
  const commands = `DELETE FROM master_labsflowsheet where patient_id='${patientid}' and labsname='${labsname}'`;
  console.log(commands,'DELETE FROM master_labsflowsheet');
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < flowsheetdatass.length) {
            const command = `INSERT INTO master_labsflowsheet(ids, patient_id, value,header,datetimevalue,colm,labsname,radilogyname,Unit) VALUES ('${flowsheetdatass[i].ids}', '${patientid}', '${flowsheetdatass[i].value}','${flowsheetdatass[i].header}','${flowsheetdatass[i].datetimevalue}','${flowsheetdatass[i].colm}','${labsname}','${flowsheetdatass[i].radilogyname}','${flowsheetdatass[i].Unit}')`;
            console.log(command,'');
            execCommand(command.replace(/null/g,'').replace(/undefined/g,''))
            // execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })
    .catch(err => logWriter(commands, err));
});
router.post('/sidebarsubheaderdata', (req, res) => {
  console.log(req.body);
  var patientid = req.body.patientguid;
  var flowsheetdatas = req.body.sidebarsubheader;
  const commands = `delete from master_flowsheetheader where pattientid='${patientid}'`;
  console.log(commands);
  execCommand(commands)
    .then(result => {
      // console.log(result);
      if (result) {
        let i = 0;
        (function loop() {
          if (i < flowsheetdatas.length) {
            const command = `INSERT INTO  master_flowsheetheader(pattientid,header, value) values('${patientid}','${flowsheetdatas[i].header}','${flowsheetdatas[i].value}')`;
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })
    .catch(err => logWriter(commands, err));
})
router.post('/flowsheetCheckBoxsave', (req, res) => {
  console.log('flowsheetCheckBoxsave', req.body,);
  var patientid = req.body.patientguid;
  var flowsheetdatas = req.body.flowsheetvital;


  const commands = `delete from master_flowsheetcheckbox where patient_id='${patientid}'`;
  console.log(commands);
  execCommand(commands)
    .then(result => {
      console.log('delete from master_flowsheetcheckbox where patient_id', result);
      if (result) {
        let i = 0;
        (function loop() {
          if (i < flowsheetdatas.length) {
            const command = `INSERT INTO  master_flowsheetcheckbox( patient_id, headernames) values('${patientid}','${flowsheetdatas[i].headernames}')`;
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })
    .catch(err => logWriter(commands, err));
})
router.post('/LabsflowsheetCheckBoxsave', (req, res) => {
  console.log('',req.body);
  var patientid = req.body.patientguid;
  var flowsheetdatas = req.body.flowsheetvital;
var labsname=req.body.labsname
  const commands = `delete from master_labsflowsheetcheckbox where patient_id='${patientid}' and labsname='${labsname}'`;
  console.log(commands,'');
  execCommand(commands)
    .then(result => {
      if (result) {
        
        let i = 0;
        (function loop() {
          if (i < flowsheetdatas.length) {
            const command = `INSERT INTO  master_labsflowsheetcheckbox( patient_id,ids, headernames,idm,labsname) values('${patientid}','${'1'}','${flowsheetdatas[i].headernames}','${flowsheetdatas[i].id}','${labsname}')`;
            
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })
    .catch(err => logWriter(commands, err));

})
router.post('/saveflowsheetColumData', (req, res) => {
  var patientid = req.body.patientguid;
  console.log(req.body);
  var flowsheetdatas = req.body.cols;
  const commands = `delete from master_flowsheettime where Patient_Id='${patientid}'`;
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < flowsheetdatas.length) {

            const command = `INSERT INTO  master_flowsheettime(Patient_Id, date, times) values('${patientid}','${flowsheetdatas[i].date}','${flowsheetdatas[i].times}')`;
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())

      }

    })
    .catch(err => logWriter(commands, err));

  // let i = 0;
  // (function loop() {

  //   if (i < flowsheetdatas.length) {
  //     console.log(flowsheetdatas[i].id);
  //     if (flowsheetdatas[i].id == 0) {

  //       console.log('vaibhav');
  //       // const
  //       const command = `INSERT INTO  master_flowsheettime(Patient_Id, date, times) values('${patientid}','${flowsheetdatas[i].date}','${flowsheetdatas[i].times}')`;
  //       console.log(command);
  //       execCommand(command)
  //         .then(() => {
  //           i++;
  //           loop()
  //         })
  //         .catch(err => logWriter(command, err));
  //     }

  //     else {
  //       i++;
  //       loop();
  //       res.json('success')

  //     }

  //   }

  // }())
})
router.post('/savelabsflowsheetColumData', (req, res) => {
  // var patientid = req.body.patientguid;
  // console.log(req.body);
  // var flowsheetdatas = req.body.cols;
  // let i = 0;
  // (function loop() {

  //   if (i < flowsheetdatas.length) {
  //     console.log(flowsheetdatas[i].id);
  //     if (flowsheetdatas[i].id == 0) {

  //       console.log('vaibhav');
  //       // const
  //       const command = `INSERT INTO  master_labsflowsheettime(Patient_Id, date, times) values('${patientid}','${flowsheetdatas[i].date}','${flowsheetdatas[i].times}')`;
  //       console.log(command);
  //       execCommand(command)
  //         .then(() => {
  //           i++;
  //           loop()
  //         })
  //         .catch(err => logWriter(command, err));
  //     }

  //     else {
  //       i++;
  //       loop();
  //       // res.json('success')

  //     }

  //   }

  // }())
  var patientid = req.body.patientguid;
  console.log(req.body);
  var labsname=req.body.labsname
  var flowsheetdatas = req.body.cols;
  const commands = `delete from master_labsflowsheettime where Patient_Id='${patientid}' and labsname='${labsname}'`;
  execCommand(commands)
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < flowsheetdatas.length) {

            const command = `INSERT INTO  master_labsflowsheettime(Patient_Id, date, times,labsname) values('${patientid}','${flowsheetdatas[i].date}','${flowsheetdatas[i].times}','${labsname}')`;
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }

    })
    .catch(err => logWriter(commands, err));

})
router.post('/flowsheetCheckBoxsaveget', (req, res) => {
  var patientid = req.body.patientguid;
  const command = `SELECT * FROM master_flowsheetcheckbox where patient_id='${patientid}';SELECT * FROM master_flowsheetheader where pattientid='${patientid}'`;

  console.log('111111111',command);
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post('/labsflowsheetCheckBoxsaveget', (req, res) => {
  var patientid = req.body.patientguid;
  var labsname=req.body.labsname
  const command = `SELECT * FROM master_labsflowsheetcheckbox where patient_id='${patientid}' and labsname='${labsname}'; `;
  console.log(command);
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.get('/getLabsflowsheetCheckBoxsave', (req, res) => {
  //  var patientguid=req.body.patientguid;
  const command = `SELECT * FROM master_labsflowsheetcheckbox`;
  console.log(command);
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post('/getflowsheetcontaindata', (req, res) => {
  // console.log(req.body);
  var patientguid = req.body.patientguid

  const command = `SELECT * FROM transaction_flowsheet where pattient_id='${patientguid}'`;
  console.log(command);
  execCommand(command) 
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});
// router.post('/graphdata', (req, res) => {
//   console.log(req.body);
//   var subheader = req.body.flowsheetsubheader
//   var patientguid=req.body.patientguid
//   const command = `SELECT * FROM transaction_flowsheet  where subheader ='${subheader}' and pattient_id='${patientguid}'`;
//   console.log(command);
//   execCommand(command)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err));


// })
router.post('/graphdata', (req, res) => {
  console.log(req.body);
  var subheader = req.body.flowsheetsubheader
  var patientguid = req.body.patientguid
  const command = `SELECT ${subheader} as name,DateAndTime FROM transaction_vitals  where  PatientId='${patientguid}'`;
  // SELECT BP_Site FROM transaction_vitals where PatientId='9ad9903a-2ed5-4d8d-beb8-fbbcf72ebfb9';
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})
router.post('/getflowsheetcolumdata', (req, res) => {
  var patientguid = req.body.patientguid
  // const command = `SELECT * FROM master_flowsheettime where Patient_Id='${patientguid}'`;
  const command = `SELECT * FROM transaction_vitals DateAndTime  where PatientId='${patientguid}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

});
// router.post('/getflowsheetcolumdata', (req, res) => {
//   var patientguid = req.body.patientguid
//   const command = `SELECT * FROM master_flowsheettime where Patient_Id='${patientguid}'`;
//   console.log(command);
//   execCommand(command)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command, err));



// });
router.post('/getlabsflowsheetcolumdata', (req, res) => {
  var patientguid = req.body.patientguid
  var labsname=req.body.labsname
  const command = `SELECT * FROM master_labsflowsheettime where Patient_Id='${patientguid}' and labsname='${labsname}'`;
  // const command = `Select * from master_labsflowsheet where patient_id='${patientguid}'  group by datetimevalue`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));



});
router.get('/getscoredata', (req, res) => {
  const command = `SELECT * FROM master_newsscore`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));



});
///////////////////////////getmasterLabsflowsheetheader////////////////////////////////

router.get('/getmasterLabsflowsheetheader', (req, res) => {
  const command = `SELECT * FROM master_labsflowsheetheader`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));



});


router.post('/getlabsflowsheetcontaindata', (req, res) => {
  // console.log(req.body);
  var patientguid = req.body.patientguid
 var labsname=req.body.labsname
  const command = `SELECT * FROM master_labsflowsheet where patient_id='${patientguid}' and labsname='${labsname}'`;
  console.log(command);
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});

router.post('/select_header', (req, res) => {

  console.log("req=>", req.body);
  userid = '1',
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

router.post("/getHeadercol", (req, res, next) => {
  userid = '1',
    component = req.body.grid_id

  console.log(req.body);

  var query = `SELECT component_name, header, header_active, field_name as id, user_id FROM  master_billing_common_grid_column_hide   where user_id = '${userid}' and component_name = '${component}'; `
  execCommand(query).then((result) => res.json(result)).catch(err => logWriter(query, err))
})
router.post("/getHeadercol", (req, res, next) => {
  userid = '1',
    component = req.body.grid_id

  console.log(req.body);

  var query = `SELECT component_name, header, header_active, field_name as id, user_id FROM  master_billing_common_grid_column_hide   where user_id = '${userid}' and component_name = '${component}'; `
  execCommand(query).then((result) => res.json(result)).catch(err => logWriter(query, err))
})


router.post('/select_header',(req,res)=>{

  console.log("req=>", req.body);
userid = '1',
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



//  santosh code



router.post('/gethosptialname', (req, res) => {
  var name = req.body.hosptialname

  const command = `SELECT * FROM hosptal_registration where clinicName  LIKE '%${name}%'`;

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});



router.get('/specialty', (req, res) => {
  // var part_ofprogram = req.body.name
  // console.log(part_ofprogram,'ss');

  const command = `SELECT * FROM master_clinical_speciality `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/sub_specialty', (req, res) => {
  var specilaty_id = req.body.name

  const command = `SELECT * FROM master_clinical_sub_speciality where speciality_id='${specilaty_id}'`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.get('/serviceprovisioncondition', (req, res) => {
  var part_ofprogram = req.body.name
  console.log(part_ofprogram,'cc');

  const command = `SELECT * FROM mater_serviceprovisionconditions `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});




router.get('/language', (req, res) => {

  const command = `SELECT * FROM language `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/billgroup', (req, res) => {
  
  console.log(req.body,'ssssssssss');
  const name = req.body.value?.BillGroup_HeaderName
  const create_id= req.body.value?.CreatedBy
  const tax= req.body.value.tax?.taxname
  const tax_id= req.body.value.tax?.id
  const discount= req.body.value.discount?.discount_name
  const discount_id= req.body.value.discount?.id


  var id = req.body.value.BillGroup_Header_id
var commnad='';
  var returnmessage="S"
  if(id=='' || id==null || id==undefined){


    commnad = `INSERT INTO bill_group(BillGroup_HeaderName, CreatedBy,tax_id,tax,discount,discount_id,CreatedDate) VALUES ('${name}','${create_id}','${tax_id}','${tax}','${discount}','${discount_id}', now())`;

  }
  else{
    commnad=`update bill_group set BillGroup_HeaderName='${name}' ,CreatedBy='${create_id}',tax_id='${tax_id}',tax='${tax}',discount='${discount}',discount_id='${discount_id}',CreatedDate=now()  where BillGroup_Header_id='${id}'`
    returnmessage="U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});


router.get('/get_billgroup', (req, res) => {
  
 
  const command = `SELECT * FROM bill_group `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/deletebillgroup', (req, res) => {
  
 var idd=req.body.id

  const command =`delete from bill_group where  BillGroup_Header_id='${idd}'`;
  

  execCommand(command)

    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});

router.post('/activestatusbillgroup', (req,res)=>{
  

  var id=req.body.id;
  var status=req.body.status;

  const command =`Update bill_group set active='${status}' where BillGroup_Header_id='${id}';`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
 

})

router.get('/getgroupname',(req,res)=>{


  const command =`select * from bill_group ;`;


  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
})

router.post('/subbillgroup', (req, res) => {

  console.log(req.body,'sssub');
  
  var billsubgroupname = req.body.value.billsubgroup_Name

  var billgroupheadername_id= req.body.value.billgroup_header_id
  var created_by=req.body.value.CreatedBy
  var id = req.body.value.bill_sub_ID


var commnad='';
  var returnmessage="S"
  if(id=='' || id==null || id==undefined){


    commnad = `INSERT INTO billsubgroup(billsubgroup_Name, billgroup_header_id,Created_By) VALUES ('${billsubgroupname}', '${billgroupheadername_id}','${created_by}')`;

  }
  else{
    commnad=`update billsubgroup set billsubgroup_Name='${billsubgroupname}' ,billgroup_header_id=${billgroupheadername_id}, Created_By=${created_by}  where bill_sub_ID='${id}'`
    returnmessage="U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});



router.get('/get_subbillgroup',(req,res)=>{



  const command=      `SELECT billsubgroup.billsubgroup_Name,billsubgroup.active, billsubgroup.bill_sub_ID ,   bill_group.BillGroup_HeaderName,billsubgroup.billgroup_header_id FROM billsubgroup INNER JOIN bill_group ON bill_group.BillGroup_Header_id=billsubgroup.billgroup_header_id;`

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
})


router.post('/deletsub_bill', (req, res) => {
  
  var idd=req.body.id
 
   const command =`delete from billsubgroup where  bill_sub_ID='${idd}'`;
   
 
   execCommand(command)
 
     .then(result => res.json('deleted'))
     .catch(err => logWriter(command, err));
 });



 router.post('/activsubbill', (req,res)=>{
  console.log(req.body);

  var id=req.body.id;
  var status=req.body.status;

  const command =`Update billsubgroup set active='${status}' where bill_sub_ID='${id}'`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
 

})


router.get('/get_statusdata',(req,res)=>{



  const command= `select * from  master_location_status`     

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
})




router.get('/getbedstatus',(req,res)=>{



  const command= `select * from  master_location_bedstatus`     

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
})



router.get('/locationstatus',(req,res)=>{



  const command= `select * from  master_location_mode`     

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
})


router.get('/location_type_type',(req,res)=>{


var display_name=req.body.name
  const command= `select * from  master_type_location `     

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 
})


router.get('/physical_form_location_search',(req,res)=>{


    const command= `select * from  master_location_form_physical_location `     
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  })
  


  router.get('/chractics_location_ser',(req,res)=>{

    const command=`select * from master_location_of_charactics`

    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
  })


  router.get('/contact_locationservice',(req,res)=>{


  const command=`select * from master_staffpersonalidentifiers `

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  })

// 



router.get('/location_orgnation_name_service',(req,res)=>{


  const command=`select * from transaction_organization`

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  })

  router.post('/service_location', (req, res) => {

    console.log(req.body,'sdd');
    var names = req.body.value.location_name
    var aliass=req.body.value.alias
    // var modes=req.body.value.modes
    var types=req.body.value.location_type
    var forname=req.body.value.physical_type_form
    var orgnation=req.body.value.managing_Organization
    var contants=req.body.value.contact


    var hosptia_guid=req.body.hosptialvalue?.guid
    var hosptial_branchId=req.body.hosptialvalue?.branchId


  var id = req.body.value.location_id
  var commnad='';
    var returnmessage="S"
    if(id=='' || id==null || id==undefined){
  
  
      commnad = `INSERT INTO master_location( location_name,alias,location_type,form,contact,managing_Organization,hospital_id,branch_id) 
      VALUES('${names}', '${aliass}','${types}','${forname}','${contants}','${orgnation}','${hosptia_guid}','${hosptial_branchId}')`;
  
    }
    else{
      commnad=`update master_location set location_name='${names}' ,alias='${aliass}',location_type='${types}', form='${forname}', contact='${contants}',
      managing_Organization='${orgnation}' ,hospital_id='${hosptia_guid}' ,branch_id='${hosptial_branchId}'   where id='${id}'`
      returnmessage="U"
    }

    console.log(commnad);
    execCommand(commnad)
      .then(result => res.json(returnmessage))
      .catch(err => logWriter(commnad, err));
  });
  
  
  router.get('/get_alllocationname',(req,res)=>{
    // master_location. location_status,
  
    const command=`
    select  master_location.id,master_location.location_name ,   master_location.enable,   master_location.table_name,   master_location.active,master_location.alias ,master_location.location_type,master_location.contact,master_location.form,master_location.managing_Organization
    ,master_type_location.display as typeslocation  ,master_location_form_physical_location.display as physical_typeform ,transaction_organization.organization_name as orgnation_name,
    master_staffpersonalidentifiers. firstname 
     as firstname,master_location_bedstatus.display as physical_status
       from master_location
       left join master_type_location on master_type_location.id=master_location.location_type
       left join master_location_form_physical_location on master_location_form_physical_location.id=master_location.form
       left join master_staffpersonalidentifiers on master_staffpersonalidentifiers.id=master_location.contact
       left join transaction_organization  on transaction_organization.id=master_location.managing_Organization
       left join master_location_bedstatus  on master_location_bedstatus.id=master_location.operationalStatus where  master_location.enable='1'`
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    })

  

    router.post('/get_hosptialname_faclity',(req,res)=>{
      
      id_name=req.body.guid_id
      

      const command=`SELECT  clinic_overview.guid,clinic_overview.ClinicName  FROM clinic_overview where guid=${id_name};`
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
      })







      router.post('/select_header',(req,res)=>{

           console.log("req=>", req.body);
        userid = '1',
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
            

        

  router.post("/getHeadercol", (req, res, next) => {
    userid = '1',
    component = req.body.grid_id

    console.log(req.body);
    
  var query = `SELECT component_name, header, header_active, field_name as id, user_id FROM  master_billing_common_grid_column_hide   where user_id = '${userid}' and component_name = '${component}'; `
    execCommand(query).then((result) => res.json(result)).catch(err => logWriter(query, err))
    })     



    router.post('/location_status_active', (req,res)=>{

      var id=req.body.id;
      var status=req.body.status;
    
      const command =`Update master_location set active='${status}' where id='${id}'`;
    
      execCommand(command)
      .then(result => res.json('success'))
      .catch(err => logWriter(command, err));
     
    
    })
    




    router.post("/oprational_status",(req,res)=>{
      
      console.log(req.body);
      var status=req.body.status
      var Data=req.body.data
      var command = ''
      let i = 0;
        (function loop(){
          if (i < Data.length) {
 
           command = `update ${Data[i].table_name} set operationalStatus='${status}' where id='${Data[i].id}';`
       
            console.log(command);
            execCommand(command)
              .then(() => {
                i++; 
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else{
            res.json('success')
          }
        }())
       
  
    })
  


    router.post('/enable_status', (req,res)=>{

      console.log('ss',req.body);

      var id=req.body.data.id;
      var status=req.body.status;
    
      const command =`Update master_location set enable='${status}' where id='${id}'`;
    
      execCommand(command)
      .then(result => res.json('success'))
      .catch(err => logWriter(command, err));
     
    
    })

    
   
    
    
    
router.get('/alllocation_service',(req,res)=>{


  const command=`select * from master_location`

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  })


  router.get('/get_bill_group_service',(req,res)=>{


    const command=`select * from bill_group`
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    })
  

    router.post('/get_subbill_group_service',(req,res)=>{
       let bill_group_id=req.body.data


      const command=`select * from billsubgroup  where billgroup_header_id='${bill_group_id}'`
    
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
      })
  



router.post('/service_name_total',(req,res)=>{
  
  let name=req.body.data

  const command=`select  loincuniversal.id,loincuniversal.LONG_COMMON_NAME as names FROM loincuniversal  where class='Communication' and  LONG_COMMON_NAME  LIKE'%${name}%' or id='${name}';SELECT master_procedure_history.id, master_procedure_history.name as names FROM master_procedure_history  where   id='${name}' or name LIKE '%${name}%'    ;`

  // const command=`select  loincuniversal.id,loincuniversal.LONG_COMMON_NAME as names FROM loincuniversal  where class='Communication' and LONG_COMMON_NAME  LIKE'%${name}%'  ;SELECT master_procedure_history.id, master_procedure_history.name as names FROM master_procedure_history  where name LIKE '%${name}%';`

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
  })



  router.post('/condtion_age_value',(req,res)=>{
  
    let id=req.body.id

    console.log(id);
    var command=``
    if(id=='2'){
      var command=` select gender.id, gender.gender as name from gender;`

    }
    else if(id=='4'){
      var command=`SELECT master_partof_program.Code as id, master_partof_program.Display as name FROM master_partof_program`
    }
    
    else if(id=='5'){
      var command=` SELECT characteristic_service_mode.id ,characteristic_service_mode.Display as name, characteristic_service_mode.code    from characteristic_service_mode;`

    }
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
    })
  




    router.post('/faclityname_service', (req, res) => {

      var orgnation_id = req.body.id.guid
      var branchId_id = req.body.id.branchId

    
      const command = `SELECT * FROM hosptal_registration where organzation_id='${orgnation_id}' and branch_id='${branchId_id}'`;
    
    
      execCommand(command)
    
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    });
    





    router.post('/servic_billgroup_totalvaleue', async (req, res) => {

      try {
        
        const { formtotalvalue, genderform,hosptialid_id } = req.body;
    
        const hosptialnames = hosptialid_id?.clinicName
        const categeory_names = formtotalvalue?.categeory_name
    
        const location_namess = formtotalvalue?.locationname
        const service_name = formtotalvalue?.service_name?.id
       
        if(service_name !==undefined){
          servicename_name = formtotalvalue?.service_name?.name
    
        }else{
           servicename_name = formtotalvalue?.service_name
        }
        
        const local_codes = formtotalvalue?.local_code
        const display_localnames = formtotalvalue?.display_localname
        const department_id = formtotalvalue?.sub_specialty_id.id
            const departmentname = formtotalvalue?.sub_specialty_id.Department
    
        const salce_price = formtotalvalue?.sales_price
        const taxes = formtotalvalue?.taxes.id
        const currencynames = formtotalvalue?.currency.currency
        const currency_id = formtotalvalue?.currency.id
    
    
    
        const hsncode = formtotalvalue?.hsn_code
        const hsndescription = formtotalvalue?.sas_description
    
    
        const hosptial_id = hosptialid_id.guid
        const branch_id = hosptialid_id.branchId
        const multiple_country_name = formtotalvalue?.country_name?.id
    
    
    
        const id = formtotalvalue.id  
        const languageCodes = formtotalvalue?.language_id
        let command = '';
    
        if (id == '' || id == null || id == undefined) {
          if (formtotalvalue !== undefined) {
            command = `INSERT INTO  masterhealthcareservices_invoice_billing(hosptialname, category, servicename, display_local_name, sub_specialty,departmentname ,location, sales_price, taxes, currency,language_name,country_name,hosptial_id,hosptial_branch_id,servicename_name,local_code,hsn_code,sas_description,currency_id)  values('${hosptialnames}','${categeory_names}','${service_name}','${display_localnames}','${department_id}', '${departmentname}','${location_namess}' ,'${salce_price}' ,'${taxes}','${currencynames}', '${languageCodes}','${multiple_country_name}','${hosptial_id}','${branch_id}','${servicename_name}','${local_codes}','${hsncode}','${hsndescription}','${currency_id}')`;
            
            const result = await execCommand(command)
            console.log(command);
            invoiceBillingId = result.insertId;
          }
          if (genderform.allgender?.length > 0) {
            const data = genderform?.allgender;
            for (let i = 0; i < data?.length; i++) {
              const gendername_id = data[i].gendername_id;
              const value_name = data[i].value_name;
              command = `INSERT INTO master_healthcareservice_multiple_value_condtions (gendername_id, value_name,health_service_id) VALUES ('${gendername_id}', '${value_name}','${invoiceBillingId}')`;
              await execCommand(command)
            }
          }
          res.json({ success: true, message: 'save' });
    
    
        } else {
          if (formtotalvalue !== undefined) {
            command = `update masterhealthcareservices_invoice_billing set hosptialname='${hosptialnames}',category='${categeory_names}',subcategory='${sub_categeorys}', servicename='${service_name}', display_local_name='${display_localnames}',local_code='${local_codes}', specialty='${Specialty_ids}', sub_specialty='${sub_specility_id}', location='${location_namess}', inventory_status='${inventory_status}', lab_status='${lab_statuss}', sales_price='${salce_price}', cost='${cost}', taxes='${taxes}', hsn_code='${hsncodes}',sas_description='${hsn_descriptions}',currency='${currencynames}',ar_income_account='${ar_incom_accounts}',ap_expenseive='${ap_expence_names}',language_name='${languageCodes}',tag='${tags_names_code}',country_name='${multiple_country_name}', servicename_name='${servicename_name}'   where id = '${id}'`
            await execCommand(command)
          }
          if (genderform.allgender?.length > 0) {
            const data = genderform?.allgender;
            for (let i = 0; i < data?.length; i++) {
              const gendername_id = data[i].gendername_id;
              const value_name = data[i].value_name;
              command = `update  master_healthcareservice_multiple_value_condtions set  gendername_id=${gendername_id}, value_name=${value_name}  where health_service_id=${id}`;
              await execCommand(command)
            }
          }
          res.json({ success: true, message: 'update' });
    
        }
    
    
    
    
    
      }
      catch (error) {
        logWriter('Error:', error);
        res.status(500).json({ success: false, error: 'An error occurred.' });
      }
    });
    
    
    
    
    
    router.get('/totaldataservice_value', (req, res) => {
    
    
    const command= ` select *,bill_group.BillGroup_HeaderName as categeory_name,
    master_location.location_name as locationname from masterhealthcareservices_invoice_billing as hlservice
    left join bill_group on bill_group.BillGroup_Header_id=hlservice.category 
    left join master_procedure_history on master_procedure_history.id=hlservice.servicename 
    left join master_location on master_location.id=hlservice.location  
    left join master_country_code1 on master_country_code1.id=hlservice.country_name`
      // const command = `select hlservice.id,hlservice.code_system_type,hlservice.active,master_country_code1.Country as country,hlservice.hosptialname,hlservice.category,hlservice.subcategory,hlservice.servicename,hlservice.display_local_name, hlservice.local_code, hlservice.specialty, hlservice.sub_specialty,hlservice. location, hlservice.tag,hlservice.inventory_status, hlservice.lab_status, hlservice.sales_price, hlservice.cost, hlservice.taxes, hlservice.hsn_code, hlservice.sas_description, hlservice.currency, hlservice.ar_income_account, hlservice.ap_expenseive, hlservice.language_name, hlservice.country_name, bill_group. BillGroup_HeaderName as categeory_name,billsubgroup.billsubgroup_Name as sub_categeory_name,CONCAT(IFNULL(loincuniversal.LONG_COMMON_NAME, ''),'',IFNULL(master_procedure_history.name, '')) AS service_name, master_clinical_speciality.speciality as Specialty_id, master_clinical_sub_speciality.sub_speciality as sub_specialty_id, master_location.location_name as locationname from masterhealthcareservices_invoice_billing as hlservice left join bill_group on bill_group.BillGroup_Header_id=hlservice.category left join billsubgroup on billsubgroup.bill_sub_ID=hlservice.subcategory left join loincuniversal on loincuniversal.id=hlservice.servicename left join master_procedure_history on master_procedure_history.id=hlservice.servicename left join master_clinical_speciality on master_clinical_speciality.id=hlservice.specialty left join master_clinical_sub_speciality on master_clinical_sub_speciality.id=hlservice.sub_specialty left join master_location on master_location.id=hlservice.location   left join master_country_code1 on master_country_code1.id=hlservice.country_name`;
    
    
      execCommand(command)
    
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    });
  
  router.post('/multipleformarraycreate', (req, res) => {
    var id=req.body.id

   
  
    const command = `select * from master_healthcareservice_multiple_value_condtions where  health_service_id='${id}';`
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });
  

  router.post('/deleteservicehealthcare', (req, res) => {
    var id=req.body.id

  
    const command = `delete  from masterhealthcareservices_invoice_billing where  id='${id}'; delete FROM master_healthcareservice_multiple_value_condtions where health_service_id='${id}';`

    execCommand(command)
  
      .then(result => res.json('deleted'))
      .catch(err => logWriter(command, err));
  });
  




  router.post('/healthcareservice_status', (req,res)=>{

    var id=req.body.id;
    var status=req.body.status;
  
    const command =`Update masterhealthcareservices_invoice_billing set active='${status}' where id='${id}'`;
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })



  router.get('/totalcurrency', (req,res)=>{


  
    const command =`select * from  master_currency_exchange_rate`;
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })






router.post('/multiple_currency_rates', (req, res) => {
  var Data = req.body?.multiple_values;
  var currencyvalues_id = req.body?.currency_id_value;
  var command = '';

  console.log(currencyvalues_id);
  console.log(Data);
  let i = 0;

  (function loop() {
    if (i < Data.length) {
      command = `INSERT INTO master_currency_multiple_rates(Date, UnitperINR, INRperUnit, TechnicalRate, currency_multiple_id, currency_id, LastUpdateOn) VALUES ('${Data[i].Date}', ${Data[i].UnitperINR}, ${Data[i].INRperUnit}, ${Data[i].TechnicalRate}, ${Data[i].currency_id}, ${currencyvalues_id}, now());`;

      execCommand(command)
        .then(() => {
          i++;
          loop();
        })
        .catch(err => logWriter(command, err));
    } else {
      const selectQuery = `SELECT * FROM master_currency_multiple_rates WHERE currency_id = ${currencyvalues_id} ORDER BY LastUpdateOn DESC LIMIT 1;`;

      execCommand(selectQuery)
        .then(result => {
          const currencyRateData = result[0]; 
          const updateExchangeRateQuery = `UPDATE master_currency_exchange_rate SET current_rate='${currencyRateData.UnitperINR}', inverse_rate='${currencyRateData.INRperUnit}' ,date='${currencyRateData.LastUpdateOn}' WHERE id = '${currencyRateData.currency_id}';`;
          console.log(updateExchangeRateQuery);


          return execCommand(updateExchangeRateQuery);

        })
        .then(() => {
          res.json('success');
        })
        .catch(err => {
          logWriter(selectQuery, err);
          res.status(500).json('error');
        });
    }
  })();
});






router.post('/update_status_currency', (req,res)=>{

  var id=req.body.id;
  var status=req.body.status;

  const command =`Update master_currency_exchange_rate set active='${status}' where id='${id}'`;

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})


router.post('/currency_rates', (req,res)=>{

  var id=req.body.id;

  const command =`select * from master_currency_multiple_rates where currency_id='${id}'`;

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})

  



router.post('/labtags', (req, res) => {
  
  console.log(req.body,'ssssssssss');
  var name = req.body.value.tagname
  var id = req.body.value?.id
var commnad='';
  var returnmessage="S"
  if(id=='' || id==null || id==undefined){


    commnad = `INSERT INTO master_labservice_tags_name(tagname) VALUES ('${name}')`;

  }
  else{
    commnad=`update master_labservice_tags_name set tagname='${name}'  where id='${id}'`
    returnmessage="U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});

  

router.get('/labservicetag__all_data', (req,res)=>{


  
  const command =`select * from  master_labservice_tags_name`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})


router.post('/delete_servicetags', (req,res)=>{

  console.log(req.body);

id=req.body.id
  
  const command =`delete   from  master_labservice_tags_name where id=${id}`;
  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
 

})



router.get('/tagalldata_value_get', (req,res)=>{


  
  const command =`select * from  master_labservice_tags_name`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})




router.post('/getunits_all', (req, res) => {
  var name = req.body.name

  const command = `SELECT * FROM ucum_units where EXAMPLE_UNITS  LIKE '%${name}%'`;

  console.log(command);

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});





router.post('/tax_allgroup', (req, res) => {
  
  console.log(req.body,'ssssssssss');
  var name = req.body.value.name
  var countryname= req.body.value.country.Country
  var country_id= req.body.value.country.id

  var id = req.body.value.id
    var commnad='';
  var returnmessage="S"
  if(id=='' || id==null || id==undefined){


    commnad = `INSERT INTO master_taxes_allgroup(name, country,country_id) VALUES ('${name}', '${countryname}','${country_id}')`;

  }
  else{
    commnad=`update master_taxes_allgroup set name='${name}' ,country='${countryname}',country_id='${country_id}'  where id='${id}'`
    returnmessage="U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});

router.get('/alltaxes_groups', (req, res) => {
  
 
  const command = `SELECT * FROM master_taxes_allgroup  order by sequence;`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});






router.post('/deletetaxgroup', (req,res)=>{

  console.log(req.body);

id=req.body.id
  
  const command =`delete   from  master_taxes_allgroup where id=${id}`;
  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
 

})



router.post('/dragtextgrop', (req,res)=>{
  
  var data = req.body.displayData
  var i = 0;
  let multiQuery = '';

  (function loop(){
      if(i < data.length){
          multiQuery += `Update master_taxes_allgroup set sequence='${(i+1)}' where id='${data[i].id}';`;
          i++;
          loop();
      }
      else{
          execCommand(multiQuery.replace(/null/g, ''))
          .then(result => res.json('success'))
          .catch(err => logWriter(multiQuery, err));
      }
  }());

  
})





router.post('/invoice_tax_all', (req, res) => {
  console.log(req.body);
  
  var tax_name = req.body.invoicetax?.taxname
  var tax_description = req.body.invoicetax?.taxdescription
  var taxcompunation = req.body.invoicetax?.tax_compunation
  var taxtype = req.body.invoicetax?.tax_type

  var taxscope = req.body.invoicetax?.tax_scope

  var amount = req.body.invoicetax?.amount
  var labeloninvoice=req.body.invoicetax?.label_on_invoice
  var taxgroup_name=req.body.invoicetax?.taxgroup
  var country=req.body.invoicetax.countryname?.Country
  var country_id=req.body.invoicetax?.countryname?.id

  var include_insome=req.body.invoicetax?.include_in_price
  var subsequence=req.body.invoicetax?.subseq_taxes

  var company_name=req.body.invoicetax?.company



  var id = req.body.invoicetax?.id
    var commnad='';
  var returnmessage="save"
  if(id=='' || id==null || id==undefined){


    commnad = `INSERT INTO master_invoice_taxes(taxname, taxdescription, taxgroup, countryname, country_id, company, label_on_invoice, tax_compunation, amount, tax_type, tax_scope,include_in_price,subseq_taxes)VALUES ('${tax_name}','${tax_description}','${taxgroup_name}','${country}','${country_id}','${company_name}','${labeloninvoice}','${taxcompunation}','${amount}','${taxtype}','${taxscope}','${include_insome}','${subsequence}');`;
    
  }
  else{
    commnad=`update master_invoice_taxes set taxname='${tax_name}',taxdescription='${tax_description}', taxgroup='${taxgroup_name}', countryname='${country}', country_id='${country_id}', company='${company_name}', label_on_invoice='${labeloninvoice}', tax_compunation='${taxcompunation}', amount='${amount}', tax_type='${taxtype}', tax_scope='${taxscope}',include_in_price='${include_insome}',subseq_taxes='${subsequence}'  where id='${id}'`
    returnmessage="update"
  }

  console.log(commnad,'qq');
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});








router.get('/invoice_all_data_tax', (req, res) => {

  const command = `SELECT * FROM master_invoice_taxes  ORDER BY  sequence;`;

  console.log(command);

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});


router.post('/company_name_name', (req, res) => {
  
  var comapany_id=req.body?.companyname
  const command = `SELECT * FROM transaction_organization where guid='${comapany_id}'`;

  console.log(command);

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});


router.post('/updta_status_invoice_tax', (req,res)=>{
  

  var id=req.body.id;
  var status=req.body?.status;

  const command =`Update master_invoice_taxes set active='${status}' where id='${id}';`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
 

})



router.post('/deletetax', (req,res)=>{
  

  var id=req.body.id;

  const command =`delete from  master_invoice_taxes where id='${id}';`;

  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
 

})



router.post('/tax_get_search', (req,res)=>{
  

  var tax_naem=req.body?.value;

  const command =`select *  from  master_invoice_taxes where taxname LIKE '%${tax_naem}%';`;

  console.log(command);

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})


router.post('/currency_search_name', (req,res)=>{
  

  var currecny=req.body?.value;

  const command =`select *  from  master_currency_exchange_rate where currency LIKE '%${currecny}%';`;

  console.log(command);

  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})




router.post('/discounts_form', (req, res) => {
  
  
  var discount_name = req.body.discounts?.discount_name
  var discount_description = req.body.discounts?.discount_description
  var discount_computions = req.body.discounts?.discount_compation
  var discount_scope=req.body.discounts?.discount_scope
  var amount = req.body.discounts?.amount
  var labeloninvoice=req.body.discounts?.label_on_invoice

  var discount_type= req.body.discounts?.discount_type
  var company_name=req.body.discounts?.company

  var country=req.body.discounts?.country_name.Country
  var country_id=req.body.discounts?.country_name?.id

 
  var id = req.body.discounts?.id
    var commnad='';
  var returnmessage="save"
  if(id=='' || id==null || id==undefined){
    commnad = `INSERT INTO master_invoice_discount (discount_name, discount_description, discount_type, country_name, country_id, company, label_on_invoice, discount_compation, amount, discount_scope)VALUES('${discount_name}','${discount_description}','${discount_type}','${country}','${country_id}','${company_name}','${labeloninvoice}','${discount_computions}','${amount}','${discount_scope}');`;
    
  }
  else{

    commnad=`update master_invoice_discount set discount_name='${discount_name}',discount_description='${discount_description}',discount_type='${discount_type}',country_name='${country}',country_id='${country_id}',company='${company_name}',label_on_invoice='${labeloninvoice}',discount_compation='${discount_computions}',amount='${amount}',discount_scope='${discount_scope}'  where id='${id}';`
    

    returnmessage="update"
  }

  console.log(commnad,'qq');
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});





router.get('/invoice_discounts_all_data', (req, res) => {

  const command = `SELECT * FROM master_invoice_discount  order by id desc;`;

  console.log(command);

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});



router.post('/update_status_discount', (req,res)=>{
  

  var id=req.body.id;
  var status=req.body?.status;

  const command =`Update master_invoice_discount set active='${status}' where id='${id}';`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
 

})







router.post('/delete_discount', (req,res)=>{
  

  var id=req.body?.id;

  const command =`delete from  master_invoice_discount where id='${id}';`;

  execCommand(command)
  .then(result => res.json('deleted'))
  .catch(err => logWriter(command, err));
 

})



router.post('/categoryname', (req, res) => {
  
  console.log(req.body,'ssssssssss');
  var categeory_name = req.body.value.categeory_name
  var description = req.body.value.description

  var tax_name = req.body.value.taxnames?.taxname

  var tax_id = req.body.value.taxnames?.id


  var  groupnam= req.body.value.selectedCategory

  var id = req.body.value.id
var commnad='';
  var returnmessage="S"
  if(id=='' || id==null || id==undefined){


    commnad = `INSERT INTO master_invoice_categeory(categeory_name, taxnames, description,selectedCategory,tax_id) VALUES ('${categeory_name}', '${tax_name}','${description}','${groupnam}','${tax_id}')`;

  }
  else{
    commnad=`update master_invoice_categeory set categeory_name='${categeory_name}' ,taxnames='${tax_name}',description='${description}',selectedCategory='${groupnam}',tax_id='${tax_id}'  where id='${id}'`
    returnmessage="U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});




router.get('/getallcategory', (req, res) => {
  
 
  const command = `SELECT * FROM master_invoice_categeory `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});




router.post('/deletecategoryinvoice', (req, res) => {
  
  var idd=req.body.id
 
   const command =`delete from master_invoice_categeory where  id='${idd}'`;
   
 
   execCommand(command)
 
     .then(result => res.json('deleted'))
     .catch(err => logWriter(command, err));
 });






 router.post('/activecategory_status', (req,res)=>{
  

  var id=req.body.id;
  var status=req.body.status;

  const command =`Update master_invoice_categeory set active='${status}' where id='${id}';`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
 

})

router.post('/country_code', (req,res)=>{
  

  var countrycodes=req.body.countrycode;

  const command =`SELECT * FROM master_coutry_postalcode     where countrycode='${countrycodes}' group  by states_name;`;


  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
 

})


















// router.post('/supliername', (req, res) => {
//   console.log(req.body, 'ssssssssss');
//   var select_option = req.body.value?.selectedOption;
//   var supliernames = req.body.value?.suplier_name;
//   var company_name = req.body.value?.company_name.id;
//   var adress_types = req.body.value?.adress_type;
//   var adressline1 = req.body.value?.adressline1;
//   var adressline2 = req.body.value?.adressline2;
//   var countryname_id = req.body.value?.Country.countrycode;
//   var countr_id = req.body.value.Country?.Country;
//   var state_name = req.body.value?.states_name;
//   var district_name = req.body.value?.District;
//   var postal_code = req.body.value.Postal_Code?.postalcode;
//   var postal_code_id = req.body.value?.Postal_Code.id;
//   var tax_id = req.body.value?.taxid;
//   var pannumber = req.body.value?.pannumber;
//   var jobpostion = req.body.value?.jobpostion;
//   var email = req.body.value?.emailid;
//   var workphone = req.body.value?.Work_Phone;
//   var workcode = req.body.value?.workcode;
//   var fax = req.body.value?.fax;
//   var mobile = req.body.value?.mobile;
//   var mobilecode = req.body.value?.mobilecode;
//   var websitename = req.body.value?.websitename;
//   var title_id = req.body.value?.title_id;
//   var tags = req.body.value?.tags;
//   var id = req.body.value?.id;

//   var commnad = '';
//   var returnmessage = "S";

//   if (id == '' || id == null || id == undefined) {
//     commnad = `INSERT INTO master_invoice_suplier(selectedoption, suplier_name, company_name, adress_type, adressline1, adressline2, countrycode, state_name,
//        District, postal_code, taxid,pannumber,jobpostion, emailid, work_phone, work_code, fax, mobile, mobilecode, websitename, title_id, tags,Country,postal_id)VALUES 
//     ('${select_option}','${supliernames}', '${company_name}','${adress_types}','${adressline1}','${adressline2}','${countryname_id}','${state_name}',
//     '${district_name}','${postal_code}','${tax_id}','${pannumber}','${jobpostion}','${email}','${workphone}','${workcode}','${fax}',
//      '${mobile}','${mobilecode}','${websitename}','${title_id}','${tags}','${countr_id}','${postal_code_id}')`;

//     execCommand(commnad)
//       .then((result) => {
//         const id_suplier_id = result?.insertId;
//         if (req.body.adress?.length > 0) {
//           console.log(req.body.adress, 'dddd');
//           const data = req.body?.adress;

//           for (let i = 0; i < data?.length; i++) {
//             const contactname = data[i]?.contactname;
//             const countryname = data[i]?.Country;
//             const statename = data[i]?.states_name;
//             const districts = data[i]?.District;
//             const postal = data[i]?.postal_Code;
//             const email = data[i]?.email;
//             const phone = data[i]?.phone;
//             const mobile = data[i]?.mobile;
//             const country_code = data[i]?.countrycode;
//             const postal_id = data[i]?.postal_id;
//             const street1 = data[i]?.street;
//             const street2 = data[i]?.street2;

//             var subCommand = `INSERT INTO master_suplier_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES
//             ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${id_suplier_id}','${country_code}','${postal_id}','${street1}','${street2}')`;

//             console.log(subCommand,'dd');
//             const subPromise = execCommand(subCommand)
//               .then((result) => {
//               })
//               .catch((err) => {
//                 logWriter(subCommand, err);
//               });

//             promises.push(subPromise);
//           }

//           return Promise.all(promises);
//         }
//       })
//       .then(() => res.json(returnmessage))
//       .catch((err) => {
//         logWriter(commnad, err);
//         res.status(500).json({ error: "An error occurred" });
//       });
//   } else {
//     commnad = `UPDATE master_invoice_suplier SET selectedoption='${select_option}', suplier_name='${supliernames}', company_name='${company_name}', adress_type='${adress_types}', 
//       adressline1='${adressline1}', adressline2='${adressline2}', countrycode='${countryname_id}', state_name='${state_name}',District='${district_name}', postal_code='${postal_code}', 
//       taxid='${tax_id}', pannumber='${pannumber}', jobpostion='${jobpostion}', emailid='${email}', work_phone='${workphone}', work_code='${workcode}', fax='${fax}', mobile='${mobile}', 
//       mobilecode='${mobilecode}', websitename='${websitename}', title_id='${title_id}', tags='${tags}', Country='${countr_id}', postal_id='${postal_code_id}' WHERE id='${id}'`;

//     returnmessage = "U";

//     execCommand(commnad)
//       .then((result) => {
//         const id_suplier_id = id;
//         if (req.body.adress?.length > 0) {
//           const data = req.body?.adress;
//           const promises = [];

//           for (let i = 0; i < data?.length; i++) {
//             const contactname = data[i]?.contactname;
//             const countryname = data[i]?.Country;
//             const statename = data[i]?.states_name;
//             const districts = data[i]?.District;
//             const postal = data[i]?.postal_Code;
//             const email = data[i]?.email;
//             const phone = data[i]?.phone;
//             const mobile = data[i]?.mobile;
//             const country_code = data[i]?.countrycode;
//             const postal_id = data[i]?.postal_id;
//             const multiple_id_contact = data[i].id;

//             const street1 = data[i]?.street;
//             const street2 = data[i]?.street2;
//             var subCommand = `UPDATE master_suplier_multiple_contact_address SET contactname='${contactname}', Country='${countryname}',states_name='${statename}',District='${districts}',postal_Code='${postal}',email='${email}',phone='${phone}',mobile='${mobile}',suplier_id='${id_suplier_id}',countrycode='${country_code}',postal_id='${postal_id}',street='${street1}',street2='${street2}' WHERE id='${multiple_id_contact}';`;

//             const subPromise = execCommand(subCommand)
//               .then((result) => {
//               })
//               .catch((err) => {
//                 logWriter(subCommand, err);
//               });

//             promises.push(subPromise);
//           }

//           return Promise.all(promises);
//         }
//       })
//       .then(() => res.json(returnmessage))
//       .catch((err) => {
//         logWriter(commnad, err);
//         res.status(500).json({ error: "An error occurred" });
//       });
//   }
// });




router.post('/supliername', (req, res) => {

  console.log(req.body, 'ssssssssss');
  const adress=req.body.adress
  const select_option = req.body.value?.selectedOption;
  const supliernames = req.body.value?.suplier_name;
  const company_name = req.body.value?.company_name.id;
  const adress_types = req.body.value?.adress_type;
  const adressline1 = req.body.value?.adressline1;
  const adressline2 = req.body.value?.adressline2;
  const countryname_id = req.body.value?.Country.countrycode;
  const countr_id = req.body.value.Country?.Country;
  const state_name = req.body.value?.states_name;
  const district_name = req.body.value?.District;
  const postal_code = req.body.value?.Postal_Code?.postalcode;
  const postal_code_id = req.body.value?.Postal_Code.id;
  const tax_id = req.body.value?.taxid;
  const pannumber = req.body.value?.pannumber;
  const jobpostion = req.body.value?.jobpostion;
  const email = req.body.value?.emailid;
  const workphone = req.body.value?.Work_Phone;
  const workcode = req.body.value?.workcode;
  const fax = req.body.value?.fax;
  const mobile = req.body.value?.mobile;
  const mobilecode = req.body.value?.mobilecode;
  const websitename = req.body.value?.websitename;
  const title_id = req.body.value?.title_id;
  const tags = req.body.value?.tags;
  const id = req.body.value?.id;

//  const commnad = '';
  if(id=='' || id==null || id==undefined){
    const returnmessage = "S";

    const command = '';

    let i = 0;
  const commands = `INSERT INTO master_invoice_suplier(selectedoption, suplier_name, company_name, adress_type, adressline1, adressline2, countrycode, state_name,District, postal_code, taxid,pannumber,jobpostion, emailid, work_phone, work_code, fax, mobile, mobilecode, websitename, title_id, tags,Country,postal_id)VALUES ('${select_option}','${supliernames}', '${company_name}','${adress_types}','${adressline1}','${adressline2}','${countryname_id}','${state_name}','${district_name}','${postal_code}','${tax_id}','${pannumber}','${jobpostion}','${email}','${workphone}','${workcode}','${fax}','${mobile}','${mobilecode}','${websitename}','${title_id}','${tags}','${countr_id}','${postal_code_id}')`;

  execCommand(commands)
  
    .then(result => {

      if (result) {
        let i = 0;
        (function loop() {
          if (i < adress.length) {
		      const contactname = adress[i]?.contactname;
            const countryname = adress[i]?.Country;
            const statename = adress[i]?.states_name;
            const districts = adress[i]?.District;
            const postal = adress[i]?.postal_Code;
            const email = adress[i]?.email;
            const phone = adress[i]?.phone;
            const mobile = adress[i]?.mobile;
            const country_code = adress[i]?.countrycode;
            const postal_id = adress[i]?.postal_id;
            const street1 = adress[i]?.street;
            const street2 = adress[i]?.street2;

            // const form_status=adress[i]?.formStatus


		  
            const command = `INSERT INTO master_suplier_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${result?.insertId}','${country_code}','${postal_id}','${street1}','${street2}')`;
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('S')
          }
        }())
      }
    })
  }else{
     var command = '';

    let i = 0;
  const commands =`UPDATE master_invoice_suplier SET selectedoption='${select_option}', suplier_name='${supliernames}', company_name='${company_name}', adress_type='${adress_types}', 
      adressline1='${adressline1}', adressline2='${adressline2}', countrycode='${countryname_id}', state_name='${state_name}',District='${district_name}', postal_code='${postal_code}', 
      taxid='${tax_id}', pannumber='${pannumber}', jobpostion='${jobpostion}', emailid='${email}', work_phone='${workphone}', work_code='${workcode}', fax='${fax}', mobile='${mobile}', 
      mobilecode='${mobilecode}', websitename='${websitename}', title_id='${title_id}', tags='${tags}', Country='${countr_id}', postal_id='${postal_code_id}' WHERE id='${id}'`;

  execCommand(commands)
  
    .then(result => {
      if (result) {
        let i = 0;
        (function loop() {
          if (i < adress.length) {

            const contactname = adress[i]?.contactname;
            const countryname = adress[i]?.Country;
            const statename = adress[i]?.states_name;
            const districts = adress[i]?.District;
            const postal = adress[i]?.postal_Code;
            const email = adress[i]?.email;
            const phone = adress[i]?.phone;
            const mobile = adress[i]?.mobile;
            const country_code = adress[i]?.countrycode;
            const postal_id = adress[i]?.postal_id;
            const street1 = adress[i]?.street;
            const street2 = adress[i]?.street2;
            const adress_form=adress[i]?.formStatus
           const  suplier_id_id=adress[i]?.suplier_id

            if(adress_form !==undefined){
              const command = `INSERT INTO master_suplier_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${id}','${country_code}','${postal_id}','${street1}','${street2}')`;

              execCommand(command)
            }if(suplier_id_id !==undefined) {

              const command2=`delete from master_suplier_multiple_contact_address where id='${adress[i].id}' `
              execCommand(command2)

              const command = `INSERT INTO master_suplier_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${adress[i].suplier_id}','${country_code}','${postal_id}','${street1}','${street2}')`;
              // const command = `UPDATE master_suplier_multiple_contact_address SET contactname='${contactname}', Country='${countryname}',states_name='${statename}',District='${districts}',postal_Code='${postal}',email='${email}',phone='${phone}',mobile='${mobile}',suplier_id='${id_suplier_id}',countrycode='${country_code}',postal_id='${postal_id}',street='${street1}',street2='${street2}' WHERE id='${multiple_id_contact}';`;
              console.log(command);
              execCommand(command)
                .then(() => {


                  i++;
                  loop()
                })  
                .then(result => res.json('U'))

                .catch(err => logWriter(command, err));
  
            }
          }

        
        }())
      }
    })

  }

  });

























router.get('/getall_supliername', (req, res) => {
  
 
  const command = `select * ,(select organization_name from transaction_organization where id=master_invoice_suplier.company_name ) as orgname ,
  (select Country from master_country_code1 where id=master_invoice_suplier.countrycode )as countryname FROM master_invoice_suplier
   `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});




router.post('/company_name_total', (req, res) => {
  
  var name = req.body.name

  const command = `SELECT * FROM transaction_organization where organization_name  LIKE '%${name}%'`;

  console.log(command);

  execCommand(command)
  

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});






router.post('/activestatus_suplier', (req,res)=>{
  

  var id=req.body.id;
  var status=req.body.status;

  const command =`Update master_invoice_suplier set active='${status}' where id='${id}';`;

  execCommand(command)
  .then(result => res.json('success'))
  .catch(err => logWriter(command, err));
 

})




router.post('/deletesuplier', (req, res) => {
  
  var idd=req.body.id
 
   const command =`delete from master_invoice_suplier where  id='${idd}'`;
   
 
   execCommand(command)
 
     .then(result => res.json('deleted'))
     .catch(err => logWriter(command, err));
 });



 router.post('/getall_suplier_multiple_contact', (req, res) => {
  id=req.body.id
 
  const command = `select *  from  master_suplier_multiple_contact_address  where suplier_id='${id}';`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});





router.post('/payments_terms', (req, res) => {

  const products = req.body?.products;
  const form = req.body?.form_value;

  const name=form.name
  const early_discount=form.early_discount
  const paid_day=form.paid_day

  const early_percent=form.early_percent
  const reduce_tax=form.reducetax
var id = form.id
  var returnmessage="S"
  if(id=='' || id==null || id==undefined){
    var command = '';

    let i = 0;
  const commands = `INSERT INTO master_invoice_payments_terms (name, early_discount, early_percent, paid_day, reducetax) VALUES('${name}', '${early_discount}','${paid_day}','${early_percent}','${reduce_tax}');`
  execCommand(commands)
  
    .then(result => {

      console.log(command);
      if (result) {
        let i = 0;
        (function loop() {
          if (i < products.length) {
            const command = `INSERT INTO  due_terms( Due, Due_type, After, after_type, payments_terms_id) values('${products[i]?.Due}','${products[i]?.Due_type}','${products[i]?.After}','${products[i]?.after_type}', '${result?.insertId}');`
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })
  }else{
     var command = '';

    let i = 0;
  const commands = `Update  master_invoice_payments_terms  set name='${name}' , early_discount='${early_discount}' , early_percent='${early_percent}' , paid_day='${paid_day}' , reducetax='${reduce_tax}' where id='${id}';`
  execCommand(commands)
  
    .then(result => {

      console.log(command);
      if (result) {
        let i = 0;
        (function loop() {
          if (i < products.length) {
            const command = `update due_terms set  Due='${products[i]?.Due}', Due_type='${products[i]?.Due_type}', After='${products[i]?.After}', after_type='${products[i]?.after_type}', payments_terms_id='${products[i]?.payments_terms_id}'  where id='${products[i]?.id}';`
            console.log(command);
            execCommand(command)
              .then(() => {
                i++;
                loop()
              })
              .catch(err => logWriter(command, err));
          }
          else {
            res.json('success')
          }
        }())
      }
    })

  }

  });


  router.get('/paymentsterms_all', (req, res) => {
   
    const command = `select *  from  master_invoice_payments_terms;`;
  
  
    execCommand(command)
  
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
  });
  

  


  router.post('/due_terms_id', (req,res)=>{

    var id=req.body.id;
  
    const command =`select * from due_terms where payments_terms_id='${id}'`;
  
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })








  router.post('/delete_payments', (req,res)=>{
  

    var id=req.body?.id;
  
    const command =`delete from  master_invoice_payments_terms where id='${id}';`;


  
    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
   
  
  })



  router.post('/hl_servicesearch_all', (req,res)=>{
  

    var name=req.body?.name;
  
    const command =`select * from masterhealthcareservices_invoice_billing  where servicename_name LIKE '%${name}%'`;


  console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })



  router.get('/categeory_all_all', (req,res)=>{
  

  
    // const command =`SELECT * FROM master_invoice_categeory order  by categeory_name`;
    const command =`SELECT * FROM bill_group order  by BillGroup_HeaderName`;


    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })


  router.post('/discountall_all', (req,res)=>{
    
  const dis_name=req.body?.name

  
    const command =`SELECT * FROM master_invoice_discount  where discount_name LIKE '%${dis_name}%'`;


  console.log(command);
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   
  
  })






  router.post('/taxall_search', (req,res)=>{
    
    const dis_name=req.body?.name
  
    
      const command =`SELECT * FROM master_invoice_taxes  where taxname LIKE '%${dis_name}%'`;
  
  
    console.log(command);
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
    
    })




    

  
    router.get('/exchange_currency_currency', (req,res)=>{
  

  
      const command =`SELECT * FROM master_currency_exchange_rate`;
  
  
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
    
    })
  




    router.post('/procedurecode_save', (req, res) => {

      console.log(req.body,'sssub');
      
      
      const lab_image_status = req.body.value?.staus
      const servicename_id = req.body.value?.service_name.id
      const service_name = req.body.value?.service_name?.servicename_name
      const bilcocde = req.body.value?.billingcode
      const description = req.body.value?.description
      const saccode = req.body.value?.saccode
      const charge = req.body.value?.charge
      const discount_id = req.body.value?.discount.id
      const discount_name = req.body.value?.discount.discount_name
      const discount_amout = req.body.value?.discount.amount

      const tax_id = req.body.value.tax?.id
      const tax_name = req.body.value.tax?.taxname
      const taxamount = req.body.value.tax?.amount

      const addtional_detail = req.body.value?.addtionaldetail
    
     
      const categeory_name = req.body.value?.categeory_name
      

      const id = req.body.value?.id;

    var commnad='';
      var returnmessage="S"
      if(id=='' || id==null || id==undefined){
    
    
        commnad = `INSERT INTO master_invoice_procedure_code(lab_image_status, service_name, billingcode, descriptions, categeory_name, saccode, charge, discount, tax, addtionaldetail, servicename_id, discount_id, tax_id,discount_amout,tax_amount) VALUES ('${lab_image_status}', '${service_name}','${bilcocde}','${description}','${categeory_name}','${saccode}','${charge}','${discount_name}','${tax_name}','${addtional_detail}','${servicename_id}','${discount_id}','${tax_id}','${discount_amout}','${taxamount}')`;
    
      }
      else{
        commnad=`update master_invoice_procedure_code set lab_image_status='${lab_image_status}', service_name='${service_name}',billingcode='${bilcocde}',descriptions='${description}',categeory_name='${categeory_name}',saccode='${saccode}',charge='${charge}',discount='${discount_name}',tax='${tax_name}',addtionaldetail='${addtional_detail}',servicename_id='${servicename_id}',discount_id='${discount_id}',tax_id='${tax_id}',discount_amout='${discount_amout}',tax_amount='${taxamount}'  where id='${id}'`
        returnmessage="U"
      }

      console.log(commnad);
      execCommand(commnad)
        .then(result => res.json(returnmessage))
        .catch(err => logWriter(commnad, err));
    });
    
    






    router.get('/getallprocedure_code', (req,res)=>{
  

  
      const command =`select * ,(select BillGroup_HeaderName from bill_group where bill_group.BillGroup_Header_id=master_invoice_procedure_code.categeory_name ) as categeory FROM master_invoice_procedure_code`;
  
  
      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
    
    })

    

    router.post('/active_service_procedure_code', (req,res)=>{
      console.log(req.body);
    
      var id=req.body.id;
      var status=req.body.status;
    
      const command =`Update master_invoice_procedure_code set active='${status}' where id='${id}'`;
    
      execCommand(command)
      .then(result => res.json('success'))
      .catch(err => logWriter(command, err));
     
    
    })

  


    router.post('/patient_name', (req, res) => {
      var name = req.body.name

const command=`SELECT mp.*,CONCAT(mp.firstName, ' ', '',mp.middleName,mp.lastName, ' [',mp.id, ']') AS fullname , DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), mp.dateOfBirth)), '%Y') + 0 AS age_age,g.gender AS sex,allcountry.Country as countryname,pc.addressLine1 AS address, pc.addressLine2 AS address2,pc.city AS city,pc.state AS state,pc.country AS country_code,pc.postalCode AS postalcode FROM master_patient AS mp LEFT JOIN gender AS g ON mp.sex = g.conceptId LEFT JOIN  patientcontact AS pc ON mp.guid = pc.patient_id LEFT JOIN master_country_code1 as allcountry  on pc.country=allcountry.countrycode WHERE mp.completeName LIKE '${name}%' or mp.id='${name}%';`
console.log(command);
      execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    
    
    });





    router.post('/provider_name', (req,res)=>{
      
    const branchId=req.body.name.branchId
    const patientId=req.body.name.guid
    const hospitalId=req.body.name.hospitalId
      const command =`SELECT transaction_encounter.*,CONCAT(transactionTime, ' Dr ', Provider) AS EncounterName,master_visit_type.visit_type AS visitTypeName,master_refering_provider.name AS ReferringproviderName,master_chepron.name AS chepronName,master_translators.name AS TranslatorName,description_snapshot.term AS problemList FROM transaction_encounter LEFT JOIN master_visit_type ON master_visit_type.id = transaction_encounter.VisitType LEFT JOIN master_refering_provider ON master_refering_provider.id = transaction_encounter.Referringprovider LEFT JOIN master_chepron ON master_chepron.id = transaction_encounter.Chaperone LEFT JOIN master_translators ON master_translators.id = transaction_encounter.Translator LEFT JOIN description_snapshot ON description_snapshot.id = transaction_encounter.Reasonforvisit WHERE transaction_encounter.patientId = '${patientId}' AND transaction_encounter.branchId = '${branchId}' AND transaction_encounter.hospitalId = '${hospitalId}' order by id desc;`;
      console.log(command);

      execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));
     
    
    })


    



    router.post('/searchprocedure_all', (req, res) => {
      var name = req.body.name

      const command=`SELECT  master_invoice_procedure_code.*,CONCAT(master_invoice_procedure_code.service_name, ' [', master_invoice_procedure_code.billingcode, ']') AS servicename FROM master_invoice_procedure_code WHERE billingcode LIKE '${name}%' OR service_name LIKE '${name}%';`



console.log(command);

      execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    
    
    });




    router.post('/sequence_oftaxes', (req,res)=>{
  
      var data = req.body.displayData
      var i = 0;
      let multiQuery = '';
    
      (function loop(){
          if(i < data.length){
              multiQuery += `Update master_invoice_taxes set sequence='${(i+1)}' where id='${data[i].id}';`;
              i++;
              loop();
          }
          else{
              execCommand(multiQuery.replace(/null/g, ''))
              .then(result => res.json('success'))
              .catch(err => logWriter(multiQuery, err));
          }
      }());
    
      
    })
        
    router.post('/multipleTaxselect', (req, res) => {
      var name = req.body.name

      const command=`SELECT * FROM master_invoice_taxes WHERE taxname LIKE '${name}%' OR taxdescription LIKE '${name}%';`


      execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    
    
    });



    router.post('/alldiscount_value', (req, res) => {
      var name = req.body?.name

      const command=`SELECT * FROM master_invoice_discount WHERE discount_name LIKE '${name}%' OR discount_description LIKE '${name}%';`


      execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    
    
    });


    router.post('/allpayments_termsall', (req, res) => {
      var name = req.body?.name

      const command=`SELECT * FROM master_invoice_payments_terms WHERE name LIKE '%${name}%';`

      execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    
    
    });



    




    router.post('/allterms_all', (req, res) => {

      console.log(req.body,'sssub');

      const name=req.body.name?.termsname
      const link=req.body.name?.termslink
      const id = req.body.value?.id;

    var commnad='';
      var returnmessage="S"
      if(id=='' || id==null || id==undefined){
    
    
        commnad = `INSERT INTO master_invoice_setting(termsname, termslink) VALUES ('${name}', '${link}')`;
    
      }
      else{
        commnad=`update master_invoice_setting set termsname='${name}', termslink='${link}' where id='${id}'`
        returnmessage="U"
      }

      console.log(commnad);
      execCommand(commnad)
        .then(result => res.json(returnmessage))
        .catch(err => logWriter(commnad, err));
    });
    
    




    

    router.get('/allpayments_termsall', (req, res) => {

      const command=`SELECT * FROM master_invoice_setting ;`

      execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
    
    
    });






    router.post('/allinvoicesaves', (req, res) => {

console.log(req.body,'invoice');



      const patient_id = req.body.value?.patientname.id;
      const patientname = req.body.value?.patientname.completeName;
      const patient_age = req.body.value?.patientname.age;
      const invoicenumber = req.body.value?.invoicenumber;
      const invoicedate = req.body.value.invoice_date;
      const encounter_id = req.body.value?.encounter_date?.id;
      const provider_id = req.body.value?.providernaem?.id;
      const provider_name= req.body.value?.providernaem?.Provider;
      const duedate = req.body.value?.duedate;
      const payments_terms = req.body.value?.payments_terms;

      const invoice_status = req.body.value?.invoice_status.name;



      const invoice_details=req.body.value?.details
      const id = req.body.value?.id;

      if(id=='' || id==null || id==undefined){
        var command = '';
    
        let i = 0;
      const commands = `INSERT INTO master_invoiceall(patient_id, patientname,patientage, invoicenumber, invoicedate,  encounter_id, provider_id, providename, duedate, paymenterms_id,invoice_status) VALUES ('${patient_id}', '${patientname}','${patient_age}','${invoicenumber}','${invoicedate}','${encounter_id}','${provider_id}','${provider_name}','${duedate}','${payments_terms}','${invoice_status}')`
      execCommand(commands)
      
        .then(result => {
    
          console.log(command);
          if (result) {

            let i = 0;
            (function loop() {
              if (i < invoice_details.length) {
                
                console.log(invoice_details,'vvvvvvv');

                const productId = invoice_details[i]?.productCode.id;
                const productname = invoice_details[i]?.productCode.servicename;
                const qty = invoice_details[i]?.qty;
                const salesPrice = invoice_details[i]?.salesPrice;
                const discountName = invoice_details[i]?.discount.discount_name;
                const discountId = invoice_details[i]?.discount.id;
                const total = invoice_details[i]?.total;
                const totalTaxInclude = invoice_details[i]?.total_tax_include;
                const command = `INSERT INTO master_invoice_multiple_details ( product_name,product_id,qty,salesprice,discount,discount_id,taxincludeprice,taxexclude_price,patient_id,invoice_id) values('${productname}', '${productId}', '${qty}', '${salesPrice}', '${discountName}', '${discountId}', '${totalTaxInclude}', '${total}','${result.insertId}','${invoicenumber}');`
                console.log(command);
                execCommand(command)
                  .then(() => {
                    i++;
                    loop()
                  })
                  .catch(err => logWriter(command, err));
              }
              else {
                res.json('success')
              }
            }())
          }
        })
      }
      // else{
      //    var command = '';
    
      //   let i = 0;
      // const commands = `Update  master_invoice_payments_terms  set name='${name}' , early_discount='${early_discount}' , early_percent='${early_percent}' , paid_day='${paid_day}' , reducetax='${reduce_tax}' where id='${id}';`
      // execCommand(commands)
      
      //   .then(result => {
    
      //     console.log(command);
      //     if (result) {
      //       let i = 0;
      //       (function loop() {
      //         if (i < products.length) {
      //           const command = `update due_terms set  Due='${products[i]?.Due}', Due_type='${products[i]?.Due_type}', After='${products[i]?.After}', after_type='${products[i]?.after_type}', payments_terms_id='${products[i]?.payments_terms_id}'  where id='${products[i]?.id}';`
      //           console.log(command);
      //           execCommand(command)
      //             .then(() => {
      //               i++;
      //               loop()
      //             })
      //             .catch(err => logWriter(command, err));
      //         }
      //         else {
      //           res.json('success')
      //         }
      //       }())
      //     }
      //   })
    
      // }
    
      });
    
    

      router.get('/invoice_data_get', (req, res) => {

        const command=`SELECT * FROM master_invoiceall ;`
  
        execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
      
      
      });
  





      router.post('/insurance_name', (req, res) => {
        var name = req.body?.name
  
        const command=`SELECT patient_insurance.planName as fullname,patient_insurance.guid,patient_insurance.policyNumber  FROM patient_insurance WHERE planName LIKE '%${name}%';`
  
        execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
      
      
      });


      router.post('/invoiceAccordin', (req, res) => {
        var name = req.body?.id
  
        const command=`select * from master_invoiceall   where patient_id='${name}'  order by invoicenumber ;`
  
        execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
      
      
      });
      router.post('/multipleproduct_code', (req, res) => {
        var name = req.body?.invoicenum

        var multiQuery=''
        let i = 0;
        (function loop(){
          if(i < name.length){
              multiQuery += `select * from master_invoice_multiple_details where patient_id='${name[i].id}' order by invoice_id;`
              i++;
              loop();
          }
          else{
              execCommand(multiQuery.replace(/null/g, ''))
              .then(result => {
                if(name.length == 1){
                  var temp = []
                  temp.push(result)
                  res.json(temp)
                }
                else{
                  res.json(result)

                }
              })
                // console.log('-----',result);
              .catch(err => logWriter(multiQuery, err));
          }
      }());


    
  
        // const command=`select * from master_invoice_multiple_details   where patient_id='${name}';`
  
        // execCommand(command)
        //   .then(result => res.json(result))
        //   .catch(err => logWriter(command, err));
      
      
      });

      
      router.get('/getallmanufacturename_allapi', (req, res) => {
        const command = `select * ,(select organization_name from transaction_organization where id=master_manufacture.company_name ) as orgname ,
        (select Country from master_country_code1 where id=master_manufacture.countrycode )as countryname FROM master_manufacture`;
        execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
      });
      
      
      router.post('/manufacture_status_changeapi', (req, res) => {
        console.log('manufacture_status_changeapi=>>>', req.body);
      
        var id = req.body.id;
        var status = req.body.status;
        const command = `Update master_manufacture set active='${status}' where id='${id}';`;
        execCommand(command)
          .then(result => res.json('success'))
          .catch(err => logWriter(command, err));
      
      
      })

      router.post('/insertmanufactureapi', (req, res) => {
      
        console.log(req.body, 'ssssssssss');
        const adress = req.body.adress;
        const select_option = req.body.value?.selectedOption || '';
        const supliernames = req.body.value?.suplier_name || '';
        const company_name = req.body.value?.company_name?.id || '';
        const adress_types = req.body.value?.adress_type || '';
        const adressline1 = req.body.value?.adressline1 || '';
        const adressline2 = req.body.value?.adressline2 || '';
        const countryname_id = req.body.value?.Country.countrycode || '';
        const countr_id = req.body.value.Country?.Country || '';
        const state_name = req.body.value?.states_name || '';
        const district_name = req.body.value?.District || '';
        const postal_code = req.body.value?.Postal_Code?.postalcode || '';
        const postal_code_id = req.body.value?.Postal_Code?.id || '';
        const tax_id = req.body.value?.taxid || '';
        const pannumber = req.body.value?.pannumber || '';
        const jobpostion = req.body.value?.jobpostion || '';
        const email = req.body.value?.emailid || '';
        const workphone = req.body.value?.work_phone || '';
        const workcode = req.body.value?.workcode || '';
        const fax = req.body.value?.fax || '';
        const mobile = req.body.value?.mobile || '';
        const mobilecode = req.body.value?.mobilecode || '';
        const websitename = req.body.value?.websitename || '';
        const title_id = req.body.value?.title_id || '';
        const tags = req.body.value?.tags || '';
        const id = req.body.value.id;
      
        if (!id) {
          // Handle the case when id is empty (insert operation)
          const returnmessage = "S";
          const command = '';
          let i = 0;
          const commands = `INSERT INTO master_manufacture(selectedoption, suplier_name, company_name, adress_type, adressline1, adressline2, countrycode, state_name,District, postal_code, taxid,pannumber,jobpostion, emailid, work_phone, work_code, fax, mobile, mobilecode, websitename, title_id, tags,Country,postal_id)VALUES ('${select_option}','${supliernames}', '${company_name}','${adress_types}','${adressline1}','${adressline2}','${countryname_id}','${state_name}','${district_name}','${postal_code}','${tax_id}','${pannumber}','${jobpostion}','${email}','${workphone}','${workcode}','${fax}','${mobile}','${mobilecode}','${websitename}','${title_id}','${tags}','${countr_id}','${postal_code_id}')`;
          execCommand(commands)
            .then(result => {
              if (result) {
                let i = 0;
                (function loop() {
                  if (i < adress.length) {
                    const contactname = adress[i]?.contactname || '';
                    const countryname = adress[i]?.Country || '';
                    const statename = adress[i]?.states_name || '';
                    const districts = adress[i]?.District || '';
                    const postal = adress[i]?.postal_Code || '';
                    const email = adress[i]?.email || '';
                    const phone = adress[i]?.phone || '';
                    const mobile = adress[i]?.mobile || '';
                    const country_code = adress[i]?.countrycode || '';
                    const contacts_type = adress[i]?.contacts_type || '';
                    const postal_id = adress[i]?.postal_id || '';
                    const street1 = adress[i]?.street || '';
                    const street2 = adress[i]?.street2 || '';
                    const command = `INSERT INTO master_manufacture_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,contacts_type,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${contacts_type}','${result?.insertId}','${country_code}','${postal_id}','${street1}','${street2}')`;
                    console.log(command);
                    execCommand(command)
                      .then(() => {
                        i++;
                        loop()
                      })
                      .catch(err => logWriter(command, err));
                  }
                  else {
                    res.json('S');
                  }
                }())
              }
            });
        } else {
          // Handle the case when id is not empty (update operation)
      
          var command = '';
          let i = 0;
          const commands = `UPDATE master_manufacture SET selectedoption='${select_option}', suplier_name='${supliernames}', company_name='${company_name}', adress_type='${adress_types}', 
            adressline1='${adressline1}', adressline2='${adressline2}', countrycode='${countryname_id}', state_name='${state_name}',District='${district_name}', postal_code='${postal_code}', 
            taxid='${tax_id}', pannumber='${pannumber}', jobpostion='${jobpostion}', emailid='${email}', work_phone='${workphone}', work_code='${workcode}', fax='${fax}', mobile='${mobile}', 
            mobilecode='${mobilecode}', websitename='${websitename}', title_id='${title_id}', tags='${tags}', Country='${countr_id}', postal_id='${postal_code_id}' WHERE id='${id}'`;
          console.log(commands);
          execCommand(commands)
            .then(result => {
              if (result) {
                if (adress === null || adress.length === 0) {
      
                  res.json('U');
                } else {
                  let i = 0;
                  (function loop() {
                    if (i < adress.length) {
                      console.log(adress);
                      const contactname = adress[i]?.contactname || '';
                      const countryname = adress[i]?.Country || '';
                      const statename = adress[i]?.states_name || '';
                      const districts = adress[i]?.District || '';
                      const postal = adress[i]?.postal_Code || '';
                      const email = adress[i]?.email || '';
                      const phone = adress[i]?.phone || '';
                      const mobile = adress[i]?.mobile || '';
                      const country_code = adress[i]?.countrycode || '';
                      const postal_id = adress[i]?.postal_id || '';
                      const street1 = adress[i]?.street || '';
                      const street2 = adress[i]?.street2 || '';
                      const contacts_type = adress[i]?.contacts_type || '';
                      const adress_form = adress[i]?.formStatus;
                      const suplier_id_id = adress[i].id;
                      console.log('suplier_id_id', suplier_id_id);
                      if (adress_form !== undefined || adress_form !== ' ') {
                        const command2 = `INSERT INTO master_manufacture_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,contacts_type,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${contacts_type}','${id}','${country_code}','${postal_id}','${street1}','${street2}')`;
                        console.log('command2', command2);
                        execCommand(command2);
                      }
                      if (suplier_id_id !== undefined) {
                        const command2 = `DELETE FROM master_manufacture_multiple_contact_address WHERE id ='${adress[i].id}'`;
                        console.log('command2', command2);
                        execCommand(command2);
                        const command3 = `INSERT INTO master_manufacture_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,contacts_type,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${contacts_type}','${id}','${country_code}','${postal_id}','${street1}','${street2}')`;
                        console.log(command3);
                        execCommand(command3)
                          .then(() => {
                            i++;
                            loop()
                          })
                          .then(result => res.json('U'))
                          .catch(err => logWriter(command3, err));
                      }
                    }
                  }())
                }
              }
            });
        }
      });

      
      router.post('/manufacture_multiple_contact', (req, res) => {
        id = req.body.id
        const command = `select *  from  master_manufacture_multiple_contact_address  where suplier_id='${id}';`;
        execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
      });
      
      router.post('/delete_manufacture_address', (req, res) => {
        var id = req.body.data.id;
        const command = `Delete FROM master_manufacture_multiple_contact_address where id ='${id}';`;
        console.log(command);
        execCommand(command)
          .then(result => res.json('deleted'))
          .catch(err => logWriter(command, err));
      
      })
      router.post('/insertmasterflowsheetAPI', (req, res) => {
        console.log(req.body,'1111111');
        var flowsheetname = req.body.flowsheetname ?? ''
        var flowsheet_header_name = req.body.headerNamesheet ?? ''
        var flowsheet_field_name = req.body.testnumber ?? ''
        var id = req.body.id
        var command = '';
        var returnmessage = "S"
        // if (id == '' || id == '0' || id == undefined) {
        //     command = `INSERT INTO master_flowsheet (flowsheet_name) VALUES ('${flowsheetname}')`;
        //     execCommand(command)
        //         .then(result => {
        //             if (result) {
                        let i = 0;
                        (function loop() {
                            if (i < flowsheet_field_name.length) {
                              console.log(flowsheet_field_name[i],flowsheet_field_name[i].servicelabid,'444444444');
                                const innerCommand = `INSERT INTO master_flowsheet (flowsheet_name,  flowsheet_header_name,flowsheet_field_name) VALUES ('${flowsheetname}', '${flowsheet_header_name}','${flowsheet_field_name[i],flowsheet_field_name[i].servicelabid}')`;
                                console.log(innerCommand);
                                execCommand(innerCommand)
                                    .then(() => {
                                        i++;
                                        loop();
                                    })
                                    .catch(err => logWriter(innerCommand, err));
                            } else {
                                // Move the response.json here, outside the loop
                                res.json('S');
                            }
                        })();
                    // }
                // })
                // .then(result => {
                    
        //         })
        //         .catch(err => logWriter(command, err));
        // }
    
    })
    router.get('/getmasterflowsheet', (req, res) => {
      
      const command = `SELECT *,(select DisplayName from  master_lab_test where id=master_flowsheet.flowsheet_field_name) as labservicename FROM master_flowsheet order by flowsheet_header_name`;
      execCommand(command)
          .then(result => res.json(result))
          .catch(err => logWriter(command, err));
  
  });
  router.get('/getflowsheetnamedata', (req, res) => {
    const command = `SELECT * FROM master_flowsheet group by flowsheet_name;`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));

});
  router.post('/insertmasterflowsheetAPI', (req, res) => {
    console.log(req.body);
    var flowsheetname = req.body.flowsheetname ?? ''
    var flowsheet_header_name = req.body.headername ?? ''
    var flowsheet_field_name = req.body.formCode ?? ''
    // var id = req.body.id
    // var command = '';
    // var returnmessage = "S"
    // if (id == '' || id == '0' || id == undefined) {
    //     command = `INSERT INTO master_flowsheet (flowsheet_name) VALUES ('${flowsheetname}')`;
    //     execCommand(command)
    //         .then(result => {
    //             if (result) {
    //                 let i = 0;
    //                 (function loop() {
    //                     if (i < testnumber.length) {
    //                         const innerCommand = `INSERT INTO MASTER_FLOWSHEET_HEADER_NAME (flowsheet_id, flowsheet_header_name) VALUES ('${result.insertId}', '${flowsheet_header_name[i]}')`;
    //                         console.log(innerCommand);
    //                         execCommand(innerCommand)
    //                             .then(() => {
    //                                 i++;
    //                                 loop();
    //                             })
    //                             .catch(err => logWriter(innerCommand, err));
    //                     } else {
    //                         // Move the response.json here, outside the loop
    //                         res.json('S');
    //                     }
    //                 })();
    //             }
    //         })
    //         .then(result => {
    //             // Handle additional logic here if needed
    //             // if (result) {
    //             //     res.json(returnmessage);
    //             // }
    //         })
    //         .catch(err => logWriter(command, err));
    // }

})
router.get('/getmasterflowsheet', (req, res) => {
  const command = `SELECT * FROM master_flowsheet group by `;

  execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));

});

router.post('/getMasterlabsflowsheetdata', (req, res) => {
 var text=req.body.event.query
 console.log(req.body,text,'11111111111111111');
  var command = `SELECT * FROM master_lab_test where  DisplayName like '${text}%'`;
console.log(command);
  execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));

});

router.post('/updateflowsheet', (req, res) => {
  console.log(req.body,'gggggggggggggggghhhhhhhhhhhhhhhhh');
  var id=req.body.newflowsheet.id
  var headerNamesheetsedit=req.body.newflowsheet.headerNamesheetsedit
  var textname=req.body.newflowsheet.TestName.id
  id = req.body.newflowsheet.id
 var command=`update master_flowsheet set flowsheet_field_name='${textname}',flowsheet_header_name='${headerNamesheetsedit}' where id='${id}'`
  // const command = `select *  from  master_manufacture_multiple_contact_address  where suplier_id='${id}';`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
});

router.post('/flowsheetlabsdataheader', (req, res) => {
  var labsname=req.body.labsname
   var command = `SELECT * FROM master_flowsheet where flowsheet_name='${labsname}' group by flowsheet_header_name;`;
 console.log(command,'11111111111111111111111');
   execCommand(command)
       .then(result => res.json(result))
       .catch(err => logWriter(command, err));
 
 });
 router.post('/getflowsheetdataheader', (req, res) => {
  var labsname=req.body.labsname
  var command = `SELECT master_flowsheet.*, master_lab_test.DisplayName AS labservicename,ReferenceRangeMin,ReferenceRangeMax,Service_catogeory,Units
  FROM master_flowsheet
  JOIN master_lab_test ON master_flowsheet.flowsheet_field_name = master_lab_test.id
  WHERE master_flowsheet.flowsheet_name ='${labsname}'`;
console.log(command);
  execCommand(command)
      .then(result => res.json(result))
      .catch(err => logWriter(command, err));

});

router.post('/getlabsnamelist', (req, res) => {
  console.log(req.body);
 var labsname=req.body.event.query
  const command = ` select * from master_flowsheet where  flowsheet_name like'%${labsname}%' group by flowsheet_name`;
  // const command = `SELECT * FROM hosptal_registration where clinicName  LIKE '%${name}%'`;
console.log(command,'2222222222222');
  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.get('/getflowsheetfavrate', (req, res) => {
  const command = ` select * from master_flowsheet where Sharepatient=0  group by flowsheet_name`;
console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

module.exports = router;