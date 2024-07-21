const express =require('express');
const router =express.Router();
const db =require('../config/db');


router.get("/GETTABLEDATAA", (req, res) => {
    var sql =`select * from sexual_orientation`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json(rows);
      }
    });
  });
  router.get("/getActiveSexualOrientation", (req, res) => {
    var sql =`select * from sexual_orientation where active= '1'`;
    console.log(sql);
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json(rows);
      }
    });
  });
  
  router.post("/DELETESEXUALDATA", (req, res) => {
    var id = req.body.id;
    var sql = `delete from sexual_orientation where id=${id}`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json("deletd");
      }
    });
  })
  router.post("/SAVESEXUALDATA", (req, res) => {
    var sexual_orientation = req.body.orientation;
    var conceptId = req.body.conceptId;
    var moduleid = req.body.moduleid;
  
   // var {countryid,stateid,cityname}= req.body
   var sql = `Insert into sexual_orientation(sexual_orientation,conceptId,moduleId,active)values('${sexual_orientation}','${moduleid}','${conceptId}','${1}')`;
   db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json("submit");
    }
  });
  });
  
  router.post("/UPDATESEXUALDATA", (req, res) => {
  var sexual_orientation = req.body.orientation;
    var conceptId = req.body.conceptId;
    var moduleid = req.body.moduleid;
    var id= req.body.id;
  
  var sql = `UPDATE sexual_orientation set sexual_orientation = '${sexual_orientation}',conceptId='${conceptId}',moduleid='${moduleid}'  WHERE id='${id}'`;
    console.log(sql1);
    console.log('heating');
    db.query(sql1, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        if (rows.length > 0) {
          // console.log('exitst');
          res.json("exist");
        } else {
          db.query(sql, (err, rows) => {
            if (err) {
              console.log(err);
            } else {
              res.json("success");
            }
          });
        }
      }
    });
  });
  
  
  router.post("/UPDATEACTIVEDATA", (req, res) => {
    var id= req.body.id;
    var active=req.body.active;
    var sql = `UPDATE sexual_orientation set active='${active}'  WHERE id='${id}'`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.json("success");
      }
    });
    });
  


module.exports =router;