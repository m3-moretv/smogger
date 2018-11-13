import SwaggerParser from "swagger-parser";
import { getMethodModel, setSpec } from "../parser";
import { mockData } from "./index";
import { allOf, anyOf, oneOf } from "./combiners";

let randResult = 0.1;
const COMBINERS = [{
  type: 'object',
  properties: {
    bark: { type: 'boolean' },
    breed: { type: 'string' }
  }
}, {
  properties: {
    type: 'object',
    id: { type: 'integer' },
    name: { type: 'string' }
  }
}];

beforeAll(() => {
  const mockMath = Object.create(global.Math);
  mockMath.random = () => randResult;
  global.Math = mockMath;
  return SwaggerParser.parse(`src/components/__mocks__/openapi.yaml`).then(setSpec);
});

test('oneOf return equals elements', () => {
  const firstCombiners = oneOf(COMBINERS);
  const combiner = firstCombiners();
  const nextCombiner = firstCombiners();
  expect(combiner).toEqual(nextCombiner);
});

test('oneOf return random element', () => {
  randResult = 0.1;
  const firstCombiners = oneOf(COMBINERS);
  expect(firstCombiners()).toEqual(COMBINERS[0]);

  randResult = 1;
  const secondCombiners = oneOf(COMBINERS);
  expect(secondCombiners()).toEqual(COMBINERS[1]);
});

test('anyOf return random element', () => {
  randResult = 0.1;
  const randCombiners = anyOf(COMBINERS);

  expect(randCombiners()).toEqual(COMBINERS[0]);

  randResult = 1;
  expect(randCombiners()).not.toEqual(COMBINERS[0]);
});

test('allOf assigned combiners', () => {
  const allCombiners = allOf(COMBINERS);
  const combiner = allCombiners();

  expect(combiner).toHaveProperty('id');
  expect(combiner).toHaveProperty('bark')
});
