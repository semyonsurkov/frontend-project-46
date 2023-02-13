import _ from 'lodash';

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const getSortedUniqueKeys = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  return _.sortBy(_.union(keys1, keys2));
};

const buildTree = ({ data1, data2 }) => {
  const keys = getSortedUniqueKeys(data1, data2);
  return keys.map((key) => {
    switch (true) {
      case !_.has(data2, key):
        return {
          key,
          type: 'deleted',
          value: data1[key],
        };
      case !_.has(data1, key):
        return {
          key,
          type: 'added',
          value: data2[key],
        };
      case isObject(data1[key]) && isObject(data2[key]):
        return {
          key,
          type: 'nested',
          children: buildTree({ data1: data1[key], data2: data2[key] }),
        };
      case !_.isEqual(data1[key], data2[key]):
        return {
          key,
          type: 'changed',
          value1: data1[key],
          value2: data2[key],
        };
      default:
        return {
          key,
          type: 'unchanged',
          value: data1[key],
        };
    }
  });
};

export default buildTree;
