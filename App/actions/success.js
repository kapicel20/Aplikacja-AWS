var AWS = require("aws-sdk");
var INDEX_TEMPLATE = "success.ejs";
var simpleDb = require("./simpleDb");
AWS.config.loadFromPath('./config.json');

var task = function (request, callback) {
simpleDb.selectDb();
	var fileParams = {
		bucket: request.query.bucket,
		key: request.query.key
	};
	
	var AttributesPut = [{
				Name: 'name',
				Value: fileParams.key,
				Replace: false
			}, {
				Name: 'date',
				Value: (new Date()).toISOString(),
				Replace: true
}];
	
	
	

	

	simpleDb.putAttributes(fileParams.key, AttributesPut, function () {
		simpleDb.getFromDb(fileParams.key);
	});
	
simpleDb.selectDb();

	callback(null, {
		template: INDEX_TEMPLATE, params: {
			fileName: fileParams.key
		}
	});
}

exports.action = task;