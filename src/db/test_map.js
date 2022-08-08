const mongoose = require('mongoose')
const parsedDate = require('../../utils/js/dateparser.js')

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

testMapSchema.methods.filterForDashboard = function (){
    const test = this
    const date = Date.parse(test.createdAt)
    let created = parsedDate(Date.parse(test.createdAt),"dd MMM yyyy")
    return {value:test._id,name:"",questions:test.marksOutOf,created}
}


const TestMap = new mongoose.model('TestMap',testMapSchema)

module.exports= TestMap