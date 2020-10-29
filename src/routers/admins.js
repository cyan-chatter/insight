const express = require('express')
const router = new express.Router()
const Admin = require('../db/admin')
const adminEmails = require('../db/adminEmails')
const auth = require('../middleware/autho')
const multer = require('multer')
const sharp = require('sharp')
const bodyParser = require('body-parser')

router.post('/admins/register', async (req, res)=>{
  
   const alreadyPresent = await Admin.findOne({email: req.body.email})
   if(alreadyPresent){
      return res.status(400).render('error404',{
         status:'400',
         message: 'E-mail already registered.',
         goto: '/admins',
         destination: 'Admins Page'
      })
   }

   const validAdmin = await adminEmails.findOne({aEmail: req.body.email})
   if(!validAdmin){
      return res.status(400).render('error404',{
         status:'400',
         message: 'This is Not a Valid Admin email!',
         goto: '/admins',
         destination: 'Admins Page'
      })
   }

   try{
      const user = new Admin(req.body)
      await user.save() 
      const token = await user.generateAuthToken()
      res.cookie('token',token,{
         maxAge:1000*60*60,
         httpOnly:true

      })
      res.status(201).render('tempPage',{
         message: 'You are successfully Registered as an Admin.',
         goto: '/admins/dashboard',
         destination: 'Dashboard',
         name: user.name
      })
   }catch(e){
      res.status(400).render('error404',{
         status:'400 :(',
         message: 'Error Occurred while generating Token',
         goto: '/admins',
         destination: 'Admins Page'
      })
   }

 })


router.post('/admins/login', async (req,res)=>{
    try{    
       const user = await Admin.findByCredentials(req.body.email, req.body.password)  
       const token = await user.generateAuthToken()
       res.cookie('token',token,{
          maxAge:3600000,
          httpOnly:true
       })
       res.redirect('/admins/dashboard')
     }catch(e){
       const E = e.toString() 
       res.status(400).render('error404',{
          status:'400 :(',
          message: E,
          goto: '/admin',
          destination: 'Admin Page'
       })
     }
  })

  router.post('/admins/logout', auth('admins'), async (req,res)=>{
    try{
       req.user.tokens = req.user.tokens.filter((t)=>{
          return t.token !== req.token
       })
       await req.user.save()
       res.clearCookie('token')
       res.render('tempPage', {
          
          message: 'You have Logged Out successfully',
          destination: 'Home Page',
          goto: '/'
 
       }) 
    }catch(e){
       res.status(500).render('error404',{
          status:'500 :(',
          message: 'Error in Logging Out, ' + e,
          goto: '/admins',
          destination: 'Admins Page'
       })
    }
 })
 
 
 router.post('/admins/logoutAll', auth('admins'), async(req,res)=>{
    try{
       req.user.tokens = []
       await req.user.save()
       res.clearCookie('token')
       res.render('tempPage', {
          
          message: 'You have Logged Out successfully from all your Devices',
          destination: 'Home Page',
          goto: '/'
       })
    }catch(e){
       res.status(500).render('error404',{
          status:'500 :(',
          message: 'Error in Logging Out, '+ e,
          goto: '/admins',
          destination: 'Admins Page'
       })
    } 
 })

 router.get('/admins/dashboard',auth('admins') ,async (req,res)=> {
    res.render('adminDashboard', { name: req.user.name})
})

 /////////////////////////
 module.exports = router