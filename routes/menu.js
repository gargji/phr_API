const express =require('express');
const router =express.Router();
const db =require('../config/db');
const { execCommand } = require('../config/cmdExecution'); 
const { logWriter } = require('../config/errorWrite');

// menu/
router.get('/sidebarMenuItemGetActive', (req,res)=>{
    const command = `select * from master_sidebar order by menuItemName;`
    execCommand(command)
    .then(result => {
      res.json(result)})
    .catch(err => logWriter(command, err));
})

module.exports =router;