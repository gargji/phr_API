const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { execCommand } = require('../config/cmdExecution');
const { logWriter } = require('../config/errorWrite')

router.post('/insertwarehouseapi', async (req, res) => {
    try {
        console.log(req.body, 'insertwarehouseapi');

        console.log(req.body, 'insertwarehouseapi');
        var location_name = req.body.value.location_name || ''
        var parent_location = req.body.value.parent_location?.id
        var location_type = req.body.value.location_type || 'Internal Location'
        var scrap_location = req.body.value.scrap_location || ''
        var selected_warehouse = req.body.value.selected_warehouse || '0'
        var returnlocation = req.body.value.returnlocation || ''
        var barcode = req.body.value.barcode || ''
        var replanish = req.body.value.replanish || ''
        var inventory_frequency_days = req.body.value.inventory_frequency_days || ''
        var last_effective_inventory = req.body.value.last_effective_inventory || ''
        var next_expected_inventory = req.body.value.next_expected_inventory || ''
        var removal_strategy = req.body.value.removal_strategy || ''
        var external_note = req.body.value.external_note || ''
        const isScrapLocationNull = scrap_location === null || scrap_location === true ? 1 : 0;
        const isreplanishNull = replanish === null || replanish === true ? 1 : 0;
        const isReturnLocationNull = returnlocation === null || returnlocation === true ? 1 : 0;
        const adress = req.body.adress;
        const Warehouse_name = req.body.value?.Warehouse_name || '';
        const warehouse_Id = req.body.value?.id || '';
        const Short_name = req.body.value?.Short_name || '';
        const address = req.body.value?.address?.id || '';
        const id = req.body.value?.id;

        // Input validation/sanitization can be added here

        if (!id) {
            const commands = `INSERT INTO master_warehouse (Warehouse_name, Short_name, address, made_on,resupplyroutes) VALUES ('${Warehouse_name.replace(new RegExp('"', 'g'), '""')}', '${Short_name}', ${address ? parseInt(address) : null}, now(),'${selected_warehouse}');`;
            console.log(commands);
            const result = await execCommand(commands);

            if (result) {
                const warehouseId = result?.insertId;
                const locationCommand = `INSERT INTO master_warehouse_location (location_name, parent_location, location_type, scrap_location, returnlocation, barcode, replanish, inventory_frequency_days, last_effective_inventory, next_expected_inventory, removal_strategy, external_note,warehouse_id) VALUES ('Stock', '${result?.insertId}', '${location_type}', '${isScrapLocationNull}', '${isReturnLocationNull}', '${barcode}', '${isreplanishNull}', '${inventory_frequency_days}', '${last_effective_inventory}', '${next_expected_inventory}', '${removal_strategy}', '${external_note}','${warehouseId}')`;
                console.log('locationCommand=>>>>>>>', locationCommand);
                await execCommand(locationCommand);

                await Promise.all(
                    adress.map(async (addressItem) => {
                        const command = `INSERT INTO master_warehouse_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,warehouse_id,countrycode,postal_id,street,street2,warehouse_name) VALUES ('${addressItem.contactname}', '${addressItem.Country}','${addressItem.states_name}','${addressItem.District}','${addressItem.postal_Code}','${addressItem.email}','${addressItem.phone}','${addressItem.mobile}','${result?.insertId}','${addressItem.countrycode}','${addressItem.postal_id}','${addressItem.street}','${addressItem.street2}','${addressItem.Warehousename}')`;
                        console.log(command);
                        await execCommand(command);
                    })
                );

                res.json('S');
            }
        } else {
            const commands = `UPDATE master_warehouse SET Warehouse_name='${Warehouse_name}', Short_name='${Short_name}', address=${address ? parseInt(address) : null} ,resupplyroutes = '${selected_warehouse}'  WHERE id= '${id}'`;
            console.log(commands);
            await execCommand(commands);

            if (adress === null || adress.length === 0) {
                res.json('U');
            } else {
                await Promise.all(
                    adress.map(async (addressItem) => {
                        const command2 = `INSERT INTO master_warehouse_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,warehouse_id,countrycode,postal_id,street,street2) VALUES ('${addressItem.contactname}', '${addressItem.Country}','${addressItem.states_name}','${addressItem.District}','${addressItem.postal_Code}','${addressItem.email}','${addressItem.phone}','${addressItem.mobile}','${result?.insertId}','${addressItem.countrycode}','${addressItem.postal_id}','${addressItem.street}','${addressItem.street2}')`;
                        console.log('command2', command2);
                        await execCommand(command2);

                        if (addressItem.id !== undefined) {
                            const command3 = `DELETE FROM master_warehouse_address WHERE id ='${addressItem.id}'`;
                            console.log('command3', command3);
                            await execCommand(command3);

                            const command4 = `INSERT INTO master_warehouse_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,warehouse_id,countrycode,postal_id,street,street2) VALUES ('${addressItem.contactname}', '${addressItem.Country}','${addressItem.states_name}','${addressItem.District}','${addressItem.postal_Code}','${addressItem.email}','${addressItem.phone}','${addressItem.mobile}','${result?.insertId}','${addressItem.countrycode}','${addressItem.postal_id}','${addressItem.street}','${addressItem.street2}')`;
                            console.log(command4);
                            await execCommand(command4);
                        }
                    })
                );
                res.json('U');
            }
        }
    } catch (error) {
        console.error(error);
        res.json('Dublicate');
    }
});



