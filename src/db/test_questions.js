const mongoose = require('mongoose')



const QuestionSchema = new mongoose.Schema({
    question : {
        type:String,
        required:true,


    },
    options:[String],
    correct_answer: {
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TestMap" 
    } 

})

QuestionSchema.methods.parse_into_question=  function (){
    const question=this
    const quesobject= question.toObject()

    delete quesobject.correct_answer
    delete quesobject.user
    delete quesobject.test
    delete quesobject.__v
    return quesobject
    
}


QuestionSchema.methods.parse_into_results= function(){
    const question=this
    const quesobject= question.toObject()
    delete quesobject.user
    delete quesobject.test
    delete quesobject.__v
    return quesobject
}

const Questions = new mongoose.model('Questions',QuestionSchema)

module.exports= Questions