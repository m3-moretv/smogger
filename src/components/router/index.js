import Koa from 'koa';
import { createRouter } from "./generate";

export const listen = (paths, { port }) => {
  const app = new Koa();
  const router = createRouter(paths);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port);
  return app;
};
