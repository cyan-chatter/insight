var result_div = document.querySelector('.result')

//disabling stream button for necessary conditions
var messageDOM = document.querySelector('#streamMessage')

function check(){
    
    if (new Set(subjects).size<3){
        const stream_button=document.querySelector('#streamrecommender').querySelector('a')
        stream_button.addEventListener('click',(e)=>{
            e.preventDefault()
        })   
        
     messageDOM.innerHTML='<h3>Please give Tests of atleast 3 subjects for Stream Recommendation<h3>'
     
    }
    
}


if(time_str[0]===undefined)
{
    result_div.innerHTML = 'You have not given any Test yet.'
}
else{
    var table = document.createElement('table')
    var row=document.createElement('tr')
    const time= document.createElement('th')
    time.innerHTML='Time'
    const subject= document.createElement('th')
    subject.innerHTML='Subject'
    const mark=document.createElement('th')
    mark.innerHTML='Marks'
    row.append(time,subject,mark)
    table.appendChild(row)
    for(i=0; i<marks.length ;i++ )
    {   row=document.createElement('tr')
        const time= document.createElement('td')
        time.innerHTML=new Date(time_str[i]) 
        const subject= document.createElement('td')
        subject.innerHTML=subjects[i]
        const mark=document.createElement('td')
        mark.innerHTML=marks[i]+"/"+marksOutOf[i]
        row.append(time,subject,mark)
        table.appendChild(row)
    }
    result_div.appendChild(table)

}