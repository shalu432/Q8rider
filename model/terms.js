const mongoose = require('mongoose')
const TermsSchema = new mongoose.Schema({
     TermsAndCondition:{
            type:String,
            required:true
            
        }
})
module.exports = mongoose.model('Terms',TermsSchema)
