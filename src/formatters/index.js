import stylish from './stylish.js';

const format = (tree, formatName) => {
  switch (formatName) {
    case 'stylish':
      return stylish(tree);
    case 'json':
      return JSON.stringify(tree);
    default:
      throw new Error(`Format name ${formatName} is not defined`);
  }
};
export default format;
