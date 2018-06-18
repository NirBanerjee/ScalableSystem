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
		unique: true
	},
	productName: {
		type: Sequelize.STRING,
		required: true
	},
	productDescription: {
		type: Sequelize.TEXT,
		required: true
	},
	group: {
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

module.exports = Products;