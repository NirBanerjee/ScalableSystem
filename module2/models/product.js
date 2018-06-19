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

const Products = sequelize.define('products', {
	aSin: {
		type: Sequelize.STRING,
		required: true,
		unique: true,
		allowNull: false
	},
	productName: {
		type: Sequelize.STRING,
		required: true,
		allowNull: false
	},
	productDescription: {
		type: Sequelize.TEXT,
		required: true,
		allowNull: false
	},
	group: {
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

module.exports = Products;