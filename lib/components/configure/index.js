"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = void 0;

var _commander = _interopRequireDefault(require("commander"));

var _package = _interopRequireDefault(require("../../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const configure = () => {
  _commander.default.version(_package.default.version).option('-s --spec <spec>', 'URL or path to spec file (yml, or json is same)', './spec.yaml').option('-p --port <port>', 'Port for fake API', 3000).option('-ip --image-provider <url>', 'Provider for random image. URL includes width and height parameters', 'https://picsum.photos/<width>/<height>/?random').parse(process.argv);

  return _commander.default.opts();
};

exports.configure = configure;
//# sourceMappingURL=index.js.map