const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('../libs/ddbClient.js');

const addItem = async (keyValue, locale, translation, TableName = 'Translations') => {
  try {
    const params = {
      TableName,
      Item: {
        key: { S: keyValue },
        locale: { S: locale },
        translation: { S: translation },
      }
    };
    const data = await ddbClient.send(new PutItemCommand(params));
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

module.exports = addItem;