const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');


router.get('/get_all_locations', (req, res) => {
    const command = `SELECT * FROM master_warehouse;`
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.get('/get_all_product', (req, res) => {
    const command = `SELECT * FROM master_products;`
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.get('/get_all_category', (req, res) => {
    const command = `SELECT * FROM master_invoice_categeory where active = 1; `
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


router.post('/get_allsub_locations', (req, res) => {
    console.log('get_allsub_locations', req.body);
    var id = req.body.id;

    const command = ` SELECT mwl.id, mwl.location_name, mwl.parent_location, mwl.location_type, mwl.scrap_location, mwl.returnlocation, mwl.barcode, mwl.replanish, mwl.inventory_frequency_days, mwl.last_effective_inventory, mwl.next_expected_inventory, mwl.removal_strategy, mwl.external_note, mwl.warehouse_id, mw.id as master_warehouse_id, mw.Warehouse_name, mw.Short_name, mw.address, mw.made_on,concat(mw.Warehouse_name,'/',mwl.location_name) as full_location_name 
    FROM  master_warehouse_location mwl 
    LEFT JOIN  master_warehouse mw ON mw.id = mwl.warehouse_id where mwl.warehouse_id = '${id}'; `
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})


router.get('/get_all_company', (req, res) => {

    const command = `SELECT * FROM transaction_organization; `
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/insertputawayruleapi', (req, res) => {
    console.log('insertputawayruleapi', req.body);

    // Extracting values from the request body
    var arrival_loc = req.body.value.arrival_loc?.id;
    var product = req.body.value.product?.id;
    var product_category = req.body.value.product_category?.id;
    var sub_location = req.body.value.sub_location?.id;
    var company = req.body.value.company?.id;
    var id = req.body.value?.id;
    let command;
    let responseMessage;
    if (id) {
        command = `UPDATE master_putawayrules SET arrival_loc='${arrival_loc}', product='${product}',product_category='${product_category}', sub_location='${sub_location}',company='${company}' WHERE id='${id}';`;
        responseMessage = 'U';
    } else {
        command = `INSERT INTO master_putawayrules (arrival_loc, product, product_category, sub_location, company) VALUES ('${arrival_loc}', '${product}', '${product_category}', '${sub_location}', '${company}');`;
        responseMessage = 'S';
    }

    execCommand(command)
        .then(result => res.json(responseMessage))
        .catch(err => logWriter(command, err));
});


router.get('/getall_putawayapi', (req, res) => {

    const command = `SELECT M.id, M.arrival_loc, M.product, M.product_category, M.sub_location, M.company, MW.id as master_warehouse_id, MW.Warehouse_name, MW.Short_name, MW.address, MW.made_on, MP.id as produt_id, MP.product_code, MP.productName, MP.saleOk, MP.purchaseOk, MP.rentOk, MP.productCategory, MP.salePrice, MP.salePricetax, MP.costPrice, MP.costPricetax, MP.internalReference, MP.barcode, MP.productTemplateTags, MP.internalNotes, MP.routes, MP.weight, MP.volume, MP.uniqueSerialNumber, MP.byLots, MP.noTracking, MP.alertBeforeExpirationDays, MP.descriptionForReceipts, MP.descriptionForDeliveryOrders, MP.descriptionForInternalTransfers, MIC.id as category_id, MIC.categeory_name, MIC.description, MIC.taxnames, MIC.selectedCategory, MIC.tax_id, MIC.active, MWL.id as location_id, MWL.location_name, MWL.parent_location, MWL.location_type, MWL.scrap_location, MWL.returnlocation, MWL.barcode, MWL.replanish, MWL.inventory_frequency_days, MWL.last_effective_inventory, MWL.next_expected_inventory, MWL.removal_strategy, MWL.external_note, MWL.warehouse_id, MO.id as compay_id, MO.guid, MO.organization_name, MO.addressLine1, MO.addressLine2, MO.GST_no, MO.Tin_No, MO.Cin_No, MO.Latitude, MO.Longitude, MO.time_zone, MO.Country, MO.states_name, MO.district_name, MO.City, MO.Land_Mark, MO.Postal_Code, MO.Work_Phone, MO.Work_Mobile, MO.Work_Email_Id, MO.Organization_Description, MO.transaction_time, MO.Maplink, MO.countryMobileCode, MO.countrycode, MO.WebSitelink, MO.active, MO.postalcode_id, MO.displayname,mwl.location_name as full_location_name 
    FROM MASTER_PUTAWAYRULES M
     LEFT JOIN MASTER_WAREHOUSE MW ON MW.ID = M.ARRIVAL_LOC
     LEFT JOIN MASTER_PRODUCTS MP ON MP.ID = M.PRODUCT
     LEFT JOIN MASTER_INVOICE_CATEGEORY MIC ON MIC.ID = M.PRODUCT_CATEGORY
     LEFT JOIN MASTER_WAREHOUSE_LOCATION MWL ON MWL.ID = M.SUB_LOCATION
     LEFT JOIN TRANSACTION_ORGANIZATION MO ON MO.ID = M.COMPANY;`
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})



router.post('/delete_putawayrulesapi', (req, res) => {
    console.log('delete_putawayrulesapi', req.body);

    var id = req.body.id;
    const command = `Delete FROM MASTER_PUTAWAYRULES where id = '${id}'; `
    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err));
})


module.exports = router;