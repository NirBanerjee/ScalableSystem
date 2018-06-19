const Sequelize      = require('sequelize');
const sequelize = new Sequelize('project2', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Users = sequelize.define('users', {
	fname: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	lname: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	address: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	city: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	state: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	zip: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	username: {
		type: Sequelize.STRING,
		required: true,
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	role: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	}
});

sequelize.sync({
	logging: console.log
})
  .then(() => {
    console.log("Query executed Successfully!!!")
  });

module.exports = Users;