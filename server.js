const express = require('express')
const mongoose  = require('mongoose')
const cors = require('cors')
const app = express()

const {Registration,PublishedSurvey,DraftedSurvey,Response} = require("./model")

app.use(express.json())
app.use(cors())
app.listen(8000,() => console.log("server is running"))
mongoose.connect("mongodb+srv://venkatesh:venkatesh@cluster0.kzqhhnv.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log("DB connected"))
.catch((err) => console.log(err))



//For registration
app.post("/registration",async(req,res) =>{
    try{
        const {name,email,password,userType} =req.body
        const data = await Registration.find({email})
        if (data.length === 0){
            const newData = new Registration({name,email,password,userType})
            await newData.save()
            return res.status(200).json("Registration Successfull")
        } 
        else{
            return res.status(500).json("user already exists..")
        }
    }catch(err){
        console.log(err)
        return res.status(500).json("Registration Failed")
    }
    
})


//For login 
app.post("/login",async(req,res) =>{
try{
    const {email,password,userType} = req.body
    const emailValidation = await Registration.find({email : email})
    if (emailValidation.length !== 0){
        const passwordValidation = await Registration.find({email : email,password:password})
        if (passwordValidation.length !== 0){
            const userTypeValidation = await Registration.find({email:email,password:password,userType:userType})
            if(userTypeValidation.length !== 0){
                return res.status(200).json("Login Successful")
            }else{
                return res.status(402).json(`you are not a ${userType}`)
            }
        }else{
            res.status(401).json("Password didn't match")
        }

    }else{
        return res.status(400).json("Email is invalid")
    }

}catch(err){
    return res.status(500).json("Login Failed")
    
}

})



//for published Surveys
app.post("/publishedSurvey" ,async(req,res) =>{
    try{
        const {users,data,email,status,title} = req.body
        
        const newData = await PublishedSurvey({email:email,data:data,users:users,status:status,title : title})
        newData.save()
        return res.status(200).json("Survey Published Successfully")
        
    }catch(err){
        console.log(err)
        return res.status(500).json("Survey didn't published")
    }
    
})


//Users Individual Survey
app.post("/surveys",async(req,res) =>{
    const {email} = req.body
    const data =await PublishedSurvey.find({"users" : email})
    if (data.length === 0){
        res.json([])
    }
    else{
        res.json(data)
    }
})

app.post("/adminSurveys",async(req,res) =>{
    const {email} = req.body
    const data =await PublishedSurvey.find({email})
    if (data.length === 0){
        res.json([])
    }
    else{
        res.json(data)
    }
})

//For Drafted Survey
app.post("/draftSurvey" ,async(req,res) =>{
    try{
        const {data,email,status} = req.body
        
        const newData = await DraftedSurvey({email:email,data:data,status:status})
        newData.save()
        return res.status(200).json("Survey Drafted Successfully")
        
    }catch(err){
        console.log(err)
        return res.status(500).json("Survey didn't Drafted")
    }
    
})


// For how many people registered as users // useful for selectins users while publishing the data
app.get("/usersData",async(req,res) => {
    try{
        const newData = await Registration.find({userType : "user"})
        res.json(newData)
    }
    catch(err){
        console.log(err)
    }
})



//For collecting user Responses
app.post("/responses",async(req,res) =>{
    try{
        const {userEmail,surveyName,status,responses,adminEmail} = req.body
        const userValidatiton =await Response.find({userEmail:userEmail,surveyName:surveyName})
        
        if (userValidatiton.length === 0){
            const newData = await Response({userEmail : userEmail,surveyName : surveyName,status:status,responses :responses,adminEmail:adminEmail})
            newData.save()
            res.json("Thank you for responding")   
        }
        else{
            res.json("You have already Responded")
        }  

    }catch(err){
        console.log(err)
    }
   
})

// For displaying user Responses
app.post("/userResponses",async(req,res) =>{
    try{
        const {adminEmail}= req.body
        const adminValidation = await Response.find({adminEmail : adminEmail})
        
        if (adminValidation.length === 0){
            res.json([])
        }
        else{
            res.json(adminValidation)
        }

    }catch(err){
        console.log(err)
    }
   
})


// //For accessing draft survey
// app.get("/draftSurvey",async(req,res) =>{
//     try{
//         const {email} = req.body
//         const Validation = await DraftedSurvey({email : email})
//         if (Validation.length === 0){
//             res.json([])
//         }else{
//             res.json(Validation)
//         }
//     }catch(err){
//         console.log(err)
//     }
    
// })



//For admin Published pages
app.post("/adminPublish",async(req,res) =>{
    const {email} = req.body
    const data =await PublishedSurvey.find({email})
    if (data.length === 0){
        res.json([])
    }
    else{
        res.json(data)
    }
})

//For accessing drafted pages

app.post("/userDraftedSurveys",async(req,res) => {
    try{
        const {email} = req.body
        const draftValidation = await DraftedSurvey.find({email : email})
        if (draftValidation.length === 0){
            return res.json([])
        }
        else {
            return res.json(draftValidation)
        }
    }catch(err){
        console.log(err)
    }    
})