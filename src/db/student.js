const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const secretKey = process.env.JWT_SECRET||'TotalOverdose'
console.log(process.cwd())
const default_image= fs.readFileSync(process.cwd()+"/utils/img/cat.jpg")

const studentSchema = new mongoose.Schema({
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
        type: Buffer,
        default : default_image
    }
},{
    timestamps: true
}) 

// studentSchema.virtual('tasks',{
//      ref: 'Task',
//      localField: '_id',
//      foreignField: 'owner'
// })



studentSchema.statics.findByCredentials = async (email, password) =>{
    const student = await Student.findOne({ email })
    
    if(!student){
        throw new Error('E-mail not registered')
    }
    const isMatch = await bcrypt.compare(password, student.password)
    
    if(!isMatch){
        throw new Error('Incorrect Password')
    }

    return student
}

studentSchema.methods.generateAuthToken = async function (){
    const student = this
    const token = jwt.sign({_id: student._id.toString()},secretKey)
    student.tokens = student.tokens.concat({token})
    await student.save()
    return token 
}

studentSchema.methods.toJSON = function(){
    const student = this
    const studentObject = student.toObject()
    delete studentObject.password
    delete studentObject.tokens
    delete studentObject.avatar
    return studentObject
}


//hash the password before saving
studentSchema.pre('save',async function(next){
    const student = this
    if(student.isModified('password')){
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()

})

// studentSchema.pre('remove', async function(next){
//     const student = this
//     await Task.deleteMany({owner: student._id})
//     next()
// })


const Student = mongoose.model('Student',studentSchema)

module.exports = Student