const mongoose = require('mongoose')
require("datejs")

const testMapSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
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
    const timestamp  = new Date(test.updatedAt)
    let created = timestamp.toString("dd MMM yyyy")
    const today = Date.today().toString("dd MMM yyyy")
    if(created==today){
        created = timestamp.toString("hh:mm tt")
    }
    return {value:test._id,name:test.name,questions:test.marksOutOf,created}
}


const TestMap = new mongoose.model('TestMap',testMapSchema)

module.exports= TestMap