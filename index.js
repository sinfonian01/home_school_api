const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//DB Connection
mongoose.connect(
    process.env.DB_CONNECT,
    () => console.log('DB Connected')
);

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server started'));