//All Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Users = require('./models/user');
const Products = require('./models/product');

//App Settings
const app = express();
const port = 3130;

//Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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

//Validation Schema for Login
const login_schema = {
	username: Joi.string().required(),
	password: Joi.string().required()
}

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
		zip: "15213",
		role: "admin"
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

//Register EndPoint - for registering new user.
app.post('/register', (request, response) => {
	request.body["role"] = "customer";
	console.log(request.body);
	Users.create(request.body)
		.then(() => {
			response.json({
				"message": request.body.fName + " was registered successfully"
			});
		})
		.catch((err) => {
			console.log(err);
			response.json({
				"message": "The input you provided was not valid"
			})
		});
});

//Login EndPoint - for logging in existing user.
app.post('/login', (request, response) => {
	console.log(request.body);

	const validation_result = Joi.validate(request.body, login_schema);
	if (validation_result.error)	{
		response.json({
			"message": "There seems to be an issue with the username/password combination that you entered"
		});
	}

	const userName = request.body.username;
	const passWord = request.body.password;

	Users.findAll({
		where: {
			username: userName,
			password: passWord
		}
	}).then((result) => {
		if (result.length === 0)	{
			return response.json({
				"message": "There seems to be an issue with the username/password combination that you entered"
			});
		}
		const userData = result[0].dataValues;
		request.session.username = userData.username;
		request.session.role = userData.role;
		request.session.firstname = userData.fName;
		response.json({
			"message": "Welcome " + userData.fName
		});
	}).catch((err) => {
		console.log(err);
		response.json({
			"message": "There seems to be an issue with the username/password combination that you entered"
		});
	});
})

//Logout EndPoint - for logging out the user.
app.post('/logout', (request, response) => {
	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}
	request.session.destroy();
	response.json({
		"message": "You have been successfully logged out"
	});
});

//updateInfo EndPoint - for allowing a user to update his contact details.
app.post('/updateInfo', (request, response) => {
	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	const currentUserName = request.session.username;
	console.log(currentUserName);

	Users.findOne({
		where: {
			username: currentUserName
		}
	}).then((result) => {
		const userData = result.dataValues;
		console.log(userData);
		var userNameChanged = false;
		const fName = request.body.fName;
		const lName = request.body.lName;
		const addr = request.body.address;
		const city = request.body.city;
		const state = request.body.state;
		const zip = request.body.zip;
		const email = request.body.email;
		const username = request.body.username;
		const password = request.body.password;

		if (typeof fName != 'undefined' && fName.length > 0)	{
			userData["fName"] = fName;
		}
		if (typeof lName != 'undefined' && lName.length > 0)	{
			userData["lName"] = lName;
		}
		if (typeof addr != 'undefined' && addr.length > 0)	{
			userData["address"] = addr;
		}
		if (typeof city != 'undefined' && city.length > 0)	{
			userData["city"] = city;
		}
		if (typeof state != 'undefined' && state.length > 0)	{
			userData["state"] = state;
		}
		if (typeof zip != 'undefined' && zip.length > 0)	{
			userData["zip"] = zip;
		}
		if (typeof email != 'undefined' && email.length > 0)	{
			userData["email"] = email;
		}
		if (typeof username != 'undefined' && username.length > 0)	{
			userData["username"] = username;
			userNameChanged = true;
		}
		if (typeof password != 'undefined' && password.length > 0)	{
			userData["password"] = password;
		}
		console.log(userData);
		Users.update(
			userData,
			{
				where: {
					username: currentUserName
				}
			}
		).then(() => {
			if (userNameChanged)	{
				request.session.username = userData["username"];
			}
			response.json({
				"message": userData.fName + " your information was successfully updated"
			});
		}).catch((err) => {
			console.log(err);
			response.json({
				"message": "The input you provided is not valid”"
			});
		})
	}).catch((err) => {
		console.log(err);
		response.json({
			"message": "The input you provided is not valid"
		});
	})
});

//addProducts EndPoint - for allowing admin to add a new product.
app.post('/addProducts', (request, response) => {
	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	if (request.session.role != "admin")	{
		return response.json({
			"message": "You must be an admin to perform this action"
		});
	}

	Products.create(request.body)
	.then(() => {
		response.json({
				"message": request.body.productName + " was successfully added to the system"
		});

	}).catch((err) => {
		response.json({
			"message": "The input you provided is not valid"
		});
	});
});

//App Init
app.listen(port, () => {
	console.log('Listening on port - ' + port)
})