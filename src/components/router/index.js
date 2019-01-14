import Koa from 'koa';
import { createRouter } from "./generate";
import { formatSwaggerPath } from "../../utils/utils";
import { getMethodModel } from "../parser";

import type { RouteParams } from "../../types/Router";
import type { Method, Paths } from "../../types/Swagger";
import type Application, {Context} from 'koa';

export type Processor = (params: RouteParams, model: Method, data: any) => any;
export const dataToResponse: (data: {}, ctx: Context) => string = (data, ctx) => ctx.body = JSON.stringify(data);
type CreateMiddleware = (router: Application, processors: Array<Processor>) => Application;
type ExposeParams = (ctx: Context) => {params: RouteParams, model: Method};
export const exposeParams: ExposeParams = ctx => {
  const {params, req: {method}, _matchedRoute} = ctx;
  const path = formatSwaggerPath(_matchedRoute);
  const model = getMethodModel(path, method);
  return {
    params,
    model
  };
};


export const createMiddleware: CreateMiddleware = (router, processors) => router.use((ctx, next) => {
  let data = {};
  if (!ctx.matched.length) { return next() }
  const {params, model} = exposeParams(ctx);
  try{
    data = processors.reduce((data, processor) => Object.assign(data, processor(params, model, data)), {});
  }catch(e) {
    ctx.status = 500;
    data = {
      error_message: `Smogger catch error: ${e.message}`,
      error_stack: e.stack
    };
  }
  dataToResponse(data, ctx);
});

export const listen = (paths: Paths, { port }: {port: number}): Application => {
  const app = new Koa();
  const router = createRouter(paths);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port);
  console.log(`Mock server working on :${port}`);
  return app;
};
