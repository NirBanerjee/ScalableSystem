const mongoose = require('mongoose');
const lineReader = require('line-reader');
var totalRecords = 0;

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//MongoDB and Mongoose Connections
mongoose.connect('mongodb://localhost/project3')
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err)); 

//Load User Model
require('./models/Product');
const Product = mongoose.model('product');

lineReader.eachLine('../../project3Data_07_07_18/projectRecordsJSON.json', (line, last) => {
	currentLine = line.toString().replace(/'/g, "\"", "g");
	jsonRecord = JSON.parse(currentLine);
	productObj = {
		asin: jsonRecord.asin,
		productName: jsonRecord.title,
		group: jsonRecord.categories[0],
		productDescription: jsonRecord.description
	};
	new Product(productObj)
	.save()
	.then((record) => {
		totalRecords = totalRecords + 1
		console.log("Row added successfully - " + totalRecords);
	})
	.catch((err) => {
		console.log(err);
	})
});

console.log(totalRecords);