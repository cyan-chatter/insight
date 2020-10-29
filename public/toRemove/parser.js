//https://www.geeksforgeeks.org/parsing-form-data-in-express-app-manually-without-body-parser/

const formidable= require('formidable')
const util = require('util')

const parser = async (req, res, next) => { 
   console.log("start")
    
   var form = new formidable.IncomingForm();

   // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

   form.parse(req, function(err, fields, files) {
     if (err) {

       // Check for and handle any errors here.

       console.error(err.message);
       return;
     }
     console.log(fields)
     res.writeHead(200, {'content-type': 'text/plain'});
     res.write('received upload:\n\n');

     // This last line responds to the form submission with a list of the parsed data and files.

     res.end(util.inspect({fields: fields, files: files}));
   })
   next()
   
 }
    // if (req.method === 'POST') { 
        
    //     const formData = {} 
    //  req.on('data', (data) => { 
    //         console.log("running")
    //         // Decode and parse data 
    //         const parsedData =  decodeURIComponent(data).split('&') 
            
    //         console.log(parsedData)

    //         for (let data of parsedData) { 
  
    //             decodedData = decodeURIComponent( data.replace(/\+/g, '%20')) 
  
    //             const [key, value] = decodedData.split('=') 
  
    //             // Accumulate submitted data in an object 
    //             formData[key] = value
                
    //             console.log('Form Data Key : ' + formData[key])
    //         } 
  
    //         // Attach form data in request object 
    //         req.body = formData
    //         console.log(req.body) 
    //         next() 
    //     }) 
    //     req.on('error',(error) =>{
    //         console.log("error")
    //     })
    //    console.log("after")

    // } else { 
    //     next() 
    // } 
 
 
 module.exports = parser
 