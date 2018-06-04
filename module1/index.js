const express = require('express');
const Joi = require('joi');
const session = require('express-session');
const mysql = require('mysql');
const app = express();
const port = 3130;

//Make Mysql connection
const uName = process.env.MYSQL_USER;
const pass = process.env.MYSQL_USER;
const connection = mysql.createConnection({
	host: 'localhost',
	user: uName,
	password: pass,
	database: 'project1'
});

connection.connect((error) => {
	if (error)	{
		console.log("Error Connecting to Mysql");
	}	else	{
		console.log("Connection Made Successfully");
	}
});

app.use(express.json());
app.use(session({
	secret: "jncksdc9013eu0", 
	resave: "false",
	saveUninitialized: "true"
}));

//All response messages
const login_error = {
	message: "There seems to be an issue with the username/password combination that you entered"
};
const illegal_input = {
	message: "The numbers you entered are not valid"
};
const not_logged_in = {
	message: "You are not currently logged in"
};
const successful_logout = {
	message: "You have been successfully logged out"
};

//Schemas for input validation.
const input_schema = {
	num1: Joi.number().required(),
	num2: Joi.number().required()
}
const login_schema = {
	username: Joi.string().required(),
	password: Joi.string().required()
}

//API end point for login function
app.post('/login', (request, response) => {
	const validation_result = Joi.validate(request.body, login_schema);

	if (validation_result.error)	{
		return response.status(200).send(login_error)
	}

	var username = request.body.username;
	var password = request.body.password;

	const query = "SELECT * FROM users where username='" + username + "' AND password='" + password +"'";
	console.log(query);
	connection.query(query, (error, rows, fields) =>	{
		if (error)	{
			console.log("Error fetching user!!");
			return response.status(200).send(login_error);
		}	else	{
			if (rows.length > 0)	{
				request.session.user = rows[0];
				console.log("Login Successful!!");
				const successful_login = {
					message: "Welcome " + rows[0].firstname
				};
				return response.status(200).send(successful_login);
			}	else	{
				return response.status(200).send(login_error);
			}
		}
	});
});

//API end point for logout function
app.post('/logout', (request, response) => {
	if (!request.session.user)	{
		return response.status(200).send(not_logged_in);
	}

	request.session.destroy();
	response.send(successful_logout);
});

//API end point for add function.
app.post('/add', (request, response) =>	{
	if (!request.session.user)	{
		return response.status(200).send(not_logged_in);
	}

	const validation_result = Joi.validate(request.body, input_schema);
	if (validation_result.error)	{
		return response.status(200).send(illegal_input)
	}	
	var num1 = parseFloat(request.body.num1);
	var num2 = parseFloat(request.body.num2);
	var sum = num1 + num2;
	var successful_action = {
		message: "The action was successful",
		result: sum
	}
	response.send(successful_action)
});

//API end point for multiply function.
app.post('/multiply', (request, response) =>	{
	if (!request.session.user)	{
		return response.status(200).send(not_logged_in);
	}

	const validation_result = Joi.validate(request.body, input_schema);
	if (validation_result.error)	{
		return response.status(200).send(illegal_input)
	}	
	var num1 = parseFloat(request.body.num1);
	var num2 = parseFloat(request.body.num2);
	var prod = num1 * num2;
	var successful_action = {
		message: "The action was successful",
		result: prod
	}
	response.send(successful_action)
});

//API end point for divide function.
app.post('/divide', (request, response) =>	{
	if (!request.session.user)	{
		return response.status(200).send(not_logged_in);
	}

	const validation_result = Joi.validate(request.body, input_schema);
	if (validation_result.error)	{
		return response.status(200).send(illegal_input)
	}	
	var num1 = parseFloat(request.body.num1);
	var num2 = parseFloat(request.body.num2);
	if (num2 == 0.0)	{
		return response.status(200).send(illegal_input)
	}
	var quo = num1 / num2;
	var successful_action = {
		message: "The action was successful",
		result: quo
	}
	response.send(successful_action)
});

app.listen(port, () => {
	console.log("Listening on port - " + port);
});
