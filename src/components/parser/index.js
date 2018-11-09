import SwaggerParser from "swagger-parser";

let SPEC = null;

const getSpec = () => {
  if (SPEC === undefined) { throw new Error(`Spec didn't loaded. Use setSpec()`); }
  return SPEC;
};

export const setSpec = spec => SPEC = spec;

export const getMethodModel: (path: string, method: string) => any = (path, method) => {

};
