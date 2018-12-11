import SwaggerParser from "swagger-parser";
import { setSpec } from "../parser";
import { allOf, oneOf } from "../parser/combiners";

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
  return SwaggerParser.parse(`src/components/__mocks__/openapi.yaml`).then(setSpec);
});

test('oneOf return equals elements', () => {
  const firstCombiners = oneOf(COMBINERS);
  const combiner = firstCombiners();
  const nextCombiner = firstCombiners();
  expect(combiner).toEqual(nextCombiner);
});

// TODO Дописать тесты для рандомных значений

// test('oneOf return random element', () => {
//
//   const firstCombiners = oneOf(COMBINERS);
//   expect(firstCombiners()).toEqual(COMBINERS[0]);
//
//   const secondCombiners = oneOf(COMBINERS);
//   expect(secondCombiners()).toEqual(COMBINERS[1]);
// });
//
// test('anyOf return random element', () => {
//   const randCombiners = anyOf(COMBINERS);
//
//   expect(randCombiners()).toEqual(COMBINERS[0]);
//
//   expect(randCombiners()).not.toEqual(COMBINERS[0]);
// });

test('allOf assigned combiners', () => {
  const allCombiners = allOf(COMBINERS.map(comb => (comb.properties || comb)));
  const combiner = allCombiners();
  expect(combiner).toHaveProperty('id');
  expect(combiner).toHaveProperty('bark')
});

// test('create mock data', () => {
//   const response = getMethodModel('/app/screenGrid/{screenName}', 'get');
//   const data = mockData({}, response);
// });
