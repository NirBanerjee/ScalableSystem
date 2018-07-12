const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the schema
const ProductSchema = new Schema({
	asin: {
		type: String,
		required: true,
		unique: true,
		allowNull: false
	},
	productName: {
		type: String,
		required: true,
		allowNull: false
	},
	productDescription: {
		type: String,
		required: true,
		allowNull: false
	},
	group: [
		[
			{
				type: String,
				required: true,
				allowNull: false
			}
		]
	]
});

mongoose.model('product', ProductSchema);

