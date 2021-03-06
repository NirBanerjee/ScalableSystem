const Sequelize      = require('sequelize');
const sequelize = new Sequelize('*******', '****', '***********', {
  host: '*************************',
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
	asin: {
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
		type: Sequelize.ENUM,
		required: true,
		values:['Book', 'DVD', 'Music' ,'Electronics', 'Home', 'Beauty', 'Toys', 'Clothing', 'Sports', 'Automotive', 'Handmade'],
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