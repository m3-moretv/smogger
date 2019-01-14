import type { Schema } from "../../types/Swagger";
import { randomElement } from "../../utils/utils";
import deepmerge from "deepmerge";

export type Combiner = (combines: Array<string>) => () => string;
type CpmbinerResolved = (combines: Array<Schema>) => () => Schema;

export const oneOf: Combiner = (combines) => {
  const combiner = randomElement(combines);
  return () => combiner;
};
export const anyOf: Combiner = (combines) => () => randomElement(combines);
export const allOf: CpmbinerResolved =
  (combines) =>
    () => combines.reduce((acc, schema) => deepmerge(acc, schema));
