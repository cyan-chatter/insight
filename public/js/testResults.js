
const generateDOM = document.querySelector('.generate')
const headDOM = document.getElementById('head')
const questionDOM = document.querySelector('.question')
const optionsDOM = document.querySelector('.options')
const correctDOM = document.querySelector('.correct')
const answerDOM = document.querySelector('.answer')
const markDOM = document.querySelector('.mark')
const downloadBtnDOM = document.querySelector('.downloadBtn')


var attQ = []

for(x=0;x<questions.length;x++){
    
    if(attempted[x] === 1){
        attQ.push(x)  
    }
}


const quesdiv= document.querySelector('#questions')

var i=0

//console.log(problems)


questions.forEach((question)=>{
    
    const quesholder = document.createElement('div')
    const que = document.createElement('p')
    que.innerHTML='Question '+(i+1)+': '+question.question
    quesholder.appendChild(que)
    //status_value = 1 for not attempted , 2 for correct and 3 for Incorrect
    var status_value = 1
    var answerindex
    const isattempted = problems.includes(question._id)
    var statstr = 'Not Attempted'
    if(isattempted){
     answerindex = problems.indexOf(question._id)
    }
    
    if(isattempted && question.correct_answer===answers[answerindex])
    {
        status_value=2
        statstr = 'Correct'
    }
    else if(isattempted)
    { 
        status_value=3
        statstr='Incorrect'
    }
    
    for(j=0;j<4;j++) 
    {   const option = document.createElement('p')
        option.innerHTML=(j+1)+'. '+question.options[j]
        quesholder.appendChild(option)
        var options_str= question.options[j]
        const htmlentity = document.createElement('p')
        htmlentity.innerHTML= options_str
        options_str=htmlentity.innerHTML

        option.innerHTML=(j+1)+'. '+question.options[j] 
        quesholder.appendChild(option)
        
        if(question.correct_answer===question.options[j])
        {   const check=document.createElement('i')
            check.className='fas fa-check'
            option.insertAdjacentElement('beforeend',check)
            if(question.options[j]===answers[answerindex]){
                option.style.backgroundColor='#4eaf00'
            }
            else{
            option.style.backgroundColor='#4caf5094'
            }
            option.style.width='40%'
        }
        
        else if(status_value===3 && answers[answerindex]===options_str)
        {   
            
            const wrong=document.createElement('i')
            wrong.className='fas fa-times'
            option.insertAdjacentElement('beforeend',wrong)
            option.style.backgroundColor='#f44336bf'
            option.style.width='40%'
            
        }
        
        
    }

    const status = document.createElement('p')
    
    status.innerHTML='Status: '+statstr
    i++
    quesholder.appendChild(status)
    quesdiv.appendChild(document.createElement('br'))
    quesdiv.appendChild(quesholder)
    
    
})
