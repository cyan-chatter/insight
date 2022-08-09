const mainContentDOM = document.querySelector(".main-content")
console.log(mainContentDOM)
const setAttributes= (ele,params)=> {
    for(attribute in params){
        ele.setAttribute(attribute,params[attribute])
    }
     
}
const cardsDOM = document.createElement('div');
setAttributes(cardsDOM,{'class':'testcards'})

if(tests.length==0){
    cardsDOM.innerText = "No Test Created Yet" 
    cardsDOM.classList.remove("testcards")
    cardsDOM.classList.add("notestcards")
}else{
    const myTestLabelDOM = document.createElement('h2');
    myTestLabelDOM.innerText = "My Tests";
    mainContentDOM.appendChild(myTestLabelDOM);
}

const redirect = (val) =>{
    console.log(val)
    location.href = `/teachers/edittest?value=${val}`
}

for(i = 1;i<=tests.length;i++){
    const cardDOM = document.createElement('div');
    setAttributes(cardDOM,{'class':'testcard','id':`testcard_${i}`,'value':tests[i-1].value})
    cardDOM.onclick = function () {
        redirect(this.getAttribute("value"))
    }
    const testNameDOM = document.createElement('h3')
    setAttributes(testNameDOM,{'class':'test_card_content test_name','id':`test_name${i}`})
    if(tests[i-1].name===""){
        testNameDOM.innerText =     `Test ${i}`
    }else{
        testNameDOM.innerText = tests[i-1].name
    }  

    const testQuestionNoDOM = document.createElement('div')
    setAttributes(testQuestionNoDOM,{'class':'test_card_content test_questionno','id':`test_questionno${i}`})
    testQuestionNoDOM.innerText = `${tests[i-1].questions} Questions`
    const testCreatedDOM = document.createElement('div')
    setAttributes(testCreatedDOM,{'class':'test_card_content test_created','id':`test_created${i}`})
    testCreatedDOM.innerText =  `${tests[i-1].created}`
    
    cardDOM.appendChild(testNameDOM)
    cardDOM.appendChild(testQuestionNoDOM)
    cardDOM.appendChild(testCreatedDOM)
    cardsDOM.appendChild(cardDOM);
}

mainContentDOM.appendChild(cardsDOM)