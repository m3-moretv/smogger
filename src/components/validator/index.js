import Joi from 'joi';
import { formatSwaggerPath, run, dataToResponse } from "../../utils/utils";
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
const exposeParams: (ctx: Context) => {params: {}, rules: Array<Parameter>} = ctx => {
  const {params, req: {method}, _matchedRoute} = ctx;
  const path = formatSwaggerPath(_matchedRoute);
  const rules = getMethodModel(path, method).parameters;

  return {
    params,
    rules
  };
};
const getSchemaType = (type) => {
  switch (type) {
    case 'number':
    case 'integer':
      return 'number';
    default:
      return type;
  }
};

const createSchema = (rules: Array<Parameter>) => {
  const schema = rules.reduce((schema, rule) => {
    const type = getSchemaType(rule.schema.type);
    schema[rule.name] = Joi[type]();
    if (rule.required) { schema[rule.name].required() }
    return schema;
  }, {});

  return Joi.object(schema);
};

export const checkPathProps: Validator = (ctx) => {
  const {params, rules} = exposeParams(ctx);
  const schema = createSchema(rules);
  const result = Joi.validate(params, schema);

  if (result.error) {
    dataToResponse({
      error: result.error.details
    }, ctx)
  }
};
