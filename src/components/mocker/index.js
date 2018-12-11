import faker from 'faker';
import random from 'random';
import { objectPath, randomElement } from "../../utils/utils";
import { getResponse, processor } from "../parser";
import type { Processor } from "../router";
import type { Schema } from "../../types/Swagger";

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

const createFakeData = ({type, format, minimum = 0, maximum = 99999999, minLength = 0, maxLength = 500, ...rest}) => {
  if ('enum' in rest) { return randomElement(rest.enum); }
  if ('nullable' in rest && random.boolean()) { return null; }
  if (format === 'date') { return faker.date.between('2015-01-01', '2021-01-01'); }
  if (format === 'image') { return 'https://picsum.photos/200/300/?random'; }

  const normalizeType = formatFakerTypes(type);
  const ftype = format && format.includes('.') ? objectPath(faker, format) : faker.random[normalizeType];
  if (format && format.includes('.')) {debugger}
  const props = {
    number: {min: minimum, max: maximum},
    words: random.int(minLength, maxLength)
  };
  if (normalizeType === 'words') {
    return ftype(props[normalizeType]).slice(0, maxLength);
  }
  return ftype(props[normalizeType]);
};

const generateArrayItems = ({minItems = 0, maxItems = 15, items}: Schema) => {
  const arrayLength = random.int(minItems, maxItems);
  return new Array(arrayLength).fill(items);
};

export const mockData: Processor = (params, model) => {
  return processor(
    createFakeData,
    { items: generateArrayItems },
    getResponse(model)
  );
};