// router.post('/insertwarehouseapi', async (req, res) => {
//     try {
//         console.log(req.body, 'insertwarehouseapi');

//         console.log(req.body, 'insertwarehouseapi');
//         var location_name = req.body.value.location_name || ''
//         var parent_location = req.body.value.parent_location?.id
//         var location_type = req.body.value.location_type || 'Internal Location'
//         var scrap_location = req.body.value.scrap_location || ''
//         var returnlocation = req.body.value.returnlocation || ''
//         var barcode = req.body.value.barcode || ''
//         var replanish = req.body.value.replanish || ''
//         var inventory_frequency_days = req.body.value.inventory_frequency_days || ''
//         var last_effective_inventory = req.body.value.last_effective_inventory || ''
//         var next_expected_inventory = req.body.value.next_expected_inventory || ''
//         var removal_strategy = req.body.value.removal_strategy || ''
//         var external_note = req.body.value.external_note || ''
//         const isScrapLocationNull = scrap_location === null || scrap_location === true ? 1 : 0;
//         const isreplanishNull = replanish === null || replanish === true ? 1 : 0;
//         const isReturnLocationNull = returnlocation === null || returnlocation === true ? 1 : 0;
//         const adress = req.body.adress;
//         const Warehouse_name = req.body.value?.Warehouse_name || '';
//         const Short_name = req.body.value?.Short_name || '';
//         const address = req.body.value?.address?.id || '';
//         const id = req.body.value?.id;

//         // Input validation/sanitization can be added here

//         if (!id) {
//             const commands = `INSERT INTO master_warehouse (Warehouse_name, Short_name, address, made_on) VALUES ('${Warehouse_name.replace(new RegExp('"', 'g'), '""')}', '${Short_name}', '${address}', now());`;
//             console.log(commands);
//             const result = await execCommand(commands);

//             if (result) {
//                 const locationCommand = `INSERT INTO master_warehouse_location (location_name, parent_location, location_type, scrap_location, returnlocation, barcode, replanish, inventory_frequency_days, last_effective_inventory, next_expected_inventory, removal_strategy, external_note) VALUES ('Stock', '${result?.insertId}', '${location_type}', '${isScrapLocationNull}', '${isReturnLocationNull}', '${barcode}', '${isreplanishNull}', '${inventory_frequency_days}', '${last_effective_inventory}', '${next_expected_inventory}', '${removal_strategy}', '${external_note}')`;
//                 console.log('locationCommand=>>>>>>>', locationCommand);
//                 await execCommand(locationCommand);

//                 await Promise.all(
//                     adress.map(async (addressItem) => {
//                         const command = `INSERT INTO master_warehouse_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,warehouse_id,countrycode,postal_id,street,street2,warehouse_name) VALUES ('${addressItem.contactname}', '${addressItem.Country}','${addressItem.states_name}','${addressItem.District}','${addressItem.postal_Code}','${addressItem.email}','${addressItem.phone}','${addressItem.mobile}','${result?.insertId}','${addressItem.countrycode}','${addressItem.postal_id}','${addressItem.street}','${addressItem.street2}','${addressItem.Warehousename}')`;
//                         console.log(command);
//                         await execCommand(command);
//                     })
//                 );

//                 res.json('S');
//             }
//         } else {
//             const commands = `UPDATE master_warehouse SET Warehouse_name='${Warehouse_name}', Short_name='${Short_name}', address='${address}' WHERE id= '${id}'`;
//             console.log(commands);
//             await execCommand(commands);

