const express = require('express')
const router = express.Router()
const user= require('../controller/usercontroller')
const midcustomer=require('../middleware/middleware')
const validateUser=require('../middleware/validator')
router.post('/loginphone',user.loginByPhoneNumber)
router.post('/loginuser',user.loginUser)
router.put('/updateuser',midcustomer.midJWT,validateUser.update,user.updateUser)
router.post('/signup',validateUser.user,user.signUp)
router.post('/otp',user.verifyOtp)
router.get('/getuser',midcustomer.midJWT,user.getProfile)
router.get('/getprivacy/:id',midcustomer.midJWT,user.getPrivacyandPolicy)
router.get('/getterms/:id',midcustomer.midJWT,user.getTermsAndCondition)
router.post('/changepass',midcustomer.midJWT,user.changePassword)
router.post('/changephone',midcustomer.midJWT,user.changePhoneNumber)
router.post('/reset',user.reqResetPassword)
router.post('/resetpass',user.createPassword)
router.post('/fbfeed',user.facebookPost)


router.post('/addnews',midcustomer.midJWT,user.addNewsFeed)










module.exports = router;