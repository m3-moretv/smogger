"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockGenerator = void 0;

var _faker = _interopRequireDefault(require("faker"));

var _random = _interopRequireDefault(require("random"));

var _utils = require("../utils");

var _parser = require("../parser");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const getFakerMethod = path => (0, _utils.objectPath)(_faker.default, path);

const createEnum = enumElements => (0, _utils.randomElement)(enumElements);

const createDate = () =>
  _faker.default.date.between(new Date("2015-01-01"), new Date("2021-01-01"));

const createBoolean = () => _random.default.boolean();

const createImageLink = (provider, width = 200, height = 300) =>
  provider
    .replace("<width>", String(width))
    .replace("<height>", String(height));

const createNumber = (min = 0, max = 9999999) => {
  const options = {
    min,
    max
  };
  return _faker.default.random.number(options);
};

const createString = (format = "random.words") => (min, max) => {
  const wordsCount = _random.default.int(min, max);

  const fakerMethod = getFakerMethod(format);
  const words = fakerMethod(wordsCount);
  return words.slice(0, max);
};

const isNumber = type => type === "number" || type === "integer";

const extractImageSize = format =>
  format
    .replace(/^image\[(\d+x\d+)\]/g, "$1")
    .split("x")
    .map(Number);

const createFakeData = ({ imageProvider }) => ({
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

  if ("nullable" in rest && _random.default.boolean()) {
    return null;
  }

  if (format === "date") {
    return createDate();
  }

  if (/^image\[\d+x\d+\]/.test(format)) {
    const [width, height] = extractImageSize(format);
    return createImageLink(imageProvider, width, height);
  }

  if (/^image/.test(format)) {
    return createImageLink(imageProvider);
  }

  if (type === "string") {
    return createString(format)(minLength, maxLength);
  }

  if (isNumber(type)) {
    return createNumber(minimum, maximum);
  }

  if (type === "boolean") {
    return createBoolean();
  }
};

const generateArrayItems = ({ minItems = 0, maxItems = 15, items }) => {
  const arrayLength = _random.default.int(minItems, maxItems);

  return new Array(arrayLength).fill(items);
};

const createMockGenerator = ({ imageProvider }) => model => {
  return (0, _parser.processor)(
    createFakeData({
      imageProvider
    }),
    {
      items: generateArrayItems
    },
    (0, _parser.getResponseModel)(model)
  );
};

exports.createMockGenerator = createMockGenerator;
//# sourceMappingURL=index.js.map
