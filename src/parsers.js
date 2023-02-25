import { load } from 'js-yaml';

export default (data, type) => {
  switch (type) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
    case 'yml':
      return load(data);
    default:
      throw new Error(`Unknown format: ${type}`);
  }
};
