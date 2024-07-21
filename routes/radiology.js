const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

router.get('/getmodalitydata' , (req,res) => {
    var command=`select * from master_modality`
    execCommand(command)
    .then(result=>res.json(result))
    .catch(err=>(logWriter(command, err)))
})

router.post('/saveradiology', (req, res) => {
    // console.log('saveradiology',req.body);
    // console.log('saveradiology',req.body);
    const {id,Radiologydate,Modality,Result,Interpretation,InvantigationType,InvantigationName}=req.body.radiology
    var date = formatDate(Radiologydate);
    if(id=='' || id=='0' || id==undefined || id==null){
    command = `INSERT INTO transation_radiology(Radiologydate, Modality, Result, Interpretation,InvantigationType,InvantigationName,transationdate) values('${date}','${Modality}','${Result}','${Interpretation}','${InvantigationType}','${InvantigationName}',now())`;

     
//   console.log(command);
      execCommand(command)
          .then(result => res.json('success'))
          .catch(err => logWriter(command, err));
  
    }
    else{
    const command =`Update transation_radiology set Radiologydate='${Radiologydate}',Modality='${Modality}', Result='${Result}', Interpretation='${Interpretation}',InvantigationType='${InvantigationType}',InvantigationName='${InvantigationName}' ,transationdate='${date}' where id='${id}'`;
     
console.log(command);
    execCommand(command)
    .then(result => res.json('update'))
    .catch(err => logWriter(command, err));id
    }
  });
  
  
router.post('/getradiologytabledata' , (req,res) => {
    var command=`select * ,(select  modalityname from master_modality where id=transation_radiology.Modality) as modalitynames ,(select name from master_radiologycatagerytype where id=transation_radiology.InvantigationType) as categrytype  from transation_radiology`
    console.log(command);
    execCommand(command)
    .then(result=>res.json(result))
    .catch(err=>(logWriter(command, err)))
})
router.get('/master_radiologycatagerytype' , (req,res) => {
    var command=`select * from master_radiologycatagerytype`
    execCommand(command)
    .then(result=>res.json(result))
    .catch(err=>(logWriter(command, err)))
})
function formatDate(dateToBeFormatted){
    if(dateToBeFormatted!=null && dateToBeFormatted!=undefined && dateToBeFormatted!=''){
        var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
        date = new Date(date);
        var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
        // console.log(dateReturn);
        return dateReturn
    }
    else{
        return ''
    }
  }
module.exports =router;