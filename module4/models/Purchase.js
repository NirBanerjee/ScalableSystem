const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the schema
const PurchaseSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		allowNull: false
	},
	products: [
		{
			asin: {
				type: String,
				required: true,
				allowNull: false

			},
			productName: {
				type: String,
				required: true,
				allowNull: false
			}
		}
	]
});

mongoose.model('purchase', PurchaseSchema);