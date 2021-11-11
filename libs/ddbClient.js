const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const REGION = 'us-west-2';
const ddbClient = new DynamoDBClient({ 
	region: REGION,
	endpoint: 'http://localhost:8000',
});

module.exports = { ddbClient };
