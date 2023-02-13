import { readFileSync } from 'node:fs';
import { extname, resolve } from 'path';
import process from 'process';
import buildTree from './buildTree.js';
import parse from './parsers.js';
import format from './formatters/index.js';

const prepareData = (filepath) => {
  const type = extname(filepath).slice(1);
  const formedFilePath = resolve(process.cwd(), filepath);
  const file = readFileSync(formedFilePath, 'utf-8');
  return parse(file, type);
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = prepareData(filepath1);
  const data2 = prepareData(filepath2);
  const differanceTree = buildTree(data1, data2);
  return format(differanceTree, formatName);
};
export default genDiff;
