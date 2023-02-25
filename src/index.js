import { readFileSync } from 'node:fs';
import { extname, resolve } from 'path';
import process from 'process';
import buildTree from './buildTree.js';
import parse from './parsers.js';
import format from './formatters/index.js';

const getFileType = (filepath) => extname(filepath).slice(1);

const getAbsoluteFilePath = (filepath) => resolve(process.cwd(), filepath);

const prepareData = (filepath) => {
  const type = getFileType(filepath);
  const formedFilePath = getAbsoluteFilePath(filepath);
  const data = readFileSync(formedFilePath, 'utf-8');
  return parse(data, type);
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = prepareData(filepath1);
  const data2 = prepareData(filepath2);
  const differanceTree = buildTree(data1, data2);
  return format(differanceTree, formatName);
};
export default genDiff;
