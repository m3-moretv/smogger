"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockData = void 0;

var _faker = _interopRequireDefault(require("faker"));

var _random = _interopRequireDefault(require("random"));

var _utils = require("../../utils/utils");

var _parser = require("../parser");

var _combiners = require("./combiners");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const formatFakerTypes = type => {
  switch (type) {
    case 'number':
    case 'integer':
      return 'number';

    case 'string':
      return 'words';

    default:
      return type;
  }
};

const createFakeData = ({
  type,
  format,
  minimum = 0,
  maximum = 99999999,
  minLength = 0,
  maxLength = 100,
  ...rest
}) => {
  if ('enum' in rest) {
    return (0, _utils.randomElement)(rest.enum);
  }

  if ('nullable' in rest && _random.default.boolean()) {
    return null;
  }

  if (format === 'date') {
    return _faker.default.date.between('2015-01-01', '2021-01-01');
  }

  const normalizeType = formatFakerTypes(type);
  const ftype = format && format.includes('.') ? (0, _utils.objectPath)(_faker.default, format) : _faker.default.random[normalizeType];
  const props = {
    number: {
      minimum,
      maximum
    },
    words: _random.default.int(minLength, maxLength)
  };
  return ftype(props[normalizeType]);
};

const mock = schema => {
  if ('$ref' in schema) {
    return mock((0, _parser.resolveRef)(schema));
  }

  if ('properties' in schema) {
    return (0, _utils.entries)(schema.properties).reduce((result, [key, property]) => {
      result[key] = mock(property);
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
      combiner = (0, _combiners.allOf)(schema.items.allOf);
    }

    const min = schema.minItems || 0;
    const max = schema.maxItems || 15;
    return new Array(_random.default.int(min, max)).fill().map(() => mock(combiner()));
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
      combiner = (0, _combiners.allOf)(schema.allOf);
    }

    return mock(combiner());
  }

  return createFakeData(schema);
};

const mockData = (params, model) => {
  const responseModel = (0, _parser.getResponse)(model);
  return mock(responseModel);
};

exports.mockData = mockData;
//# sourceMappingURL=index.js.map