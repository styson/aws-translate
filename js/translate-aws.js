const { TranslateClient, TranslateTextCommand  } = require("@aws-sdk/client-translate");

const translate = async (locale, input) => {
  const REGION = 'us-west-2';
  const client = new TranslateClient({ region: REGION });

  const params = {
    SourceLanguageCode: 'en',
    TargetLanguageCode: locale,
    Text: input
  };

  const command = new TranslateTextCommand (params);
  const data = await client.send(command);

  return data;
};

module.exports = translate;