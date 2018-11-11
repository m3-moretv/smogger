import SwaggerParser from "swagger-parser";
import type { Method } from "../../types/Swagger";

let SPEC = null;

const getSpec = () => {
  if (SPEC === undefined) { throw new Error(`Spec didn't loaded (or passed to parser). Use setSpec()`); }
  return SPEC;
};

export const setSpec = spec => SPEC = spec;

export const getMethodModel: (path: string, method: string) => Method = (path, method) => {
  return getSpec().paths[path][method.toLowerCase()];
};
