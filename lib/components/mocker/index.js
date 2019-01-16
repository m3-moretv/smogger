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

const getFakerMethod = path => (0, _utils.objectPath)(_faker.default, path);

const createEnum = enumElements => (0, _utils.randomElement)(enumElements);

const createDate = () => _faker.default.date.between(new Date('2015-01-01'), new Date('2021-01-01'));

const createBoolean = () => _random.default.boolean();

const createImageLink = provider => provider.replace('<width>', '200').replace('<height>', '300');

const createNumber = (min = 0, max = 9999999) => {
  const options = {
    min,
    max
  };
  return _faker.default.random.number(options);
};

const createString = (format = 'random.words') => (min, max) => {
  const wordsCount = _random.default.int(min, max);

  const fakerMethod = getFakerMethod(format);
  const words = fakerMethod(wordsCount);
  return words.slice(0, max);
};

const isNumber = type => type === 'number' || type === 'integer';

const createFakeData = ({
  imageProvider
}) => ({
  type,
  format,
  minimum = 0,
  maximum = 99999999,
  minLength = 0,
  maxLength = 500,
  ...rest
}) => {
  if (rest.enum) {
    return createEnum(rest.enum);
  }

  if ('nullable' in rest && _random.default.boolean()) {
    return null;
  }

  if (format === 'date') {
    return createDate();
  }

  if (format === 'image') {
    return createImageLink(imageProvider);
  }

  if (type === 'string') {
    return createString(format)(minLength, maxLength);
  }

  if (isNumber(type)) {
    return createNumber(minimum, maximum);
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

const mockData = ({
  imageProvider
}) => model => {
  return (0, _parser.processor)(createFakeData({
    imageProvider
  }), {
    items: generateArrayItems
  }, (0, _parser.getResponseModel)(model));
};

exports.mockData = mockData;
//# sourceMappingURL=index.js.map