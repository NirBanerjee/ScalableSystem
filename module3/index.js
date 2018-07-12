const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = 3130;

const users = require('./routes/users')

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//MongoDB and Mongoose Connections
mongoose.connect('mongodb://localhost/project3')
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));

//Call the routes
app.use('/', users);

app.listen(port, () => {
	console.log(`Server started, port = ${port}`);
});