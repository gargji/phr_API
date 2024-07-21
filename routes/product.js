const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite');


router.post('/insertnewproductdetails', async (req, res) => {
  try {
    console.log('insertnewproductdetails=>', req.body);

    var productName = req.body.data.productName || '';
    var product_code = req.body.data.product_code || '';
    var saleOk = req.body.data.saleOk || '';
    var purchaseOk = req.body.data.purchaseOk || '';
    var rentOk = req.body.data.rentOk || '';
    var salePrice = req.body.data.salePrice || '';
    var salePricetax = req.body.data.salePricetax?.id || '';
    var costPrice = req.body.data.costPrice || '';
    var costPricetax = req.body.data.costPricetax?.id || '';
    var internalReference = req.body.data.internalReference || '';
    var selected_warehouse = req.body.data.selected_warehouse || '';
    var barcode = req.body.data.barcode || '';
    var productTemplateTags = req.body.data.productTemplateTags || '';
    var internalNotes = req.body.data.internalNotes || '';
    var routes = req.body.data.routes || '';
    var weight = req.body.data.weight || '';
    var volume = req.body.data.volume || '';
    var uniqueSerialNumber = req.body.data.uniqueSerialNumber || '';
    var byLots = req.body.data.byLots || '';
    var noTracking = req.body.data.noTracking || '';
    var alertBeforeExpirationDays = req.body.data.alertBeforeExpirationDays || '0';
    var descriptionForReceipts = req.body.data.descriptionForReceipts || '';
    var descriptionForDeliveryOrders = req.body.data.descriptionForDeliveryOrders || '';
    var descriptionForInternalTransfers = req.body.data.descriptionForInternalTransfers || '';
    var productCategoryId = req.body.data.productCategory || '';
    var id = req.body.data.id || '';

    if (!id) {
      // Insert new record
      const insertCommand = `
        INSERT INTO master_products (
          product_code, productName, saleOk, purchaseOk, rentOk, productCategory, salePrice, salePricetax, costPrice, costPricetax,
          internalReference, barcode, productTemplateTags, internalNotes, routes, weight, volume, uniqueSerialNumber,
          byLots, noTracking, alertBeforeExpirationDays, descriptionForReceipts, descriptionForDeliveryOrders,
          descriptionForInternalTransfers
        ) VALUES (
          '${product_code}', '${productName}', '${saleOk ? 1 : 0}', '${purchaseOk ? 1 : 0}', '${rentOk ? 1 : 0}', '${productCategoryId}',
          '${salePrice}', '${salePricetax}', '${costPrice}', '${costPricetax}', '${internalReference}', '${barcode}',
          '${productTemplateTags}', '${internalNotes}', '${routes}', '${weight}', '${volume}', '${uniqueSerialNumber ? 1 : 0}',
          '${byLots ? 1 : 0}', '${noTracking ? 1 : 0}', '${alertBeforeExpirationDays}', '${descriptionForReceipts}',
          '${descriptionForDeliveryOrders}', '${descriptionForInternalTransfers}'
        )`;
      console.log(insertCommand);
      await execCommand(insertCommand);
      res.json('S');
    } else {
      const updateCommand = ` UPDATE master_products SET  product_code = '${product_code}',  productName = '${productName}',  saleOk = '${saleOk ? 1 : 0}',
        purchaseOk = '${purchaseOk ? 1 : 0}',  rentOk = '${rentOk ? 1 : 0}',  productCategory = '${productCategoryId}', salePrice = '${salePrice}', salePricetax = '${salePricetax}',
        costPrice ='${costPrice}', costPricetax = '${costPricetax}',  internalReference = '${internalReference}',  barcode = '${barcode}', productTemplateTags = '${productTemplateTags}',
        internalNotes = '${internalNotes}',  routes = '${routes}', weight = '${weight}',  volume = '${volume}', uniqueSerialNumber = '${uniqueSerialNumber ? 1 : 0}',  byLots = '${byLots ? 1 : 0}',
        noTracking = '${noTracking ? 1 : 0}',  alertBeforeExpirationDays = '${alertBeforeExpirationDays}', descriptionForReceipts = '${descriptionForReceipts}',  descriptionForDeliveryOrders = '${descriptionForDeliveryOrders}',  descriptionForInternalTransfers = '${descriptionForInternalTransfers}'  WHERE id = '${id}';`
      console.log(updateCommand);
      await execCommand(updateCommand);
      res.json('U');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Error occurred');
  }
});


router.get('/getallproduct_api', (req, res) => {
  const command = `SELECT MP.id, MP.product_code, MP.productName, MP.saleOk, MP.purchaseOk, MP.rentOk, MP.productCategory, MP.salePrice, MP.salePricetax, MP.costPrice, MP.costPricetax, MP.internalReference, MP.barcode, MP.productTemplateTags, MP.internalNotes, MP.routes, MP.weight, MP.volume, MP.uniqueSerialNumber, MP.byLots, MP.noTracking, MP.alertBeforeExpirationDays, MP.descriptionForReceipts, MP.descriptionForDeliveryOrders, MP.descriptionForInternalTransfers, MIT.id as m_i_t_id, MIT.codes, MIT.taxname, MIT.taxdescription, MIT.taxgroup, MIT.itisparent_group, MIT.countryname, MIT.country_id, MIT.company, MIT.label_on_invoice, MIT.tax_compunation, MIT.amount, MIT.tax_type, MIT.tax_scope, MIT.distribution_for_invoice, MIT.created_on, MIT.created_by, MIT.last_updated_by, MIT.active, MIT.include_in_price, MIT.subseq_taxes, MIT.sequence, MIC.id as m_i_c_id, MIC.categeory_name, MIC.description, MIC.taxnames, MIC.selectedCategory, MIC.tax_id, MIC.active
  FROM MASTER_PRODUCTS MP
  LEFT JOIN MASTER_INVOICE_TAXES MIT ON MP.SALEPRICETAX = MIT .ID
  LEFT JOIN MASTER_INVOICE_CATEGEORY MIC ON MIC.ID = mp.productCategory;`
  execCommand(command)
    .then(result => res.json(result))
    .catch(err => logWriter(command, err));
})


router.post('/delete_productapi', (req, res) => {
  console.log('delete_productapi=>', req.body);
  var idd = req.body.id
  const command = `delete from master_products where  id='${idd}'`;
  console.log(command);
  execCommand(command)
    .then(result => res.json('deleted'))
    .catch(err => logWriter(command, err));
});

module.exports = router;