const express = require('express')
const router = new express.Router()
const User = require('../db/student')
const auth = require('../middleware/authStudent')
const multer = require('multer')
const sharp = require('sharp')

const parser = require('../middleware/parser')
const bodyParser = require('body-parser')
//const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
////////////////////////

//public



router.post('/students/register', async (req, res)=>{
  

   const alreadyPresent = await User.findOne({email: req.body.email})
   if(alreadyPresent){
      return res.status(400).render('error404',{
         status:'400',
         message: 'E-mail already registered.'
      })
   }
   try{
      const user = new User(req.body)
      
      
      await user.save() 
      //sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.cookie('token',token,{
         maxAge:1000*60*60,
         httpOnly:true

      })
      res.status(201).render('studentHome',{
         
         message: 'You are successfully Registered as a Student.'
      })
   }catch(e){
      res.status(400).render('error404',{
         status:'400 :(',
         message: 'Error Occurred while generating Token'
      })
   }

 })

 router.post('/students/login', async (req,res)=>{
   try{    
      const user = await User.findByCredentials(req.body.email, req.body.password)  
      const token = await user.generateAuthToken()
      res.cookie('token',token,{
         maxAge:3600000,
         httpOnly:true
      })
      res.redirect('/students/dashboard')
    }catch(e){
      const E = e.toString() 
      res.status(400).render('error404',{
         status:'400 :(',
         message: E
      })
    }
 })



////////////////////////////////////////
//private

router.post('/students/logout', auth, async (req,res)=>{
   try{
      req.user.tokens = req.user.tokens.filter((t)=>{
         return t.token !== req.token
      })
      await req.user.save()
      res.clearCookie('token')
      res.send('You have logged out successfully') 
   }catch(e){
      res.status(500).send()
   }
})


router.post('/students/logoutAll', auth, async(req,res)=>{
   try{
      req.user.tokens = []
      await req.user.save()
      res.clearCookie('token')
      res.send('You have successfully Logged Out from All your Devices')
   }catch(e){
      res.status(500).send()
   }
})



 router.get('/students/me', auth, async (req,res)=>{
    try{
       res.send(req.user)
    }catch(e){
       res.status(500).send(e)
    } 
 
  })
 

 router.patch('/students/me', auth, async (req, res)=>{
   const allowedUpdates = ['name','email','password','age']
   const updates = Object.keys(req.body)
   const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
   })

   if(!isValidOperation){
      return res.status(400).send({ error: 'Invalid Updates!'})
   }

   try{
     
      updates.forEach((update)=>{
        req.user[update] = req.body[update]
      }) 

      await req.user.save()       
      res.status(200).send(req.user)
   }

   catch(e){
      return res.status(400).send(e)
   }
   
})

 router.delete('/students/me', auth, async (req, res)=>{
   try{
      //sendCancellationEmail(req.user.email, req.user.name)
      await req.user.remove()
      res.send(req.user)
   }catch(e){
      res.status(500).send()
   }
})

router.get('/students/dashboard',auth ,async (req,res)=> {
    res.render('dashboard', { name: req.user.name})
})
////////////////////////////////////
// FILE UPLOADS

const upload = multer({
   //dest: 'avatars',
   limits: {
       fileSize: 1000000
   },
   fileFilter(req,file,cb){
      
      if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
      return cb(new Error('File must be a an Image'))
    }
      cb(undefined, true)
   }
   
})

router.post('/students/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
  
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save() 
  res.send()
}, (error, req, res, next)=>{
   res.status(400).send({error: error.message})
})

router.delete('/students/me/avatar', auth, async (req,res)=>{
   req.user.avatar = undefined 
   await req.user.save()
   try{
      res.send()
   }catch(e){
      res.status(400).send(e)
   } 
   
 }) 
 

router.get('/students/me/avatar', auth, async (req,res)=>{
   try{
      
      if(!req.user || !req.user.avatar){
         throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(req.user.avatar)
   } catch(e){
      res.status(404).send()
   }
})

////////////////////////////////////////////

////////////////////////////////////////////
module.exports = router