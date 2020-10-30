const jwt = require('jsonwebtoken')
const User = require('../../src/db/teacher')
const cookieParser= require('cookie-parser')

const secretKey = process.env.JWT_SECRET || 'TotalOverdose'
// app.use((req,res,next)=>{
//     if(req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE'){
//         res.status(503).end('Request Temporarily Disabled. Server is Under Maintainance')
//     } else{
//        next()
//     }

// })

const auth = async(req, res, next)=>{
    try{ 
        const token = req.cookies.token
        const decoded = jwt.verify(token, secretKey)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        
        if (!user) {
        throw new Error()
        }
    req.token = token
    req.user = user
    next()

    }catch(e){
        console.log("Error")
        res.status(401).send('error: Please authenticate.You are not logged in')
    }
}

module.exports = auth