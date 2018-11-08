import Koa from 'koa';
import { createRouter } from "./generate";
import { validatorMiddleware } from "./validate";
export const app = new Koa();

export const listen = (spec, { port }) => {
  const router = createRouter(spec);
  const middleware = validatorMiddleware(spec);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port);
  return app;
};
