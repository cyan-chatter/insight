const test_list_DOM = document.querySelector('#testoptionform')
console.log(test_list)

const submit = document.querySelector("[type='submit']")

const setAttributes= (ele,params)=> {
    for(attribute in params)
    {
        ele.setAttribute(attribute,params[attribute])
    }
     
 }

var i = 1
test_list.forEach(test => {
    const test_label = document.createElement('label')
    const radio = document.createElement('input')
    setAttributes(radio,{'type':'radio','name':'testchoice','value':test._id})
    test_label.appendChild(radio)
    test_label.appendChild(document.createTextNode('Test '+i))
    
    
    test_list_DOM.insertBefore(test_label,submit)
    test_list_DOM.insertBefore(document.createElement('br'),submit)
    i++
});