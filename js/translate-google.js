const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

const gTranslate = async (target, text) => {
  const [translation] = await translate.translate(text, target);
  return translation;
};

module.exports = gTranslate;