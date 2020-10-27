const isloggedin= (req,res,next)=>{
    if(!req.cookies.token)
    {
        next()
    }
    else{
      res.redirect('/students/dashboard')
    }
}

module.exports= isloggedin