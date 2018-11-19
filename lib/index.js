#!/usr/bin/env node
"use strict";

var _swaggerParser = _interopRequireDefault(require("swagger-parser"));

var _configure = require("./components/configure");

var _parser = require("./components/parser");

var _router = require("./components/router");

var _validator = require("./components/validator");

var _mocker = require("./components/mocker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = (0, _configure.configure)();
const SPEC_PATH = config.spec;
const PORT = config.port;

_swaggerParser.default.parse(SPEC_PATH).then(_parser.setSpec).then(spec => {
  const router = (0, _router.listen)(spec.paths, {
    port: PORT
  });
  (0, _router.createMiddleware)(router, [_validator.checkPathProps, _mocker.mockData]);
});
//# sourceMappingURL=index.js.map