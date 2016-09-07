var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var lwip = require('lwip');
var s3 = new AWS.S3();
var sqs = new AWS.SQS();
var simpledb = new AWS.SimpleDB();
var domainName = 'lukaszz';

function executeMirror(message) {
	
	var bodyMsg = JSON.parse(JSON.stringify(message))[0]["Body"];
	var file = JSON.parse(bodyMsg).file;
	
	var params = {
		Bucket: 'tracz-lab4',
		Key: file
	};
	
	s3.getObject(params, function (err, data) {
		if (err) { console.log(1, err.stack); } 
		else {
			lwip.open(data.Body, 'jpg', function (err, image) {
				image.mirror('x', function (err, image) {
					image.toBuffer('jpg', function (err, buffer) {
						var params1 = {
							Bucket: params.Bucket,
							Key: params.Key,
							Body: buffer,
							ACL: 'public-read'
						};
						
						s3.upload(params1, function (err, data) {
							if (err) console.log("wywala"); // an error occurred
							else console.log("Obrócono");           // successful response
						});
					});
				});
			});
		

			
			var AttributesPut = [];
	
			AttributesPut.push({
				Name: 'mirror', 
				Value: (new Date()).toISOString(),
				Replace: true
			});


			putAttr(file, AttributesPut);
			
			
			}
		});
    
}

var putAttr = function(itemName, attributes)
{
	var params = {
	  Attributes: attributes,
	  DomainName: domainName, /* required */
	  ItemName: itemName, /* required */
	};
	simpledb.putAttributes(params, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     
		  {
			console.log('Zapisano do SimpleDB modyfikacje info');           // successful response
					  }
	});
}

exports.executeMirror= executeMirror;