import SwaggerParser from "swagger-parser";
import { setSpec } from "../parser";
import { checkPathProps } from "./index";

beforeAll(() => {
  return SwaggerParser.parse(`src/components/__mocks__/openapi.yaml`).then(setSpec);
});

test('check required props', () => {
  const result = checkPathProps({
    test_param: 'test'
  }, {
    operationId: 'testOperation',
    parameters: [{
      description: 'descr',
      name: 'test_param',
      required: true,
      in: 'path',
      type: 'string'
    }],
    summary: 'test descr'
  });
  expect(result).toEqual(undefined);
});

test('Error without required props', () => {
  const result = checkPathProps({}, {
    operationId: 'testOperation',
    parameters: [{
      name: 'test_param',
      required: true,
      description: 'descr',
      in: 'path',
      type: 'number'
    }],
    summary: 'test descr'
  });
  expect(result).toHaveProperty('error');
});

test('Check number type props', () => {
  const result = checkPathProps({
    test_number: 'ooops'
  }, {
    operationId: 'testOperation',
    summary: 'test descr',
    parameters: [{
      name: 'test_number',
      in: 'path',
      type: 'number'
    }]
  });
  expect(result.error[0]).toHaveProperty('type', 'number.base');
});
