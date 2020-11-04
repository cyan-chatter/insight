console.log('Answers: ' + answers)

const generateDOM = document.querySelector('.generate')
const headDOM = document.getElementById('head')
const questionDOM = document.querySelector('.question')
const optionsDOM = document.querySelector('.options')
const correctDOM = document.querySelector('.correct')
const answerDOM = document.querySelector('.answer')
const markDOM = document.querySelector('.mark')
const downloadBtnDOM = document.querySelector('.downloadBtn')

var attQ = []
var x
for(x in questions){
    if(attempted[x] === 1){
        attQ.push(x)  
    }
}


head.insertAdjacentText('beforeend', 'Attempted Questions:')

for(var q=0; q<attQ.length; ++q){
    questionDOM.insertAdjacentText('beforeend', attQ[q].question)
    optionsDOM.insertAdjacentText('beforeend', attQ[q].options)
    correctDOM.insertAdjacentText('beforeend', attQ[q].correct_answer)
    answerDOM.insertAdjacentText('beforeend', answers[q])
    if(correct[q] === 1){
        markDOM.insertAdjacentText('beforeend', '+1')
    }else{
        markDOM.insertAdjacentText('beforeend', '0')
    }
}

head.insertAdjacentText('beforeend', 'Unattempted Questions:')

var y
var f = 0
for(y in questions){
    if(attempted[y] === 0){
        f=1
        questionDOM.insertAdjacentText('beforeend', questions[y].question)
        optionsDOM.insertAdjacentText('beforeend', questions[y].options)
        correctDOM.insertAdjacentText('beforeend', questions[y].correct_answer) 
        answerDOM.insertAdjacentText('beforeend', 'none')
        markDOM.insertAdjacentText('beforeend', '0')  
    }
}

if(f === 0){
    generateDOM.insertAdjacentText('beforeend', 'NONE. All questions were attempted')
}

// downloadBtnDOM.addEventListener('click', (e)=>{

// })
