const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('../libs/ddbClient.js');

const updateItem = async (keyValue, locale, translation, TableName = 'Translations') => {
  try {
    const params = {
      TableName,
      Key: {
        key: { S: keyValue },
        locale: { S: locale },
      },
      UpdateExpression: 'set #tran = :t',
      ExpressionAttributeNames: { 
        '#tran': 'translation',
      },
      ExpressionAttributeValues: { 
        ':t': { S: translation },
      },
    };
    return await ddbClient.send(new UpdateItemCommand(params));
  } catch (err) {
    console.error(err);
  }
};

module.exports = updateItem;