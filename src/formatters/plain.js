import _ from 'lodash';

const stringify = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return String(value);
};

const getPath = (parentNames, name) => [...parentNames, name].join('.');

const iter = (data, parentNames = []) => data
  .filter((node) => node.type !== 'unchanged')
  .flatMap((node) => {
    switch (node.type) {
      case 'added': {
        const { key, value } = node;
        return `Property '${getPath(
          parentNames,
          key,
        )}' was added with value: ${stringify(value)}`;
      }
      case 'deleted': {
        const { key } = node;
        return `Property '${getPath(parentNames, key)}' was removed`;
      }
      case 'changed': {
        const { key, value1, value2 } = node;
        return `Property '${getPath(
          parentNames,
          key,
        )}' was updated. From ${stringify(value1)} to ${stringify(value2)}`;
      }
      case 'nested': {
        const { key, children } = node;
        return iter(children, [getPath(parentNames, key)]);
      }
      default:
        throw new Error(`Node type ${node.type} is not defined`);
    }
  });

const formatToPlain = (tree) => iter(tree).join('\n');

export default formatToPlain;
