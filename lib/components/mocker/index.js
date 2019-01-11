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

const createEnum = enumElements => (0, _utils.randomElement)(enumElements);

const createDate = () => _faker.default.date.between('2015-01-01', '2021-01-01');

const createBoolean = () => _random.default.boolean();

const createImageLink = () => 'https://picsum.photos/200/300/?random';

const createNumber = (min = 0, max = 99999999, isFloat) => {
  const options = {
    min,
    max
  };
  return isFloat ? _faker.default.random.float(options) : _faker.default.random.number(options);
};

const createString = (format = 'words') => (min, max) => {
  const wordsCount = _random.default.int(min, max);

  const words = _faker.default.random[format](wordsCount);

  return words.slice(0, max);
};

const isFloat = format => format === 'float' || format === 'double';

const isNumber = type => type === 'number' || type === 'integer';

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
    return createEnum(rest.enum);
  }

  if ('nullable' in rest && _random.default.boolean()) {
    return null;
  }

  if (format === 'date') {
    return createDate();
  }

  if (format === 'image') {
    return createImageLink();
  }

  if (type === 'string') {
    return createString(format)(minLength, maxLength);
  }

  if (isNumber(type)) {
    return createNumber(minimum, maximum, isFloat(format));
  }

  if (type === 'boolean') {
    return createBoolean();
  }
};

const generateArrayItems = ({
  minItems = 0,
  maxItems = 15,
  items
}) => {
  const arrayLength = _random.default.int(minItems, maxItems);

  return new Array(arrayLength).fill(items);
};

const mockData = (params, model) => {
  return (0, _parser.processor)(createFakeData, {
    items: generateArrayItems
  }, (0, _parser.getResponse)(model));
};

exports.mockData = mockData;
//# sourceMappingURL=index.js.map