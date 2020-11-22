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
const TestMap = require('./db/test_map')

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

app.set('subject_key',{'22':'Geography','19':'Mathematics','17':'Science and Nature','11':'Entertainment:Movies'})
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
hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
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
        goto: '/students/register',
        type: JSON.stringify('students')
    })
})






app.get('/teachers/register',isloggedin('teachers'), (req,res)=>{
    res.render('register',{
        title: 'Teacher Registeration',
        goto:'/teachers/register',
        type: JSON.stringify('teachers')
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

app.get('/teachers/createtest',auth('teachers'),(req,res)=>{
    
    res.render('test_create')
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
