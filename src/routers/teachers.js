const express = require('express')
const router = new express.Router()
const Teacher = require('../db/teacher')
const TestMap = require('../db/test_map')
const auth = require('../middleware/autho')
const multer = require('multer')
const sharp = require('sharp')
const bodyParser = require('body-parser')
const Questions= require('../db/test_questions')
const { ObjectID } = require('mongodb')
const { Mongoose } = require('mongoose')


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
          goto: '/teachers',
          title: 'Error'
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
          name: user.name,
          title: 'Success'
          
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
       res.status(400).render("error404", {
         status: "400 :(",
         message: E,
         destination: "Teachers Page",
         goto: "/teachers",
         title: "Error",
       });
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
          goto: '/',
          title: 'Success'
 
       }) 
    }catch(e){
       res.status(500).render("error404", {
         status: "500 :(",
         message: "Error in Logging Out, " + e,
         destination: "Teachers Page",
         goto: "/teachers",
         title: "Error",
       });
    }
 })
 
 
 router.post('/teachers/logoutAll', auth('teachers'), async(req,res)=>{
    try{
       req.user.tokens = []
       await req.user.save()
       res.clearCookie('token')
       res.render("tempPage", {
         message: "You have Logged Out successfully from all your Devices",
         destination: "Home Page",
         goto: "/",
         title: "Success",
       });
    }catch(e){
       res.status(500).render("error404", {
         status: "500 :(",
         message: "Error in Logging Out, " + e,
         destination: "Teachers Page",
         goto: "/teachers",
         title: "Error",
       });
    }
 })
 //////////////////

 router.get('/teachers/profile/patch', auth('teachers'), async (req,res)=>{
   try{
      res.render("update_teachers", {
        title: "Update Teacher Profile",
        goto: "/teachers/profile/patch",
        type: "teachers",
        type_str: JSON.stringify("teachers"),
        name: req.user.name,
      });
   }catch(e){
      res.status(500).render(e)
   }  
 })

router.post('/teachers/profile/patch', auth('teachers'), async (req, res)=>{
  const allowedUpdates = ['name','age','email','password','subject']
  const updates = Object.keys(req.body)
  console.log(req.body)

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

     res.status(200).render("tempPage", {
       name: req.user.name,
       message: "Profile Data Updated",
       goto: "/teachers/dashboard",
       destination: "Dashboard",
       title: "Success",
     });
  }

  catch(e){
     return res.render("error404", {
       status: "400",
       message: e + "Unable to Update Profile Data. Please Try Again",
       goto: "/teachers/dashboard",
       destination: "Dashboard",
       title: "Error",
     });
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
   try{
      const teacher_tests = await TestMap.find({teacher:req.user._id})
      //getting filtered data about test
      let test_filtered = []
      teacher_tests.forEach((test)=>{
         test_filtered.push(test.filterForDashboard())
      })


      res.render('dashboard_teachers', { name: req.user.name,
      type:'teachers',
      type_str:JSON.stringify(req.user_type),
      title: 'Teacher Dashboard',
      tests: JSON.stringify(test_filtered)
      })
   }catch(e){
      console.log(e)
      res.status(500).send()
   }
 })
 
 // FILE UPLOADS


 router.get("/teachers/createtest", auth("teachers"), (req, res) => {
   res.render("test_create", { title: "New Test", name:req.user.name, });
 });


 router.post('/teachers/createtest',auth('teachers'),async (req,res)=> {
    try{
      const questions = req.body
      const quesNo = questions
      let questionCount = 0
      for(i=1;questions['q'+i]!==undefined;i++){
         questionCount++;
      }
      const test_map= new TestMap({name:questions['testName'],subject:req.user.subject,teacher:req.user._id,marksOutOf:questionCount})
      await test_map.save()
      console.log(test_map)
      for(i=1;questions['q'+i]!==undefined;i+=1)
      { var options=[]
         for(j=1;j<=4;j++)
         {
            options.push(questions['o'+i+j])
         }
         const ques =new  Questions( {question:questions['q'+i],options,correct_answer:questions['c'+i],test:test_map._id})
         await ques.save()
         console.log(ques)
      }
      
      res.redirect('/teachers/testsaved')
   }catch(e){
      console.log(e)
      res.render("tempPage", {
        name: req.user.name,
        message: "Error in test Creation",
        goto: "/teachers/dashboard",
        destination: "Dashboard",
        title: "Error",
      });
   }
 })

