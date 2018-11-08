import SwaggerParser from "swagger-parser";

type Parser = (specPath: string) => Promise<{}>

export const parser: Parser = async (specPath) => {
  return await SwaggerParser.parse(specPath);
};
