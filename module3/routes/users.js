const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

//Validation Schema for Login
const login_schema = {
	username: Joi.string().required(),
	password: Joi.string().required()
}

//Admin Schema
const admin_schema = {
	username: "jadmin",
	password: "admin"
}

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

//Register User End Point
router.post('/registerUser', (request, response) => {
	console.log("=============================")
	console.log("Register Action");
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

//Login EndPoint
router.post('/login', (request, response) => {
	console.log("=============================")
	console.log("Login Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	const validation_result = Joi.validate(request.body, login_schema);
	if (validation_result.error)	{
		console.log("Login Schema Validation Error");
		console.log("================");
		return response.json({
			"message": "There seems to be an issue with the username/password combination that you entered"
		});
	}

	User.findOne(request.body)
	.then((user) => {
		console.log(user);
		const fname = user.fname;
		const username = user.username;
		request.session.username = fname;
		if (username === admin_schema.username)	{
			request.session.role = "admin";
		}	else	{
			request.session.role = "user";
		}
		console.log("Logged in successfully");
		console.log("================");
		response.json({
			"message": "Welcome " + fname
		});
	})
	.catch((err) =>	{
		console.log(err);
		console.log("================");
		response.json({
			"message": "There seems to be an issue with the username/password combination that you entered"
		});
	});
});

//Logout EndPoint
router.post('/logout', (request, response) => {
	console.log("=============================")
	console.log("Log out Action");
	console.log("================");
	if (! request.session.username)	{
		console.log("No login found");
		console.log("================");
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	request.session.destroy();
	console.log("Logged out Successfully");
	console.log("================");
	response.json({
		"message": "You have been successfully logged out"
	});
});

module.exports = router;