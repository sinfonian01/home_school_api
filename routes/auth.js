const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');

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

router.post('/login', (req, res) => {
    res.send('Login');
});

module.exports = router;