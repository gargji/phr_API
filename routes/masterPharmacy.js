const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

router.get('/GetPharmacytableData',(req,res)=>{
   const command=`SELECT *,(select city_name from master_city where id=master_pharmacy.city) as cityname,(select countryName from master_country1 where conceptId = master_pharmacy.country) as countryName,(select state_name from master_state where id=master_pharmacy.state) as StateName from master_pharmacy;`;

   execCommand(command)
   .then(result => res.json(result))
   .catch(err => logWriter(command, err));
})

router.post('/activedeactivemaster_pharmacy', (req,res)=>{
    var id=req.body.id;
    var status=req.body.status;

    const command =`Update master_pharmacy set active='${status}' where id='${id}';`;
    console.log(command);

    execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('success')
    //     }                                    
    // })

})

router.post('/AddUpdateMasterPharmacy', (req,res)=>{
    var guid = newGuid()
    var name = req.body.name
    var language_id=req.body.language_id
   var addressline1 = req.body.addressline1
   var emailId   =  req.body.emailId
   var addressline2  =     req.body. addressline2          
   var area =    req.body.area
   var state  = req.body.state
   var district = req.body.district
   var country= req.body.country
   var landmark= req.body.landmark
   var postalcode=req.body.postalcode
   var phoneNo=req.body.phoneNo
   var GSTNo=req.body.GSTNo
   var geoLocation=req.body.geoLocation;
   var city=req.body.city.id;
   var active=req.body.active

    var id = req.body.id
    var command ='';
    var returnmessage="S"
    if(id=='' || id=='0' || id==undefined){
         command = `INSERT INTO master_pharmacy(guid,name,language_id,city,addressline1,emailId,addressline2,area,state,district,country,landmark,postalcode,phoneNo,GSTNo,geoLocation,active) values('${guid}','${name}','${language_id}','${city}','${addressline1}','${emailId}','${addressline2}','${area}','${state}','${district}','${country}','${landmark}','${postalcode}','${phoneNo}','${GSTNo}','${geoLocation}',1)`;
    }
    else{
        command =`update master_pharmacy set name='${name}',language_id='${language_id}',city='${city}',addressline1='${addressline1}',emailId='${emailId}',addressline2='${addressline2}',area='${area}',state='${state}',district='${district}',country='${country}',landmark='${landmark}',postalcode='${postalcode}',phoneNo='${phoneNo}',GSTNo='${GSTNo}',geoLocation='${geoLocation}' where id='${id}'`;
        returnmessage="U"
    }

    execCommand(command)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(command, err));
    
    

    function newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
})
router.post('/deletemaster_pharmacy', (req,res)=>{
    const id =req.body.id;

    const command =`delete from master_pharmacy where id=${id};`;
    console.log(command);

    execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
    // db.query(command,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.json('deleted')
    //     }                                    
    // })

})
router.post('/findAddress', (req, res) => {
  console.log(req.body.text);
  const cityname = req.body.text
  const command = `select * from master_city where city_name like '%${cityname}%';`;
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

}) 
router.post('/findPINcode', (req, res) => {
  const district = req.body.district
  const command = `select * from master_pincode where area='${district}';`;
  console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));

})  

router.post('/getDistrictWithCity', (req, res) => {
  console.log('hit');
  const cityId = req.body.city_id
  const command = `select * from master_pincode where city_id = '${cityId}' group by area; select *, (select state_name from master_state where id = master_city.state_id) as statename, (select countryName  from master_country1 where conceptId = master_city.country_id) as countryname from master_city where id = '${cityId}'; `
  console.log(command);
  execCommand(command)
  .then(result => res.json(result))
  .catch(err => logWriter(command, err));
}) 
module.exports =router;