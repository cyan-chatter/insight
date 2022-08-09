
 const quesform = document.getElementById('questionsblock')
 const addquesButton =  document.getElementById('addquestion')
 const testNameDOM = document.getElementById('test_name')

 testNameDOM.value = testData.testName

 var quesNo = 1


 const setAttributes= (ele,params)=> {
    for(attribute in params)
    {
        ele.setAttribute(attribute,params[attribute])
    }
     
 }
 const resizeTextArea = (ele) => {
    ele.style.height = "48px"
    const eleheight = ele.scrollHeight
    ele.style.height = `${eleheight}px`
 }

 const updatequestions = (currquesNo)=>{
    try{

        const all_holders= document.getElementsByClassName('quesholder')
        quesNo--
        
        for(i=currquesNo;i<all_holders.length;i++)
        {   const currholder= all_holders[i]
            currholder.id='quesholder'+(i+1)
            const children= currholder.childNodes
            setAttributes(children[2].childNodes[0],{'name':'q'+(i+1),'placeholder':'Enter Question '+(i+1)})
            children[3].id='close'+(i+1)
            for(j=6,k=1;j<10;j++,k++)
            {
                children[j].childNodes[0].name='o'+(i+1)+k
            }
            children[10].childNodes[0].name='c'+(i+1)
           
        }
    }catch(e){}
 }


const addQuestionDOM = () =>{
    const holder=document.createElement('div')
    setAttributes(holder,{'class':'quesholder','id':'quesholder'+quesNo})
    holder.innerHTML='<br><br>'
    
    
    const newques = document.createElement('label')
    newques.innerHTML="<textarea class='question' name='q"+quesNo+"' autocomplete='off' placeholder='Enter Question "+quesNo+"'></textarea>"
    const ques_DOM = newques.childNodes[0]
    ques_DOM.addEventListener('keyup',function (e) {resizeTextArea(e.target)})

    const close= document.createElement('i')
    close.title = "Remove question"
    close.id='close'+quesNo
    close.className='far fa-times-circle'
    close.addEventListener('click',()=> {
        const currquesNo= holder.id.slice(10)
        holder.remove()
      
        updatequestions(currquesNo-1)

    })
    
    holder.appendChild(newques)
    holder.appendChild(close)
    holder.appendChild(document.createElement('br'))
    for(i=1;i<=4;i++)
    {  
        const op = document.createElement('label')
         op.innerHTML="<input type='text' autocomplete='off' placeholder='Enter Option "+i+"' name='o"+quesNo+i+"' placeholder='Enter Option "+i+"' required><br>"
        // op.innerHTML="<input type='text'"
        holder.appendChild(op)

    }
    
    const answer= document.createElement('label')
    answer.innerHTML="<input type='text' autocomplete='off' name='c"+quesNo+"' placeholder='Enter Answer' required><br>"
    holder.appendChild(answer)
    quesform.insertBefore(holder,addquesButton)
    quesNo++
}

addquesButton.addEventListener('click',function (e){
    e.preventDefault() 
    addQuestionDOM();
})
for(let j=0;j<testData['totalQuestions'];j++){
    addQuestionDOM()
}
for(i=1;i<=testData['totalQuestions'];i++){
    let questionName = `q${i}`
    const questionDOM = document.getElementsByName(questionName)[0]
    questionDOM.value = testData[questionName]
    resizeTextArea(questionDOM)
    console.log(questionDOM)
    for(j =1;j<=4;j++){
        let optionName = `o${i}${j}`
        const optionDOM = document.getElementsByName(optionName)[0]
        optionDOM.value = testData[optionName]
    }
    let correctName = `c${i}`
    const correctDOM = document.getElementsByName(correctName)[0]
    correctDOM.value = testData[correctName]
}
