const express =require('express');
const router =express.Router();
const db =require('../config/db');


router.get("/getActiveMaritalStatusData", (req, res) => {
  var sql =`select * from master_marital_status where active = '1'`;
  console.log(sql);
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
});;


module.exports =router;