
const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')



router.post('/gethosptialname', (req, res) => {
  var name = req.body.hosptialname

  const command = `SELECT * FROM hosptal_registration where clinicName  LIKE '%${name}%'`;

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});



router.get('/specialty', (req, res) => {

  const command = `SELECT * FROM master_clinical_speciality `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/sub_specialty', (req, res) => {
  var department = req.body.name

  const command = `SELECT * FROM master_lab_department where Department Like'%${department}%'`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.get('/serviceprovisioncondition', (req, res) => {
  var part_ofprogram = req.body.name
  console.log(part_ofprogram, 'cc');

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

  const name = req.body.value?.BillGroup_HeaderName ?? ''
  const create_id = req.body.value?.CreatedBy ?? ''
  const tax = req.body.value.tax?.taxname ?? ''
  const tax_id = req.body.value.tax?.id ?? ''
  const discount = req.body.value.discount?.discount_name ?? ''
  const discount_id = req.body.value.discount?.id ?? ''

  var hosptial_id=req.body?.hospitalId
  var branchid=req.body?.branchId

  var id = req.body.value.BillGroup_Header_id ?? ''
  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO bill_group(BillGroup_HeaderName, CreatedBy,tax_id,tax,discount,discount_id,CreatedDate,hosptial_id,branch_id) VALUES ('${name}','${create_id}','${tax_id}','${tax}','${discount}','${discount_id}',now(),'${hosptial_id}','${branchid}')`;

  }
  else {
    commnad = `update bill_group set BillGroup_HeaderName='${name}',CreatedBy='${create_id}',tax_id='${tax_id}',tax='${tax}',discount='${discount}',discount_id='${discount_id}',hosptial_id='${hosptial_id}',branch_id='${branchid}',   CreatedDate=now()  where BillGroup_Header_id='${id}'`
    returnmessage = "U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});


router.post('/get_billgroup', (req, res) => {

  
var hosptial=req.body?.hospitalId
var branchid=req.body?.branchId


  const command = `SELECT * FROM bill_group  where hosptial_id='${hosptial}'  and branch_id='${branchid}';`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/deletebillgroup', (req, res) => {

  var idd = req.body.id

  const command = `delete from bill_group where  BillGroup_Header_id='${idd}'`;


  execCommand(command)

    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});

router.post('/activestatusbillgroup', (req, res) => {


  var id = req.body.id;
  var status = req.body.status;

  const command = `Update bill_group set active='${status}' where BillGroup_Header_id='${id}';`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})











router.get('/getgroupname', (req, res) => {


  const command = `select * from bill_group ;`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})

router.post('/subbillgroup', (req, res) => {

  console.log(req.body, 'sssub');

  var billsubgroupname = req.body.value.billsubgroup_Name

  var billgroupheadername_id = req.body.value.billgroup_header_id
  var created_by = req.body.value.CreatedBy
  var id = req.body.value.bill_sub_ID


  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO billsubgroup(billsubgroup_Name, billgroup_header_id,Created_By) VALUES ('${billsubgroupname}', '${billgroupheadername_id}','${created_by}')`;

  }
  else {
    commnad = `update billsubgroup set billsubgroup_Name='${billsubgroupname}' ,billgroup_header_id=${billgroupheadername_id}, Created_By=${created_by}  where bill_sub_ID='${id}'`
    returnmessage = "U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});



router.get('/get_subbillgroup', (req, res) => {



  const command = `SELECT billsubgroup.billsubgroup_Name,billsubgroup.active, billsubgroup.bill_sub_ID ,   bill_group.BillGroup_HeaderName,billsubgroup.billgroup_header_id FROM billsubgroup INNER JOIN bill_group ON bill_group.BillGroup_Header_id=billsubgroup.billgroup_header_id;`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})


router.post('/deletsub_bill', (req, res) => {

  var idd = req.body.id

  const command = `delete from billsubgroup where  bill_sub_ID='${idd}'`;


  execCommand(command)

    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});



router.post('/activsubbill', (req, res) => {
  console.log(req.body);

  var id = req.body.id;
  var status = req.body.status;

  const command = `Update billsubgroup set active='${status}' where bill_sub_ID='${id}'`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})


router.get('/get_statusdata', (req, res) => {



  const command = `select * from  master_location_status`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})




router.get('/getbedstatus', (req, res) => {



  const command = `select * from  master_location_bedstatus`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})



router.get('/locationstatus', (req, res) => {



  const command = `select * from  master_location_mode`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})


router.get('/location_type_type', (req, res) => {


  var display_name = req.body.name
  const command = `select * from  master_type_location `

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})


router.get('/physical_form_location_search', (req, res) => {


  const command = `select * from  master_location_form_physical_location `

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));

})



router.get('/chractics_location_ser', (req, res) => {

  const command = `select * from master_location_of_charactics`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.get('/contact_locationservice', (req, res) => {


  const command = `select * from master_staffpersonalidentifiers `

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

// 



router.get('/location_orgnation_name_service', (req, res) => {


  const command = `select * from transaction_organization`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/service_location', (req, res) => {

  console.log(req.body, 'sdd');
  var names = req.body.value.location_name
  var aliass = req.body.value.alias
  // var modes=req.body.value.modes
  var types = req.body.value.location_type
  var forname = req.body.value.physical_type_form
  var orgnation = req.body.value.managing_Organization
  var contants = req.body.value.contact


  var hosptia_guid = req.body.hosptialvalue?.guid
  var hosptial_branchId = req.body.hosptialvalue?.branchId


  var id = req.body.value.location_id
  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO master_location( location_name,alias,location_type,form,contact,managing_Organization,hospital_id,branch_id) 
        VALUES('${names}', '${aliass}','${types}','${forname}','${contants}','${orgnation}','${hosptia_guid}','${hosptial_branchId}')`;

  }
  else {
    commnad = `update master_location set location_name='${names}' ,alias='${aliass}',location_type='${types}', form='${forname}', contact='${contants}',
        managing_Organization='${orgnation}' ,hospital_id='${hosptia_guid} ,branch_id='${hosptial_branchId}'   where id='${id}'`
    returnmessage = "U"
  }

  console.log(commnad);
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});


router.get('/get_alllocationname', (req, res) => {
  // master_location. location_status,

  const command = `
      select  master_location.id,master_location.location_name ,   master_location.enable,   master_location.table_name,   master_location.active,master_location.alias ,master_location.location_type,master_location.contact,master_location.form,master_location.managing_Organization
      ,master_type_location.display as typeslocation  ,master_location_form_physical_location.display as physical_typeform ,transaction_organization.organization_name as orgnation_name,
      master_staffpersonalidentifiers. firstname 
       as firstname,master_location_bedstatus.display as physical_status
         from master_location
         left join master_type_location on master_type_location.id=master_location.location_type
         left join master_location_form_physical_location on master_location_form_physical_location.id=master_location.form
         left join master_staffpersonalidentifiers on master_staffpersonalidentifiers.id=master_location.contact
         left join transaction_organization  on transaction_organization.id=master_location.managing_Organization
         left join master_location_bedstatus  on master_location_bedstatus.id=master_location.operationalStatus where  master_location.enable='1'
   `
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



router.post('/get_hosptialname_faclity', (req, res) => {

  id_name = req.body.guid_id


  const command = `SELECT  clinic_overview.guid,clinic_overview.ClinicName  FROM clinic_overview where guid=${id_name};`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})







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



router.post('/location_status_active', (req, res) => {

  var id = req.body.id;
  var status = req.body.status;

  const command = `Update master_location set active='${status}' where id='${id}'`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})





router.post("/oprational_status", (req, res) => {

  console.log(req.body);
  var status = req.body.status
  var Data = req.body.data
  var command = ''
  let i = 0;
  (function loop() {
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
    else {
      res.json('success')
    }
  }())


})



router.post('/enable_status', (req, res) => {

  console.log('ss', req.body);

  var id = req.body.data.id;
  var status = req.body.status;

  const command = `Update master_location set enable='${status}' where id='${id}'`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})






router.get('/alllocation_service', (req, res) => {


  const command = `select * from master_location`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.get('/get_bill_group_service', (req, res) => {


  const command = `select * from bill_group`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/get_subbill_group_service', (req, res) => {
  let bill_group_id = req.body.data


  const command = `select * from billsubgroup  where billgroup_header_id='${bill_group_id}'`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})




router.post('/service_name_total', (req, res) => {

  let name = req.body?.data

  const command = `select * from master_procedure_history  where name LIKE'%${name}%';`


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})



router.post('/condtion_age_value', (req, res) => {

  let id = req.body.id

  console.log(id);
  var command = ``
  if (id == '2') {
    var command = ` select gender.id, gender.gender as name from gender;`

  }
  else if (id == '1') {
    var command = `select master_ageband.agebandname as name,master_ageband.id   from master_ageband`
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
  console.log('servic_billgroup_totalvaleue=>>>>', req.body);
  try {

    const { formtotalvalue, genderform, hosptialid_id } = req.body;

    const hosptialnames = hosptialid_id?.clinicName
    const categeory_names = formtotalvalue?.categeory_name

    const location_namess = formtotalvalue?.locationname
    const service_name = formtotalvalue?.service_name?.id

    if (service_name !== undefined) {
      servicename_name = formtotalvalue?.service_name?.name

    } else {
      servicename_name = formtotalvalue?.service_name
    }

    const local_codes = formtotalvalue?.local_code
    const display_localnames = formtotalvalue?.display_localname
    const department_id = formtotalvalue?.sub_specialty_id?.id
    const departmentname = formtotalvalue?.sub_specialty_id?.id
    const salce_price = formtotalvalue?.sales_price
    const taxes = formtotalvalue?.taxes?.id
    const currencynames = formtotalvalue?.currency?.currency
    const currency_id = formtotalvalue?.currency?.id
    const hsncode = formtotalvalue?.hsn_code
    const hsndescription = formtotalvalue?.sas_description
    const hosptial_id = hosptialid_id?.guid
    const branch_id = hosptialid_id?.branchId
    const multiple_country_name = formtotalvalue?.country_name?.id
    const id = formtotalvalue?.id
    const languageCodes = formtotalvalue?.language_id
    let command = '';

    if (id == '' || id == null || id == undefined) {
      if (formtotalvalue !== undefined) {
        command = `INSERT INTO  masterhealthcareservices_invoice_billing(hosptialname, category, servicename, display_local_name, sub_specialty,departmentname ,location, sales_price, taxes, currency,language_name,country_name,hosptial_id,hosptial_branch_id,servicename_name,local_code,hsn_code,sas_description,currency_id)  values('${hosptialnames}','${categeory_names}','${service_name}','${display_localnames}','${department_id}', '${departmentname}','${location_namess}' ,'${salce_price}' ,'${taxes}','${currencynames}', '${languageCodes}','${multiple_country_name}','${hosptial_id}','${branch_id}','${servicename_name}','${local_codes}','${hsncode}','${hsndescription}','${currency_id}')`;
        console.log(command);
        const result = await execCommand(command)

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
        command = `update masterhealthcareservices_invoice_billing set hosptialname='${hosptialnames}',category='${categeory_names}', servicename='${service_name}', display_local_name='${display_localnames}',local_code='${local_codes}', location='${location_namess}', sales_price='${salce_price}',taxes='${taxes}',currency='${currencynames}',language_name='${languageCodes}',country_name='${multiple_country_name}', servicename_name='${servicename_name}',departmentname = '${departmentname}'   where id = '${id}'`
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





router.post('/totaldataservice_value', (req, res) => {
   var hosptial=req.body?.hosptialid
   var branch_id=req.body?.branch


  const command = `select hls.id, hls.hosptialname, hls.category, hls.subcategory, hls.servicename, hls.display_local_name, hls.local_code, hls.specialty, hls.sub_specialty, hls.location, hls.sales_price, hls.cost, hls.taxes, hls.hsn_code, hls.sas_description, hls.currency, hls.currency_id, hls.ap_expenseive, hls.language_name, hls.country_name, hls.active, hls.hosptial_id, hls.hosptial_branch_id, hls.code_system_type, hls.servicename_name, hls.departmentname ,bg.BillGroup_Header_id, bg.BillGroup_HeaderName, bg.active, bg.DisplaySequence, bg.CreatedBy, bg.CreatedDate, bg.ModifiedBy, bg.ModifiedDate, bg.IsOPD, bg.IsIPD, bg.RequestType, bg.IsMarkUP, bg.IsInvItems, bg.tax_id, bg.tax, bg.discount, bg.discount_id,mph.autoId,mph.effectiveTime, mph.active, mph.moduleId, mph.refsetId, mph.referencedComponentId, mph.name, mph.defaul,  ml.active,  ml.operationalStatus,  ml.location_name,  ml.alias,  ml.description,  ml.modes,  ml.location_type,  ml.contact,  ml.address,  ml.form,  ml.managing_Organization,  ml.partOf,  ml.characteristic,  ml.hoursOfOperation,  ml.table_name,  ml.enable,  ml.lang_id,  ml.hospital_id, ml.branch_id,mcc1.countrycode, mcc1.fips, mcc1.Country, mcc1.Capital, mcc1.Continent, mcc1.mobileCode, mit.codes, mit.taxname, mit.taxdescription, mit.taxgroup, mit.itisparent_group, mit.countryname, mit.country_id, mit.company, mit.label_on_invoice, mit.tax_compunation, mit.amount, mit.tax_type, mit.tax_scope, mit.distribution_for_invoice, mit.created_on, mit.created_by, mit.last_updated_by, mit.active, mit.include_in_price, mit.subseq_taxes, mit.sequence,mld.Department
  from masterhealthcareservices_invoice_billing as hls
  left join bill_group bg on bg.BillGroup_Header_id = hls.category 
  left join master_procedure_history mph on mph.id = hls.servicename
  left join master_location ml on ml.id = hls.location   
  left join master_country_code1 mcc1 on mcc1.id = hls.country_name
  left join master_lab_department mld on mld.id = hls.departmentname
  left join master_invoice_taxes mit on mit.id = hls.taxes    where hls.hosptial_id='${hosptial}' and hls.hosptial_branch_id='${branch_id}'  ORDER BY ID DESC ;`
  // const command = `select hlservice.id,hlservice.code_system_type,hlservice.active,master_country_code1.Country as country,hlservice.hosptialname,hlservice.category,hlservice.subcategory,hlservice.servicename,hlservice.display_local_name, hlservice.local_code, hlservice.specialty, hlservice.sub_specialty,hlservice. location, hlservice.tag,hlservice.inventory_status, hlservice.lab_status, hlservice.sales_price, hlservice.cost, hlservice.taxes, hlservice.hsn_code, hlservice.sas_description, hlservice.currency, hlservice.ar_income_account, hlservice.ap_expenseive, hlservice.language_name, hlservice.country_name, bill_group. BillGroup_HeaderName as categeory_name,billsubgroup.billsubgroup_Name as sub_categeory_name,CONCAT(IFNULL(loincuniversal.LONG_COMMON_NAME, ''),'',IFNULL(master_procedure_history.name, '')) AS service_name, master_clinical_speciality.speciality as Specialty_id, master_clinical_sub_speciality.sub_speciality as sub_specialty_id, master_location.location_name as locationname from masterhealthcareservices_invoice_billing as hlservice left join bill_group on bill_group.BillGroup_Header_id=hlservice.category left join billsubgroup on billsubgroup.bill_sub_ID=hlservice.subcategory left join loincuniversal on loincuniversal.id=hlservice.servicename left join master_procedure_history on master_procedure_history.id=hlservice.servicename left join master_clinical_speciality on master_clinical_speciality.id=hlservice.specialty left join master_clinical_sub_speciality on master_clinical_sub_speciality.id=hlservice.sub_specialty left join master_location on master_location.id=hlservice.location   left join master_country_code1 on master_country_code1.id=hlservice.country_name`;

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

router.post('/multipleformarraycreate', (req, res) => {
  var id = req.body.id



  const command = `select * from master_healthcareservice_multiple_value_condtions where  health_service_id='${id}';`


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});


router.post('/deleteservicehealthcare', (req, res) => {
  var id = req.body.id


  const command = `delete  from masterhealthcareservices_invoice_billing where  id='${id}'; delete FROM master_healthcareservice_multiple_value_condtions where health_service_id='${id}';`

  execCommand(command)

    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});





router.post('/healthcareservice_status', (req, res) => {

  var id = req.body.id;
  var status = req.body.status;

  const command = `Update masterhealthcareservices_invoice_billing set active='${status}' where id='${id}'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})



router.get('/totalcurrency', (req, res) => {



  const command = `select * from  master_currency_exchange_rate`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

// router.post('/multiple_currency_rates', (req, res) => {
//   console.log('multiple_currency_rates=>>', req.body);
//   var Data = req.body?.multiple_values;
//   var currencydata = req.body?.currency_id_value
//   var currencyvalues_id = req.body?.currency_id_value?.id;
//   var command = '';


//   if (!currencyvalues_id) {
//     const insert = `INSERT INTO master_currency_exchange_rate (currency, name, currency_unit, currency_subunit) VALUES ('${currencydata?.currency}', '${currencydata?.name}', '${currencydata?.currency_unit}', '${currencydata?.currency_subunit}');`
//     console.log(insert);
//     execCommand(insert)
//       .then(result => res.json('success'))



//       .catch(err => logWriter(insert, err));
//   }


//   let i = 0;
//   const command3 = `delete from master_currency_multiple_rates  where currency_id='${currencyvalues_id}'`
//   console.log(command3);
//   execCommand(command3)
//     .then(result => res.json(result))
//     .catch(err => logWriter(command3, err));

//   (function loop() {
//     if (i < Data.length) {
//       command = `INSERT INTO master_currency_multiple_rates(Date, UnitperINR, INRperUnit, TechnicalRate, currency_multiple_id, currency_id, LastUpdateOn) VALUES ('${Data[i].Date}',' ${Data[i].UnitperINR}', '${Data[i].INRperUnit}', '${Data[i].TechnicalRate}', '${Data[i].currency_id}', '${currencyvalues_id}', now());`;
//       console.log(command);
//       execCommand(command)
//         .then(() => {
//           i++;
//           loop();
//         })
//         .catch(err => logWriter(command, err));
//     }

//     else {
//       const selectQuery = `SELECT * FROM master_currency_multiple_rates WHERE currency_id = ${currencyvalues_id} ORDER BY LastUpdateOn DESC LIMIT 1;`;

//       execCommand(selectQuery)
//         .then(result => {
//           const currencyRateData = result[0];
//           const updateExchangeRateQuery = `UPDATE master_currency_exchange_rate SET current_rate='${currencyRateData.UnitperINR}', inverse_rate='${currencyRateData.INRperUnit}' ,date='${currencyRateData.LastUpdateOn}' WHERE id = '${currencyRateData.currency_id}';`;
//           console.log(updateExchangeRateQuery);


//           return execCommand(updateExchangeRateQuery);

//         })
//         .then(() => {
//           res.json('success');
//         })
//         .catch(err => {
//           logWriter(selectQuery, err);
//           res.status(500).json('error');
//         });
//     }
//   })();
// });




router.post('/multiple_currency_rates', async (req, res) => {
  try {
    // console.log('multiple_currency_rates =>>', req.body);

    var data = req.body?.multiple_values;
    var currencyData = req.body?.currency_id_value;
    var currencyValuesId = req.body?.currency_id_value?.id;

    if (currencyValuesId) {
      // Update master_currency_exchange_rate
      const updateCurrency = `
        UPDATE master_currency_exchange_rate
        SET currency = '${currencyData?.currency}', name = '${currencyData?.name}', currency_unit = '${currencyData?.currency_unit}', currency_subunit = '${currencyData?.currency_subunit}'
        WHERE id = '${currencyValuesId}';
      `;

      // console.log(updateCurrency);
      await execCommand(updateCurrency);

      // Delete existing records from master_currency_multiple_rates
      const deleteMultipleRates = `
        DELETE FROM master_currency_multiple_rates
        WHERE currency_id = '${currencyValuesId}';
      `;

      console.log(deleteMultipleRates);
      await execCommand(deleteMultipleRates);
    } else {
      // Insert into master_currency_exchange_rate if currencyValuesId is not available
      const insertCurrency = `
        INSERT INTO master_currency_exchange_rate (currency, name, currency_unit, currency_subunit) 
        VALUES ('${currencyData?.currency}', '${currencyData?.name}', '${currencyData?.currency_unit}', '${currencyData?.currency_subunit}')
        RETURNING id;
      `;

      // console.log(insertCurrency);

      const result = await execCommand(insertCurrency);
      currencyValuesId = result.insertId; // Update currencyValuesId with the newly inserted ID
    }

    // Insert new records into master_currency_multiple_rates
    for (const item of data) {
      const insertMultipleRates = `
        INSERT INTO master_currency_multiple_rates(Date, UnitperINR, INRperUnit, TechnicalRate, currency_multiple_id, currency_id, LastUpdateOn) 
        VALUES ('${item.Date}', '${item.UnitperINR}', '${item.INRperUnit}', '${item.TechnicalRate}', '${item.currency_id}', '${currencyValuesId}', now());
      `;

      // console.log(insertMultipleRates);
      await execCommand(insertMultipleRates);
    }

    res.json('success');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/update_status_currency', (req, res) => {

  var id = req.body.id;
  var status = req.body.status;

  const command = `Update master_currency_exchange_rate set active='${status}' where id='${id}'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


router.post('/currency_rates', (req, res) => {

  var id = req.body.id;

  const command = `select * from master_currency_multiple_rates where currency_id='${id}'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})





router.post('/labtags', (req, res) => {

  console.log(req.body, 'ssssssssss');
  var name = req.body.value.tagname
  var id = req.body.value?.id
  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO master_labservice_tags_name(tagname) VALUES ('${name}')`;

  }
  else {
    commnad = `update master_labservice_tags_name set tagname='${name}' where id='${id}'`
    returnmessage = "U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});



router.get('/labservicetag__all_data', (req, res) => {



  const command = `select * from  master_labservice_tags_name`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


router.post('/delete_servicetags', (req, res) => {

  console.log(req.body);

  id = req.body.id

  const command = `delete   from  master_labservice_tags_name where id=${id}`;
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


})



router.get('/tagalldata_value_get', (req, res) => {



  const command = `select * from  master_labservice_tags_name`;
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

  console.log(req.body, 'ssssssssss');
  var name = req.body.value.name
  var countryname = req.body.value.country.Country
  var country_id = req.body.value.country.id

  var id = req.body.value.id
  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO master_taxes_allgroup(name, country,country_id) VALUES ('${name}', '${countryname}','${country_id}')`;

  }
  else {
    commnad = `update master_taxes_allgroup set name='${name}' ,country='${countryname}',country_id='${country_id}'  where id='${id}'`
    returnmessage = "U"
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






router.post('/deletetaxgroup', (req, res) => {

  console.log(req.body);

  id = req.body.id

  const command = `delete   from  master_taxes_allgroup where id=${id}`;
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


})



router.post('/dragtextgrop', (req, res) => {

  var data = req.body.displayData
  var i = 0;
  let multiQuery = '';

  (function loop() {
    if (i < data.length) {
      multiQuery += `Update master_taxes_allgroup set sequence='${(i + 1)}' where id='${data[i].id}';`;
      i++;
      loop();
    }
    else {
      execCommand(multiQuery.replace(/null/g, ''))
        .then(result => res.json('success'))
        .catch(err => logWriter(multiQuery, err));
    }
  }());


})





router.post('/invoice_tax_all', (req, res) => {
  console.log(req.body);

  var tax_name = req.body.invoicetax?.taxname ?? ''
  var tax_description = req.body.invoicetax?.taxdescription ?? ''
  var taxcompunation = req.body.invoicetax?.tax_compunation ?? ''
  var taxtype = req.body.invoicetax?.tax_type ?? ''

  var taxscope = req.body.invoicetax?.tax_scope ?? ''
  var amount = req.body.invoicetax?.amount ?? ''
  var labeloninvoice = req.body.invoicetax?.label_on_invoice ?? ''
  var taxgroup_name = req.body.invoicetax?.taxgroup ?? ''
  var country = req.body.invoicetax.countryname?.Country ?? ''
  var country_id = req.body.invoicetax?.countryname?.id ?? ''
  var include_insome = req.body.invoicetax?.include_in_price ?? ''
  var subsequence = req.body.invoicetax?.subseq_taxes ?? ''
  var company_name = req.body.invoicetax?.company ?? ''
  var id = req.body.invoicetax?.id ?? ''
  var commnad = '';
  var returnmessage = "save"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO master_invoice_taxes(taxname, taxdescription, taxgroup, countryname, country_id, company, label_on_invoice, tax_compunation, amount, tax_type, tax_scope,include_in_price,subseq_taxes)VALUES ('${tax_name}','${tax_description}','${taxgroup_name}','${country}','${country_id}','${company_name}','${labeloninvoice}','${taxcompunation}','${amount}','${taxtype}','${taxscope}','${include_insome}','${subsequence}');`;

  }
  else {
    commnad = `update master_invoice_taxes set taxname='${tax_name}',taxdescription='${tax_description}', taxgroup='${taxgroup_name}', countryname='${country}', country_id='${country_id}', company='${company_name}', label_on_invoice='${labeloninvoice}', tax_compunation='${taxcompunation}', amount='${amount}', tax_type='${taxtype}', tax_scope='${taxscope}',include_in_price='${include_insome}',subseq_taxes='${subsequence}'  where id='${id}'`
    returnmessage = "update"
  }

  console.log(commnad, 'qq');
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

  var comapany_id = req.body?.companyname
  const command = `SELECT * FROM transaction_organization where guid='${comapany_id}'`;

  console.log(command);

  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});


router.post('/updta_status_invoice_tax', (req, res) => {


  var id = req.body.id;
  var status = req.body?.status;

  const command = `Update master_invoice_taxes set active='${status}' where id='${id}';`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})



router.post('/deletetax', (req, res) => {


  var id = req.body.id;

  const command = `delete from  master_invoice_taxes where id='${id}';`;

  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


})



router.post('/tax_get_search', (req, res) => {


  var tax_naem = req.body?.value;

  const command = `select *  from  master_invoice_taxes where taxname LIKE '%${tax_naem}%';`;

  console.log(command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


router.post('/currency_search_name', (req, res) => {


  var currecny = req.body?.value;

  const command = `select *  from  master_currency_exchange_rate where currency LIKE '%${currecny}%';`;

  console.log(command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})




router.post('/discounts_form', (req, res) => {


  var discount_name = req.body.discounts?.discount_name ?? ''
  var discount_description = req.body.discounts?.discount_description ?? ''
  var discount_computions = req.body.discounts?.discount_compation ?? ''
  var discount_scope = req.body.discounts?.discount_scope ?? ''
  var amount = req.body.discounts?.amount ?? ''
  var labeloninvoice = req.body.discounts?.label_on_invoice ?? ''
  var discount_type = req.body.discounts?.discount_type ?? ''
  var company_name = req.body.discounts?.company ?? ''
  var country = req.body.discounts?.country_name.Country ?? ''
  var country_id = req.body.discounts?.country_name?.id ?? ''
  var id = req.body.discounts?.id ?? ''
  var commnad = '';
  var returnmessage = "save"
  if (id == '' || id == null || id == undefined) {
    commnad = `INSERT INTO master_invoice_discount (discount_name, discount_description, discount_type, country_name, country_id, company, label_on_invoice, discount_compation, amount, discount_scope)VALUES('${discount_name}','${discount_description}','${discount_type}','${country}','${country_id}','${company_name}','${labeloninvoice}','${discount_computions}','${amount}','${discount_scope}');`;

  }
  else {

    commnad = `update master_invoice_discount set discount_name='${discount_name}',discount_description='${discount_description}',discount_type='${discount_type}',country_name='${country}',country_id='${country_id}',company='${company_name}',label_on_invoice='${labeloninvoice}',discount_compation='${discount_computions}',amount='${amount}',discount_scope='${discount_scope}'  where id='${id}';`


    returnmessage = "update"
  }

  console.log(commnad, 'qq');
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



router.post('/update_status_discount', (req, res) => {


  var id = req.body.id;
  var status = req.body?.status;

  const command = `Update master_invoice_discount set active='${status}' where id='${id}';`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})







router.post('/delete_discount', (req, res) => {


  var id = req.body?.id;

  const command = `delete from  master_invoice_discount where id='${id}';`;

  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


})



router.post('/categoryname', (req, res) => {

  var categeory_name = req.body.value.categeory_name ?? ''
  var description = req.body.value.description ?? ''

  var tax_name = req.body.value.taxnames?.taxname ?? ''

  var tax_id = req.body.value.taxnames?.id ?? ''


  var groupnam = req.body.value.selectedCategory ?? ''

  var hosptial=req.body?.hospitalId
var branchid=req.body?.branchId

  var id = req.body.value.id ?? ''
  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO master_invoice_categeory(categeory_name, taxnames, description,selectedCategory,tax_id,hosptial_id,branch_id) VALUES ('${categeory_name}', '${tax_name}','${description}','${groupnam}','${tax_id}','${hosptial}','${branchid}')`;

  }
  else {
    commnad = `update master_invoice_categeory set categeory_name='${categeory_name}' ,taxnames='${tax_name}',description='${description}',selectedCategory='${groupnam}',tax_id='${tax_id}' hosptial_id='${hosptial}',branch_id='${branchid}'  where id='${id}'`
    returnmessage = "U"
  }
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});




router.post('/getallcategory', (req, res) => {


  var hosptial=req.body?.hospitalId
  var branchid=req.body?.branchId
  const command = `SELECT * FROM master_invoice_categeory  where master_invoice_categeory.hosptial_id='${hosptial}'and master_invoice_categeory.branch_id='${branchid}' `;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});




router.post('/deletecategoryinvoice', (req, res) => {

  var idd = req.body.id

  const command = `delete from master_invoice_categeory where  id='${idd}'`;


  execCommand(command)

    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});






router.post('/activecategory_status', (req, res) => {


  var id = req.body.id;
  var status = req.body.status;

  const command = `Update master_invoice_categeory set active='${status}' where id='${id}';`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})

router.post('/country_code', (req, res) => {


  var countrycodes = req.body.countrycode;

  const command = `SELECT * FROM master_coutry_postalcode     where countrycode='${countrycodes}' group  by states_name;`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})







router.post('/supliername', (req, res) => {

  console.log(req.body, 'ssssssssss');
  const adress = req.body.adress
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
  if (id == '' || id == null || id == undefined) {
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
  } else {
    var command = '';

    let i = 0;
    const commands = `UPDATE master_invoice_suplier SET selectedoption='${select_option}', suplier_name='${supliernames}', company_name='${company_name}', adress_type='${adress_types}', 
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
              const adress_form = adress[i]?.formStatus
              const suplier_id_id = adress[i]?.suplier_id

              if (adress_form !== undefined) {
                // const command3 = `delete from master_suplier_multiple_contact_address where id='${adress[i].id}' `;
                // execCommand(command3)

                const command = `INSERT INTO master_suplier_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${id}','${country_code}','${postal_id}','${street1}','${street2}')`;

                execCommand(command)
              } if (suplier_id_id !== undefined) {

                const command2 = `delete from master_suplier_multiple_contact_address where id='${adress[i].id}' `;



                execCommand(command2)

                const command = `INSERT INTO master_suplier_multiple_contact_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,suplier_id,countrycode,postal_id,street,street2) VALUES ('${contactname}', '${countryname}','${statename}','${districts}','${postal}','${email}','${phone}','${mobile}','${adress[i].suplier_id}','${country_code}','${postal_id}','${street1}','${street2}')`;
                // const command = `UPDATE master_suplier_multiple_contact_address SET contactname='${contactname}', Country='${countryname}',states_name='${statename}',District='${districts}',postal_Code='${postal}',email='${email}',phone='${phone}',mobile='${mobile}',suplier_id='${id_suplier_id}',countrycode='${country_code}',postal_id='${postal_id}',street='${street1}',street2='${street2}' WHERE id='${multiple_id_contact}';`;
                console.log(command);
                execCommand(command)
                  .then(() => {


                    i++;
                    loop()
                  }).then(result => res.json('U'))

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






router.post('/activestatus_suplier', (req, res) => {


  var id = req.body.id;
  var status = req.body.status;

  const command = `Update master_invoice_suplier set active='${status}' where id='${id}';`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})




router.post('/deletesuplier', (req, res) => {

  var idd = req.body.id

  const command = `delete from master_invoice_suplier where  id='${idd}'`;


  execCommand(command)

    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});



router.post('/getall_suplier_multiple_contact', (req, res) => {
  id = req.body.id

  const command = `select *  from  master_suplier_multiple_contact_address  where suplier_id='${id}';`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});

// router.post('/payments_terms', (req, res) => {
//   console.log(req.body);



//     const products = req.body?.products ?? ''
//     const form = req.body?.form_value ?? ''

//     const name = form?.name ?? ''
//     const early_discount = form?.early_discount ?? ''
//     const paid_day = form?.paid_day ?? ''

//     const early_percent = form?.early_percent ?? ''
//     const reduce_tax = form?.reducetax ?? ''
//     var id = form?.form_value?.id ?? ''
//     var returnmessage = "S"
//     if (id == '' || id == null || id == undefined) {
//       var command = '';

//       let i = 0;
//       const commands = `INSERT INTO master_invoice_payments_terms (name, early_discount, early_percent, paid_day, reducetax) VALUES('${name}', '${early_discount}','${paid_day}','${early_percent}','${reduce_tax}');`
//       execCommand(commands)

//         .then(result => {

//           console.log(command);
//           if (result) {
//             let i = 0;
//             (function loop() {
//               if (i < products.length) {
//                 const command = `INSERT INTO  due_terms( Due, Due_type, After, after_type, payments_terms_id) values('${products[i]?.Due}','${products[i]?.Due_type}','${products[i]?.After}','${products[i]?.after_type}', '${result?.insertId}');`
//                 console.log(command);
//                 execCommand(command)
//                   .then(() => {
//                     i++;
//                     loop()
//                   })
//                   .catch(err => logWriter(command, err));
//               }
//               else {
//                 res.json('success')
//               }
//             }())
//           }
//         })
//     } else {
//       var command = '';

//       let i = 0;
//       const commands = `Update  master_invoice_payments_terms  set name='${name}' , early_discount='${early_discount}' , early_percent='${early_percent}' , paid_day='${paid_day}' , reducetax='${reduce_tax}' where id='${id}';`
//       execCommand(commands)

//         .then(result => {

//           console.log(command);
//           if (result) {
//             let i = 0;
//             (function loop() {
//               if (i < products.length) {
//                 const command = `update due_terms set  Due='${products[i]?.Due}', Due_type='${products[i]?.Due_type}', After='${products[i]?.After}', after_type='${products[i]?.after_type}', payments_terms_id='${products[i]?.payments_terms_id}'  where id='${products[i]?.id}';`
//                 console.log(command);
//                 execCommand(command)
//                   .then(() => {
//                     i++;
//                     loop()
//                   })
//                   .catch(err => logWriter(command, err));
//               }
//               else {
//                 res.json('success')
//               }
//             }())
//           }
//         })

//     }

//   });



router.post('/payments_terms', async (req, res) => {
  console.log(req.body);
  try {
    const products = req.body?.products ?? '';
    const form = req.body?.form_value ?? '';
    const name = form?.name ?? '';
    const early_discount = form?.early_discount ?? '';
    const paid_day = form?.paid_day ?? '';
    const early_percent = form?.early_percent ?? '';
    const reduce_tax = form?.reducetax ?? '';
    let id = form?.id ?? '';

    if (id) {
      // Update existing record in master_invoice_payments_terms
      const updatePaymentsTerms = `
        UPDATE master_invoice_payments_terms
        SET name = '${name}', early_discount = '${early_discount}', 
            paid_day = '${paid_day}', early_percent = '${early_percent}', 
            reducetax = '${reduce_tax}'
        WHERE id = '${id}';
      `;
      await execCommand(updatePaymentsTerms);

      // Delete existing records from due_terms for the given payments_terms_id
      const deleteDueTerms = `
        DELETE FROM due_terms
        WHERE payments_terms_id = '${id}';
      `;
      await execCommand(deleteDueTerms);
    } else {
      // Insert into master_invoice_payments_terms
      const insertPaymentsTerms = `
        INSERT INTO master_invoice_payments_terms (name, early_discount, early_percent, paid_day, reducetax) 
        VALUES ('${name}', '${early_discount}', '${paid_day}', '${early_percent}', '${reduce_tax}');
      `;
      const result = await execCommand(insertPaymentsTerms);
      // console.log(result);
      id = result.insertId;
    }

    // Insert new records into due_terms
    for (const product of products) {
      const insertDueTerms = `
        INSERT INTO due_terms (Due, Due_type, After, after_type, payments_terms_id) 
        VALUES ('${product?.Due}', '${product?.Due_type}', '${product?.After}', '${product?.After_type}', '${id}');
      `;
      console.log('insertDueTerms', insertDueTerms);
      await execCommand(insertDueTerms);
    }

    res.json('success');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/paymentsterms_all', (req, res) => {

  const command = `select *  from  master_invoice_payments_terms;`;


  execCommand(command)

    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
});





router.post('/due_terms_id', (req, res) => {

  var id = req.body.id;

  const command = `select * from due_terms where payments_terms_id='${id}'`;

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})








router.post('/delete_payments', (req, res) => {
  var id = req.body?.id;
  const command = `delete from  master_invoice_payments_terms where id='${id}';`;
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
})



router.post('/hl_servicesearch_all', (req, res) => {


  var name = req.body?.name;

  const command = `select * from masterhealthcareservices_invoice_billing  where servicename_name LIKE '%${name}%'`;


  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})



router.get('/categeory_all_all', (req, res) => {



  // const command =`SELECT * FROM master_invoice_categeory order  by categeory_name`;
  const command = `SELECT * FROM bill_group order  by BillGroup_HeaderName`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})


router.post('/discountall_all', (req, res) => {

  const dis_name = req.body?.name


  const command = `SELECT * FROM master_invoice_discount  where discount_name LIKE '%${dis_name}%'`;


  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})






router.post('/taxall_search', (req, res) => {

  const dis_name = req.body?.name


  const command = `SELECT * FROM master_invoice_taxes  where taxname LIKE '%${dis_name}%'`;


  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})







router.get('/exchange_currency_currency', (req, res) => {



  const command = `SELECT * FROM master_currency_exchange_rate`;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})





router.post('/procedurecode_save', (req, res) => {
  console.log(req.body, 'sssub');

  const lab_image_status = req.body.value?.staus;
  const servicename_id = req.body.value?.service_name?.id ?? '';
  const service_name = req.body.value?.service_name?.servicename_name ?? '';
  const bilcocde = req.body.value?.billingcode ?? '';
  const description = req.body.value?.description ?? '';
  const saccode = req.body.value?.saccode ?? '';
  const charge = parseFloat(req.body.value?.charge).toFixed(2) ?? '';
  const discount_id = req.body.value?.discount?.id ?? '';
  const discount_name = req.body.value?.discount?.discount_name ?? '';
  const discount_amout = req.body.value?.discount?.amount ?? '';

  const tax_id = req.body.value?.tax?.id ?? '';
  const tax_name = req.body.value?.tax?.taxname ?? '';
  const taxamount = req.body.value?.tax?.amount ?? '';

  const addtional_detail = req.body.value?.addtionaldetail ?? '';

  const categeory_name = req.body.value?.categeory_name ?? '';

  var hosptial_id=req.body.hospitalId
  var bracnch_id=req.body.branchId


  const id = req.body.value?.id ?? '';

  var commnad = '';
  var returnmessage = "S";

  if (!id) {
    commnad = `INSERT INTO master_invoice_procedure_code(lab_image_status, service_name, billingcode, descriptions, categeory_name, saccode, charge, discount, tax, addtionaldetail, servicename_id, discount_id, tax_id, discount_amout, tax_amount,hosptial_id,branch_id) VALUES ('${lab_image_status}', '${service_name}','${bilcocde}','${description}','${categeory_name}','${saccode}','${charge}','${discount_name}','${tax_name}','${addtional_detail}','${servicename_id}','${discount_id}','${tax_id}','${discount_amout}','${taxamount}','${hosptial_id}','${bracnch_id}')`;
  } else {
    commnad = `UPDATE master_invoice_procedure_code SET lab_image_status='${lab_image_status}', service_name='${service_name}',billingcode='${bilcocde}',descriptions='${description}',categeory_name='${categeory_name}',saccode='${saccode}',charge='${charge}', hosptial_id='${hosptial_id}' , branch_id='${hosptial_id}',discount='${discount_name}',tax='${tax_name}',addtionaldetail='${addtional_detail}',servicename_id='${servicename_id}',discount_id='${discount_id}',tax_id='${tax_id}',discount_amout='${discount_amout}',tax_amount='${taxamount}' WHERE id='${id}'`;
    returnmessage = "U";
  }

  console.log(commnad);
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});









router.post('/getallprocedure_code', (req, res) => {

var hosptial_id=req.body.hospitalId
var branchid=req.body.branchId


  const command = `select * ,(select BillGroup_HeaderName from bill_group where bill_group.BillGroup_Header_id=master_invoice_procedure_code.categeory_name )
   as categeory FROM master_invoice_procedure_code  where master_invoice_procedure_code.hosptial_id='${hosptial_id}' and  master_invoice_procedure_code.branch_id='${branchid}' `;


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})



router.post('/active_service_procedure_code', (req, res) => {
  console.log(req.body);

  var id = req.body.id;
  var status = req.body.status;

  const command = `Update master_invoice_procedure_code set active='${status}' where id='${id}'`;

  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})




router.post('/patient_name', (req, res) => {
  var name = req.body.name

  const command = `SELECT mp.*,CONCAT(mp.firstName, ' ', '',mp.middleName,mp.lastName, ' [',mp.id, ']') AS fullname , DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), mp.dateOfBirth)), '%Y') + 0 AS age_age,g.gender AS sex,allcountry.Country as countryname,pc.addressLine1 AS address, pc.addressLine2 AS address2,pc.city AS city,pc.state AS state,pc.country AS country_code,pc.postalCode AS postalcode FROM master_patient AS mp LEFT JOIN gender AS g ON mp.sex = g.conceptId LEFT JOIN  patientcontact AS pc ON mp.guid = pc.patient_id LEFT JOIN master_country_code1 as allcountry  on pc.country=allcountry.countrycode WHERE mp.completeName LIKE '${name}%' or mp.id='${name}%';`
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});





router.get('/encounterdatatiem', (req, res) => {

  // const branchId = req.body.name.branchId
  // const patientId = req.body.name.guid
  // const hospitalId = req.body.name.hospitalId

  const command = `SELECT * from transaction_encounter`

  // const command = `SELECT transaction_encounter.*,CONCAT(transactionTime, ' Dr ', Provider) AS EncounterName,master_visit_type.visit_type AS visitTypeName,master_refering_provider.name AS ReferringproviderName,master_chepron.name AS chepronName,master_translators.name AS TranslatorName,description_snapshot.term AS problemList FROM transaction_encounter LEFT JOIN master_visit_type ON master_visit_type.id = transaction_encounter.VisitType LEFT JOIN master_refering_provider ON master_refering_provider.id = transaction_encounter.Referringprovider LEFT JOIN master_chepron ON master_chepron.id = transaction_encounter.Chaperone LEFT JOIN master_translators ON master_translators.id = transaction_encounter.Translator LEFT JOIN description_snapshot ON description_snapshot.id = transaction_encounter.Reasonforvisit WHERE transaction_encounter.patientId = '${patientId}' AND transaction_encounter.branchId = '${branchId}' AND transaction_encounter.hospitalId = '${hospitalId}' order by id desc;`;
  console.log(command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})






router.post('/searchprocedure_all', (req, res) => {
  var name = req.body.name

  const command = `SELECT  master_invoice_procedure_code.*,CONCAT(master_invoice_procedure_code.service_name, ' [', master_invoice_procedure_code.billingcode, ']') AS servicename FROM master_invoice_procedure_code WHERE billingcode LIKE '${name}%' OR service_name LIKE '${name}%';`



  console.log(command);

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});




router.post('/sequence_oftaxes', (req, res) => {

  var data = req.body.displayData
  var i = 0;
  let multiQuery = '';

  (function loop() {
    if (i < data.length) {
      multiQuery += `Update master_invoice_taxes set sequence='${(i + 1)}' where id='${data[i].id}';`;
      i++;
      loop();
    }
    else {
      execCommand(multiQuery.replace(/null/g, ''))
        .then(result => res.json('success'))
        .catch(err => logWriter(multiQuery, err));
    }
  }());


})

router.post('/multipleTaxselect', (req, res) => {
  var name = req.body.name

  const command = `SELECT * FROM master_invoice_taxes WHERE taxname LIKE '${name}%' OR taxdescription LIKE '${name}%';`


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});


router.post('/taxprsingleget', (req, res) => {
  var id = req.body.id

  const command = `SELECT * FROM master_invoice_taxes WHERE id='${id}';`


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});







router.post('/alldiscount_value', (req, res) => {
  var name = req.body?.name

  const command = `SELECT * FROM master_invoice_discount WHERE discount_name LIKE '${name}%' OR discount_description LIKE '${name}%';`


  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});


router.post('/allpayments_termsall', (req, res) => {
  var name = req.body?.name

  const command = `SELECT * FROM master_invoice_payments_terms WHERE name LIKE '%${name}%';`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});








router.post('/allterms_all', (req, res) => {

  console.log(req.body, 'sssub');

  const name = req.body.name?.termsname
  const link = req.body.name?.termslink
  const id = req.body.value?.id;

  var commnad = '';
  var returnmessage = "S"
  if (id == '' || id == null || id == undefined) {


    commnad = `INSERT INTO master_invoice_setting(termsname, termslink) VALUES ('${name}', '${link}')`;

  }
  else {
    commnad = `update master_invoice_setting set termsname='${name}', termslink='${link}' where id='${id}'`
    returnmessage = "U"
  }

  console.log(commnad);
  execCommand(commnad)
    .then(result => res.json(returnmessage))
    .catch(err => logWriter(commnad, err));
});








router.get('/allpayments_termsall', (req, res) => {

  const command = `SELECT * FROM master_invoice_setting ;`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});

function formatDate(dateToBeFormatted) {
  if (dateToBeFormatted != null && dateToBeFormatted != undefined && dateToBeFormatted != '') {

    var date = new Date(dateToBeFormatted.toLocaleString('en-US'));
    date = new Date(date);
    // ("0" + (this.getMonth() + 1)).slice(-2)
    var dateReturn = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`
    console.log(dateReturn);
    return dateReturn
  }
  else {
    return ''
  }
}


router.post('/allinvoicesaves', (req, res) => {

  console.log(req.body, 'invoice');
  const patient_id = req.body.value?.patientname.id;
  const patientname = req.body.value?.patientname.fullname;
  const patient_age = req.body.value?.patientname.age;
  var convertedDate = new Date(req.body.value?.invoice_date);
  let isoDate = convertedDate;
  var d = new Date(isoDate);
  let time = d.toLocaleTimeString('en-GB');
  let timeWithoutSeconds = time?.slice(0, 5);
  let dateFor = d.toLocaleDateString('en-GB');
  let databaseDate = `${dateFor.split('/')[0]}-${dateFor.split('/')[1]}-${dateFor.split('/')[2]}`
  const encounter_id = req.body.value?.encounter_date;
  const provider_id = req.body.value?.providernaem;
  var convertedDate1 = new Date(req.body.value?.duedate);
  let isoDate1 = convertedDate1;
  var d1 = new Date(isoDate1);
  let time1 = d1.toLocaleTimeString('en-GB');
  let timeWithoutSeconds1 = time1.slice(0, 5);
  let dateFor1 = d1.toLocaleDateString('en-GB');
  let databaseDate1 = `${dateFor1.split('/')[0]}-${dateFor1.split('/')[1]}-${dateFor1.split('/')[2]}`
  const payments_terms = req.body.value?.payments_terms;

  const finalamount = parseFloat(req.body.value?.finalamount);
  const dueamounts = req.body.value?.dueamount;
  var AOE = req.body.multiplevalue_product.AoELab

  const invoicestatus = req.body.value?.invoice_status
  const payment_status = req.body.value?.paymentstatus
  const sumarytotlamount = req.body.value?.sumarytotlaamount
  const invoice_details = req.body.value?.details

  const invoicenumber = req.body.value?.invoicenumber
  const id = req.body.value?.id;



  if (id == '' || id == null || id == undefined) {
    const command = `INSERT INTO master_invoiceall(patient_id, patientname,patientage,invoicedate,encounter_id, provider_id, duedate, paymenterms_id,invoice_status,sumarytotal_amount,totalamount,dueamount,paymentstatus) VALUES ('${patient_id}', '${patientname}','${patient_age}','${databaseDate} ${timeWithoutSeconds}','${encounter_id}','${provider_id}','${databaseDate1} ${timeWithoutSeconds1}','${payments_terms}','${invoicestatus}','${sumarytotlamount}','${finalamount}','${dueamounts}','${payment_status}')`
    execCommand(command)
      .then(result => {
        if (result) {
          const invoicenumberformat = `update master_invoiceall set  invoicenumber='INV/2023/${result.insertId}' where id='${result.insertId}'`;
          execCommand(invoicenumberformat)
          var i = 0;
          (function loop() {
            if (i < AOE?.length) {

              var multiselecttax = AOE[i].taxpercent

              var idArray = [];
              var taxnameArray = [];
              var idValues_ddd = ''
              var taxnameValues = ''
              if (multiselecttax.length > 0) {
                for (let index = 0; index < multiselecttax.length; index++) {
                  const element = multiselecttax[index];
                  idArray.push(element.id);
                  taxnameArray.push(element.taxname);
                }
              }
              idValues_ddd = idArray.join(",");
              taxnameValues = taxnameArray.join(",");
              var command2 = `Insert into master_multiple_procedure_charge (invoiceall_id,invoiceNo, productCode,productName, qty,  salesPrice, discount, total, total_tax_include,description,tax_id,taxpercent)  values('${result.insertId}','INV/2023/${result.insertId}','${AOE[i].productCode.id}','${AOE[i].productCode.servicename}','${AOE[i].qty}','${AOE[i].salesPrice}','${AOE[i].discount.discount_name}','${AOE[i].total}','${AOE[i].total_tax_include}','${AOE[i].description}','${idValues_ddd}','${taxnameValues}')`;
              console.log(command2);
              execCommand(command2)
                .then(() => {
                  i++;
                  loop();
                })
                .catch((err) => logWriter(command2, err));
            }
            else {
              res.json("success");
            }


          })()
        }
      })
      .catch(err => logWriter(command, err));
  }
  else {
    const command = `Update master_invoiceall set patient_id='${patient_id}', invoicenumber='${invoicenumber}', patientname='${patientname}',patientage='${patient_age}',invoicedate='${databaseDate} ${timeWithoutSeconds}',encounter_id='${encounter_id}', provider_id='${provider_id}', duedate='${databaseDate1} ${timeWithoutSeconds1}', paymenterms_id='${payments_terms}',invoice_status='${invoicestatus}',sumarytotal_amount='${sumarytotlamount}',totalamount='${finalamount}',dueamount='${dueamounts}',paymentstatus='${payment_status}'  where id='${id}'`
    execCommand(command)
      .then(result => {
        const deltecommand = `delete from master_multiple_procedure_charge where invoiceall_id='${id}'`
        console.log(deltecommand);
        execCommand(deltecommand)
          .then(result => {
            if (result) {
              var i = 0;
              (function loop() {
                if (i < AOE.length) {


                  var multiselecttax = AOE[i].taxpercent

                  var idArray = [];
                  var taxnameArray = [];
                  var idValues_ddd = ''
                  var taxnameValues = ''
                  if (multiselecttax.length > 0) {
                    for (let index = 0; index < multiselecttax.length; index++) {
                      const element = multiselecttax[index];
                      idArray.push(element.id);
                      taxnameArray.push(element.taxname);
                    }
                  }
                  idValues_ddd = idArray.join(",");
                  taxnameValues = taxnameArray.join(",");


                  var command2 = `Insert into master_multiple_procedure_charge (invoiceall_id,invoiceNo, productCode,productName, qty,  salesPrice, discount, total, total_tax_include,description,tax_id,taxpercent)  values('${id}','${invoicenumber}','${AOE[i].productCode.id}','${AOE[i].productCode.servicename}','${AOE[i].qty}','${AOE[i].salesPrice}','${AOE[i].discount.discount_name}','${AOE[i].total}','${AOE[i].total_tax_include}','${AOE[i].description}','${idValues_ddd}','${taxnameValues}')`;
                  console.log(command2);
                  execCommand(command2)
                    .then(() => {
                      i++;
                      loop();
                    })
                    .catch((err) => logWriter(command2, err));
                } else {
                  res.json("update");
                }
              })()
            }
          })
          .catch(err => logWriter(deltecommand, err));
      })
      .catch(err => logWriter(command, err));
  }
});




router.get('/invoice_data_get', (req, res) => {

  const command = ` SELECT * from master_invoiceall ORDER BY invoicenumber DESC`



  // const command = ` SELECT *,mastermultiple_invoicetotal.applied_amount,mastermultiple_invoicetotal.dueamount FROM master_invoiceall LEFT JOIN mastermultiple_invoicetotal ON master_invoiceall.patient_id = mastermultiple_invoicetotal.patientid`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});

router.post('/insurance_name', (req, res) => {
  var name = req.body?.name

  const command = `SELECT patient_insurance.planName as fullname,patient_insurance.guid,patient_insurance.policyNumber  FROM patient_insurance WHERE planName LIKE '%${name}%';`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});


router.post('/invoiceAccordin', (req, res) => {
  var name = req.body?.id


  const command = `select * from master_invoiceall   where patient_id='${name}'  order by invoicenumber ;`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});
router.post('/multipleproduct_code', (req, res) => {
  var name = req.body?.invoicenum

  var multiQuery = ''
  let i = 0;
  (function loop() {
    if (i < name.length) {
      multiQuery += `select * from master_invoice_multiple_details where patient_id='${name[i].id}' order by invoice_id;`
      i++;
      loop();
    }
    else {
      execCommand(multiQuery.replace(/null/g, ''))
        .then(result => {
          if (name.length == 1) {
            var temp = []
            temp.push(result)
            res.json(temp)
          }
          else {
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








router.post('/totlainvoicepaymetall', (req, res) => {



  const patientvalue = req.body?.ppatientform
  const invoice = req.body?.invoiceform
  const code = req.body?.multiplecode
  const patientformtype = patientvalue?.paymentform_type
  const patientname_id = patientvalue?.patientname.id
  const patientname = patientvalue?.patientname.completeName
  const amount = patientvalue?.paymentamount
  const paymentmethod = patientvalue?.paymentmethod
  const patientagainst = patientvalue?.paymentagainst
  const recipt = patientvalue?.recipt
  const paymentdate = patientvalue?.paymentdate
  const refrence1 = patientvalue?.refrence1
  const refrence2 = patientvalue?.refrence2
  const description = patientvalue?.description
  const upappliedamount = patientvalue?.upappliedamount
  const invoicepayment_status = patientvalue?.invoicepayment_status

  const totapplayamount1 = amount - upappliedamount
  const id = req.body.ppatientform?.id;


  if (id == '' || id == null || id == undefined) {
    var command = '';

    const commands = `insert into masterpayment_total_invoice  (paymentform_type, patient_id, patientname, paymentamount, paymentmethod, paymentagainst, recipt, paymentdate, refrence1, refrence2, description, upappliedamount, invoicepayment_status,totapplayamount)values('${patientformtype}','${patientname_id}','${patientname}','${amount}','${paymentmethod}','${patientagainst}','${recipt}','${paymentdate}','${refrence1}','${refrence2}','${description}','${upappliedamount}','${invoicepayment_status}','${totapplayamount1}');`
    execCommand(commands)
      .then(result => {

        if (result) {
          let i = 0;
          const invoices = Object.keys(invoice);

          (function loop() {
            if (i < invoices.length) {
              const invoicenumber = invoices[i];
              const totlchargeitem = invoice[invoices[i]][0]?.totlchargeitem;
              const appliedamount = invoice[invoices[i]][0]?.appliedPayment;
              const aRJUSTUMENTTOTLA = invoice[invoices[i]][0]?.aRJUSTUMENTTOTLA;
              const writeoftoal = invoice[invoices[i]][0]?.writeoftoal;
              const totalamountfinal = invoice[invoices[i]][0]?.totalbalanceInvoice_summary;
              const command = `INSERT INTO mastermultiple_invoicetotal (patientid,invoicenumber,pantientname,totalchargeitem,applied_amount,aRJUSTUMENTTOTLA,writeoftotal,dueamount) values('${patientname_id}', '${invoicenumber}', '${patientname}','${totlchargeitem}','${appliedamount}','${aRJUSTUMENTTOTLA}','${writeoftoal}','${totalamountfinal}');`
              execCommand(command)
                .then(() => {
                  i++;
                  loop()
                })
                .catch(err => logWriter(command, err));
            }

            const proc_code = Object.keys(code);
            if (i < proc_code.length) {
              const totlchargeitem = code[proc_code[i]];
              for (let index = 0; index < totlchargeitem.length; index++) {
                const procedurecode = totlchargeitem[index];

                for (let j = 0; j < procedurecode.length; j++) {
                  console.log(procedurecode);

                  const invoicenumber = proc_code[i];
                  const code_item = procedurecode[j]?.item
                  const charegeitem = procedurecode[j]?.charge
                  const applypament = procedurecode[j]?.appliedpayment
                  const arjustumentreason = procedurecode[j]?.argustment_reason
                  const writoff = procedurecode[j]?.writoff
                  const writeoffreason = procedurecode[j]?.writoff_reason
                  const ptreasponblity1 = procedurecode[j]?.ptresponsblity1
                  const ptreasponblityreaon1 = procedurecode[j]?.ptresponsblityreason1
                  const ptreasponblity2 = procedurecode[j]?.ptresponsblity2
                  const ptreasponblityreaon2 = procedurecode[j]?.ptresponsblityreason2
                  const ptreasponblity3 = procedurecode[j]?.ptresponsblity3
                  const ptreasponblityreaon3 = procedurecode[j]?.ptresponsblityreason3
                  const balance = procedurecode[j]?.balance
                  const deney = procedurecode[j]?.deney
                  const followup = procedurecode[j]?.followup
                  const followupreason = procedurecode[j]?.followupreason

                  const command4 = `insert into masterinvoice_multiplecodecharge  (invoicenumber,item, charge, appliedamount, arjustument, writeoff, writeoffreason, ptresponblity1, ptresponblity2, ptresponblity3, ptresponsblityreason1, ptresponsblityreason2, ptresponsblityreason3, balance, denied, follow, followreason)values('${invoicenumber}', '${code_item}','${charegeitem}','${applypament}','${arjustumentreason}','${writoff}','${writeoffreason}','${ptreasponblity1}','${ptreasponblity2}','${ptreasponblity3}','${ptreasponblityreaon1}','${ptreasponblityreaon2}','${ptreasponblityreaon3}','${balance}','${deney}','${followup}', '${followupreason}');`
                  execCommand(command4)

                }
              }
              i++;
            }
            else {
              res.json('success')
            }
          }())

        }
      })
  }

});






router.get('/invoicepaymentdata', (req, res) => {


  const command = `select * from masterpayment_total_invoice;`

  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


});






router.post('/deleteprocedurecode_code', (req, res) => {


  const id = req.body?.id;

  const command = `delete from  master_invoice_procedure_code where id='${id}';`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


})


router.get('/providername_all', (req, res) => {



  const command = `SELECT *, CONCAT(providertitle,'',firstname, ' ', Lastname) AS providename FROM provider_personal_identifiers;`;
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})










router.post('/getallarjustument_amount', (req, res) => {


  const invnumber = req.body?.invnumber;

  const command = `select * from  master_invoice_payment_single where invoicenumber='${invnumber}';`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})

router.post('/multipleprocedurcode_multiple', (req, res) => {


  const id = req.body?.id;

  const command = `select *  from master_multiple_procedure_charge  where invoiceall_id='${id}';`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));


})










router.post('/invoicesingle_payment', (req, res) => {


  const paymentamount = parseFloat(req.body.paymentform?.paymentamount).toFixed(2);
  const payment_status = req.body.paymentform?.payment_type;
  const description = req.body.paymentform?.description;
  const reference = req.body.paymentform?.reference;
  const otherreference = req.body.paymentform?.otherreferences;
  var convertedDate = new Date(req.body.paymentform?.paymentdate);
  let isoDate = convertedDate;
  var d = new Date(isoDate);
  let time = d.toLocaleTimeString('en-GB');
  let timeWithoutSeconds = time?.slice(0, 5);
  let dateFor = d.toLocaleDateString('en-GB');
  let databaseDate = `${dateFor.split('/')[0]}-${dateFor.split('/')[1]}-${dateFor.split('/')[2]}`
  const patient_id = req.body.paymentid_value?.patient_id;
  const writeamount = parseFloat(req.body.paymentform?.writof_amount);
  const writereason = req.body.paymentform?.writof_reason;
  const invoicenumber = req.body.paymentid_value?.invoicenumber;
  const paymentagainst = req.body.paymentform?.paymentagainst;
  var invoice_id = req.body.paymentform?.invoice_id;



  const totalamount = req.body.paymentform?.totalpaymentapply

  const duefinelamount = req.body.paymentform?.dueamount


  const apymentapllay = req.body.paymentform?.payment_applay
  const unused = req.body.paymentform?.unusedpayment


  const id = req.body.paymentform?.id;


  if (id == '' || id == null || id == undefined) {


    const insertCommand = `INSERT INTO master_invoice_payment_single(patient_id,paymentamount, payment_type, writof_amount, writof_reason,paymentdate, reference, description, otherreferences, paymentagainst, invoicenumber,paymentapply,invoice_id,payment_applay,paymentform)VALUES('${patient_id}','${paymentamount}', '${payment_status}', '${writeamount}', '${writereason}', '${databaseDate} ${timeWithoutSeconds}', '${reference}', '${description}', '${otherreference}', '${paymentagainst}','${invoicenumber}','${paymentamount}','${invoice_id}','${paymentamount}','Patient')`;
    execCommand(insertCommand)
      .then(result => {
        if (result) {
          var recipt = `UPDATE  master_invoice_payment_single  SET  reciptnumber='REC/${result.insertId}'   where id='${result.insertId}'`

          execCommand(recipt)

          var updateCommand = ''
          if (duefinelamount <= 0) {

            updateCommand = `UPDATE master_invoiceall SET dueamount = '${duefinelamount}', totalpaymentapply = '${totalamount}' ,paymentstatus='Paid', invoice_status='Approved',   payment_id='${result.insertId}'    WHERE id = '${invoice_id}'`;
          } else {

            updateCommand = `UPDATE master_invoiceall SET dueamount = '${duefinelamount}', totalpaymentapply ='${totalamount}',paymentstatus='Partially Paid',invoice_status='Approved',    payment_id='${result.insertId}' WHERE id = '${invoice_id}'`;


            console.log(updateCommand);
          }
          execCommand(updateCommand).then(result => res.json(result))
            .catch(err => logWriter(updateCommand, err))
        }
      })
      .catch(err => logWriter(insertCommand, err));

  } else {
    const updatepayment = `UPDATE  master_invoice_payment_single  SET payment_applay='${apymentapllay}',  unusedpayment='${unused}'  where id='${id}'`

    console.log(updatepayment);
    execCommand(updatepayment)
      .then(result => {

        if (result) {
          var updateCommand = ''
          if (duefinelamount <= 0) {

            updateCommand = `UPDATE master_invoiceall SET dueamount = '${duefinelamount}', totalpaymentapply = '${totalamount}' WHERE id = '${invoice_id}'`;
          } else {

            updateCommand = `UPDATE master_invoiceall SET dueamount = '${duefinelamount}', totalpaymentapply ='${totalamount}',  paymentstatus='Partially Paid',invoice_status='Approved'  WHERE id = '${invoice_id}'`;
            console.log(updateCommand);
          }
          execCommand(updateCommand)
            .then(result => res.json('updated'))
            .catch(err => logWriter(command, err));

        }
      })
      .catch(err => logWriter(updatepayment, err));
  }


})


router.post('/deleteinvoicesingle', (req, res) => {


  const id = req.body?.id;

  const command = `delete   from master_invoiceall  where id='${id}';  delete from master_multiple_procedure_charge where invoiceall_id='${id}';`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));


})

router.post('/Invoicedatasingle', (req, res) => {


  const id = req.body?.id;

  const command = `select *  from master_invoiceall  where id='${id}';`;
  console.log(command);
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})

router.post('/delete_currencyapi', (req, res) => {
  console.log('delete_currencyapi', req.body);
  const id = req.body?.id;
  const command = `Delete FROM master_currency_exchange_rate  where id='${id}';`
  console.log(command);
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
})

router.post('/activelabserviceAPI', (req, res) => {


  var id = req.body.id;
  var status = req.body.status;

  const command = `Update master_labservice_tags_name set active='${status}' where id ='${id}';`;
console.log(command);
  execCommand(command)
    .then(result => res.json('success'))
    .catch(err => logWriter(command, err));


})




module.exports = router;