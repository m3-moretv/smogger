import type { Processor } from "../../utils/utils";
import { entries, exposeParams, dataToResponse } from "../../utils/utils";
import { getResponse, resolveRef } from "../parser";
import faker from 'faker';

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

const mock = (schema) => {
  switch(schema.type) {
    case 'array':
      return mockArray(schema.items);
    default:
      return {};
  }
};

export const mockData: Processor = (ctx) => {
  const { model } = exposeParams(ctx);
  const responseModel = getResponse(model);
  const data = mock(responseModel);
  dataToResponse(data, ctx);
};