//             if (adress === null || adress.length === 0) {
//                 res.json('U');
//             } else {
//                 await Promise.all(
//                     adress.map(async (addressItem) => {
//                         const command2 = `INSERT INTO master_warehouse_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,warehouse_id,countrycode,postal_id,street,street2) VALUES ('${addressItem.contactname}', '${addressItem.Country}','${addressItem.states_name}','${addressItem.District}','${addressItem.postal_Code}','${addressItem.email}','${addressItem.phone}','${addressItem.mobile}','${result?.insertId}','${addressItem.countrycode}','${addressItem.postal_id}','${addressItem.street}','${addressItem.street2}')`;
//                         console.log('command2', command2);
//                         await execCommand(command2);

//                         if (addressItem.id !== undefined) {
//                             const command3 = `DELETE FROM master_warehouse_address WHERE id ='${addressItem.id}'`;
//                             console.log('command3', command3);
//                             await execCommand(command3);

//                             const command4 = `INSERT INTO master_warehouse_address (contactname, Country,states_name,District,postal_Code,email,phone,mobile,warehouse_id,countrycode,postal_id,street,street2) VALUES ('${addressItem.contactname}', '${addressItem.Country}','${addressItem.states_name}','${addressItem.District}','${addressItem.postal_Code}','${addressItem.email}','${addressItem.phone}','${addressItem.mobile}','${result?.insertId}','${addressItem.countrycode}','${addressItem.postal_id}','${addressItem.street}','${addressItem.street2}')`;
//                             console.log(command4);
//                             await execCommand(command4);
//                         }
//                     })
//                 );
//                 res.json('U');
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         res.json('Dublicate');
//     }
// });


router.get('/getallwarehouse_allapi', (req, res) => {
    const command = `select mw.id, mw.Short_name, mw.address, mw.made_on,mwa.contactname, mwa.titlname, mwa.jobpostion,  mwa.street,  mwa.street2,  mwa.Country,  mwa.states_name,  mwa.District,  mwa.postal_Code,  mwa.email,  mwa.phone,  mwa.mobile,  mwa.contacts_type,  mwa.warehouse_id,  mwa.countrycode, mwa.postal_id,  mw.Warehouse_name,concat( mw.Warehouse_name,' - ' ,mw.Short_name) as warehouse_name,mwa.warehouse_name as Address,concat(mw.Short_name,'/Stock')  as location
    from master_warehouse mw
    left join master_warehouse_address mwa on mwa.id = mw.address
    left join master_warehouse_location mwl on   mw.id = mwl.parent_location group by mw.Warehouse_name`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.get('/all_Address', (req, res) => {
    const command = `SELECT id,warehouse_name FROM master_warehouse_address`;
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/delete_warehouseapi', (req, res) => {
    console.log('delete_warehouseapi=>', req.body);
    var idd = req.body.id
    const command = `delete from master_warehouse where  id='${idd}'`;
    console.log(command);
    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err));
});

// router.get('/getlocation_allapi', (req, res) => {
//     const command = `SELECT mwl.id, mwl.location_name, mwl.parent_location
//     rent_location, mwl.location_type, mwl.scrap_location, mwl.returnlocation, mwl.barcode, mwl.replanish, mwl.inventory_frequency_days, mwl.last_effective_inventory, mwl.next_expected_inventory, mwl.removal_strategy, mwl.external_note, mw.Warehouse_name, mw.Short_name, mw.address, mw.made_on, mwl.location_type as Location_Type,concat(mw.Short_name,'/',mwl.location_name)  as location,concat( mw.Warehouse_name,' - ' ,mw.Short_name) as Warehouse_name
//       FROM master_warehouse_location mwl
//       left join master_warehouse mw on mw.id = mwl.parent_location
//       left join master_warehouse_address mwa on mwa.id = mw.address;`
//     execCommand(command)
//         .then(result => res.json(result))
//         .catch(err => logWriter(command, err));
// })


router.get('/getlocation_allapi', (req, res) => {
    const command = `SELECT   mwl.id, mwl.location_name,  mwl.parent_location,   mwl.location_type,   mwl.scrap_location,  mwl.returnlocation,  mwl.barcode,  mwl.replanish,  mwl.inventory_frequency_days,   mwl.last_effective_inventory,  mwl.next_expected_inventory,  mwl.removal_strategy,   mwl.external_note,mwl.warehouse_id,  mw.Warehouse_name,  mw.Short_name,  mw.address, mw.made_on, mwl.location_type as Location_Type, CONCAT(mw.Short_name, '/', mwl.location_name) as location,mwl.parent_location_name
    FROM  master_warehouse_location mwl 
    LEFT JOIN  master_warehouse mw ON mw.id = mwl.warehouse_id 
    LEFT JOIN  master_warehouse mw_parent ON mw_parent.id = mwl.parent_location;`
    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
})

router.post('/delete_locationapi', (req, res) => {
    console.log('delete_locationapi=>', req.body);
    var idd = req.body.id
    const command = `delete from master_warehouse_location where  id='${idd}'`;
    execCommand(command)
        .then(result => res.json('deleted'))
        .catch(err => logWriter(command, err));
});

