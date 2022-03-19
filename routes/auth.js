const router = require('express').Router();
const User = require('../model/User');

router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    try{
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err){
        res.status(500).send(err);
    }
});

router.post('/login', (req, res) => {
    res.send('Login');
});

module.exports = router;