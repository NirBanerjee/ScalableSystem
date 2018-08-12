const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the schema
const RecommendationSchema = new Schema({
	asin: {
		type: String,
		required: true,
		allowNull: false,
		unique: true
	},
	products: [
		{
			type: String
		}
	]
});

mongoose.model('recommendation', RecommendationSchema);