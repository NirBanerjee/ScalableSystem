const express = require('express');
const app = express();
const port = 3130;

app.use(express.json());

//All response messages
const login_error = {
	message: "There seems to be an issue with the username/password combination that you entered"
};
const logout_error = {
	message: "You are not currently logged in"
};
const illegal_input = {
	message: "The numbers you entered are not valid"
}
const not_logged_in = {
	message: "You are not currently logged in"
}
const successful_login = {
	message: "Welcome first name"
}
const successful_logout = {
	message: "You have been successfully logged out"
}

//API end point for add function.
app.post('/add', (request, response) =>	{
	var num1 = parseInt(request.body.num1);
	var num2 = parseInt(request.body.num2);
	var sum = num1 + num2;
	var successful_action = {
		message: "The action was successful",
		result: sum.toString()
	}
	response.send(successful_action)
});

//API end point for multiply function.
app.post('/multiply', (request, response) =>	{
	var num1 = parseInt(request.body.num1);
	var num2 = parseInt(request.body.num2);
	var prod = num1 * num2;
	var successful_action = {
		message: "The action was successful",
		result: prod.toString()
	}
	response.send(successful_action)
});

//API end point for divide function.
app.post('/divide', (request, response) =>	{
	var num1 = parseInt(request.body.num1);
	var num2 = parseInt(request.body.num2);
	var div = num1 / num2;
	var successful_action = {
		message: "The action was successful",
		result: div.toString()
	}
	response.send(successful_action)
});

app.listen(port, () => {
	console.log("Listening on port - " + port);
});
