const express = require('express')
const router = new express.Router()
const Teacher = require('../db/teacher')
const TestMap = require('../db/test_map')
const auth = require('../middleware/autho')
const multer = require('multer')
const sharp = require('sharp')
const bodyParser = require('body-parser')


//const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
////////////////////////

//public
var subject_key={'22':'Geography','19':'Mathematics','17':'Science and Nature','11':'Entertainment:Movies'}

router.post('/teachers/register', async (req, res)=>{
  

    const alreadyPresent = await Teacher.findOne({email: req.body.email})
    if(alreadyPresent){
       return res.status(400).render('error404',{
          status:'400',
          message: 'E-mail already registered.',
          destination: 'Teachers Page',
          goto: '/teachers'
       })
    }
    try{
       const user = new Teacher(req.body)
       
       await user.save() 
       //sendWelcomeEmail(user.email, user.name)
       const token = await user.generateAuthToken()
       res.cookie('token',token,{
          maxAge:1000*60*60,
          httpOnly:true
 
       })
       res.status(201).render('tempPage',{
          
          message: 'You are successfully Registered as a Teacher.',
          goto: '/teachers/dashboard',
          destination: 'Dashboard',
          name: user.name
          
       })
    }catch(e){
       res.status(400).render('error404',{
          status:'400 :(',
          message: 'Error Occurred while generating Token',
          destination: 'Teachers Page',
          goto: '/teachers'
       })
    }
 
  })
 
  router.post('/teachers/login', async (req,res)=>{
    try{    
       const user = await Teacher.findByCredentials(req.body.email, req.body.password)  
       const token = await user.generateAuthToken()
       res.cookie('token',token,{
          maxAge:3600000,
          httpOnly:true
       })
       res.redirect('/teachers/dashboard')
     }catch(e){
       const E = e.toString() 
       res.status(400).render('error404',{
          status:'400 :(',
          message: E,
          destination: 'Teachers Page',
          goto: '/teachers'
       })
     }
  })
 

 ////////////////////////////////////////
 //private
 

 router.post('/teachers/logout', auth('teachers'), async (req,res)=>{
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
        message: 'Error in Logging Out, '+ e,
        destination: 'Teachers Page',
        goto: '/teachers'
     })
    }
 })
 
 
 router.post('/teachers/logoutAll', auth('teachers'), async(req,res)=>{
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
        destination: 'Teachers Page',
        goto: '/teachers'
     })
    }
 })
 //////////////////

 router.get('/teachers/profile/patch', auth('teachers'), async (req,res)=>{
   try{
      res.render('update',{
         title: 'Teachers Update Profile',
         goto: '/teachers/profile/patch',
         type: 'teachers'
      })
   }catch(e){
      res.status(500).render(e)
   }  
 })

router.post('/teachers/profile/patch', auth('teachers'), async (req, res)=>{
  const allowedUpdates = ['name','age','email','password']
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every((update)=>{
     return allowedUpdates.includes(update)
  })

  if(!isValidOperation){
     return res.status(400).send({ error: 'Invalid Updates!'})
  }

  try{
     updates.forEach((update)=>{
       
       if(req.body[update]){
        req.user[update] = req.body[update]
       }
        
     }) 

     await req.user.save()       

     res.status(200).render('tempPage',{
        name: req.user.name,
        message: 'Profile Data Updated',
        goto: '/teachers/dashboard',
        destination: 'Dashboard'
     })
  }

  catch(e){
     return res.render('error404', {
        status: '400',
        message: e + 'Unable to Update Profile Data. Please Try Again',
        goto: '/teachers/dashboard',
        destination: 'Dashboard'
     })
  }
  
})

 
  router.delete('/teachers/me', auth('teachers'), async (req, res)=>{
    try{
       //sendCancellationEmail(req.user.email, req.user.name)
       await req.user.remove()
       res.send(req.user)
    }catch(e){
       res.status(500).send()
    }
 })
 
 router.get('/teachers/dashboard',auth('teachers') ,async (req,res)=> {
     res.render('dashboard', { name: req.user.name, type:'teachers',type_str:JSON.stringify('teachers')})
 })
 
 // FILE UPLOADS


 router.post('/teachers/createtest',auth('teachers'),async (req,res)=> {
    const questions = req.body
    const quesNo = questions
    console.log(questions)
    for(i=1;questions['q'+i]!==undefined;i+=1)
    { var options=[]
       for(j=1;j<=4;j++)
      {
         options.push(questions['o'+i+j])
      }
      const ques = {question:questions['q'+i],options,correct_answer:questions['c'+i]}
      console.log(ques)
    }
    const test = new TestMap({subject})
    res.redirect('/teachers/testcreated')
 })

 router.get('/teachers/testcreated',(req,res)=>{
    
    res.send("test Created")
 })

const uploadT = multer({
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


router.get('/teachers/profile', auth('teachers'), async(req,res)=>{

   if(!req.user){
      throw new Error()
   }
   const noTests = await TestMap.count({teacher : req.user._id})
   
   if(!req.user.avatar){
      var pic = "Profile Picture Not Uploaded"
   }else{
      var pic = req.user.avatar
   }

   res.render('profile', {
      title : 'Teachers Profile',
      type: 'teachers',
      name : req.user.name,
      noTests,
      diffString: 'Created',
      pic
   })
})


router.post('/teachers/profile/avatar', auth('teachers'), uploadS.single('avatar'), async (req,res)=>{
   
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  try{
   req.user.avatar = buffer
  await req.user.save() 
  res.redirect('/teachers/profile/patch')
  }
  catch{
   res.render('400',{
      message: 'Choose an image before Pressing Upload Button',
      status: '400',
      destination: 'Teachers Profile',
      goto: '/teachers/profile/patch'
   })
  }
  
}, (error, req, res, next)=>{
   res.status(400).send(error.message)
})

router.get('/teachers/profile/avatar/delete', auth('teachers'), async (req,res)=>{
   req.user.avatar = undefined 
   await req.user.save()
   try{
      res.redirect('/teachers/profile')
   }catch(e){
      res.render('400',{
         message: e,
         status: '400',
         destination: 'Teachers Profile',
         goto: '/teachers/profile'
      })
   } 
 }) 
 
 ////////////////////////////////////////////
 
 ////////////////////////////////////////////
 module.exports = router
