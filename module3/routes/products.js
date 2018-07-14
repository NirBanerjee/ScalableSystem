const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const hashmap = require('hashmap');

//Set Debug mode
mongoose.set('debug', true);

//Load Product Model
require('../models/Product');
require('../models/Purchase');
require('../models/User');
require('../models/Recommendation');
const Product = mongoose.model('product');
const Purchase = mongoose.model('purchase');
const User = mongoose.model('user');
const Recommendation = mongoose.model('recommendation');

//Load external function
const getPromise = require('./utility')

router.post("/addProducts", (request, response) => {
	console.log("=============================")
	console.log("Add Products Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	if (request.session.role != "admin")	{
		return response.json({
			"message": "You must be an admin to perform this action"
		});
	}

	const asin = request.body.asin;
	const productName = request.body.productName;
	const productDescription = request.body.productDescription;
	const group = request.body.group;

	if (!asin || asin.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!productName || productName.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!productDescription || productDescription.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!group || group.length == 0)	{
		response.json({
			"message": "The input you provided is not valid"
		});
	}

	new Product(request.body)
	.save()
	.then(() => {
		console.log("Product added to Database");
		console.log("=======================");
		response.json({
			"message": request.body.productName + " was successfully added to the system"
		})
	})
	.catch((err) => {
		console.log("Product add process failed");
		console.log("=======================");
		response.json({
			"message": "The input you provided is not valid"
		});
	})
});

router.post("/modifyProduct", (request, response) => {
	console.log("=============================")
	console.log("Modify Products Action");
	console.log("================");
	console.log(request.body);
	console.log("================");
	
	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	if (request.session.role != "admin")	{
		return response.json({
			"message": "You must be an admin to perform this action"
		});
	}

	const asin = request.body.asin;
	const productName = request.body.productName;
	const productDescription = request.body.productDescription;
	const group = request.body.group;

	if (!asin || asin.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!productName || productName.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!productDescription || productDescription.length == 0)	{
		return response.json({
			"message": "The input you provided is not valid"
		});
	}
	if (!group || group.length == 0)	{
		response.json({
			"message": "The input you provided is not valid"
		});
	}

	Product.findOne({
		asin: asin
	})
	.then((row) => {
		row.productName = productName;
		row.productDescription = productDescription;
		console.log("New Product Details = ");
		console.log(row);
		row.save()
		.then(() => {
			console.log("Product Updated Successfully");
			response.json({
				"message": row.productName + " was successfully updated"
			});
		})
		.catch((err) => {
			console.log("Error Updating Product");
			console.log(err);
			response.json({
				"message": "The input you provided is not valid"
			});
		})
	})
	.catch((err) => {
		console.log("Error Retrieving Product");
		console.log("=====================");
		console.log(err);
		response.json({
			"message": "The input you provided is not valid"
		});
	})
});

