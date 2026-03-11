var jwt = require('jsonwebtoken')
const JWT_SECRET = 'yash@isarockstar'
const fetchUser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error : "please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        console.log("User Assigned to req.user:", req.user);
        next()
    } catch (error) {
        return res.status(401).send({error : "please authenticate using a valid token"})
    }
}

module.exports = fetchUser
