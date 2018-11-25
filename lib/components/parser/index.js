"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processor = exports.getResponse = exports.resolveRef = exports.getMethodModel = exports.setSpec = void 0;

var _utils = require("../../utils/utils");

var _combiners = require("./combiners");

let SPEC = null;

const getSpec = () => {
  if (SPEC === undefined) {
    throw new Error(`Spec didn't loaded (or passed to parser). Use setSpec()`);
  }

  return SPEC;
};

const parseRef = ref => (0, _utils.objectPath)(getSpec(), ref.slice(2), '/');

const setSpec = spec => SPEC = spec;

exports.setSpec = setSpec;

const getMethodModel = (path, method) => {
  return getSpec().paths[path][method.toLowerCase()];
};

exports.getMethodModel = getMethodModel;

const resolveRef = schema => {
  if ('$ref' in schema) {
    return parseRef(schema.$ref);
  }

  return schema;
};

exports.resolveRef = resolveRef;

const getResponse = (method, status = 200, contentType = 'application/json') => {
  const schema = method.responses[status].content[contentType].schema;
  return resolveRef(schema);
};

exports.getResponse = getResponse;

const processor = (cb, mutators, schema) => {
  const next = processor.bind(void 0, cb, mutators);

  if ('$ref' in schema) {
    return next(resolveRef(schema));
  }

  if ('properties' in schema) {
    return (0, _utils.entries)(schema.properties).reduce((result, [key, property]) => {
      result[key] = next(property);
      return result;
    }, {});
  }

  if ('items' in schema) {
    if (mutators['items']) {
      return mutators['items'](schema).map(item => next(item));
    }

    return next(schema.items);
  }

  if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
    let combiner = () => schema;

    if ('oneOf' in schema) {
      combiner = (0, _combiners.oneOf)(schema.oneOf);
    }

    if ('anyOf' in schema) {
      combiner = (0, _combiners.anyOf)(schema.anyOf);
    }

    if ('allOf' in schema) {
      combiner = (0, _combiners.allOf)(schema.allOf.map(resolveRef));
    }

    return next(combiner());
  }

  return cb(schema);
};

exports.processor = processor;
//# sourceMappingURL=index.js.map