const express = require('express');
const Joi = require('joi');
const session = require('express-session');
const app = express();
const port = 3130;

app.use(express.json());
app.use(session({
	secret: "jncksdc9013eu0", 
	resave: "false",
	saveUninitialized: "true"
}));

//Users
const users = [
	{
		firstName: "Henry",
		lastName: "Smith",
		userName: "hsmith",
		password: "smith"
	},
	{
		firstName: "Tim",
		lastName: "Bucktoo",
		userName: "tbucktoo",
		password: "bucktoo"
	}
];

//All response messages
const login_error = {
	message: "There seems to be an issue with the username/password combination that you entered"
};
const logout_error = {
	message: "You are not currently logged in"
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

	const user = users.find(u => (u.userName === username && u.password === password));
	if (!user)	{
		return response.status(200).send(login_error);
	}

	request.session.user = user;
	const successful_login = {
		message: "Welcome " + user.firstName
	};
	response.send(successful_login)
});

//API end point for logout function
app.post('/logout', (request, response) => {

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
		result: sum.toString()
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
		result: prod.toString()
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
		result: quo.toString()
	}
	response.send(successful_action)
});

app.listen(port, () => {
	console.log("Listening on port - " + port);
});
