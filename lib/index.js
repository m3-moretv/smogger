#!/usr/bin/env node
"use strict";

var _ballboy = require("ballboy");

var _configure = require("./components/configure");

var _parser = require("./components/parser");

var _router = require("./components/router");

var _mocker = require("./components/mocker");

var _yamljs = _interopRequireDefault(require("yamljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = (0, _configure.configure)();
const SPEC_PATH = config.spec;
const PORT = Number(config.port);
(0, _ballboy.ballboy)(SPEC_PATH).then(_yamljs.default.parse).then(_parser.setSpec).then(spec => {
  const router = (0, _router.listen)(spec.paths, {
    port: PORT
  });
  const cfg = {
    imageProvider: config.imageProvider
  };
  (0, _router.createMiddleware)(router, [(0, _mocker.mockData)(cfg)]);
});
//# sourceMappingURL=index.js.map