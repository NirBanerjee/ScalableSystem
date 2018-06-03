const express = require('express');
const app = express();
const port = 3130;

app.get('/', (request, response) => {
	response.send("Sending Response from API");
});

app.get('/api/courses', (request, response) => {
	response.send([1, 2, 3]);
});

app.listen(port, () => {
	console.log("Listening on port - " + port);
});