router.get('/teachers/testsaved',auth('teachers'),(req,res)=>{   
   res.render("tempPage", {
   name: req.user.name,
   message: "Test Saved Successfully",
   goto: "/teachers/dashboard",
   destination: "Dashboard",
   title: "Success",
   });
})



router.get('/teachers/edittest',auth('teachers'),async (req,res)=>{
   try{
      const questions = await Questions.find({test:ObjectID(req.query.value)})
      let test_map = await TestMap.findOne({_id: ObjectID(req.query.value), teacher : ObjectID(req.user._id)}) 
      let testData = {}
      questions.forEach((question,currq)=>{
         testData[`q${currq+1}`] = question.question
         testData[`c${currq+1}`] = question.correct_answer
         question.options.forEach((option,curro)=>{
            testData[`o${currq+1}${curro+1}`] = option
         })
      })
      testData['totalQuestions'] = questions.length
      testData['testName'] = test_map.name

      res.render("test_edit", { title: "Edit Test", name:req.user.name, 
                                 testData : JSON.stringify(testData), testValue : req.query.value});

   }catch(e){
      console.log(e)
      return res.render("error404", {
         status: "400",
         message: "Unable to Update Test. Please Try Again",
         goto: "/teachers/dashboard",
         destination: "Dashboard",
         title: "Error",
       });
   }
})

router.post('/teachers/edittest',auth('teachers'), async(req,res)=>{
   try{
      const questions = req.body
      let questionCount = 0
      for(i=1;questions['q'+i]!==undefined;i++){
         questionCount++;
      }
      const test_map= await  TestMap.findOneAndUpdate({teacher:req.user._id,_id:ObjectID(req.query.value)},{marksOutOf:questionCount,name:questions.testName})
      console.log(test_map)
      await Questions.deleteMany({test:ObjectID(req.query.value)})
      for(i=1;questions['q'+i]!==undefined;i+=1)
      { var options=[]
         for(j=1;j<=4;j++)
         {
            options.push(questions['o'+i+j])
         }
         const ques =new  Questions( {question:questions['q'+i],options,correct_answer:questions['c'+i],test:test_map._id})
         await ques.save()
      }    
      res.redirect('/teachers/testsaved')

   }catch(e){
      console.log(e)
      res.render("tempPage", {
        name: req.user.name,
        message: "Error in Saving Test",
        goto: "/teachers/dashboard",
        destination: "Dashboard",
        title: "Error",
      });
   }
})


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


router.get('/teachers/profile', auth('teachers'), async(req,res)=>{

   if(!req.user){
      throw new Error()
   }
   const noTests = await TestMap.count({teacher : req.user._id})
   
   if(!req.user.avatar){
      var pic = "Profile Picture Not Uploaded"
   }else{
      var pic = req.user.avatar.toString('base64')
   }
   res.render('profile_teachers', {
      title : 'Teacher Profile',
      type: 'teachers',
      type_js:JSON.stringify('teachers'),
      subject:subject_key[req.user.subject],
      name : req.user.name,
      noTests,
      diffString: 'Created',
      pic : JSON.stringify(pic)
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
      goto: '/teachers/profile/patch',
      title: 'Error'
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
         goto: '/teachers/profile',
         title: 'Error'
      })
   } 
 }) 
 
 ////////////////////////////////////////////
 
 ////////////////////////////////////////////
 module.exports = router
