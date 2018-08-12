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
require('../models/Recommendation');

const User = mongoose.model('user');
const Recommendation = mongoose.model('recommendation');

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
	.then((user) => {
		response.json(user);
	})
	.catch((err) => {
		console.log(err);
		response.json(err);
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
		request.session.username = username;
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

//Update User Information Endpoint
router.post('/updateInfo', (request, response) => {
	console.log("=============================")
	console.log("Update Info Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	if (! request.session.username)	{
		console.log("Not logged in");
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	const currUsername = request.session.username;
	const fname = request.body.fname;
	const lname = request.body.lname;
	const addr = request.body.address;
	const city = request.body.city;
	const state = request.body.state;
	const zip = request.body.zip;
	const email = request.body.email;
	const username = request.body.username;
	const password = request.body.password;
	var userNameChanged = false;

	User.findOne({
		username: currUsername
	})
	.then((user) => {
		if (typeof fname != 'undefined' && fname.length > 0)	{
			user.fname = fname;
		}
		if (typeof lname != 'undefined' && lname.length > 0)	{
			user.lname = lname;
		}
		if (typeof addr != 'undefined' && addr.length > 0)	{
			user.address = addr;
		}
		if (typeof city != 'undefined' && city.length > 0)	{
			user.city = city;
		}
		if (typeof state != 'undefined' && state.length > 0)	{
			user.state = state;
		}
		if (typeof zip != 'undefined' && zip.length > 0)	{
			user.zip = zip;
		}
		if (typeof email != 'undefined' && email.length > 0)	{
			user.email = email;
		}
		if (typeof username != 'undefined' && username.length > 0)	{
			user.username = username;
			userNameChanged = true;
		}
		if (typeof password != 'undefined' && password.length > 0)	{
			user.password = password;
		}
		console.log("New User Details");
		console.log(user);
		user.save()
		.then((result) => {
			console.log("User updated successfully");
			console.log("================");
			if (userNameChanged)	{
				request.session.username = user.username;
			}
			response.json({
				"message": user.fname + " your information was successfully updated"
			});
		})
		.catch((err) => {
			console.log("Information not updated");
			console.log(err);
			console.log("================");
			response.json({
				"message": "The input you provided is not valid”"
			});
		})
	})
	.catch((err) => {
		console.log("User not found");
		console.log(err);
		console.log("================");
		response.json({
			"message": "The input you provided is not valid”"
		});
	});
})

//View Users Endpoint
router.post('/viewUsers', (request, response) => {
	console.log("=============================")
	console.log("View Users Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	if (! request.session.username)	{
		console.log("Not logged in");
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	if (request.session.role != "admin")	{
		console.log("Not an admin");
		return response.json({
			"message": "You must be an admin to perform this action"
		});
	}

	var fnameQuery = request.body.fname;
	var lnameQuery = request.body.lname;

	if (!fnameQuery || fnameQuery.length == 0)	{
		fnameQuery = "";
	}

	if (!lnameQuery || lnameQuery.length == 0)	{
		lnameQuery = "";
	}

	User.find({
		fname: new RegExp('^' + fnameQuery, 'i'),
		lname: new RegExp('^' + lnameQuery, 'i')
	})
	.then((rows) => {
		console.log(rows.length + " records returned");
		if (rows.length == 0)	{
			return response.json({
				"message": "There are no users that match that criteria"
			});
		}

		userArray = [];
		var i;

		for (i = 0; i < rows.length; i++)	{
			const userObj = {
				"fname": rows[i].fname,
				"lname": rows[i].lname,
				'userId': rows[i].username
			}
			userArray[i] = userObj;
		}
		console.log(userArray);
		response.json({
			"message": "Action was successful",
			"user": userArray
		});
	})
	.catch((err) => {
		console.log("Error Executing Query");
		console.log("=====================");
		console.log(err);
		return response.json({
			"message": "There are no users that match that criteria"
		});
	});
});

module.exports = router;