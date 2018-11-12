import SwaggerParser from "swagger-parser";
import { getMethodModel, getResponse, resolveRef, setSpec } from "./index";

beforeAll(() => {
  return SwaggerParser.parse(`src/components/__mocks__/openapi.yaml`).then(setSpec);
});

test('resolveRef with SlideBadge', () => {
  const model = resolveRef({$ref: '#/components/schemas/SlideBadge'}).properties;
  expect(model).toHaveProperty('text', { type: 'string', description: 'Текст бейджа', example: 'hit' });
});

test('getMethodModel', () => {
  const model = getMethodModel('/app/screenGrid/{screenName}', 'get');
  expect(model).toHaveProperty('summary', 'Сетка виджетов для отображения в мобильном приложении');
});

test('getResponse', () => {
  const method = getMethodModel('/app/screenGrid/{screenName}', 'get');
  const response = getResponse(method);
  expect(response).toHaveProperty('properties');
});
