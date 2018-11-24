import type { ContentType, HTTPMethod, Method, Schema } from "../../types/Swagger";
import { entries, objectPath } from "../../utils/utils";
import { allOf, anyOf, oneOf } from "./combiners";
import random from "random";

let SPEC = null;

const getSpec = () => {
  if (SPEC === undefined) { throw new Error(`Spec didn't loaded (or passed to parser). Use setSpec()`); }
  return SPEC;
};

const parseRef = (ref: string) => objectPath(getSpec(), ref.slice(2), '/');

export const setSpec = spec => SPEC = spec;

export const getMethodModel: (path: string, method: HTTPMethod) => Method = (path, method) => {
  return getSpec().paths[path][method.toLowerCase()];
};

export const resolveRef = (schema: Schema) => {
  if ('$ref' in schema) { return parseRef(schema.$ref); }
  return schema;
};

export const getResponse: (method: Method, status?: number, contentType?: ContentType) => Schema
  = (method, status = 200, contentType = 'application/json') => {
  const schema = method.responses[status].content[contentType].schema;
  return resolveRef(schema);
};

export const processor: (schema: Schema, cb: (data: Schema, next: (any) => void) => any) => any = (schema, cb) => {
  if ('$ref' in schema) {
    return processor(resolveRef(schema), cb);
  }

  if ('properties' in schema) {
    return entries(schema.properties).reduce((result, [key, property]) => {
      result[key] = processor(property, cb);
      return result;
    }, {});
  }

  if ('items' in schema) {
    let combiner = () => schema.items;
    if ('oneOf' in schema.items) {combiner = oneOf(schema.items.oneOf)}
    if ('anyOf' in schema.items) {combiner = anyOf(schema.items.anyOf)}
    if ('allOf' in schema.items) {combiner = allOf(schema.items.allOf.map(resolveRef))}
    const min = schema.minItems || 0;
    const max = schema.maxItems || 15;

    return new Array(random.int(min, max)).fill().map(() => processor(combiner(), cb));
  }

  if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
    let combiner = () => schema;
    if ('oneOf' in schema) {combiner = oneOf(schema.oneOf)}
    if ('anyOf' in schema) {combiner = anyOf(schema.anyOf)}
    if ('allOf' in schema) {combiner = allOf(schema.allOf.map(resolveRef))}

    return processor(combiner(), cb);
  }

  return cb(schema);
};
