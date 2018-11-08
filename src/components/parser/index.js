import SwaggerParser from "swagger-parser";

type Download = (specPath: string) => Promise<{}>

export const download: Download = async (specPath) => {
  return await SwaggerParser.parse(specPath);
};
