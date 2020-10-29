const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secretKey = process.env.JWT_SECRET||'TotalOverdose'

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('E-mail is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length<6){
                throw new Error('Password must have atleast 6 characters')
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain the Word : password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
}) 

// adminSchema.virtual('tasks',{
//      ref: 'Task',
//      localField: '_id',
//      foreignField: 'owner'
// })


adminSchema.statics.findByCredentials = async (email, password) =>{
    const admin = await Admin.findOne({ email })
    
    if(!admin){
        throw new Error('E-mail not registered')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    
    if(!isMatch){
        throw new Error('Incorrect Password')
    }

    return admin
}

adminSchema.methods.generateAuthToken = async function (){
    const admin = this
    const token = jwt.sign({_id: admin._id.toString()},secretKey)
    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token 
}

adminSchema.methods.toJSON = function(){
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.password
    delete adminObject.tokens
    delete adminObject.avatar
    return adminObject
}


//hash the password before saving
adminSchema.pre('save',async function(next){
    const admin = this
    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()

})

// adminSchema.pre('remove', async function(next){
//     const admin = this
//     await Task.deleteMany({owner: admin._id})
//     next()
// })


const Admin = mongoose.model('Admin',adminSchema)

module.exports = Admin