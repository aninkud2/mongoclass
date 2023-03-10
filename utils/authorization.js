const jwt = require('jsonwebtoken')
const AddUser =require('../models/Adduser')
const dotenv =require('dotenv')
dotenv.config({path: './config/config.env'})

const isSignIn = async (req, res, next) => {
        const userid = req.params.id;
        const user = await AddUser.findById(userid)
        // console.log(user);
        const authToken = user.token;
        if(!authToken) return res.status(401).json({message: "Not authorized"});
                
       jwt.verify(authToken, process.env.JWTTOKEN, (err, payload)=>{
         if(err) return res.status(401).json({message: err.message})
            req.user = payload
            next()
            ; 
        })        
}

const IsAdminAuth = (req, res, next)=>{
    isSignIn(req, res, ()=>{
       
        if(req.user.IsAdmin){
            next()
        }else{
            res.status(403).json({message: "You are not an admin"})
        }
    })
}

module.exports = {IsAdminAuth}