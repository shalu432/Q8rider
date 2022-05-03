const express = require('express')
const router = express.Router()
const user= require('../controller/usercontroller')
const midcustomer=require('../middleware/middleware')
//const midadmin=require('../middleware/adminmiddleware')
const validateUser=require('../middleware/validator')
const car= require('../controller/carcontroller')
router.post('/addcar',midcustomer.midJWT,car.addCar)
router.post('/addcategory',midcustomer.midJWT,car.addcategory)
router.post('/addbrand',midcustomer.midJWT,car.addBrand)
router.get('/getpost/:id',midcustomer.midJWT,car.getCarPost)


router.post('/addcountry',midcustomer.midJWT,car.addCountry)
router.get('/searchpost',midcustomer.midJWT,car.searchingCarPost)
router.get('/getfav',midcustomer.midJWT,car.getFavList)
router.post('/favpost',midcustomer.midJWT,car.addPostToFav)

router.put('/removefav',midcustomer.midJWT,car.removeFav)
router.put('/report',midcustomer.midJWT,car.reportedPost)
router.get('/report',midcustomer.midJWT,car.getAllReportedPost)
router.get('/block',midcustomer.midJWT,car.getBlockedPost)



module.exports = router;