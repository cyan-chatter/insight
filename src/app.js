const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const express = require('express')
const studentRouter = require('./routers/students')
const teacherRouter = require('./routers/teachers')
const adminRouter = require('./routers/admins')
const auth = require('./middleware/autho')
const isloggedin = require('./middleware/isloggedin')
const Questions = require('./db/test_questions')
const api = require('../utils/js/api.js')
const app = express()
const cookieParser= require('cookie-parser')
//body Parser for parsing form data
const bodyParser = require('body-parser')

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser())
app.use(studentRouter)
app.use(teacherRouter)
app.use(adminRouter)

//port value
const port = process.env.PORT||3000

// paths
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views' )

//handlebars engine, partials and views paths
app.set('view engine', 'hbs')
app.set('views', viewsPath)
const partialsPath = path.join(__dirname, '../templates/partials' )
hbs.registerPartials(partialsPath)

// serving static directory
app.use(express.static(publicDirectoryPath))



//home routes
app.get('/', (req, res) => {
    
    res.render('face', {
        title: 'INSIGHT',
        subtitle: 'Stream Analysis by Online Aptitude Tests'
    })
   
})

app.get('/students',isloggedin('students'),(req,res) =>{
    res.render('entry',{
        title: 'Students',
        login:'Student Login',
        register: 'Student Register',
        gotoLogin:'/students/login',
        gotoRegister:'/students/register'
    })
})

app.get('/teachers',isloggedin('teachers'),(req,res) =>{
    res.render('entry',{
        title: 'Teachers',
        login:'Teacher Login',
        register: 'Teacher Register',
        gotoLogin:'/teachers/login',
        gotoRegister:'/teachers/register'
    })
})

app.get('/admins',(req,res) =>{
    res.render('entry',{
        title:'Admin',
        login:'Admin Login',
        gotoLogin:'/admins/login',
        register: 'Admin Register',
        gotoRegister: '/admins/register'
    })
})

app.get('/students/register',isloggedin('students'), (req,res)=>{
    res.render('register',{
        title: 'Student Registeration',
        goto: '/students/register'
    })
})


app.get('/students/test',auth('students'),async (req,res)=> {
     const category= req.query.category
    try{ 

        
         await api(category,async (questions)=>{

            

            const ques_arr = await questions.map(async (que)=>{
                
                que.incorrect_answers.push(que.correct_answer)
                var options = que.incorrect_answers
                

                const ques = {question:que.question,options,correct_answer:que.correct_answer}
                

                const result= new Questions({
                        ...ques,
                        user:req.user._id
        
                    })

                await result.save()
                    // each question gets saves to database with user id as parent field
                const quesParsed = result.parse_into_question()
                    
                 

                return quesParsed
               // returns question data to be displayed     
            })

             const ques= await Promise.all(ques_arr)
            
            res.render('test',{questions:JSON.stringify(ques)})
        })  
        }catch(e){
            res.send("error")
        } 
    
})



app.get('/teachers/register',isloggedin('teachers'), (req,res)=>{
    res.render('register',{
        title: 'Teacher Registeration',
        goto:'/teachers/register'
    })
})

app.get('/admins/register',(req,res)=>{
    res.render('adminReg',{
        title: 'Admin Registeration',
        goto:'/admins/register'
    })
})

app.get('/students/login',isloggedin('students'), (req,res)=>{
    res.render('login',{
        title: 'Student Login',
        goto: '/students/login'
    })
})

app.get('/teachers/login',isloggedin('teachers'), (req,res)=>{
    res.render('login',{
        title: 'Teacher Login',
        goto:'/teachers/login'
    })
})

app.get('/admins/login', (req,res)=>{
    res.render('login',{
        title: 'Admin Login',
        goto:'/admins/login'
    })
})

app.get('/clcookie',(req,res) => {
    res.clearCookie('token')
    res.json({name:"sanu"})
}
)

app.get('/cookie',(req,res)=> {
    console.log(req.cookies)
    res.send("success")
})

app.get('/testing/:id',  (req,res)=>{


    res.send(req.params.id)
    
    
    
})

app.get('*',(req,res)=>{
    res.render('error404',{
        status: '404',
        message: 'Page Not Found',
        destination: 'Home Page',
        goto: '/'
    })
})

app.listen(port, () => {
    console.log('Server is Up on port ' + port)
})
