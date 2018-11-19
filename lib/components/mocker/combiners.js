"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allOf = exports.anyOf = exports.oneOf = void 0;

var _utils = require("../../utils/utils");

var _parser = require("../parser");

const oneOf = combines => {
  const combiner = (0, _utils.randomElement)(combines);
  return () => combiner;
};

exports.oneOf = oneOf;

const anyOf = combines => () => (0, _utils.randomElement)(combines);

exports.anyOf = anyOf;

const allOf = combines => () => combines.reduce((acc, schema) => {
  return Object.assign(acc, (0, _parser.resolveRef)(schema.properties || schema));
}, {});

exports.allOf = allOf;
//# sourceMappingURL=combiners.js.map