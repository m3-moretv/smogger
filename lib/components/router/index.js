"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listen = exports.createMiddleware = exports.exposeParams = exports.dataToResponse = void 0;

var _koa = _interopRequireDefault(require("koa"));

var _generate = require("./generate");

var _utils = require("../../utils/utils");

var _parser = require("../parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dataToResponse = (data, ctx) => ctx.body = JSON.stringify(data);

exports.dataToResponse = dataToResponse;

const exposeParams = ctx => {
  const {
    params,
    req: {
      method
    },
    _matchedRoute
  } = ctx;
  const path = (0, _utils.formatSwaggerPath)(_matchedRoute);
  const model = (0, _parser.getMethodModel)(path, method);
  return {
    params,
    model
  };
};

exports.exposeParams = exposeParams;

const createMiddleware = (router, processors) => router.use((ctx, next) => {
  if (!ctx.matched.length) {
    return next();
  }

  const {
    params,
    model
  } = exposeParams(ctx);
  const data = processors.reduce((data, processor) => Object.assign(data, processor(params, model, data)), {});
  dataToResponse(data, ctx);
});

exports.createMiddleware = createMiddleware;

const listen = (paths, {
  port
}) => {
  const app = new _koa.default();
  const router = (0, _generate.createRouter)(paths);
  app.use(router.routes()).use(router.allowedMethods());
  app.listen(port);
  console.log(`Mock server working in :${port}`);
  return app;
};

exports.listen = listen;
//# sourceMappingURL=index.js.map