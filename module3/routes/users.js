const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load User Model
require('../models/User');
const User = mongoose.model('user');

//Init end-point for adding admin
router.get('/init', (request, response) => {
	//Load the admin to database
	const adminUser = {
		fname: "Jenny",
		lname: "Admin",
		username: "jadmin",
		password: "admin",
		address: "300, South Craig Street",
		email: "jadmin@cmu.com",
		city: "Pittsburgh",
		state: "PA",
		zip: "15213"
	}
	new User(adminUser)
	.save()
	.then(user => {
		response.json(user);
	});
});

router.post('/registerUser', (request, response) => {
	console.log("Request Received");
	console.log("================");
	console.log(request.body);
	console.log("================");
	new User(request.body)
	.save()
	.then(user => {
		console.log("User Added Successfully.");
		const resp = {
			"message": request.body.fname + " was registered successfully"
		}
		console.log(resp);
		console.log("================");
		response.json(resp);
	})
	.catch((err) => {
		console.log(err);
		console.log("================");
		response.json({
			"message": "The input you provided is not valid"
		});
	});
});



module.exports = router;