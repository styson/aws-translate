const fs = require('fs');
const mkdirp = require('mkdirp');
const neatCsv = require('neat-csv'); // https://github.com/sindresorhus/neat-csv
const fastCsv = require('fast-csv'); // https://c2fo.io/fast-csv/

const addItem = require('./addItem.js');
const getItem = require('./getItem.js');
const targets = require('./targets.js');
const aTranslate = require('./translate-aws.js');
const gTranslate = require('./translate-google.js');
const updateItem = require('./updateItem.js');

const inputFolder = 'C:\\projects\\blue\\agent\\source\\i18n\\Data\\en\\';
// const inputFiles = ['20.8.organizations.en.csv'];
const inputFiles = ['20.8.sites.en.csv'];

const resetDB = false;
const aws = true;

let inputFile = '';
let file = '';

async function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function writeFile(strArray, output) {
  const dir = `../results/${output}`;
  mkdirp.sync(dir);

  const outputFile = `${dir}/${inputFile.replace('.en.',`.${output}.`)}`;
  return new Promise(resolve => {
    const ws = fs.createWriteStream(outputFile);
    fastCsv
      .write(strArray, { headers: false, quoteColumns: true })
      .pipe(ws);
    ws.on('finish', () => ws.close(resolve));
  });
}

async function process(data) {
  const keys = await neatCsv(data);

  for (const target of targets) {
    for (const output of target.out) {
      let strArray = [];
      strArray.push({
          Key: 'Key',
          en: 'en',
          output,
        });
      for (const key of keys) {
        const obj = {
          Key: key.Key,
          en: key.en,
          output: '',
        }

        let existingTranslation = '';
        const item = await getItem(obj.Key, output);
        if (item.Item) {
          if(!resetDB) existingTranslation = item.Item.translation.S;
        }

        if (existingTranslation > '') {
          obj.output = existingTranslation;
          // console.log(`found ${existingTranslation}`)
        } else {
          const targetLocale = target.code === 'zh-CN' ? 'zh' : target.code;
          let translatedText = '';

          if(aws) {
            const result = await aTranslate(targetLocale, obj.en);
            if(result.$metadata.httpStatusCode == 200) {
              translatedText = result.TranslatedText;
              // console.log(`aws result for ${targetLocale} is ${translatedText}`)
            }
          } else {
            // console.log(`google translate request for ${obj.en}`)
            translatedText = await gTranslate(targetLocale, obj.en);
            // console.log(`google result for ${targetLocale} is ${translatedText}`)
          }

          if(resetDB) {
            await updateItem(obj.Key, output, translatedText);
          } else {
            await addItem(obj.Key, output, translatedText);
          }
          obj.output = translatedText;
        }

        strArray.push(obj);
      }

      await writeFile(strArray, output);
    }
  }
}

async function main() {
  for (inputFile of inputFiles) {
    file = `${inputFolder}${inputFile}`;
    console.log(file);
    const data = await readFile();
    await process(data);
  }
}

main();
