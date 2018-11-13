import SwaggerParser from "swagger-parser";
import { setSpec } from "../parser";
import { checkPathProps } from "./index";
import type { DataFormat, DataTypes, Parameter, ParameterIn, Schema } from "../../types/Swagger";

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
