const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/students')
const auth = require('./middleware/authStudent')
const isloggedin = require('./middleware/isloggedin')
const app = express()


const cookieParser= require('cookie-parser')


//body Parser for parsing form data
const bodyParser = require('body-parser')

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser())
app.use(userRouter)


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
app.get('/', isloggedin, (req, res) => {
    
    
    res.render('face', {
        title: 'INSIGHT',
        subtitle: 'Stream Analysis by Online Aptitude Tests'
    })
   
  
})

app.get('/students',isloggedin,(req,res) =>{
    res.render('entry',{
        title: 'Students',
        login:'Student Login',
        register: 'Student Register',
        gotoLogin:'/students/login',
        gotoRegister:'/students/register'
    })
})

app.get('/teachers',(req,res) =>{
    res.render('entry',{
        title: 'Teachers',
        login:'Teacher Login',
        register: 'Teacher Register',
        gotoLogin:'/teachers/login',
        gotoRegister:'/teachers/register'
    })
})

app.get('/admins',(req,res) =>{
    res.render('adminEntry',{
        login:'Admin Login',
        title:'Admin',
        gotoLogin:'/admins/login'
    })
})

app.get('/students/register',isloggedin, (req,res)=>{
    res.render('register',{
        title: 'Student Registeration',
        goto: '/students/register'
    })
})



app.get('/teachers/register', (req,res)=>{
    res.render('register',{
        title: 'Teacher Registeration',
        goto:'/teachers/register'
    })
})

app.get('/students/login',isloggedin, (req,res)=>{
    res.render('login',{
        title: 'Student Login',
        goto: '/students/login'
    })
})

app.get('/teachers/login', (req,res)=>{
    res.render('login',{
        title: 'Teacher Login',
        goto:'/teachers/login'
    })
})

app.get('/clcookie',(req,res) => {
    res.clearCookie('token')
    

    res.json({name:"sanu"})
}
)

app.get('/cookie',(req,res)=> {
    console.log(req.cookies)
    res.send("succes")
})

app.get('*',(req,res)=>{
    res.render('error404',{
        status: '404',
        message: 'Page Not Found' 
    })
})



app.listen(port, () => {
    console.log('Server is Up on port ' + port)
})
