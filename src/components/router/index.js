import Koa from 'koa';
import { createRouter } from "./generate";
export const app = new Koa();

export const listen = (paths, { port }) => {
  const router = createRouter(paths);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port);
  return app;
};
