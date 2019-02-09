import "source-map-support/register";

import { createHTTPServer } from "./components/router";
import { createMockGenerator } from "./components/mocker";
import SwaggerParser from "swagger-parser";
import { getMethodModel } from "./components/parser";
import { compose } from "./components/utils";

import type Application from "koa";
import type { OpenAPI } from "openapi3-flowtype-definition";

type Config = {
  port: string,
  spec: string,
  imageProvider: string
};

type SmoggerFunction = (config: Config) => Promise<Application>;

export const Smogger: SmoggerFunction = async config => {
  const { spec: pathToSpec, port, imageProvider } = config;
  const spec = await SwaggerParser.dereference(pathToSpec);
  const mocker = createMockGenerator({ imageProvider });
  const getMethod = getMethodModel(spec);
  const router = createHTTPServer({ port: Number(port) }, [
    compose(
      mocker,
      getMethod
    )
  ]);

  return router(spec.paths);
};
