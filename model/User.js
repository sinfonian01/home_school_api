const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        require: [true, "Name is required"],
        min: 2,
        max: 255
    },
    password:{
        type: String,
        require: [true, "Password is required"],
        min: 8,
        max: 1024
    },
    email:{
        type: String,
        require: [true, "Email is required"],
        min: 6,
        trim: true
        ,validate: {
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    dt:{
        type: Date,
        default: Date.now
    }
});

userSchema.path('password').validate(function(v){
    return v && v.length >= 8;
}, "Password must be at least 8 characters in length");

module.exports = mongoose.model('User', userSchema);