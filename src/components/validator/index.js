import { formatSwaggerPath, run } from "../../utils/utils";
import { getMethodModel } from "../parser";
import { Parameter, ParametrIn } from "../../types/Swagger";
import { Context, NextFn } from "../../types/Router";

type Validator = (ctx: Context, next: NextFn) => void;
type CreateMiddleware = (router: KoaRouter$Middleware, validators: Array<Validator>) => KoaRouter$Middleware;

export const createMiddleware: CreateMiddleware = (router, validators) => router.use((ctx, next) => {
  if (!ctx.matched.length) { return next() }

  validators
    .map(validator => validator.bind(this, ctx))
    .forEach(run);

  next();
});

const filterParamsByType: (type: ParametrIn) => (param: Parameter) => boolean
  = type => param => param.in === type;
const filterRequiredParams: (param: Parameter) => boolean
  = ({required}) => required;
const exposeParams = ctx => {
  const {params, req: {method}, _matchedRoute} = ctx;
  const path = formatSwaggerPath(_matchedRoute);
  const rules = getMethodModel(path, method).parameters;

  return {
    params,
    rules
  };
};

export const requiredPathProps: Validator = (ctx) => {
  const {params, rules} = exposeParams(ctx);
  const requiredParams = rules.filter(filterParamsByType('path')).filter(filterRequiredParams);
  const missedParams = requiredParams.filter((prop) => !params[prop.name]);

  if (missedParams.length) {
    ctx.body = `Missed url props: ${missedParams.map(p => p.name).join(',')}`
  }
};

export const typesPathProps: Validator = (ctx) => {
  const {params, rules} = exposeParams(ctx);
  debugger;
};
