import { expect, test, describe } from '@jest/globals';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFixtureFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const cases = ['json'];
const expectedOutput = readFixtureFile('rightjson.txt');

describe('genDiff', () => {
  test.each(cases)('Compare format %s', (format) => {
    const filepath1 = getFixturePath(`filepath1.${format}`);
    const filepath2 = getFixturePath(`filepath2.${format}`);
    expect(genDiff(filepath1, filepath2)).toBe(expectedOutput);
  });
});