const authorize = (...alloweRoles) =>{
    return (req, res, next)=>{
        //checking the isAuthnticated() populated user object
        if(!req.user) return res.status(401).json({
            message:'unauthorized : user not found'
        })
        console.log(alloweRoles.includes(req.user.role));
        
        
        if(!alloweRoles.includes(req.user.role)) return res.status(403).json({
                message:'Access denied'
            })
            console.log(req.user.role);

        next();   
        }
       
        
    }
    module.exports = authorize;