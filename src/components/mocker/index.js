import { entries } from "../../utils/utils";
import { getResponse, resolveRef } from "../parser";
import faker from 'faker';
import type { Processor } from "../router";
import type { Schema } from "../../types/Swagger";
import { allOf, anyOf, oneOf } from "./combiners";

const formatFakerTypes = (type) => {
  switch(type) {
    case 'number':
    case 'integer':
      return 'number';
    case 'string':
      return 'words';
    default:
      return type;
  }
};

const createFakeData = ({type}) => faker.random[formatFakerTypes(type)]();

const mock = (schema: Schema) => {
  if ('$ref' in schema) {
    return mock(resolveRef(schema));
  }

  if ('properties' in schema) {
    return entries(schema.properties).reduce((result, [key, property]) => {
      result[key] = mock(property);
      return result;
    }, {});
  }

  if ('items' in schema) {
    let combiner = () => schema.items;
    if ('oneOf' in schema.items) {combiner = oneOf(schema.items.oneOf)}
    if ('anyOf' in schema.items) {combiner = anyOf(schema.items.anyOf)}
    if ('allOf' in schema.items) {combiner = allOf(schema.items.allOf)}

    return new Array(10).fill().map(() => mock(combiner()));
  }

  if ('oneOf' in schema || 'anyOf' in schema || 'allOf' in schema) {
    let combiner = () => schema;
    if ('oneOf' in schema) {combiner = oneOf(schema.oneOf)}
    if ('anyOf' in schema) {combiner = anyOf(schema.anyOf)}
    if ('allOf' in schema) {combiner = allOf(schema.allOf)}

    return mock(combiner());
  }

  return createFakeData(schema);
};

export const mockData: Processor = (params, model) => {
  const responseModel = getResponse(model);
  return mock(responseModel);
};
