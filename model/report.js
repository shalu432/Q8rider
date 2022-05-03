const mongoose = require('mongoose')
const ReportSchema = new mongoose.Schema({
     userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
            
        },
        postId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Car",
                
        }
})
module.exports = mongoose.model('Report',ReportSchema)
