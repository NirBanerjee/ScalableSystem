const express = require('express');
const app = express();
const port = 3130;

const courses = [
	{id: 1, name: 'course1'},
	{id: 2, name: 'course2'},
	{id: 3, name: 'course3'}
];
app.get('/', (request, response) => {
	response.send("Sending Response from API");
});

app.get('/api/courses', (request, response) => {
	response.send(courses);
});

app.get('/api/courses/:id', (request, response) =>	{
	//response.send(request.params);
	var id = parseInt(request.params.id);
	const course = courses.find(c => c.id === id);
	if (!course)	{
		response.status(404).send("Course with " + id + " not found");
	}
	response.send(course)
});

app.listen(port, () => {
	console.log("Listening on port - " + port);
});
