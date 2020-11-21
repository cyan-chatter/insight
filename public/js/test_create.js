
 const quesform = document.getElementById('questionsblock')
 const addques =  document.getElementById('addquestion')
 var quesNo = 2

 const setAttributes= (ele,params)=> {
    for(attribute in params)
    {
        ele.setAttribute(attribute,params[attribute])
    }
     
 }


 const updatequestions = (currquesNo)=>{
     try{

        const all_holders= document.getElementsByClassName('quesholder')
        console.log(currquesNo)
        quesNo--
        
        for(i=currquesNo;i<all_holders.length;i++)
        {   const currholder= all_holders[i]
            
            currholder.id='quesholder'+(i+1)
            const children= currholder.childNodes
            setAttributes(children[2].childNodes[0],{'name':'q'+(i+1),'placeholder':'Enter Question '+(i+1)})
            children[3].id='close'+(i+1)
            for(j=5,k=1;j<9;j++,k++)
            {
                children[j].childNodes[0].name='o'+(i+1)+k
            }
            children[9].childNodes[0].name='c'+(i+1)
        
        }
        }catch(e){}
 }



addques.addEventListener('click',function (button){
    button.preventDefault()
    const holder=document.createElement('div')
    setAttributes(holder,{'class':'quesholder','id':'quesholder'+quesNo})
    holder.innerHTML='<br><br>'
    
    
    const newques = document.createElement('label')
    newques.innerHTML="<input type='text' class='question' name='q"+quesNo+"' autocomplete='off' placeholder='Enter Question "+quesNo+"'>"
    const close= document.createElement('i')
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

    
    
    quesform.insertBefore(holder,addques)
    quesNo++
    
})
