const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const body  = req.body;
    //create the new user object
    const user = new User({
        name: body.username,
        password: body.password,
        email: body.email
    });

    try{
        //Validate user object
        const validationErrors = user.validateSync();
        if(validationErrors) return res.status(400).send(validationErrors.message).json();
        //Does user already exist?
        const userExists = await User.findOne({email: user.email});
        if(userExists) return res.status(400).send('User already exists').json();
        //Geneate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        user.password = hashedPassword;
        //Register User to database
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err){
        res.status(400).send(err).json();
    }
});

router.post('/login', async (req, res) => {
    const body = req.body;
    //find user in database based on email provided
    const user = await User.findOne({email: body.email});
    if(user){
        //does the password match the user?
        const validPassword = await bcrypt.compare(body.password, user.password);
        if(validPassword){
            //Create and assign token
            const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
            res.header('auth_token', token);
            return res.status(200).send(token);
            
        } else {
            return res.status(400).json({error: "Invalid Password"});
        }
    } else {
        return res.send(401).json({error: "User does not exist"});
    }
});

module.exports = router;