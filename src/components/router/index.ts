import Koa, {Context} from "koa";

import { createRouter } from "./generate";
import { formatSwaggerPath } from "../utils";

import { getFromCache, setToCache } from "../cache";
import Application = require("koa");
import {OpenAPIV3} from "openapi-types";

export type Middleware = (path: string, method: string, data?: any) => any;

const dataToResponse: (data: string, ctx: any) => string = (data, ctx) => (ctx.body = data);


const exposeRequestProps = (ctx: Context) => {
  const { req: { method }, _matchedRoute } = ctx;
  const path = formatSwaggerPath(_matchedRoute);

  return {
    path,
    method
  };
};

export const createRouteMiddleware = (app: Application, paths: any) => {
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

export const createCacheMiddleware = (
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

export const createProcessingMiddleware = (
  app: Application,
  middlewares: Middleware[]
) =>
  app.use((ctx, next) => {
    const { path, method } = ctx.state;

    if (!path && !method) {
      return next();
    }

    const data = middlewares.reduce((result, mw) => {
        return mw(path, method.toLowerCase(), result)
    }, {});
    //const data = processor(path, method.toLowerCase());

    const dataAsString = JSON.stringify(data);

    setToCache(path, method, dataAsString);

    dataToResponse(dataAsString, ctx);
  });

export const createHTTPServer = (
  { port }: { port: number },
  middlewares: Middleware[]
) => (paths: {[pattern: string]: OpenAPIV3.PathItemObject}): Application => {
  const app = new Koa();

  createRouteMiddleware(app, paths);
  createRequestStateMiddleware(app);
  createCacheMiddleware(app);
  createProcessingMiddleware(app, middlewares);

  app.listen(port);

  console.log(`Mock server working on :${port}`);
  return app;
};
