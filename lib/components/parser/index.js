"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processor = exports.getResponseModel = exports.getMethodModel = void 0;

var _utils = require("../utils");

var _combiners = require("./combiners");

const getMethodModel = spec => (path, method) => spec.paths[path][method.toLowerCase()];

exports.getMethodModel = getMethodModel;

const getResponseModel = (method, status = 200, contentType = 'application/json') => method.responses[status].content[contentType].schema;

exports.getResponseModel = getResponseModel;

const processor = (cb, mutators, schema) => {
  const next = processor.bind(void 0, cb, mutators);

  if (schema.properties) {
    return (0, _utils.entries)(schema.properties).reduce((result, [key, property]) => {
      result[key] = next(property);
      return result;
    }, {});
  }

  if (schema.items) {
    if (mutators.items) {
      return mutators.items(schema).map(item => next(item));
    }

    return next(schema.items);
  }

  if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
    let combiner = () => schema;

    if (schema.oneOf) {
      combiner = (0, _combiners.oneOf)(schema.oneOf);
    }

    if (schema.anyOf) {
      combiner = (0, _combiners.anyOf)(schema.anyOf);
    }

    if (schema.allOf) {
      combiner = (0, _combiners.allOf)(schema.allOf);
    }

    return next(combiner());
  }

  return cb(schema);
};

exports.processor = processor;
//# sourceMappingURL=index.js.map