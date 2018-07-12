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

router.get('/registerUser', (request, response) => {
	response.send("Hello from Router File")
});

module.exports = router;