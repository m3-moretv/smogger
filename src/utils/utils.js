import type { Context, RouteParams } from "../types/Router";
import type { DataTypes, Method } from "../types/Swagger";
import { getMethodModel } from "../components/parser";

export type Processor = (params: RouteParams, model: Method, data: any) => any;
type CreateMiddleware = (router: KoaRouter$Middleware, processors: Array<Processor>) => KoaRouter$Middleware;

export const entries: (obj: {}) => Array<string, any> = Object.entries.bind(Object);
export const run: (Function) => any = fn => fn();
export const normalizer: (Function) => (Array<any>, Array<any>) => Array<any> = handler => (acc, arr) => acc.concat(handler(arr));
export const spreadToArgs: (cb: Function) => (obj: {} | Array<any>) => any = cb => props => cb(...props);
export const dataToResponse: (data: {}, ctx: Context) => string = (data, ctx) => ctx.body = JSON.stringify(data);
export const normalizeUrlParams = (subst: RegExp, brackets?: string = ':$1') => (path: string) => path.replace(subst, brackets);
export const formatSwaggerPath: (path: string) => string = normalizeUrlParams(/:(\w+)/g, '{$1}');
export const formatRouterPath: (path: string) => string = normalizeUrlParams(/{(\w+)}/g, ':$1');

export const exposeParams: (ctx: Context) => {params: RouteParams, model: Method} = ctx => {
  const {params, req: {method}, _matchedRoute} = ctx;
  const path = formatSwaggerPath(_matchedRoute);
  const model = getMethodModel(path, method);
  return {
    params,
    model
  };
};

export const createMiddleware: CreateMiddleware = (router, processors) => router.use((ctx, next) => {
  if (ctx.matched.length) { return next() }
  const {params, model} = exposeParams(ctx);
  const data = processors.reduce((data = {}, processor) => Object.assign(data, processor(params, model, data)));
  dataToResponse(data, ctx);
  next();
});

export const getValidJoiType: (type: DataTypes) => string = (type) => {
  switch (type) {
    case 'number':
    case 'integer':
      return 'number';
    default:
      return type;
  }
};

// export const arrayToMap: (key: string, arr: Array<any>) => {[key: string]: any}
//   = (arr, key) => arr.reduce((acc, item) => {
//   const data = {...acc};
//   data[item[key]] = item;
//   return data;
// }, {});
