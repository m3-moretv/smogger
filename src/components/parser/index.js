import SwaggerParser from "swagger-parser";
import type { ContentType, HTTPMethod, Method, Schema } from "../../types/Swagger";

let SPEC = null;

const getSpec = () => {
  if (SPEC === undefined) { throw new Error(`Spec didn't loaded (or passed to parser). Use setSpec()`); }
  return SPEC;
};

const parseRef = (ref: string) => ref.split('/').slice(1).reduce((acc, part) => acc[part], getSpec());

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
