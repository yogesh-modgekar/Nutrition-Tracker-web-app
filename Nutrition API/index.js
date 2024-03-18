const express = require('express');           // modules : a cllection of functionality which can         import in our code and we can use it
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('./models/userModel') ; // importing model from file
const foodModel= require('./models/foodModel');
const trackingModel = require('./models/trackingModel');
const cors = require('cors');

mongoose.connect("mongodb://localhost:27017/nutrify")   //Database connection
.then(()=>{
    console.log("Database connected");
})
.catch(()=>{
    console.log("Couldn't Connect");
})

const app = express();                     // END POINT FOR LOGIN
app.use(express.json());
app.use(cors());

app.listen(7000,()=>{
    console.log("Server is Running");
})

app.post("/register",(req,res)=>{

       let user = req.body;

       bcrypt.genSalt(10,(err,salt)=>{                // encription of password
        if(!err)
        {
            bcrypt.hash(user.password,salt,async(err,hpass)=>{
              if(!err)
              {
                user.password=hpass;
                try                                                // handling promises using async await
                {                                                       
                    let doc = await userModel.create(user);
                     res.status(201).send({message:"User Registered Successfully..!"});
                }
                catch(err)
                {
                 console.log(err);
                    res.status(500).send({message :" some problem"});
                }
              }
              })
         }
        })
     })

     //  userModel.create(user)
    //    .then((docs)=>{                                        //handeling promises using .then & .catch
    //       res.status(200).send({message:"User Registered"});
    //    })
    //    .catch((err)=>{
    //        console.log(err);
    //        res.status(500).send({message :" some problem"});
    //    })
  
    app.post("/login",async(req,res)=>{                      // END POINT FOR LOGIN

        let userCred = req.body;
        try
        {
            const user = await userModel.findOne({email:userCred.email});
            if(user!==null)
          {
            bcrypt.compare(userCred.password,user.password,(err,result)=>{
                if(result==true)
                {
                    //res.send({message : "Login Successfull"});
                    jwt.sign({email:userCred.email},"nutrify",(err,token)=>{   //Generating token
                        if(!err)
                        {
                            res.status(200).send({message:"Login Successfully",Token : token, userid : user._id, name : user.name});
                        }
                    })
                }
                else
                {
                    res.status(403).send({message : "Incorrect Password"});
                }
            })
          }
        else
          {
            res.status(404).send({message : "Invalid Username"})
          }
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send({message :" some problem"});
        }
    })

    app.get("/foods",verifyToken,async(req,res)=>{    // fetching food

        try{
            let foods = await foodModel.find();
            res.send(foods);
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send({message :" some problem"});
        }
    })

    function verifyToken(req,res,next)             // creating middleware
    {
       //console.log(req.headers.authorization.split(" "));
       //res.send({message:"coming from middleware"})
       if(req.headers.authorization!==undefined)
       {
           let token = req.headers.authorization.split(" ")[1];
             
           jwt.verify(token,"nutrify",(err,data)=>{
            if(!err)
            {
                next();
            }
            else
            {
                res.send({message : "Invalid token"});
            }
           })
       }
       else
       {
        res.send({message : "please enter a token"})
       }
    }
   
    app.get("/foods/:name",verifyToken,async (req,res)=>{           // END POINT for fetching data by name     

        try 
        {
              let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}});
              if (foods.length!==0)
              {
              res.send(foods);
              }
              else
              {
                res.status(404).send({message:"food item not found"});
              }
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send({message :" some problem"});
        }
    })

    app.post("/track",verifyToken,async(req,res)=>{                        //END POINT for tracking food 
        let trackData = req.body;
        try
        {
            let data = await trackingModel.create(trackData);
            console.log(data)
            res.status(201).send({messge : "Food Added"});
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send({message :" some problem"});
        }        
    })

    app.get("/track/:userid/:date",async(req,res)=>{                   //END POINT FOR Fetching Food
        let userid = req.params.userid;
        let date = new Date (req.params.date);
        let strDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

        try{
            let foods = await trackingModel.find({userId : userid, eatenDate:strDate}).populate('userId').populate('foodId')
            res.send(foods);
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send({message :" some problem"});
        }        
    })



