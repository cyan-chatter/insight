const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const express = require('express')
const app = express()
const userRouter = require('./routers/students')
app.use(express.json())
app.use(userRouter)
//const utils = require('../utils')
// const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json())



//port value
const port = process.env.PORT || 3000

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
app.get('/',(req, res) => {
    res.render('face', {
        title: 'INSIGHT',
        subtitle: 'Stream Analysis by Online Aptitude Tests'
    })
})

app.get('/students',(req,res) =>{
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

app.get('/students/register', (req,res)=>{
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

app.get('/students/login', (req,res)=>{
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


app.get('*',(req,res)=>{
    res.render('error404',{
        status: '404',
        message: 'Page Not Found' 
    })
})


app.listen(port, () => {
    console.log('Server is Up on port ' + port)
})
