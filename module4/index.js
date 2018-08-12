const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = 3130;

const users = require('./routes/users')
const products = require('./routes/products')

//Session Middleware
app.use(cookieParser());
app.use(session({
	key: 'express.sid',
	secret: 'jncksdc9013eu0', 
	resave: true, 
	saveUninitialized: true, 
	cookie: {
		expires:new Date(new Date().getMinutes()+240), 
		maxAge:900000
	}
}));

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//MongoDB and Mongoose Connections
mongoose.connect('mongodb://ec2-54-158-41-20.compute-1.amazonaws.com:27017/project4')
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));

//Body Parser - Middleware
app.use(bodyParser.urlencoded({
	extended: true,
	parameterLimit: 1000000,
    limit: '500mb',
}));

app.use(bodyParser.json());

//Call the routes
app.use('/', users);
app.use('/', products);

app.listen(port, () => {
	console.log(`Server started, port = ${port}`);
});