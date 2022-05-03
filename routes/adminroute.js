const express = require('express')
const router = express.Router()
const Admin = require('../model/admin')




 const adm = require('../controller/admincontroller')
 
 router.post('/addAdmin',adm.addAdmin)
 router.post('/loginAdmin',adm.loginAdmin)


 module.exports = router;