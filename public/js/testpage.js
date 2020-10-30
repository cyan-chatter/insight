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

//  window.onscroll = function() { document.getElementsByClassName("timer").innerHTML='yes'
//      myFunction()}

//  // Get the header
//  var timer = document.getElementsByClassName("timer")
 
//  // Get the offset position of the navbar
//  var fixed = timer.offsetTop
 
//  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
//  function myFunction() {
//    if (window.pageYOffset > fixed) {
//      timer.classList.add='fixed'
//    } else {
//      timer.classList.remove='fixed'
//    }
//  }


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
    const br = document.createElement('br')

    element.appendChild(para)
    element.appendChild(br)
    
}
const submit = document.createElement('input')
setAttributes(submit,{'type':'submit','value':'Submit Test'})
element.appendChild(submit)

    










