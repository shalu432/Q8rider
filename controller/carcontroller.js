const express = require('express')
const user = require('../controller/usercontroller')
const Car = require('../model/carschema')
const Category = require('../model/category')
const carservice = require('../services/carservices');
const Country = require('../model/dealership');
const Brand = require('../model/brand');
const User = require('../model/userschema')
const favouriteList = require('../model/favourite')
const { ObjectId } = require("bson");
const addCar = async (req, res) => {
    var userId = req.user
    data={model:req.body.model}
    await carservice.find(Car,data).then((result)=>{
        if(!result)
        {
             carservice.insertdata(Car, {
                userId: userId,
                product: req.body.product,
                model: req.body.model,
                categoryId: req.body.categoryId,
                price: req.body.price,
                mileage: req.body.mileage,
                manufacturedYear: req.body.manufacturedYear,
                enginePower: req.body.enginePower,
                transmissionType: req.body.transmissionType,
                conditions: req.body.conditions,
                dealershipId: req.body.dealershipId,
                fuelType: req.body.fuelType,
                cyclinders: req.body.cyclinders,
                report: req.body.report,
                postType:req.body.postType
        
        
        
            })
                .then((data) => {
                    res.json({
                        status: "true",
                        error: {},
                        message: "post added successfully",
                        response: data
                    })
                })
        
        }
        else{
            res.json({
                status:"false",
                err:{},
                message:"post is already added"
            })
        }
    })
    
    


}

const addcategory = async (req, res) => {
    data={ bodyType: req.body.bodyType,}
    await carservice.find(Car,data).then((result)=>{
        if(!result)
        {
    carservice.insertdata(Category, {

        bodyType: req.body.bodyType,
    }).then((result) => {
        res.json({
            status: "true",
            error: {},
            message: "carBodyType added successfully",
            data: result
        })
    })

    }else{
        res.json({
            status:"false",
            err:{},
            message:"duplicate value"
        })
    }
})
}
const addCountry = async (req, res) => {
    
    try{
        data={dealership: req.body.dealership}
        await carservice.find(Car,data).then((result)=>{
            if(!result)
            {
     carservice.insertdata(Country, {

        dealership: req.body.dealership,
    }).then((result) => {
        res.json({
            status: "true",
            error: {},
            message: " country added successfully",
            data: result
        })
    })
            }
            else{
                res.json({
                    status:"false",
                    err:{},
                    message:"duplicate value"
                })
            }



        })
    }
catch(error){
    res.json({
        error:error.message  
    })
   
}
}
const addBrand = async (req, res) => {
    carservice.insertdata(Brand, {
        countryId: req.body.countryId,
        brandName: req.body.brandName,
    }).then((result) => {
        res.json({
            status: "true",
            error: {},
            message: " brand added successfully",
            data: result
        })
    })

}

const getCarPost = async (req, res) => {
    try {
        let data = req.params.id
        console.log(data);
        let value = await carservice.getPost(data)
        console.log(value);
        if (value != 0) {
            res.json({
                status: "true",
                code: 200,
                data: value
            })
        }
        else {
            res.json({
                status: "false",
                message: "no data"
            })
        }

    }
    catch (error) {
        res.send({
            error:
            {
                message: "null",
                error: error.message
            }
        })
    }
}

const searchingCarPost = async (req, res) => {


    var pageSize = 1;
    if (pageSize != 0 && pageSize != null) {
        pageSize = Number(req.query.pageSize);
    }
    else {
        res.json("limit must be greater than 0")
    }


    const skip = Number(req.query.skip);
    let data = ([



        {
            $lookup:
            {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryId"
            }
        },
        { $unwind: "$categoryId" },
        {
            $lookup:
            {
                from: "brands",
                localField: "dealershipId",
                foreignField: "countryId",
                as: "dealershipId"
            }
        },
        { $unwind: "$dealershipId" },
        {
            $match: {
                $or: [


                    { model: { $regex: req.query.keyword, $options: 'i' } },
                    { "categoryId.bodyType": { $regex: req.query.keyword, $options: 'i' } },
                    { "dealershipId.brandName": { $regex: req.query.keyword, $options: 'i' } },

                ]
            }
        },
        {
            $limit: pageSize
        },
        { $skip: skip }
    ])
    let value = await carservice.viewPost(Car, data)
    // console.log(value);
    if (value.length == 0) {
        responseObj = {
            "status": "error",
            "msg": "no matched product",
            "body": {}
        }
        res.status(500).send(responseObj);
    } else {
        responseObj = {
            "status": "true",
            "msg": "Record found.",
            "body": value
        }
        res.status(200).send(responseObj);
    }




}





