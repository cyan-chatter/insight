const express = require('express')
const router = new express.Router()
const Student = require('../db/student')
const api = require('../../utils/js/api.js')
const auth = require('../middleware/autho')
const multer = require('multer')
const sharp = require('sharp')
const Questions= require('../db/test_questions')
const TestMap = require('../db/test_map')
const bodyParser = require('body-parser')
const { findById } = require('../db/student')
const { ObjectID } = require('mongodb')
//const { findOne } = require('../db/student')

//const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
////////////////////////

//public

function shuffleArray(array) {
   for (var i = array.length - 1; i > 0; i--) {
       var j = Math.floor(Math.random() * (i + 1));
       var temp = array[i];
       array[i] = array[j];
       array[j] = temp;
   }
}  


var subject_key={'22':'Geography','19':'Mathematics','17':'Science and Nature','11':'Entertainment:Movies'}

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
      res.render('error404',{
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
      res.render('error404',{
         status:'500 :(',
         message: 'Error in Logging Out, '+ e,
         goto: '/students',
         destination: 'Students Page'
      })
   }
})

/////////////////////////////////

 router.get('/students/profile/patch', auth('students'), async (req,res)=>{
    try{
       res.render('update',{
          title: 'Students Update Profile',
          goto: '/students/profile/patch',
          type: 'students',
          type_str: JSON.stringify('students')
       })
    }catch(e){
       res.status(500).render(e)
    }  
  })
 
 router.post('/students/profile/patch', auth('students'), async (req, res)=>{
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
         goto: '/students/dashboard',
         destination: 'Dashboard'
      })
   }

   catch(e){
      return res.render('error404', {
         status: '400',
         message: e + 'Unable to Update Profile Data. Please Try Again',
         goto: '/students/dashboard',
         destination: 'Dashboard'
      })
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
    res.render('dashboard', { name: req.user.name, type: 'students', type_str:JSON.stringify(req.user_type),goto: '/students/results', destination: 'Results', goto2: '/students/profile', destination2: 'Profile'})
})

router.get('/students/pretest',auth('students'),async (req,res)=> {
   const teacher_tests = await TestMap.find({subject:req.query.category})
   var tests = []
   teacher_tests.forEach((test)=>{
      if(test.teacher && !test.student){
         tests.push(test)
      }
   })
   
   res.render('pretest_page',{goto:'/students/test', 
                           test_list:JSON.stringify(tests),
                           subject: req.query.category})
})

router.get('/students/test',auth('students'),async (req,res)=> {
   const category= req.query.testchoice
  
  try{ 
       
       if( subject_key[category])
       {
       await api(category,async (questions,category)=>{
          const test = new TestMap({subject: category})
          await test.save() 
        
          const ques_arr = await questions.map(async (que)=>{
              
              que.incorrect_answers.push(que.correct_answer)
              var options = que.incorrect_answers
              shuffleArray(options)
              

              const ques = {question:que.question,options,correct_answer:que.correct_answer}
             
              
              const result= new Questions({
                      ...ques,
                      user: req.user._id,
                      test: test._id
                  })

              await result.save()
                  // each question gets saved to database with user id as parent field
              const quesParsed = result.parse_into_question()
                  
              res.cookie('test',test,{
                  maxAge:1000*60*60,
                  httpOnly:true
               })
              
              return quesParsed
             // returns question data to be displayed     
          })

           const ques= await Promise.all(ques_arr)
          
          res.render('test',{questions:JSON.stringify(ques)})
      })
      }  
      else{
         
         const test_map = await TestMap.findById(req.query.testchoice)
         const questions = await Questions.find({test:ObjectID(req.query.testchoice)})
         var parsed_questions=[]
         const test = new TestMap({subject: test_map.subject})
          test.student= req.user._id
          test.testconnect= ObjectID(category)
          await test.save()
          
          res.cookie('test',test,{
            maxAge:1000*60*60,
            httpOnly:true
         })
         
         questions.forEach(question => {
            parsed_questions.push(question.parse_into_question())
         })
         res.render('test',{questions:JSON.stringify(parsed_questions)})
         
      }
      
      }catch(e){
         
         res.send(e)

      } 
  
})



router.post('/students/test', auth('students'), async (req,res)=>{ 
   var questions
   console.log(req.cookies.test)
   //const questions = await findTestQuestions( req.cookies.test)
   if(req.cookies.test.testconnect){
   questions = await Questions.find({test : req.cookies.test.testconnect})
   }
   else{
   questions = await Questions.find({test :req.cookies.test._id})
   }
   
   //to-do: generate results -- req.body
   const problems = Object.keys(req.body)
   // problems is array of Question IDs now
   //works
   const answers = Object.values(req.body)
   // answers is array of Answer values now
   //works
   
   var correct = []
   const len = problems.length
   //works
   for(var i=0; i<len; ++i){
      correct[i] = 0;
   }

   var attempted = []
   for(var i in questions){
      attempted[i] = 0
   }
   
   const Test = await TestMap.findById(req.cookies.test) //works
   Test.marks=0
   
   for(var x in questions){  
     for(var i=0; i<len; ++i){   //Works but some Error might be present
      if(problems[i] === questions[x]._id.toString()){
         attempted[x] = 1

         if(answers[i] === questions[x].correct_answer){
            Test.marks += 1
            correct[i] = 1 
         } 
      }   
     }
   }
   if(Test.marks < 0){
      Test.marks = 0
   }
   Test.student = req.user._id
   Test.marksOutOf= questions.length
   await Test.save() 
   console.log(Test)

   res.render('testResults', {
      message : 'You have Successfully Completed The Test. Here are the Results.',
      totalMarks : JSON.stringify(Test.marks),
      correctMap : JSON.stringify(correct),
      ans: JSON.stringify(answers),
      ques : JSON.stringify(questions),
      prob : JSON.stringify(problems),
      att : JSON.stringify(attempted)
   })

})


