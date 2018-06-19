//All Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const Users = require('./models/user')
const Products = require('./models/product')

//App Settings
const app = express();
const port = 3130;

//Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
//Init end-point for adding admin
app.get('/init', (request, response) => {
	//Load the admin to database
	const adminUser = {
		fName: "Jenny",
		lName: "Admin",
		username: "jadmin",
		password: "admin",
		address: "300, South Craig Street",
		email: "jadmin@cmu.com",
		city: "Pittsburgh",
		state: "PA",
		zip: "15213"
	}
	Users.create(adminUser)
		.then(user => response.json(user));
});

//Default End-point
app.get('', (request, response) => {
	response.json({
		message: "Welcome from Service"
	});
});

//Register EndPoint for registering new user.
app.post('/register', (request, response) => {
	console.log(request.body);
	Users.create(request.body)
		.then(() => {
			response.json({
				"message": request.body.fName + " was registered successfully"
			})
		})
		.catch((err) => {
			console.log(err);
			response.json({
				"message": "The input you provided was not valid"
			})
		});
});

//App Init
app.listen(port, () => {
	console.log('Listening on port - ' + port)
})