const express =require('express');
const router =express.Router();
const db =require('../config/db');

router.get('/Addmaster_resource', (req,res)=>{
    const command = `SELECT * FROM master_resource`;
    
    db.query(command, (err, result) => {
        if (err) {
            res.json({ status: 'fail', error: err });
        } else {
            res.json(result);
        }
    });
    
});
router.get('/Addmaster_language', (req,res)=>{
    const command = `SELECT * FROM master_language`;
    // console.log(command);.
    db.query(command, (err, result) => {
        if (err) {
            res.json({ status: 'fail', error: err });
        } else {
            res.json(result);
        }
    });
    
});
router.get('/Addmaster_label', (req,res)=>{
    const command = `SELECT * FROM master_resource where language_id = 'c002'`;
    // console.log(command);
    db.query(command, (err, result) => {
        if (err) {
            res.json({ status: 'fail', error: err });
        } else {
            res.json(result);
        }
    });
    
});
router.post('/insertlanguage', (req,res)=>{
    // console.log(req.body);
    var languageinputName =req.body.languageinputName
    const command = `INSERT INTO master_resource(language) values('${languageinputName}')`;
    const command2 =`SELECT * from master_resource where language = '${languageinputName}'`;
    
    
    db.query(command2,(err,result)=>{
        if(err){
            console.log(err);
        } else {
            if(result.length>0) {
                res.json('exist');
            } else {
                db.query(command, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json('success');
                    }
                });
            }
        }
    })    
    
});


module.exports =router;