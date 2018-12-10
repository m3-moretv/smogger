"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockData = void 0;

var _faker = _interopRequireDefault(require("faker"));

var _random = _interopRequireDefault(require("random"));

var _utils = require("../../utils/utils");

var _parser = require("../parser");

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
  maxLength = 500,
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

  if (format === 'image') {
    return 'https://picsum.photos/200/300/?random';
  }

  const normalizeType = formatFakerTypes(type);
  const ftype = format && format.includes('.') ? (0, _utils.objectPath)(_faker.default, format) : _faker.default.random[normalizeType];

  if (format && format.includes('.')) {
    debugger;
  }

  const props = {
    number: {
      min: minimum,
      max: maximum
    },
    words: _random.default.int(minLength, maxLength)
  };

  if (normalizeType === 'words') {
    return ftype(props[normalizeType]).slice(0, maxLength);
  }

  return ftype(props[normalizeType]);
};

const generateArrayItems = schema => {
  const min = schema.minItems || 0;
  const max = schema.maxItems || 15;

  const arrayLength = _random.default.int(min, max);

  return new Array(arrayLength).fill(schema.items);
};

const mockData = (params, model) => {
  return (0, _parser.processor)(createFakeData, {
    items: generateArrayItems
  }, (0, _parser.getResponse)(model));
};

exports.mockData = mockData;
//# sourceMappingURL=index.js.map