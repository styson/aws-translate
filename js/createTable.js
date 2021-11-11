const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('../libs/ddbClient.js');

// Set the parameters
const params = {
  KeySchema: [
    {
      AttributeName: 'key',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'locale',
      KeyType: 'RANGE',
    },
  ],

  AttributeDefinitions: [
    {
      AttributeName: 'key',
      AttributeType: 'S',
    },
    {
      AttributeName: 'locale',
      AttributeType: 'S',
    },
  ],

  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },

  TableName: 'Translations',

  StreamSpecification: {
    StreamEnabled: false,
  },
};

const run = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(params));
    console.log('Table Created', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

run();
