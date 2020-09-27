//https://www.geeksforgeeks.org/parsing-form-data-in-express-app-manually-without-body-parser/

const registerStudentParseData = (req, res, next) => { 
    if (req.method === 'POST') { 
        const formData = {} 
        req.on('data', data => { 
  
            // Decode and parse data 
            const parsedData =  decodeURIComponent(data).split('&') 
            
            console.log(parsedData)

            for (let data of parsedData) { 
  
                decodedData = decodeURIComponent( data.replace(/\+/g, '%20')) 
  
                const [key, value] = decodedData.split('=') 
  
                // Accumulate submitted data in an object 
                formData[key] = value
                
                console.log('Form Data Key : ' + formData[key])
            } 
  
            // Attach form data in request object 
            req.body = formData
            console.log(req.body) 
            next() 
        }) 
    } else { 
        next() 
    } 
 } 
 
 module.exports = {
    registerStudentParseData
 }