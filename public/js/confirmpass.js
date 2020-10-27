
const submit = document.querySelector('#submit')
const confirmpass = document.querySelector('#confirmpass')
const password = document.querySelector('#password')

submit.addEventListener('click',(button) => {
    
    if(confirmpass.value!==password.value)
    {   button.preventDefault()
        alert('Password is not matching!')
        
    } 
})



