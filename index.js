const { parse } = require('postcss');

const camel = s => s.replace(/-([a-z]?)/g, (_, x) => x.toUpperCase());

const parsePx = val => /^\d+(\.\d+)?px$/.test(val)
  ? parseFloat(val.slice(0, -2))
  : val;

const recurseNodes = (nodes, opts) => nodes.reduce(
  (o, node) => {
    switch (node.type) {
      case 'decl':
        o[opts.parseKey(node.prop)] = opts.parseNumber(node.value);
        break;
      case 'rule':
        o[node.selector] = recurseNodes(node.nodes, opts);
        break;
      case 'atrule':
        o[`@${node.name} ${node.params}`] = recurseNodes(node.nodes, opts);
        break;
    }
    return o;
  },
  {}
);

module.exports = (css, { camelCase = true, numbers = true } = {}) => {
  const tree = parse(css);
  return recurseNodes(tree.nodes, {
    parseNumber: numbers ? parsePx : x => x,
    parseKey: camelCase ? camel : x => x,
  });
};
