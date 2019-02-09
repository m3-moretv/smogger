import Koa from "koa";
import type Application, { Context } from "koa";
import type { PathItem } from "openapi3-flowtype-definition";

import { createRouter } from "./generate";
import { compose, formatSwaggerPath } from "../utils";

import { getFromCache, setToCache } from "../cache";

export type Middleware = (path: string, method: string, data?: any) => any;

const dataToResponse: (data: string, ctx: Context) => string = (data, ctx) =>
  (ctx.body = data);

type CreateProccesingMiddleware = (
  router: Application,
  processors: Array<Middleware>
) => Application;

type CreateCacheMiddleware = (router: Application) => Application;

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

export const createRouteMiddleware = (app: Application, paths: PathItem) => {
  const router = createRouter(paths);

  app.use(router.routes()).use(router.allowedMethods());
};

export const createRequestStateMiddleware = (app: Application) =>
  app.use((ctx, next) => {
    if (!ctx.matched.length) {
      return next();
    }

    const { path, method } = exposeRequestProps(ctx);

    ctx.state = {
      ...ctx.state,
      path,
      method
    };

    next();
  });

export const createCacheMiddleware: CreateCacheMiddleware = (
  app: Application
) =>
  app.use((ctx, next) => {
    const { path, method } = ctx.state;

    if (!path && !method) {
      return next();
    }

    const cachedData = getFromCache(path, method);

    if (!cachedData) {
      return next();
    }

    dataToResponse(cachedData, ctx);
  });

export const createProcessingMiddleware: CreateProccesingMiddleware = (
  app: Application,
  middlewares: Middleware[]
) =>
  app.use((ctx, next) => {
    const { path, method } = ctx.state;

    if (!path && !method) {
      return next();
    }

    const processor = compose(...middlewares);
    const data = processor(path, method);

    const dataAsString = JSON.stringify(data);

    setToCache(path, method, dataAsString);

    dataToResponse(dataAsString, ctx);
  });

export const createHTTPServer = (
  { port }: { port: number },
  middlewares: Middleware[]
) => (paths: PathItem): Application => {
  const app = new Koa();

  createRouteMiddleware(app, paths);
  createRequestStateMiddleware(app);
  createCacheMiddleware(app);
  createProcessingMiddleware(app, middlewares);

  app.listen(port);

  console.log(`Mock server working on :${port}`);
  return app;
};
