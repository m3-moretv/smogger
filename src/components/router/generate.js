import Router from 'koa-router';
import { normalizer, entries, run, spreadToArgs, formatRouterPath } from "../../utils/utils";
import type { PathItem, Paths } from "openapi3-flowtype-definition";

const log = ([path, methods]) => {
  console.log(`Create path ${path}`);
  console.log(`With methods`);
  Object.keys(methods).forEach(method => {
    console.log(`– ${method}`);
  });
  console.log('');
  return [path, methods];
};

const setRouteName = (operationId: string): ?string => operationId || null;
const defaultResponse = (ctx, next) => {
  ctx.body = `params: ${JSON.stringify(ctx.params, null, 2)}`;
  next();
};

const getRouterMethod = (router: Router) => (type: string) => {
  switch (type) {
    case 'get':
      return router.get;
    case 'post':
      return router.post;
    case 'delete':
      return router.delete;
    case 'put':
      return router.put;
    case 'update':
      return router.post;
    default:
      return router.get;
  }
};

const createMethod =
  (router: Router) => // save router
    path => // save path
      (type: string, {operationId}) => // bind method to router with saved path
        getRouterMethod(router)(type).bind(router, setRouteName(operationId), path, defaultResponse);

export const createRouter = (paths: Paths) => {
  const router = new Router();
  const createMethodWithRouter = createMethod(router);

  entries(paths)
    .map(log)
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
