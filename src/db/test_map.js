const mongoose = require('mongoose')

const testMapSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    marks:{
        type: Number,
        default: 0
    }, 
    marksOutOf :{
        type : Number,
        default :0
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    testconnect:{
        type :mongoose.Schema.Types.ObjectId
    }

},{
    timestamps: true
})



const TestMap = new mongoose.model('TestMap',testMapSchema)

module.exports= TestMap