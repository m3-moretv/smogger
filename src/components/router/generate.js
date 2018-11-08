import Router from 'koa-router';
import { Observable } from 'rxjs';

type Schema = {
  format: string;
  type: string;
};

type Parameter = {
  description?: string;
  name: string;
  required?: boolean;
  in: 'query' | 'body';
  schema: Schema
}

type Method = {
  operationId?: string;
  parameters: Array<Parameter>;
  summary?: string;
}

type Path = {
  [key: string] : Method
}

type Paths = {
  [key: string]: Path
}

const METHODS_MAP = {
  'get': 'get',
  'post': 'post',
  'put': 'put',
  'delete': 'del'
};
const insertParamsToUrl = (path: string): string => path.replace(/{(\w+)}/g, `:$1`);
const getRouterMethodByName = (httpMethod: string): string => {
  const name = METHODS_MAP[httpMethod];
  if (!name) { throw new Error(`Method ${httpMethod} is not supported`); }
  return name;
};

const addPathToRouter = (router) => ([path, params]) => {
  const methods = Object.entries(params);
  const pathWithParams = insertParamsToUrl(path);
  methods.forEach(([name, config]) => {
    router[getRouterMethodByName(name)](config.operationId, pathWithParams, (ctx, next) => {
      ctx.state.params = params;
      ctx.body = `${config.summary}; ${JSON.stringify(ctx.params)}`;
      next();
    });
  });
};

export const createRouter = (paths: Paths, config = {}) => {
  const router = new Router(config);
  Object.entries(paths).forEach(addPathToRouter(router));
  return router;
};
