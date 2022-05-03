const mongoose = require('mongoose')
const PrivacySchema = new mongoose.Schema({
     privacyPolicy :{
            type:String,
            required:true
            
        }
})
module.exports = mongoose.model('Privacy',PrivacySchema)
