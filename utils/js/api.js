const { json } = require('body-parser');
const request= require('request')

const { response } = require('express');
const api = async  (subject,callback) => {
    
    
    try{
    const url= 'https://opentdb.com/api.php?amount=20&category='+subject+'&type=multiple'
     request({url,json:true}, (error, response) => {
       
     callback(response.body.results, subject)
        
        
      })
    }catch(e){return e.json().message}
      
    
}

module.exports= api