router.post('/insertlocationapi', async (req, res) => {
    console.log('insertlocationapi=>', req.body);
    var location_name = req.body.value.location_name || ''
    var parent_location = req.body.value.parent_location?.id
    var parent_location_name = req.body.value.parent_location?.location_name
    var warehouse_id = req.body.value.parent_location?.warehouse_id
    var location_type = req.body.value.location_type || 'Internal Location'
    var scrap_location = req.body.value.scrap_location || ''
    var returnlocation = req.body.value.returnlocation || ''
    var barcode = req.body.value.barcode || ''
    var replanish = req.body.value.replanish || ''
    var inventory_frequency_days = req.body.value.inventory_frequency_days || ''
    var last_effective_inventory = req.body.value.last_effective_inventory || ''
    var next_expected_inventory = req.body.value.next_expected_inventory || ''
    var removal_strategy = req.body.value.removal_strategy || ''
    var external_note = req.body.value.external_note || ''
    const isScrapLocationNull = scrap_location === null || scrap_location === true ? 1 : 0;
    const isreplanishNull = replanish === null || replanish === true ? 1 : 0;
    const isReturnLocationNull = returnlocation === null || returnlocation === true ? 1 : 0;
    const id = req.body.value.id

    try {
        if (!id) {
            // insert new data
            const command = `INSERT INTO master_warehouse_location (location_name, parent_location, location_type, scrap_location, returnlocation, barcode, replanish, inventory_frequency_days, last_effective_inventory, next_expected_inventory, removal_strategy, external_note,warehouse_id,parent_location_name) VALUES ('${parent_location_name}/${location_name}', '${parent_location}', '${location_type}', '${isScrapLocationNull}', '${isReturnLocationNull}', '${barcode}', '${isreplanishNull}', '${inventory_frequency_days}', '${last_effective_inventory}', '${next_expected_inventory}', '${removal_strategy}', '${external_note}', '${warehouse_id}','${parent_location_name}')`;
            console.log(command);
            await execCommand(command);
            res.json('S');
        } else {
            const command = `UPDATE master_warehouse_location SET  location_name='${location_name}', parent_location='${parent_location}', location_type='${location_type}',scrap_location='${isScrapLocationNull}', returnlocation='${isReturnLocationNull}', barcode='${barcode}', replanish='${isreplanishNull}', inventory_frequency_days='${inventory_frequency_days}', last_effective_inventory='${last_effective_inventory}',next_expected_inventory='${next_expected_inventory}', removal_strategy='${removal_strategy}', external_note='${external_note}',warehouse_id='${warehouse_id}',parent_location_name='${parent_location_name}' WHERE id='${id}'`
            console.log(command);
            await execCommand(command);
            res.json('U');
        }
    } catch (err) {
        logWriter(command, err);
        res.status(500).json('Error');
    }
});




router.post('/getsublocations_allapi', (req, res) => {
    console.log('getsublocations_allapi=>>>>', req.body);
    const id = req.body.data.id;

    const command = `SELECT mwl.id,mwl.location_name, mwl.parent_location , mwl.location_type, mwl.scrap_location, mwl.returnlocation, mwl.barcode, mwl.replanish, mwl.inventory_frequency_days, mwl.last_effective_inventory, mwl.next_expected_inventory, mwl.removal_strategy, mwl.external_note,mwl.warehouse_id FROM master_warehouse_location mwl where warehouse_id =  '${id}';`
    console.log(command);

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

router.post('/warehosuefilter', (req, res) => {
    console.log('warehosuefilter=>>>>', req.body);
    const id = req.body.data;

    const command = `    SELECT   mwl.id, mwl.location_name,  mwl.parent_location,   mwl.location_type,   mwl.scrap_location,  mwl.returnlocation,  mwl.barcode,  mwl.replanish,  mwl.inventory_frequency_days,   mwl.last_effective_inventory,  mwl.next_expected_inventory,  mwl.removal_strategy,   mwl.external_note,mwl.warehouse_id,  mw.Warehouse_name,  mw.Short_name,  mw.address, mw.made_on, mwl.location_type as Location_Type, CONCAT(mw.Short_name, '/', mwl.location_name) as location
    FROM  master_warehouse_location mwl 
    LEFT JOIN  master_warehouse mw ON mw.id = mwl.warehouse_id  where mw.Warehouse_name like '%${id}%';`
    console.log(command);

    execCommand(command)
        .then(result => res.json(result))
        .catch(err => logWriter(command, err));
});

module.exports = router;