const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

const tableName = 'Translations';
const params = {
  TableName: tableName,
  Select: 'ALL_ATTRIBUTES'
};

function doScan(response) {
  if (response.error) 
    ppJson(response.error);
  else {
    ppJson(response.data);

    if ('LastEvaluatedKey' in response.data) {
      response.request.params.ExclusiveStartKey = response.data.LastEvaluatedKey;
      dynamodb.scan(response.request.params)
        .on('complete', doScan)
        .send();
    }
  }
}

console.log('Starting a Scan of the table');
dynamodb.scan(params)
  .on('complete', doScan)
  .send();