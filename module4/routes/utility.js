const mongoose = require('mongoose');
mongoose.set('debug', true);

require('../models/Recommendation');
const Recommendation = mongoose.model('recommendation');

var getPromise = (key, productChain) => {
	console.log("In Utility");
	console.log(key, productChain);
	return Recommendation.findOne({
		asin: key
	})
	.then((record) => {
		if (!record)	{
			var prodArr = []
			for (var i = 0; i < productChain.length; i++)	{
				prodArr.push(productChain[i]);
			}
			obj = {
				asin: key,
				products: prodArr
			}
			return new Recommendation(obj)
			.save()
		}	else	{
			for (var i = 0; i < productChain.length; i++)	{
				record.products.push(productChain[i]);
			}
			return record.save()
		}
	});
}

module.exports = getPromise;