import _ from 'lodash';

const space = ' ';
const spaceCounts = 4;
const signSpace = 2;

const indent = (depth, isFull = true) => {
  const indentSize = depth * spaceCounts;
  return isFull
    ? space.repeat(indentSize)
    : space.repeat(indentSize - signSpace);
};

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return String(data);
  }
  const lines = Object.entries(data).map(
    ([key, value]) => `${indent(depth + 1)}${key}: ${stringify(value, depth + 1)}`,
  );
  return `{\n${lines.join('\n')}\n${indent(depth)}}`;
};

const iter = (data, depth = 1) => data.map((node) => {
  switch (node.type) {
    case 'added': {
      const { key, value } = node;
      return `${indent(depth, false)}+ ${key}: ${stringify(value, depth)}`;
    }
    case 'deleted': {
      const { key, value } = node;
      return `${indent(depth, false)}- ${key}: ${stringify(value, depth)}`;
    }
    case 'unchanged': {
      const { key, value } = node;
      return `${indent(depth)}${key}: ${stringify(value, depth)}`;
    }
    case 'changed': {
      const { key, value1, value2 } = node;
      const line1 = `${indent(depth, false)}- ${key}: ${stringify(
        value1,
        depth,
      )}`;
      const line2 = `${indent(depth, false)}+ ${key}: ${stringify(
        value2,
        depth,
      )}`;
      return `${line1}\n${line2}`;
    }
    case 'nested': {
      const { key, children } = node;
      const lines = iter(children, depth + 1).join('\n');
      return `${indent(depth)}${key}: {\n${lines}\n${indent(depth)}}`;
    }
    default:
      throw new Error(`Node type ${node.type} is not defined`);
  }
});

const formatToStylish = (tree) => {
  const lines = iter(tree);
  return `{\n${lines.join('\n')}\n}`;
};

export default formatToStylish;
