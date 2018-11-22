import faker from 'faker';
import random from 'random';
import { entries, objectPath, randomElement } from "../../utils/utils";
import { getResponse, resolveRef } from "../parser";
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

const createFakeData = ({type, format, minimum = 0, maximum = 99999999, minLength = 0, maxLength = 100, ...rest}) => {
  if ('enum' in rest) { return randomElement(rest.enum); }
  if ('nullable' in rest && random.boolean()) { return null; }
  if (format === 'date') { return faker.data.between('2015-01-01', '2021-01-01'); }

  const normalizeType = formatFakerTypes(type);
  const ftype = format && format.includes('.') ? objectPath(faker, format) : faker.random[normalizeType];
  const props = {
    number: {minimum, maximum},
    words: random.int(minLength, maxLength)
  };
  return ftype(props[normalizeType]);
};

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
    const min = schema.minItems || 0;
    const max = schema.maxItems || 15;

    return new Array(random.int(min, max)).fill().map(() => mock(combiner()));
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
