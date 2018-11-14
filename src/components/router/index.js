import Koa from 'koa';
import { createRouter } from "./generate";
import { formatSwaggerPath } from "../../utils/utils";
import type { Context, RouteParams } from "../../types/Router";
import type { Method } from "../../types/Swagger";
import { getMethodModel } from "../parser";

export type Processor = (params: RouteParams, model: Method, data: any) => any;
type CreateMiddleware = (router: KoaRouter$Middleware, processors: Array<Processor>) => KoaRouter$Middleware;
export const dataToResponse: (data: {}, ctx: Context) => string = (data, ctx) => ctx.body = JSON.stringify(data);

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
  if (!ctx.matched.length) { return next() }
  const {params, model} = exposeParams(ctx);
  const data = processors.reduce((data, processor) => Object.assign(data, processor(params, model, data)), {});
  dataToResponse(data, ctx);
});

export const listen = (paths, { port }) => {
  const app = new Koa();
  const router = createRouter(paths);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port);
  return app;
};
