const express = require('express')
const router = new express.Router()
const Student = require('../db/student')
const auth = require('../middleware/autho')
const multer = require('multer')
const sharp = require('sharp')
const Questions= require('../db/test_questions')
const TestMap = require('../db/test_map')


const bodyParser = require('body-parser')
//const { findOne } = require('../db/student')

//const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
////////////////////////

//public

const findTest = async (StudentId, TestId)=>{
   const questions = await Questions.find({test : TestId, user: StudentId})
   return questions
}

router.post('/students/register', async (req, res)=>{
  
   const alreadyPresent = await Student.findOne({email: req.body.email})
   if(alreadyPresent){
      return res.status(400).render('error404',{
         status:'400',
         message: 'E-mail already registered.',
         goto: '/students',
         destination: 'Students Page'
      })
   }
   try{
      const user = new Student(req.body)
      await user.save() 
      //sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.cookie('token',token,{
         maxAge:1000*60*60,
         httpOnly:true

      })
      res.status(201).render('tempPage',{
         
         message: 'You are successfully Registered as a Student.',
         goto: '/students/dashboard',
         destination: 'Dashboard',
         name: user.name
         
      })
   }catch(e){
      res.status(400).render('error404',{
         status:'400 :(',
         message: 'Error Occurred while generating Token',
         goto: '/students',
         destination: 'Students Page'
      })
   }

 })

 router.post('/students/login', async (req,res)=>{
   try{    
      const user = await Student.findByCredentials(req.body.email, req.body.password)  
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
         message: E,
         goto: '/students',
         destination: 'Students Page'
      })
    }
 })



////////////////////////////////////////
//private

router.post('/students/logout', auth('students'), async (req,res)=>{
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
         goto: '/students',
         destination: 'Students Page'
      })
   }
})


router.post('/students/logoutAll', auth('students'), async(req,res)=>{
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
         goto: '/students',
         destination: 'Students Page'
      })
   }
})

/////////////////////////////////

 router.get('/students/me', auth('students'), async (req,res)=>{
    try{
       res.send(req.user)
    }catch(e){
       res.status(500).render(e)
    }  
  })
 
 router.patch('/students/me', auth('students'), async (req, res)=>{
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

 router.delete('/students/me', auth('students'), async (req, res)=>{
   try{
      //sendCancellationEmail(req.user.email, req.user.name)
      await req.user.remove()
      res.send(req.user)
   }catch(e){
      res.status(500).send()
   }
})

router.get('/students/dashboard',auth('students') ,async (req,res)=> {
    res.render('dashboard', { name: req.user.name, type: 'students'})
})

router.post('/students/test', auth('students'), async (req,res)=>{ 
/* DATA to Process:
questions:
[
  {
    options: [ 'Russia', 'China', 'United States of America', 'Canada' ],
    _id: 5fa0f74c65955923445689e7,
    question: 'What country is the second largest in the world by area?',
    correct_answer: 'Canada',
    user: 5f992186a27c242bd4a0a467,
    test: 5fa0f74c65955923445689e6,
    __v: 0
  },..]
    for(x in questions){
       x = questions[x];
    }
req.body:
 {
   '5fa0fecf65b8b72a58c65ae9': 'Indonesia',
   '5fa0fecf65b8b72a58c65aea': '6',
   '5fa0fecf65b8b72a58c65af8': 'Sickle',
   '5fa0fecf65b8b72a58c65af9': '8',
   '5fa0fecf65b8b72a58c65afa': '8'
 }
  */
 
   const questions = await findTest(req.user._id, req.cookies.test)
   console.log(req.body)
   //to-do: generate results -- req.body
   
   res.render('tempPage', {
      name : 'Test Completed',
      message : 'You have Successfully Completed The Test. Check Results :',
      goto: '/students/results/:' + req.cookies.test._id,
      destination: 'Results Page'
   })
})


//to-do: 
//fix router positions
//remove MongoClient
////////////////////////////////////
// FILE UPLOADS

const uploadS = multer({
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

router.post('/students/me/avatar', auth('students'), uploadS.single('avatar'), async (req,res)=>{
  
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save() 
  res.send()
}, (error, req, res, next)=>{
   res.status(400).send({error: error.message})
})

router.delete('/students/me/avatar', auth('students'), async (req,res)=>{
   req.user.avatar = undefined 
   await req.user.save()
   try{
      res.send()
   }catch(e){
      res.status(400).send(e)
   } 
   
 }) 
 

router.get('/students/me/avatar', auth('students'), async (req,res)=>{
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