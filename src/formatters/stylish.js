import _ from 'lodash';

const space = ' ';
const spaceCount = 4;
const signSpace = 2;

const indent = (depth, isFull = true) => {
  const indentSize = depth * spaceCount;
  return isFull
    ? space.repeat(indentSize)
    : space.repeat(indentSize - signSpace);
};

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return String(value);
  }
  const lines = Object.entries(value).map(
    ([key, val]) => `${indent(depth + 1)}${key}: ${stringify(val, depth + 1)}`,
  );
  return `{\n${lines.join('\n')}\n${indent(depth)}}`;
};

const iter = (data, depth = 1) => data.flatMap((node) => {
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
      return [line1, line2];
    }
    case 'nested': {
      const { key, children } = node;
      const childrenTree = iter(children, depth + 1).join('\n');
      return `${indent(depth)}${key}: {\n${childrenTree}\n${indent(depth)}}`;
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
