const Otp = require('../model/otp')
const User = require('../model/userschema')

const Car=require('../model/carschema')
const Terms=require('../model/terms')

const { ObjectId } = require("bson")

const add = async (model,data) => {
 const res=model.create(data)
 console.log(res);
            if (res) {
                return res
            }
            else {
                return 0
            }
        }
    



const userOtpVerification = async(data,res) => {

  res=await User.findOne({ phoneNumber:data.phoneNumber })
        if (res!=null) {
           let data1= await Otp.findOne({ otp:data.otp})
               // console.log(data1);
                return data1
            
            }else{
                return 0
            }
       
        
    }

const insertQuery = async(model,data,res)=>{
    try{
        res=await model.insertMany(data)
       console.log(res);
        if(res.length>0){
            return res
        }
    }
    catch(error)
    {
        return error
    }
}


const get = async(model,data,res)=>{
    try{
        res=await model.find({_id:ObjectId(data)})
        //console.log(res);
        if(res.length>0){
          return res
            
        }
    }
    catch(error)
    {
        return error
    }
}


const updateQuery = async(id,data,res)=>{
    try{
        res= await User.findByIdAndUpdate(id,{$set:data},{new:true})
        console.log(id);
        if(res==null)
        {
            return 0
        }
        else{
            return res
        }
    }
    catch(error){
        return error
    }
}



const update = async(id,data,res)=>{
    try{
        
        res= await User.findOneAndUpdate(id,{$set:data},{new:true})

        if(res==null)
        {
            return 0
        }
        else{
            return res
        }
    }
    catch(error){
        return error
    }
}

const changepass=async(data,res)=>{
    try{
    res=await User.findOne({ email: data })
    if(res!=null){
        return res
          
      }}
      catch(error){
          return error
      }
  }

  const changePhone=async(data,res)=>{
      try{
        res=await User.findOne({ phoneNumber: data })
        if(res!=null){
            return res
              
          }}
      
      catch(error){

      }
  }

const findEmail=async(model,data,res)=>{
    
        try{
        res=await model.findOne({ email: data })
       //console.log(res);

        if(res!=null){
            return res
              
          }}
          catch(error){
              return error
          }
      }


const findUser= async(model,id,data)=>{
    try{
        const res=await model.findOne({userId:id,loginType:data})
        //console.log(res);
        if(res){
            return res
              
          }
        else{
            return 0
        }}
          catch(error){
              return error
          }
}


const userId= async(model,body,res)=>{
    try{
        
        res=await model.find(body)
            
    
        if(res!=null){
            return res
              
          }}
          catch(error){
              return error
          }
}









    module.exports = {
        add,
        userOtpVerification,
        insertQuery,
        get,
        updateQuery,
        changepass,
        changePhone,
        findEmail,
        findUser,
        userId,
        update
    }