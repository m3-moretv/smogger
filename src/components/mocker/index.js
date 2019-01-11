import faker from 'faker';
import random from 'random';
import { randomElement } from "../../utils/utils";
import { getResponse, processor } from "../parser";
import type { Processor } from "../router";
import type { Schema } from "../../types/Swagger";

const createEnum = (enumElements: Array<string>) => randomElement(enumElements);
const createDate = () => faker.date.between('2015-01-01', '2021-01-01');
const createBoolean = () => random.boolean();
const createImageLink = () => 'https://picsum.photos/200/300/?random';
const createNumber = (min: number = 0, max: number = 99999999, isFloat: boolean) => {
  const options = {min, max};
  return isFloat ? faker.random.float(options) : faker.random.number(options);
};
const createString = (format: string = 'words') => (min: number, max: number) => {
  const wordsCount: number = random.int(min, max);
  const words = faker.random[format](wordsCount);
  return words.slice(0, max);
};

const isFloat = (format) => (format === 'float' || format === 'double');
const isNumber = (type) => (type === 'number' || type === 'integer');

const createFakeData = ({type, format, minimum = 0, maximum = 99999999, minLength = 0, maxLength = 500, ...rest}) => {
  if ('enum' in rest) { return createEnum(rest.enum); }
  if ('nullable' in rest && random.boolean()) { return null; }

  if (format === 'date') { return createDate(); }
  if (format === 'image') { return createImageLink(); }

  if (type === 'string') { return createString(format)(minLength, maxLength); }
  if (isNumber(type)) { return createNumber(minimum, maximum, isFloat(format)); }
  if (type === 'boolean') { return createBoolean(); }
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
