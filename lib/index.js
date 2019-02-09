"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Smogger = void 0;

require("source-map-support/register");

var _router = require("./components/router");

var _mocker = require("./components/mocker");

var _swaggerParser = _interopRequireDefault(require("swagger-parser"));

var _parser = require("./components/parser");

var _utils = require("./components/utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Smogger = async config => {
  const { spec: pathToSpec, port, imageProvider } = config;
  const spec = await _swaggerParser.default.dereference(pathToSpec);
  const mocker = (0, _mocker.createMockGenerator)({
    imageProvider
  });
  const getMethod = (0, _parser.getMethodModel)(spec);
  const router = (0, _router.createHTTPServer)(
    {
      port: Number(port)
    },
    [(0, _utils.compose)(mocker, getMethod)]
  );
  return router(spec.paths);
};

exports.Smogger = Smogger;
//# sourceMappingURL=index.js.map
