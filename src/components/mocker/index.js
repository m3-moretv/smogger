import faker from "faker";
import random from "random";
import { objectPath, randomElement } from "../utils";
import { getResponseModel, processor } from "../parser";
import type { Schema } from "openapi3-flowtype-definition";

type Config = {
  imageProvider: string
};

const getFakerMethod = (path: string) => objectPath(faker, path);

const createEnum = (enumElements: Array<string | number | boolean>) =>
  randomElement(enumElements);
const createDate = () =>
  faker.date.between(new Date("2015-01-01"), new Date("2021-01-01"));
const createBoolean = () => random.boolean();
const createImageLink = (
  provider: string,
  width?: number = 200,
  height?: number = 300
) =>
  provider
    .replace("<width>", String(width))
    .replace("<height>", String(height));
const createNumber = (min: number = 0, max: number = 9999999) => {
  const options = { min, max };
  return faker.random.number(options);
};
const createString = (format: string = "random.words") => (
  min: number,
  max: number
) => {
  const wordsCount: number = random.int(min, max);
  const fakerMethod = getFakerMethod(format);
  const words = fakerMethod(wordsCount);
  return words.slice(0, max);
};

const isNumber = (type: string): boolean =>
  type === "number" || type === "integer";

const extractImageSize = (format: string): number[] =>
  format
    .replace(/^image\[(\d+x\d+)\]/g, "$1")
    .split("x")
    .map(Number);

const createFakeData = ({ imageProvider }: Config) => ({
  type,
  format,
  minimum = 0,
  maximum = 99999999,
  minLength = 0,
  maxLength = 500,
  ...rest
}: Schema) => {
  if (rest.enum) {
    return createEnum(rest.enum);
  }
  if ("nullable" in rest && random.boolean()) {
    return null;
  }

  if (format === "date") {
    return createDate();
  }
  if (/^image\[\d+x\d+\]/.test(format)) {
    const [width, height] = extractImageSize(format);
    return createImageLink(imageProvider, width, height);
  }

  if (/^image/.test(format)) {
    return createImageLink(imageProvider);
  }

  if (type === "string") {
    return createString(format)(minLength, maxLength);
  }
  if (isNumber(type)) {
    return createNumber(minimum, maximum);
  }
  if (type === "boolean") {
    return createBoolean();
  }
};

const generateArrayItems = ({ minItems = 0, maxItems = 15, items }: Schema) => {
  const arrayLength = random.int(minItems, maxItems);
  return new Array(arrayLength).fill(items);
};

export const createMockGenerator: (cfg: Config) => (model: Schema) => any = ({
  imageProvider
}) => model => {
  return processor(
    createFakeData({ imageProvider }),
    { items: generateArrayItems },
    getResponseModel(model)
  );
};