const addPostToFav = async (req, res) => {
    try {
        let postId = req.body.postId
        var userId = req.user;
        let favPost = await favouriteList.findOne({ userId: req.user })
        const postDetails = await Car.findById(postId);
        let data1 = null
        if (favPost) {

            favPost.items.push({
                postId: postId,
                product: postDetails.product,
                model: postDetails.model,
                price: postDetails.price,
                categoryId: postDetails.categoryId,
                dealershipId: postDetails.dealershipId,

            })
            data1 = await favPost.save();
        }
        else {
            const postData = {
                userId: userId,

                items: [{
                    postId: postId,
                    product: postDetails.product,
                    model: postDetails.model,
                    price: postDetails.price,
                    categoryId: postDetails.categoryId,
                    dealershipId: postDetails.dealershipId,
                }],

            }
            favPost = new favouriteList(postData);
            data1 = await favPost.save();

        }
        return res.status(200).send({
            code: 200,
            message: "Add to favourite successfully!",
            data: data1
        });

    } catch (error) {
        res.json({
            status: "false",
            response: "null",
            error: {
                error: "failed"
            }
        })
    }
}

const getFavList = async (req, res) => {

    try {
        let data = req.user
        console.log(data);
        let val = await carservice.getfav(data)


        if (val != 0) {
            res.json({
                status: "true",
                code: 200,
                err: {},
                data: val
            })
        }
        else {
            res.json({
                status: "false",
                message: "no data",
                error: {
                    error: "failed"
                }
            })
        }

    }
    catch (error) {
        res.send({
            error:
            {
                message: "null",
                error: error.message
            }
        })
    }
}

const removeFav = async (req, res) => {
    try {
        var value={ userId: (req.user) }
        await carservice.update(value,  { items: { postId: (req.query.postId) }  }, { multi: true }).then(data => {
            res.json({
                status: "true",
                error: {},
                message: "removed successfully",

                response: data
            })
        })
    }
    catch (err) {
        res.json(err);
    }
}






const reportedPost = async (req, res) => {
 var value=({ _id: req.query.postId })
data={_id:req.user}
    await User.find(data)
   // console.log(data);
    await carservice.updateQuery(value,
        {
        
            report:req.body.report
        
        }, { new: true, runValidators: true })
        .then((result) => {
            res.json({
                status: "true",
                code: 200,
                message: "reported successfully",
                response: result,

            })
        })



}


const getAllReportedPost= async(req,res)=>{
Car.find({report: { $gt:0} } ).then((data)=>{
    
    if(data!=0){
        res.json({
            status:"true",
            code:"200",
            message:"reported post",
            response:data
        })
        }
        else{
            res.json({
                status:"false",
                response:"null",
                message:"no reported post found"
            })
        }
})


}

const getBlockedPost= async(req,res)=>{

 try{
  

   // const data= await Car.find({ report:{$eq:3}},
        
        
    //     {
    //        $set:{
    //         postType:"blocked post"
    //        }
    //    },{ new: true, runValidators: true })
    //.then((result)=>{
    //     res.json({
    //         status:"true",
    //         code:"200",
    //         response:result
    //     })
    //    })


const data= await Car.find({ report:{$eq:3}})

    data.forEach(el=>{
        {   console.log(result);
            Car.findByIdAndUpdate(ObjectId(req.user),{
                $set:{
                            postType:"blocked post"
                           }
                       },{ new: true, runValidators: true })
                       .then((result)=>{
                        
                        res.json({
                            status:"true",
                            code:"200",
                            response:result
                        })
                       })
                }
    })
   
            
        
    
    

// .forEach(function(doc){
//     console.log({ _id: doc._id });
//      Car.updateMany({ _id: doc._id }, {$set:{
//         postType:"blocked post"
//        }})
// }) 
// .then((data1)=>{
//     res.json({
//         status:"true",
//         code:"200",
//         response:data1
//     })
// })
.catch(error=>{
    res.json({
        status:"false",
        error:{
            err_message:error
        }
        
    })
})
       
}

catch (err) {
    res.json(err)
}

}  














module.exports = {
    addCar,
    
    addcategory,
    addCountry,
    addBrand,
    getCarPost,
    searchingCarPost,
    addPostToFav,
    getFavList,
    reportedPost,
    removeFav,
    getAllReportedPost,
    getBlockedPost
   
   
}
