"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResponse = exports.resolveRef = exports.getMethodModel = exports.setSpec = void 0;

var _swaggerParser = _interopRequireDefault(require("swagger-parser"));

var _utils = require("../../utils/utils");

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
//# sourceMappingURL=index.js.map