router.get('/students/results',auth('students') ,async (req,res)=>{
   const Tests = await TestMap.find({student : req.user._id})
   try{
      const marksArr = []
      const subArr = []
      const timeObjArr = []

      for(var t in Tests){
         marksArr[t] = Tests[t].marks
         subArr[t] = Tests[t].subject
         timeObjArr[t] = Tests[t].createdAt
      }

      var subjects = [...subArr]
      var points = [...marksArr]

      for(var i=0; i<subjects.length; ++i){
         var streamTemp = subjects[i]
         for(var j=i+1; j<subjects.length; ++j){
            if(subjects[j] === streamTemp && subjects[j] !== '-1'){
               points[i] = Math.max(points[i], points[j])
               subjects[j] = '-1'
            }
         }
      }

   var maxPt=points[0]
   var streamIndex = 0
   for(var i=1; i<points.length; ++i){
      if(maxPt < points[i] && subjects[i] !== '-1'){
         maxPt = points[i]
         streamIndex = i
      }
   }

   var stream = subjects[streamIndex]
      res.cookie('stream',stream,{
         maxAge:3600000,
         httpOnly:true
      })

      res.render('results', {marks : marksArr, subcode : subArr, time: timeObjArr})
   }
   catch(e){
      console.log(e)
   }
})

router.get('/students/stream',auth('students') ,async (req,res)=>{
   res.render('stream',{conclusion: req.cookies.stream,subject_key:JSON.stringify(subject_key)})
})





////////////////////////////////////
//to-do-list: (and we thought we were almost done with this project....)
//render the Results Page HTML
//make a map of subject-string to subject-code and render the subject string on 'stream' view
//fix router positions in the code
//make enter subjects form to be displayed just after Register --give option to enter subjects in order of preference
//on dashboard, show only those subjects for creating test which were entered in the subjects form
//in the profile section, give an option to the student to add more subjects and as more subjects are added along with their preference number, Those subjects get also displayed in the Create Test Option in Dashboard
//lock the button for generating stream recommendation until atleast 1 test of all the subjects selected are completed
//Once Create Test Form is Submitted, Add a page in between which gives the user an option to select either API Test or Teacher test. If no Teacher test is available, lock that option
//figure out a way to download a web page and Make option to Download the web page in PDF form
//add login via google and login via facebook 
//figure out a way to calculate the stream not only on the basis of max marks but also providing some weightage to the preference number provided to each subject 
//teacher gets a page to view the tests created by him --on that page, teacher also gets options to Edit and Delete a test
//student on Results page, gets options to remove a particular test or all the tests -> remember to lock the Generate Stream Button if the required tests get deleted.    
//On the Test page, add an option to clear selection (either by clicking the same option again or a button after the options)  

////////////////////////////////////
// FILE UPLOADS

//STUDENTS
router.get('/students/profile', auth('students'), async(req,res)=>{

   if(!req.user){
      throw new Error()
   }
   const noTests = await TestMap.count({student : req.user._id})
   
   if(!req.user.avatar){
      var pic = "Profile Picture Not Uploaded"
   }else{
      var pic = req.user.avatar.toString('base64')
   }

   res.render('profile', {
      title : 'Student Profile',
      type: 'students',
      name : req.user.name,
      noTests,
      diffString: 'Attempted',
      pic:JSON.stringify(pic)
   })
})


const uploadS = multer({
   //dest: 'avatars',
   limits: {
       fileSize: 5000000
   },
   fileFilter(req,file,cb){
      
      if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
      return cb(new Error('File must be a an Image'))
    }
      cb(undefined, true)
   }
   
})

router.post('/students/profile/avatar', auth('students'), uploadS.single('avatar'), async (req,res)=>{
   
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  try{
   req.user.avatar = buffer
   
  await req.user.save() 
  res.redirect('/students/profile/patch')
  }
  catch{
   res.render('400',{
      message: 'Choose an image before Pressing Upload Button',
      status: '400',
      destination: 'Students Profile',
      goto: '/students/profile/patch'
   })
  }
  
}, (error, req, res, next)=>{
   res.status(400).send(error.message)
})

router.get('/students/profile/avatar/delete', auth('students'), async (req,res)=>{
   req.user.avatar = undefined 
   await req.user.save()
   try{
      res.redirect('/students/profile/patch')
   }catch(e){
      res.render('400',{
         message: e,
         status: '400',
         destination: 'Students Profile',
         goto: '/students/profile/patch'
      })
   } 
 }) 
 

////////////////////////////////////////////

 

////////////////////////////////////////////


////////////////////////////////////////////
module.exports = router