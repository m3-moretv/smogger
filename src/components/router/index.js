import Koa from 'koa';
import { createRouter } from './generate';
import { compose, formatSwaggerPath } from '../utils';
import type Application, { Context } from 'koa';
import type { PathItem } from 'openapi3-flowtype-definition';

export type Middleware = (path: string, method: string, data?: any) => any;

const dataToResponse: (data: {}, ctx: Context) => string = (data, ctx) =>
  (ctx.body = JSON.stringify(data));

type CreateMiddleware = (
  router: Application,
  processors: Array<Middleware>
) => Application;

const exposeRequestProps: (
  ctx: Context
) => { path: string, method: string } = ctx => {
  const {
    req: { method },
    _matchedRoute
  } = ctx;
  const path = formatSwaggerPath(_matchedRoute);
  return {
    path,
    method
  };
};

export const createMiddleware: CreateMiddleware = (
  app: Application,
  middlewares: Middleware[]
) =>
  app.use((ctx, next) => {
    let data = {};
    if (!ctx.matched.length) {
      return next();
    }
    const { path, method } = exposeRequestProps(ctx);
    const processor = compose(...middlewares);
    data = processor(path, method, data);
    dataToResponse(data, ctx);
  });

export const createHTTPServer = (
  { port }: { port: number },
  middlewares: Middleware[]
) => (paths: PathItem): Application => {
  const app = new Koa();
  const router = createRouter(paths);
  app.use(router.routes()).use(router.allowedMethods());

  createMiddleware(app, middlewares);

  app.listen(port);
  console.log(`Mock server working on :${port}`);
  return app;
};
