import { randomElement } from '../utils';
import deepmerge from 'deepmerge';
import type { Schema } from 'openapi3-flowtype-definition';

export type Combiner = (combines: Array<string>) => () => string;
type CombinerResolved = (combines: Array<Schema>) => () => Schema;

export const oneOf: Combiner = combines => {
  const combiner = randomElement(combines);
  return () => combiner;
};
export const anyOf: Combiner = combines => () => randomElement(combines);
export const allOf: CombinerResolved = combines => () =>
  combines.reduce((acc, schema) => deepmerge(acc, schema));
