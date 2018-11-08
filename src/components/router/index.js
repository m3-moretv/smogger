import Koa from 'koa';
import { createRouter } from "./generate";
import { validatorMiddleware } from "./validate";
export const app = new Koa();

export const listen = (port: number = 3000, spec) => {
  const router = createRouter(spec);
  const middleware = validatorMiddleware(spec);
  app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(middleware);

  app.listen(port);
};
