const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    //Get the token from the request
    const token = req.header('auth_token');
    //Was a token provided?
    if(!token) return res.status(401).send('Access Denied');
    //Verify the auth token if provided
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        //Add verified status to user request object
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}