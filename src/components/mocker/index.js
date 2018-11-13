import { entries } from "../../utils/utils";
import { getResponse, resolveRef } from "../parser";
import faker from 'faker';
import type { Processor } from "../router";

const formatFakerTypes = (type) => {
  switch(type) {
    case 'number':
    case 'integer':
      return 'number';
    case 'string':
      return 'words';
  }
};

const createFakeData = (schema) => {
  const {properties, required} = schema;
  return entries(properties).reduce((acc, [key, prop]) => {
    acc[key] = faker.random[formatFakerTypes(prop.type)]();
    return acc;
  }, {});
};

const mockArray = (schema) => {
  const resolvedSchema = resolveRef(schema);
  return new Array(10).fill().map(() => createFakeData(resolvedSchema));
};

const mockObject = (schema) => {
  return {};
};

const mockPrimitive = (schema) => {
  return '';
};

const mock = (schema) => {
  if (schema.type === undefined) { return mock(schema.properties); }

  switch(schema.type) {
    case 'array':
      return mockArray(schema.items);
    case 'object':
      return mock(schema.properties);
    default:
      return mockPrimitive(schema);
  }
};

export const mockData: Processor = (params, model) => {
  const responseModel = getResponse(model);
  return mock(responseModel);
};
