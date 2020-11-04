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
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }
},{
    timestamps: true
})


const TestMap = new mongoose.model('TestMap',testMapSchema)

module.exports= TestMap