router.post("/viewProducts", (request, response) => {
	console.log("=============================")
	console.log("View Products Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	var asin = request.body.asin;
	var keyword = request.body.keyword;
	var group = request.body.group;

	if (typeof asin != 'undefined' && asin.length > 0)	{
		console.log("Asin Found");
		Product.find({ asin: asin}, {"asin": 1, "productName": 1, "_id": 0})
		.then((record) => {
			console.log(record);
			response.json({
				"product": record
			});
		})
		.catch((err) => {
			console.log("No product found with the asin.");
			console.log("================");
			console.log(err);
			response.json({
				"message": "There are no products that match that criteria"
			});
		})
	}	else {
		console.log("Searching by keyword and group");
		console.log("================");
		if (!group || group.length == 0)	{
			group = "";
		}

		if (!keyword || keyword.length == 0)	{
			keyword = "";
		}

		Product.find(
		{
			group: new RegExp(group, 'i'),
			$or: [{
					productName: new RegExp(keyword, 'i')
				},
				{
					description: new RegExp(keyword, 'i')
				}
			],
		},
		{
			"asin": 1, 
			"productName": 1, 
			"_id": 0
		})
		.then((records) => {
			console.log(records.length + " records retrieved");
			if (records.length == 0)	{
				return response.json({
					"message": "There are no products that match that criteria"
				});
			}
			response.json({
				"product": records
			});

		})
		.catch((err) => {
			console.log("No product found with the keyword and group.");
			console.log("================");
			console.log(err);
			response.json({
				"message": "There are no products that match that criteria"
			});
		})
	}	
});

router.post("/buyProducts", (request, response) => {
	console.log("=============================")
	console.log("Buy Products Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	var uName = request.session.username;
	var productList = request.body.products;
	var purchaseList;
	var recommendationMap;

	if (productList.length == 0)	{
		return response.json({
			"message": "There are no products that match that criteria"
		});
	}

	Product.find({
		$or: productList
	},
	{
		"asin": 1, 
		"productName": 1, 
		"_id": 0
	})
	.then((records) => {
		console.log("Records Returned - " + records.length);
		//console.log(records);

		if (records.length != productList.length)	{
			console.log("Product ids incorrect");
			throw {
				"message": "There are no products that match that criteria"
			};
		}
		
		purchaseList = records;
		return Purchase.findOne({
			username: uName
		})
	})
	.then((userData) => {
		if (!userData)	{
			console.log("First Purchase Transaction....");
			new Purchase({
				username: uName,
				products: purchaseList
			}).save()
		} else {
			console.log("Appending Purchase Transaction....");
			var i;
			for (i = 0; i < purchaseList.length; i++)	{
				userData.products.push(purchaseList[i]);
			}
			return userData.save()
		}
	})
	.then(() => {
		console.log("Successful save to Purchase table");
		var i = 0;
		var j = 0;
		recommendationMap = {};

		for(var i=0;i<productList.length;i++) {
			var key = productList[i].asin;
			recommendationMap[key] = new Array();
		}

		Object.keys(recommendationMap).forEach((key) => {
			for(var i = 0; i < productList.length; i++) {
				if(key!== productList[i].asin) {
					recommendationMap[key].push(productList[i].asin);
				}
			}
		})
		console.log(JSON.stringify(recommendationMap), recommendationMap instanceof Array);

		var searchPromiseList = [];
		mapKeyList = Object.keys(recommendationMap);
		for (var i = 0; i < mapKeyList.length; i++)	{
			productChain = recommendationMap[mapKeyList[i]];
			console.log(productChain);
			searchPromiseList.push(getPromise(mapKeyList[i], productChain));
		}
		
		return Promise.all(searchPromiseList);
	})
	.then((retMsg) => {
		console.log("Recommendation DB Updated");
		console.log(retMsg);
		return response.send({
			"message": "The action was successful"
		});
	})
	.catch((err) => {
		console.log("UnSuccessful save");
		console.log(err);
		return response.json(err);
	})
 });

router.post("/productsPurchased", (request, response) => {
	console.log("=============================")
	console.log("Products Purchased Action");
	console.log("================");
	console.log(request.body);
	console.log("================");
	
	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	if (request.session.role != "admin")	{
		return response.json({
			"message": "You must be an admin to perform this action"
		});
	}

	Purchase.findOne({
		username: request.body.username
	})
	.then((record) => {
		if (!record)	{
			throw {
				"message": "“There are no users that match that criteria"
			}
		}
		productCount = {};
		var i;
		for (i = 0; i < record.products.length; i++)	{
			if (!productCount[record.products[i].asin])	{
				Obj = {
					productName: record.products[i].productName,
					count: 1
				}
				productCount[record.products[i].asin] = Obj;
			}	else	{
				productCount[record.products[i].asin].count = productCount[record.products[i].asin].count + 1;
			}
		}

		console.log(productCount);
		var keyList = Object.keys(productCount);
		var products = []
		for (i = 0; i < keyList.length; i++)	{
			products.push(productCount[keyList[i]]);
		}
		response.json({
			"message": "The action was successful",
			"products": products
		});
	})
	.catch((err) => {
		console.log("Something Wrong");
		console.log(err);
		response.json(err);
	});
});

router.post("/getRecommendations", (request, response) => {
	console.log("=============================")
	console.log("Get Recommendation Action");
	console.log("================");
	console.log(request.body);
	console.log("================");

	if (! request.session.username)	{
		return response.json({
			"message": "You are not currently logged in"
		});
	}

	var prodId = request.body.asin;

	Recommendation.findOne({
		asin: prodId
	})
	.then((row) => {
		if (!row)	{
			return response.json({
				"message": "There are no recommendations for that product"
			});
		}

		var prodArr = row.products;
		if (prodArr.length == 0)	{
			return response.json({
				"message": "There are no recommendations for that product"
			});
		}

		recommendationArr = [];
		recommendationMap = {};
		for (var i = 0; i < prodArr.length; i++)	{
			if (!recommendationMap[prodArr[i]])	{
				recommendationMap[prodArr[i]] = 1
			}	else	{
				recommendationMap[prodArr[i]] = recommendationMap[prodArr[i]] + 1;
			}
		}

		console.log(recommendationMap);
		var recommendationMapSorted = Object.keys(recommendationMap).sort((a,b) => {
			return recommendationMap[b] - recommendationMap[a];
		});
		console.log(recommendationMapSorted);
		recommendationMapSorted = recommendationMapSorted.splice(0,5);
		console.log(recommendationMapSorted);

		for (var i = 0; i < recommendationMapSorted.length; i++)	{
			obj = {
				"asin": recommendationMapSorted[i]
			}
			recommendationArr.push(obj);
		}
		response.json({
			"message": "The action was successful",
			"products": recommendationArr
		});
	})
	.catch((err) => {
		console.log("Error");
		console.log(err);
		response.json({
			"message": "There are no recommendations for that product"
		});
	})
});


module.exports = router;