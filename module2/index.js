//All Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const Users = require('./models/user')
const Products = require('./models/product')

//App Settings
const app = express();
const port = 3130;

app.get('/init', (request, response) => {
	//Load the admin to database
	const adminUser = {
		firstName: "Jenny",
		lastName: "Admin",
		username: "jadmin",
		password: "admin",
		address: "300, South Craig Street",
		city: "Pittsburgh",
		state: "PA",
		zip: "15213"
	}
	Users.create(adminUser)
		.then(user => response.json(user));
});

app.get('', (request, response) => {
	response.json({
		message: "Welcome from Service"
	});
});
//App Init
app.listen(port, () => {
	console.log('Listening on port - ' + port)
})