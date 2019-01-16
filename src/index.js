#!/usr/bin/env node
import 'source-map-support/register'

import { configure } from "./components/configure";
import { createHTTPServer } from "./components/router";
import { mockData } from "./components/mocker";
import SwaggerParser from 'swagger-parser';
import type { OpenAPI } from "openapi3-flowtype-definition";
import { getMethodModel } from "./components/parser";
import { compose } from "./components/utils";

const config = configure();
const SPEC_PATH = config.spec;
const PORT = Number(config.port);
const cfg = {
  imageProvider: config.imageProvider
};
const mocker = mockData(cfg);

SwaggerParser
  .dereference(SPEC_PATH)
  .then((spec: OpenAPI) => {
    const getMethod = getMethodModel(spec);
    const router = createHTTPServer({port: PORT}, [compose(mocker, getMethod)]);
    router(spec.paths);
  });
