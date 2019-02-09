import { entries } from '../utils';
import { allOf, anyOf, oneOf } from './combiners';
import { Schema, Operation, Spec } from "swagger-schema-official";
export type MutatorItems = (schema: Schema) => Array<any>;
export type Mutators = {
  items?: MutatorItems
};

export const getMethodModel: (
  spec: Spec
) => (path: string, method: string) => Operation = spec => (path, method) =>
  spec.paths[path][method.toLowerCase()];

export const getResponseModel: (
  method: Operation,
  status?: number,
  contentType?: string
) => Schema = (method, status = 200, contentType = 'application/json') =>
  method.responses[status].content[contentType].schema;

export const processor: (
  cb: (data: Schema) => any,
  mutators: Mutators,
  schema: Schema
) => any = (cb, mutators, schema) => {
  const next = processor.bind(this, cb, mutators);

  if (schema.properties) {
    return entries(schema.properties).reduce((result, [key, property]) => {
      result[key] = next(property);
      return result;
    }, {});
  }

  if (schema.items) {
    if (mutators.items) {
      return mutators.items(schema).map(item => next(item));
    }
    return next(schema.items);
  }

  if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
    let combiner = () => schema;
    if (schema.oneOf) {
      combiner = oneOf(schema.oneOf);
    }
    if (schema.anyOf) {
      combiner = anyOf(schema.anyOf);
    }
    if (schema.allOf) {
      combiner = allOf(schema.allOf);
    }

    return next(combiner());
  }

  return cb(schema);
};
