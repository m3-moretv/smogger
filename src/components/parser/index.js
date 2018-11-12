import SwaggerParser from "swagger-parser";
import type { Method } from "../../types/Swagger";

let SPEC = null;

const getSpec = () => {
  if (SPEC === undefined) { throw new Error(`Spec didn't loaded (or passed to parser). Use setSpec()`); }
  return SPEC;
};

const parseRef = (ref: string) => ref.split('/').slice(1).reduce((acc, part) => acc[part], getSpec());

export const setSpec = spec => SPEC = spec;

export const getMethodModel: (path: string, method: string) => Method = (path, method) => {
  return getSpec().paths[path][method.toLowerCase()];
};

export const getResponse: (method: Method, status?: number, contentType?: string) => Response
  = (method, status = 200, contentType = 'application/json') => {
  const schema = method.responses[status].content[contentType].schema;
  return resolveRef(schema);
};

export const resolveRef = (schema: {$ref?: string}) => {
  if (schema.$ref) { return parseRef(schema.$ref); }
  return schema;
};
