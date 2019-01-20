"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouter = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _utils = require("../utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const log = ([path, methods]) => {
  console.log(`Create path ${path}`);
  console.log(`With methods`);
  Object.keys(methods).forEach(method => {
    console.log(`– ${method}`);
  });
  console.log("");
  return [path, methods];
};

const setRouteName = operationId => operationId || null;

const defaultResponse = (ctx, next) => {
  ctx.body = `params: ${JSON.stringify(ctx.params, null, 2)}`;
  next();
};

const getRouterMethod = router => type => {
  switch (type) {
    case "get":
      return router.get;

    case "post":
      return router.post;

    case "delete":
      return router.delete;

    case "put":
      return router.put;

    case "update":
      return router.post;

    default:
      return router.get;
  }
};

const createMethod = (
  router // save router
) => (
  path // save path
) => (
  type, // bind method to router with saved path
  { operationId }
) =>
  getRouterMethod(router)(type).bind(
    router,
    setRouteName(operationId),
    path,
    defaultResponse
  );

const createRouter = paths => {
  const router = new _koaRouter.default();
  const createMethodWithRouter = createMethod(router);
  (0, _utils.entries)(paths)
    .map(log)
    .map(([path, methods]) => [(0, _utils.formatRouterPath)(path), methods]) // /path/{param} => /path/:param
    .map(([path, methods]) => [
      createMethodWithRouter(path),
      (0, _utils.entries)(methods)
    ]) // Создаем функцию для привязки метода к пути и получаем [methodName, methodParams]
    .reduce(
      (0, _utils.normalizer)(
        ([bindMethodToRouter, methods]) =>
          methods.map((0, _utils.spreadToArgs)(bindMethodToRouter)) // bindMethodToRouter <- methodProps, возвращаем функцию привязки метода со всеми пропсами
      ),
      []
    )
    .forEach(_utils.run); // Привязываем каждый метод к роутеру

  return router;
};

exports.createRouter = createRouter;
//# sourceMappingURL=generate.js.map
