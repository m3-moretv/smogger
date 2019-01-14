import faker from 'faker';
import random from 'random';
import { randomElement } from "../../utils/utils";
import { getResponse, processor } from "../parser";
import type { Processor } from "../router";
import type { Schema } from "../../types/Swagger";

type Config = {
  imageProvider: string;
}

const createEnum = (enumElements: Array<string | number | boolean>) => randomElement(enumElements);
const createDate = () => faker.date.between(new Date('2015-01-01'), new Date('2021-01-01'));
const createBoolean = () => random.boolean();
const createImageLink = (provider: string) => provider.replace('<width>', '200').replace('<height>', '300');
const createNumber = (min: number = 0, max: number = 9999999) => {
  const options = {min, max};
  return faker.random.number(options);
};
const createString = (format: string = 'words') => (min: number, max: number) => {
  const wordsCount: number = random.int(min, max);
  const words = faker.random[format](wordsCount);
  return words.slice(0, max);
};

const isNumber = (type: string): boolean => (type === 'number' || type === 'integer');

const createFakeData = ({imageProvider}: Config) =>
  ({
     type,
     format,
     minimum = 0,
     maximum = 99999999,
     minLength = 0,
     maxLength = 500,
     ...rest
  }: Schema) => {
  if (rest.enum) { return createEnum(rest.enum); }
  if ('nullable' in rest && random.boolean()) { return null; }

  if (format === 'date') { return createDate(); }
  if (format === 'image') { return createImageLink(imageProvider); }

  if (type === 'string') { return createString(format)(minLength, maxLength); }
  if (isNumber(type)) { return createNumber(minimum, maximum); }
  if (type === 'boolean') { return createBoolean(); }
};

const generateArrayItems = ({minItems = 0, maxItems = 15, items}: Schema) => {
  const arrayLength = random.int(minItems, maxItems);
  return new Array(arrayLength).fill(items);
};

export const mockData: (cfg: Config) => Processor = ({imageProvider}) => (params, model) => {
  return processor(
    createFakeData({
      imageProvider
    }),
    { items: generateArrayItems },
    getResponse(model)
  );
};
