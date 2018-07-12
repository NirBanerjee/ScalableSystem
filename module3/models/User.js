const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the schema
const UserSchema = new Schema({
	fname: {
		type: String,
		required: true,
		allowNull: false
	},
	lname: {
		type: String,
		required: true,
		allowNull: false
	},
	address: {
		type: String,
		required: true,
		allowNull: false
	},
	city: {
		type: String,
		required: true,
		allowNull: false
	},
	state: {
		type: String,
		required: true,
		allowNull: false
	},
	zip: {
		type: String,
		required: true,
		allowNull: false
	},
	email: {
		type: String,
		required: true,
		allowNull: false
	},
	username: {
		type: String,
		required: true,
		unique: true,
		allowNull: false
	},
	password: {
		type: String,
		required: true,
		allowNull: false
	}
});

mongoose.model('user', UserSchema);