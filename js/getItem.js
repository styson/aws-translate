const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('../libs/ddbClient.js');

const getItem = async (keyValue, locale, TableName = 'Translations') => {
  try {
    const params = {
      TableName,
      Key: {
        key: { S: keyValue },
        locale: { S: locale },
      }
    };
    const data = await ddbClient.send(new GetItemCommand(params));
    // console.log('Success', data.Item);
    return data;
  } catch (err) {
    console.error(err);
  }
};

module.exports = getItem;