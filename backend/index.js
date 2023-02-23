const e = require("express")
const express = require("express")
const router = express()
const mongoose = require("mongoose")
const reqschema = require("./rmodels/register")
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
mongoose.set('strictQuery', true)
const link = "mongodb+srv://new:new@cluster0.oaooz3x.mongodb.net/?retryWrites=true&w=majority"
const con = async()=>{
    await mongoose.connect(link , (err)=>{
        if(err){
            console.log("error in connecting mongodb")
        }else{
            console.log("mongodb connected successfully")
        }
    })
}
con()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
const saltRounds = 10
router.post("/register" , async(req,res)=>{
    try{
          const {name , password , email , rollnumber} = req.body
          bcrypt.hash(password, saltRounds,async function (err, hash) {
             if(err){
                res.status(400).json({
                    msg : err
                })
             }else{
                const data =  await reqschema.create({
                    name : name,
                    password : hash,
                    email:email,
                    rollnumber : rollnumber
                 })
                 res.status(200).json({
                   status : "success",
                   data: data
                 })
             }
        });
         
    }catch(e){
          res.status(404).json({
            message : e.message
          })
    }
})

router.get("/getusers",async(req,res)=>{
     try{
        const data = await reqschema.find()
        res.status(200).json({
            data : data
        })
     }catch(e){
        res.status(404).json({
            message : e.message
          })
     }
})

router.post("/login" , async (req,res)=>{
    try{
         const {email , password } = req.body
         const data = await reqschema.findOne({email:email})
         const hash = data.password
         bcrypt.compare(password, hash).then( async function(result) {
              if(result == true){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (10 * 60),
                    data: 'foobar'
                  }, 'secret');
                res.status(201).json({
                    token:token,
                    message : "User successfully loggedin"
                })
              }else{
                res.status(401).json({
                    message : "Invalid credentails"
                })
              }
        });
    }catch(e){
        res.status(404).json({
            message : e.message
          })
    }
})

router.put("/update/:rollnumber" , async(req,res)=>{
    try{
        const rollnumber = req.params.rollnumber
        const data = await reqschema.updateOne({rollnumber : rollnumber}, req.body)
        res.status(201).json({
            status : "success",
            message : "data successfully updated",
            data
        })
    }catch(e){
        res.status(404).json({
            message : e.message
          })
    }
})

router.delete("/delete/:rollnumber" , async(req,res)=>{
    try{
        const rollnumber = req.params.rollnumber
        const data = await reqschema.deleteOne({rollnumber : rollnumber})
        res.status(201).json({
            status : "success",
            message : "data successfully deleted",
            data
        })
    }catch(e){
        res.status(404).json({
            message : e.message
          })
    }
})

router.listen(8080 , ()=>{
    console.log("port is running at 8080")
})
