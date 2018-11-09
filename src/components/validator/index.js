import { dataToResponse, run } from "../../utils/utils";

type Validator = (ctx: any) => void;
type CreateMiddleware = (router: KoaRouter$Middleware, validators: Array<Validator>) => KoaRouter$Middleware;

export const createMiddleware: CreateMiddleware = (router, validators) => router.use((ctx, next) => {
  validators
    .map(validator => validator.bind(this, ctx))
    .forEach(run);

  next();
});

export const requiredQueryProps: Validator = (ctx) => {
  // Тут получаем url, матчим его с моделью через parser, проверяем что все нужные,
  // проверяем по этому правилу и если все плохо записываем в ctx.body ответ с ошибкой
  dataToResponse({test: 'test'}, ctx);
};

export const propsTypes: Validator = (ctx) => {
  // Тут получаем url, матчим его с моделью через parser, создаем правило на основе пропсов в моделе,
  // проверяем по этому правилу и если все плохо записываем в ctx.body ответ с ошибкой
};
