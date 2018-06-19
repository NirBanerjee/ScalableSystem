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
		fname: "Jenny",
		lname: "Admin",
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
app.post('/registerUser', (request, response) => {
	request.body["role"] = "customer";
	console.log(request.body);
	Users.create(request.body)
		.then(() => {
			response.json({
				"message": request.body.fname + " was registered successfully"
			});
		})
		.catch((err) => {
			console.log(err);
			response.json({
				"message": "The input you provided is not valid"
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
		request.session.firstname = userData.fname;
		console.log(userData);
		response.json({
			"message": "Welcome " + userData.fname
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
		const fname = request.body.fname;
		const lname = request.body.lname;
		const addr = request.body.address;
		const city = request.body.city;
		const state = request.body.state;
		const zip = request.body.zip;
		const email = request.body.email;
		const username = request.body.username;
		const password = request.body.password;

		if (typeof fname != 'undefined' && fname.length > 0)	{
			userData["fname"] = fname;
		}
		if (typeof lname != 'undefined' && lname.length > 0)	{
			userData["lname"] = lname;
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
				"message": userData.fname + " your information was successfully updated"
			});
		}).catch((err) => {
			console.log(err);
			response.json({
				"message": "The input you provided is not valid”"
			});
		});
	}).catch((err) => {
		console.log(err);
		response.json({
			"message": "The input you provided is not valid"
		});
	});
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

	const groupList = ['Book', 'DVD', 'Music' ,'Electronics', 'Home', 'Beauty', 'Toys', 'Clothing', 'Sports', 'Automotive', 'Handmade'];
	const grp = request.body.group;
	console.log(grp);
	if (!group || group.length == 0 || groupList.indexOf(grp) < 0)	{
		response.json({
			"message": "The input you provided is not valid"
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

//modifyProducts EndPoint - for allowing admin to modify existin product.
app.post('/modifyProduct', (request, response) => {
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

	const asin = request.body.asin;
	const productName = request.body.productName;
	const productDescription = request.body.productDescription;
	const group = request.body.group;
	const groupList = ['Book', 'DVD', 'Music' ,'Electronics', 'Home', 'Beauty', 'Toys', 'Clothing', 'Sports', 'Automotive', 'Handmade'];

	if (!asin || asin.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!productName || productName.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!productDescription || productDescription.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!group || group.length == 0 || groupList.indexOf(grp) < 0)	{
		response.json({
			"message": "The input you provided is not valid"
		});
	}

	Products.findOne({
		where: {
			asin: asin
		}
	}).then((result) => {
		var currProduct = result.dataValues;
		currProduct["productName"] = productName;
		currProduct["productDescription"] = productDescription;
		console.log(currProduct);
		Products.update(
			currProduct,
			{
				where: {
					asin: asin
				}
			}
		).then(() => {
			console.log("Record Updated!!!");
			response.json({
				"message": currProduct["productName"] + " was successfully updated"
			});

		}).catch((err) => {
			console.log(err);
			response.json({
				"message": "The input you provided is not valid"
			});
		})
	}).catch((err) => {
		console.log(err);
		response.json({
			"message": "The input you provided is not valid"
		});
	});
});

//viewUsers endpoint - for allowing admin to view all users
app.post("/viewUsers", (request, response) => {
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

	var fnameQuery = request.body.fname;
	var lnameQuery = request.body.lname;

	if (!fnameQuery || fnameQuery.length == 0)	{
		fnameQuery = "%";
	}	else {
		fnameQuery = "%" + fnameQuery + "%";
	}

	if (!lnameQuery || lnameQuery.length == 0)	{
		lnameQuery = "%";
	}	else {
		lnameQuery = "%" + lnameQuery + "%";
	}

	Users.findAll({
		where: {
			fname: {
				$like: fnameQuery
			},
			lname: {
				$like: lnameQuery
			}
		}
	}).then((result) => {
		if (result.length == 0)	{
			response.json({
				"message": "There are no users that match that criteria"
			});
		}	else{
			userArray = [];
			var i;
			for (i = 0; i < result.length; i++)	{
				const currentUser = result[i].dataValues;
				const fname = currentUser.fname;
				const lname = currentUser.lname;
				const userId = currentUser.username;
				const userObj = {
					"fname": fname,
					"lname": lname,
					"userId": userId
				}
				userArray[i] = userObj;
			}
			response.json({
				"message": "The action was successful",
				"user": userArray
			});
		}
	}).catch((err) => {
		console.log(err);
		response.json({
			"message": "There was some problem executing the query"
		});
	});
});

//viewProducts EndPoint - Allow user to view all products
app.post('/viewProducts', (request, response) => {
	var asin = request.body.asin;

	if (typeof asin != 'undefined' && asin.length > 0)	{
		console.log("In Here");
		Products.findOne({
			where: {
				asin: asin
			}
		}).then((result) => {
			console.log(result);
			productArray = []
			const currentProduct = result.dataValues;
			const prodAsin = currentProduct.asin;
			const prodName = currentProduct.productName;
			const prodObj = {
				"asin": prodAsin,
				"productName": prodName
			}
			productArray[0] = prodObj;
			response.json({
				"product": productArray
			})
		}).catch((err) => {
			console.log(err);
			response.json({
				"message": "There are no products that match that criteria"
			});
		});
	}	else{
		console.log("Not In THere");
		var group = request.body.group;
		var key = request.body.keyword;

		if (!group || group.length == 0)	{
			group = "%";
		}	else{
			group = "%" + group + "%"
		}

		if (!key || key.length == 0)	{
			key = "%";
		}	else{
			key = "%" + key + "%";
		}

		Products.findAll({
			where: {
				group: {
					$like: group
				},
				$or: [ 
				{
					productName: {
						$like: key
					}	
				},
				{
					productDescription: {
						$like: key
					}
				} ]
			}
		}).then((result) => {
			if (result.length == 0)	{
				response.json({
					"message": "There are no users that match that criteria"
				});
			}	else{
				productArray = [];
				var i;
				for (i = 0; i < result.length; i++)	{
					const currentProduct = result[i].dataValues;
					const asinId = currentProduct.asin;
					const prodName = currentProduct.productName;
					const prodObj = {
						"asin": asinId,
						"productName": prodName
					}
					productArray[i] = prodObj;
				}
				response.json({
					"product": productArray
				});
			}

		}).catch((err) => {
			console.log(err);
			response.json({
				"message": "There was a problem executing the query"
			});
		});
	}
});

//App Init
app.listen(port, () => {
	console.log('Listening on port - ' + port)
})