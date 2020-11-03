const mongoose = require('mongoose')

const testMapSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    }
})


const TestMap = new mongoose.model('TestMap',testMapSchema)

module.exports= TestMap