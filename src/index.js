import { readFileSync } from 'node:fs';
import { extname, resolve } from 'path';
import parse from './parser.js';
import _ from 'lodash';


const prepareData = (filepath) => {
  const type = extname(filepath).slice(1);
  const formedFilePath = resolve(process.cwd(), filepath);
  const file = readFileSync(formedFilePath, 'utf-8')
  return parse(file, type);
}

const genDiff = (filepath1, filepath2) => {
  const data1 = prepareData(filepath1);
  const data2 = prepareData(filepath2);

  const keysData1 = Object.keys(data1);
  const keysData2 = Object.keys(data2);
  const generalArray = keysData1.concat(keysData2).sort();
  const sortUniqGeneralArray = _.sortedUniq(generalArray);

  const result = sortUniqGeneralArray.map((key) => {
    if (!keysData2.includes(key)) {
      return `- ${key}: ${data1[key]}`;
    }
    if (!keysData1.includes(key)) {
      return `+ ${key}: ${data2[key]}`;
    }
    if (data1[key] === data2[key]) {
      return `  ${key}: ${data1[key]}`;
    }
    return `- ${key}: ${data1[key]} \n+ ${key}: ${data2[key]}`;
  });
  return result.join('\n');
  
};
export default genDiff;