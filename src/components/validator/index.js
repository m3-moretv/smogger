import Joi from 'joi';
import { getValidJoiType } from "../../utils/utils";
import { Parameter } from "../../types/Swagger";
import type { Processor } from "../../utils/utils";

const createSchema = (rules: Array<Parameter>) => {
  const schema = rules.reduce((schema, rule) => {
    const type = getValidJoiType(rule.type);
    const joiSchema = Joi[type]();
    if (rule.required) { schema[rule.name] = joiSchema.required() }
    return schema;
  }, {});

  return Joi.object(schema);
};

export const checkPathProps: Processor = (params, {parameters}) => {
  const schema = createSchema(parameters);
  const {error} = Joi.validate(params, schema);

  if (error) {
    return {
      error: error.details
    };
  }
};
