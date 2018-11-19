"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomElement = exports.objectPath = exports.formatRouterPath = exports.formatSwaggerPath = exports.normalizeUrlParams = exports.spreadToArgs = exports.normalizer = exports.run = exports.entries = void 0;

var _random = _interopRequireDefault(require("random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const entries = Object.entries.bind(Object);
exports.entries = entries;

const run = fn => fn();

exports.run = run;

const normalizer = handler => (acc, arr) => acc.concat(handler(arr));

exports.normalizer = normalizer;

const spreadToArgs = cb => props => cb(...props);

exports.spreadToArgs = spreadToArgs;

const normalizeUrlParams = (subst, brackets = ':$1') => path => path.replace(subst, brackets);

exports.normalizeUrlParams = normalizeUrlParams;
const formatSwaggerPath = normalizeUrlParams(/:(\w+)/g, '{$1}');
exports.formatSwaggerPath = formatSwaggerPath;
const formatRouterPath = normalizeUrlParams(/{(\w+)}/g, ':$1');
exports.formatRouterPath = formatRouterPath;

const objectPath = (object, path, separator = '.') => path.split(separator).reduce((acc, part) => acc[part], object);

exports.objectPath = objectPath;

const randomElement = arr => arr[_random.default.int(0, arr.length - 1)];

exports.randomElement = randomElement;
//# sourceMappingURL=utils.js.map