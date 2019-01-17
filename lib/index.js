#!/usr/bin/env node
"use strict";

require("source-map-support/register");

var _configure = require("./components/configure");

var _router = require("./components/router");

var _mocker = require("./components/mocker");

var _swaggerParser = _interopRequireDefault(require("swagger-parser"));

var _parser = require("./components/parser");

var _utils = require("./components/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = (0, _configure.configure)();
const SPEC_PATH = config.spec;
const PORT = Number(config.port);
const cfg = {
  imageProvider: config.imageProvider
};
const mocker = (0, _mocker.mockData)(cfg);

_swaggerParser.default.dereference(SPEC_PATH).then(spec => {
  const getMethod = (0, _parser.getMethodModel)(spec);
  const router = (0, _router.createHTTPServer)({
    port: PORT
  }, [(0, _utils.compose)(mocker, getMethod)]);
  router(spec.paths);
});
//# sourceMappingURL=index.js.map