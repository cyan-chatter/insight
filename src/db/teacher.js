const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secretKey = process.env.JWT_SECRET||'TotalOverdose'

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        validate(value){
             if(value<0){
             throw new Error('Age must be a positve number')}
         }
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

// teacherSchema.virtual('tasks',{
//      ref: 'Task',
//      localField: '_id',
//      foreignField: 'owner'
// })



teacherSchema.statics.findByCredentials = async (email, password) =>{
    const teacher = await Teacher.findOne({ email })
    
    if(!teacher){
        throw new Error('E-mail not registered')
    }
    const isMatch = await bcrypt.compare(password, teacher.password)
    
    if(!isMatch){
        throw new Error('Incorrect Password')
    }

    return teacher
}

teacherSchema.methods.generateAuthToken = async function (){
    const teacher = this
    const token = jwt.sign({_id: teacher._id.toString()},secretKey)
    teacher.tokens = teacher.tokens.concat({token})
    await teacher.save()
    return token 
}

teacherSchema.methods.toJSON = function(){
    const teacher = this
    const studentObject = teacher.toObject()
    delete studentObject.password
    delete studentObject.tokens
    delete studentObject.avatar
    return studentObject
}


//hash the password before saving
teacherSchema.pre('save',async function(next){
    const teacher = this
    if(teacher.isModified('password')){
        teacher.password = await bcrypt.hash(teacher.password, 8)
    }
    next()

})

// teacherSchema.pre('remove', async function(next){
//     const teacher = this
//     await Task.deleteMany({owner: teacher._id})
//     next()
// })


const Teacher = mongoose.model('Teacher',teacherSchema)

module.exports = Teacher