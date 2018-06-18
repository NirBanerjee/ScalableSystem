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
	firstName: {
		type: Sequelize.STRING,
		required: true
	},
	lastName: {
		type: Sequelize.STRING,
		required: true
	},
	address: {
		type: Sequelize.STRING,
		required: true
	},
	city: {
		type: Sequelize.STRING,
		required: true
	},
	state: {
		type: Sequelize.STRING,
		required: true
	},
	zip: {
		type: Sequelize.STRING,
		required: true
	},
	email: {
		type: Sequelize.STRING,
		required: true
	},
	username: {
		type: Sequelize.STRING,
		required: true,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		required: true
	}
});

sequelize.sync({
  force: true
})
  .then(() => {
    console.log("Query executed Successfully!!!")
  });

module.exports = Users;