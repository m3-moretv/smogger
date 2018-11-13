import type { Schema } from "../../types/Swagger";
import { randomElement } from "../../utils/utils";

export type Combiner = (combines: Array<Schema>) => () => Schema;

export const oneOf: Combiner = (combines) => {
  const combiner = randomElement(combines);
  return () => combiner;
};
export const anyOf: Combiner = (combines) => () => randomElement(combines);
export const allOf: Combiner = (combines) => () => combines.reduce((acc, {properties}) => Object.assign(acc, properties), {});
