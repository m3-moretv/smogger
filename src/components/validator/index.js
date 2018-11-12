import Joi from 'joi';
import { dataToResponse, exposeParams, getValidJoiType } from "../../utils/utils";
import { Parameter } from "../../types/Swagger";
import type { Processor } from "../../utils/utils";

const createSchema = (rules: Array<Parameter>) => {
  const schema = rules.reduce((schema, rule) => {
    const type = getValidJoiType(rule.type || rule.schema.type);
    schema[rule.name] = Joi[type]();
    if (rule.required) { schema[rule.name].required() }
    return schema;
  }, {});

  return Joi.object(schema);
};

export const checkPathProps: Processor = (ctx) => {
  const {params, model: {parameters}} = exposeParams(ctx);
  const schema = createSchema(parameters);
  const result = Joi.validate(params, schema);

  if (result.error) {
    dataToResponse({
      error: result.error.details
    }, ctx)
  }
};
