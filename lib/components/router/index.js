"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHTTPServer = exports.createMiddleware = void 0;

var _koa = _interopRequireDefault(require("koa"));

var _generate = require("./generate");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dataToResponse = (data, ctx) => ctx.body = JSON.stringify(data);

const exposeRequestProps = ctx => {
  const {
    req: {
      method
    },
    _matchedRoute
  } = ctx;
  const path = (0, _utils.formatSwaggerPath)(_matchedRoute);
  return {
    path,
    method
  };
};

const createMiddleware = (app, middlewares) => app.use((ctx, next) => {
  let data = {};

  if (!ctx.matched.length) {
    return next();
  }

  const {
    path,
    method
  } = exposeRequestProps(ctx);
  const processor = (0, _utils.compose)(...middlewares);
  data = processor(path, method, data);
  dataToResponse(data, ctx);
});

exports.createMiddleware = createMiddleware;

const createHTTPServer = ({
  port
}, middlewares) => paths => {
  const app = new _koa.default();
  const router = (0, _generate.createRouter)(paths);
  app.use(router.routes()).use(router.allowedMethods());
  createMiddleware(app, middlewares);
  app.listen(port);
  console.log(`Mock server working on :${port}`);
  return app;
};

exports.createHTTPServer = createHTTPServer;
//# sourceMappingURL=index.js.map