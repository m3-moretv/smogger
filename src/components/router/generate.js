import Router from 'koa-router';
import { normalizer, entries, run, spreadToArgs, formatRouterPath } from "../../utils/utils";
import type { Paths } from "../../types/Swagger";

const setRouteName = (operationId: string): ?string => operationId || null;
const defaultResponse = (ctx, next) => {
  ctx.body = `${ctx.routerName}: ${JSON.stringify(ctx.params, null, 2)}`;
  next();
};

const createMethod =
  router => // save router
    path => // save path
      (type, {operationId}) => // bind method to router with saved path
        router[type].bind(router, setRouteName(operationId), path, defaultResponse);

export const createRouter = (paths: Paths, config = {}) => {
  const router = new Router(config);
  const createMethodWithRouter = createMethod(router);

  entries(paths)
    .map(([path, methods]) => [formatRouterPath(path), methods]) // /path/{param} => /path/:param
    .map(([path, methods]) => [createMethodWithRouter(path), entries(methods)]) // Создаем функцию для привязки метода к пути и получаем [methodName, methodParams]
    .reduce(
      normalizer(
        ([bindMethodToRouter, methods]) => methods.map(spreadToArgs(bindMethodToRouter)) // bindMethodToRouter <- methodProps, возвращаем функцию привязки метода со всеми пропсами
      ), []
    )
    .forEach(run); // Привязываем каждый метод к роутеру

  return router;
};
