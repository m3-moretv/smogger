"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processor = exports.getResponse = exports.resolveRef = exports.getMethodModel = exports.setSpec = void 0;

var _utils = require("../../utils/utils");

var _combiners = require("./combiners");

var _random = _interopRequireDefault(require("random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const processor = (schema, cb) => {
  if ('$ref' in schema) {
    return processor(resolveRef(schema), cb);
  }

  if ('properties' in schema) {
    return (0, _utils.entries)(schema.properties).reduce((result, [key, property]) => {
      result[key] = processor(property, cb);
      return result;
    }, {});
  }

  if ('items' in schema) {
    let combiner = () => schema.items;

    if ('oneOf' in schema.items) {
      combiner = (0, _combiners.oneOf)(schema.items.oneOf);
    }

    if ('anyOf' in schema.items) {
      combiner = (0, _combiners.anyOf)(schema.items.anyOf);
    }

    if ('allOf' in schema.items) {
      combiner = (0, _combiners.allOf)(schema.items.allOf.map(resolveRef));
    }

    const min = schema.minItems || 0;
    const max = schema.maxItems || 15;
    return new Array(_random.default.int(min, max)).fill().map(() => processor(combiner(), cb));
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

    return processor(combiner(), cb);
  }

  return cb(schema);
};

exports.processor = processor;
//# sourceMappingURL=index.js.map