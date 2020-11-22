const timer = document.getElementById('timer')
const str1='Remaining Time:  '
var minute = 20
var second = 00

document.addEventListener('DOMContentLoaded', function() {
    var time= new Date()
    
    timer.innerHTML=str1+ minute+':'+('0'+second).slice(-2)
 }, false);

const updateTimer= ()=>{

    if(second==00){
     minute--
    }
    if(second!=00)
    {
        second--
    }
    else{
        second=59
    }

    timer.innerHTML=str1+('0'+minute).slice(-2)+':'+('0'+second).slice(-2)
}
window.setInterval(updateTimer,1000)

const isCompleted= ()=> {
    if(timer.innerHTML===str1+'00:00')
    {   
        const form = document.getElementById('questions')
        form.submit()
    }
}
window.setInterval(isCompleted,1000)


const setAttributes= (ele,params)=> {
    for(attribute in params)
    {
        ele.setAttribute(attribute,params[attribute])
    }
     
 }
   
 
const no = ques_arr.length
const element = document.getElementById("questions")


for( i=0;i<no;i++)
{   
    var para = document.createElement("fieldset")
    para.setAttribute('class','questionholder')

    var question = document.createElement('p')
    question.innerHTML=(ques_arr[i].question)
    para.appendChild(question)
    var options = document.createElement("div")
    options.setAttribute('class','options')
    for(j=0;j<4;j++)
    {var option_label=document.createElement("label")
    
    option_label.innerHTML="<input type='radio' value='"+ques_arr[i].options[j]+"' name='"+ques_arr[i]._id+"'> "+ques_arr[i].options[j]+"<br>"
        options.appendChild(option_label)
    } 

    para.appendChild(options)
    const clearOptions = document.createElement('button')
    clearOptions.innerHTML='Clear Selection'
    setAttributes(clearOptions,{'class':'clearSelection','type':'button'})
    clearOptions.onclick= function (r){
             const opts=clearOptions.parentElement.querySelectorAll('[type="radio"]')
             opts.forEach((radio)=>{
                 radio.checked=false
             })

    }
    para.appendChild(clearOptions)
    const br = document.createElement('br')

    element.appendChild(para)
    element.appendChild(br)
    
}
const submit = document.createElement('button')
submit.innerHTML='Submit Test'
submit.setAttribute('type','submit')
element.appendChild(submit)

    










