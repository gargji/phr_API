const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');
const multer = require('multer')

const fs = require("fs");
const { text } = require('express');


// ___________________-clinic Overview

router.post('/InsertOrganization', (req,res)=>{
//console.log(req.body);
var guid=req.body.formValue.guid
  var organization_name=req.body.formValue.organization_name
  var addressLine1=req.body.formValue.addressLine1
  var addressLine2=req.body.formValue.addressLine2
  var GST_no=req.body.formValue.GST_no
  var Tin_No=req.body.formValue.Tin_No;
  var Cin_No=req.body.formValue.Cin_No
  var Latitude=req.body.formValue.Latitude
  var Longitude=req.body.formValue.Longitude
  var time_zone=req.body.formValue.time_zone
  var Country=req.body.formValue.Country?.Country
  var countryId=req.body.formValue.Country?.countrycode
  var State=req.body.formValue.State
  var District=req.body.formValue.District
  var Postal_Code=req.body.formValue.Postal_Code?.postalcode
  var postalcode_id=req.body.formValue.Postal_Code.id
  var Work_Phone=req.body.formValue.Work_Phone
  var Work_Mobile=req.body.formValue.Work_Mobile
  var Work_Email_Id=req.body.formValue.Work_Email_Id
  var mobilecode=req.body.formValue.mobilecode
  var link=req.body.formValue.Maplink;
  var WebSitelink=req.body.formValue.WebSitelink
  var Organization_Description=req.body.formValue.Organization_Description
  var displayname=req.body.formValue.displayname
         var id=req.body.formValue.id
         var command=''
        //  returmMesage='S'
         
        //  if(id==undefined || id==null || id=='' ){
        //        var commandDuplicate=`select count(*) as count from transaction_organization where organization_name = '${organization_name}'`
       
              
        //        .then(result => {
        //         //console.log('parful',result.count);
        //         debugger
        //         if(result.count>0){
        //           command = `Insert into transaction_organization(guid,countrycode, organization_name, addressLine1, addressLine2, GST_no, Tin_No, Cin_No, Latitude, Longitude, time_zone, Country, states_name, district_name, Postal_Code, Work_Phone, Work_Mobile, Work_Email_Id, Organization_Description,Maplink,countryMobileCode,WebSitelink,postalcode_id,transaction_time) 
        //           values('${guid}','${countryId}','${organization_name}','${addressLine1}','${addressLine2}','${GST_no}','${Tin_No}','${Cin_No}','${Latitude}','${Longitude}','${time_zone}','${Country}','${State}','${District}','${Postal_Code}','${Work_Phone}','${Work_Mobile}','${Work_Email_Id}','${Organization_Description}','${link}','${mobilecode}','${WebSitelink}','${postalcode_id}',now())`;
        //           execCommand(command)
        //           .then(result => res.json(returmMesage))
        //           .catch(err => logWriter(commandInsert, err));
        //         }else{
        //           res.json('duplicate')
                
        //         }
             
        //        })
              
         
        //  }else{
          // returmMesage='U'
          command = `Update transaction_organization set  countrycode='${countryId}',organization_name='${organization_name}',addressLine1='${addressLine1}',addressLine2='${addressLine2}',GST_no='${GST_no}',Tin_No='${Tin_No}',Cin_No='${Cin_No}',Latitude='${Latitude}',Longitude='${Longitude}',time_zone='${time_zone}',Country='${Country}',states_name='${State}',district_name='${District}',Postal_Code='${Postal_Code}',Work_Phone='${Work_Phone}',Work_Mobile='${Work_Mobile}',Work_Email_Id='${Work_Email_Id}',Organization_Description='${Organization_Description}',Maplink='${link}',countryMobileCode='${mobilecode}',WebSitelink='${WebSitelink}',postalcode_id='${postalcode_id}',displayname='${displayname}',transaction_time=now() where id='${id}'`;
          //console.log(command);
          execCommand(command.replace(/null/g, ''))
         
          .then(result => res.json('success'))
          .catch(err => logWriter(commandInsert, err));
// 
        //  }
        
        })



        
        // ____________________________________________________________________________
    
   router.get('/getAllOrganization',(req,res)=>{

    var command=`select * from transaction_organization;`
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   })

   router.post('/getAllOrganizationDetails',(req,res)=>{
    // //console.log(req.body);
    var organid=req.body.Oragnid

    var command=`select * from transaction_organization where guid='${organid}';`
    execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
   })
   
   
   router.post('/DeleteOrganization',(req,res)=>{
     var  id=req.body.id
    var command=`Delete from  transaction_organization where id= '${id}';`
    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
   })

module.exports=router