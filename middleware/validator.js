const { error } = require('console');
const joi = require('joi');
const { result } = require('lodash');

const user=(req,res,next)=>{
const schema = joi.object().keys({ 
    userName: joi.string().alphanum().min(3).max(30).required(),
    phoneNumber:joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    email:joi.string().lowercase().email({ minDomainSegments: 2, tlds: {allow: ["com", "net", "in", "co"]}}).required(),
    password: joi.string().min(4).required(),
    countryCode:joi.string().regex(/^(\+?\d{1,3}|\d{1,4})$/).required()
    
  });

try{
   
    const value=schema.validate(req.body,{stripUnknown:{objects:true}})
    if(value.error)
    {
       return res.send(value.error.message)
    }
    if(!value.error)
{
        return next();
    }
}
catch(error){
    
 return next(error)
}
}



const update=(req,res,next)=>{
    const schema = joi.object().keys({ 
        userName: joi.string().alphanum().min(3).max(30).required(),
        phoneNumber:joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
        email:joi.string().lowercase().email({ minDomainSegments: 2, tlds: {allow: ["com", "net", "in", "co"]}}),
        password: joi.string().min(4),
        countryCode:joi.string().regex(/^(\+?\d{1,3}|\d{1,4})$/)
        
      });
    
    try{
       
        const value=schema.validate(req.body,{stripUnknown:{objects:true}})
        if(value.error)
        {
           return res.send(value.error.message)
        }
        if(!value.error)
    {
            return next();
        }
    }
    catch(error){
        
     return next(error)
    }
    }
    


module.exports={
user,
update
}