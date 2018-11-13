#!/usr/bin/env node
import SwaggerParser from "swagger-parser";
import { configure } from "./components/configure";
import { setSpec } from "./components/parser";
import { createMiddleware, listen } from "./components/router";
import { checkPathProps } from "./components/validator";
import { mockData } from "./components/mocker";

const config = configure();
const SPEC_PATH = config.spec;
const PORT = config.port;

SwaggerParser.parse(SPEC_PATH)
  .then(setSpec)
  .then(spec => {
    const router = listen(spec.paths, {port: PORT});
    createMiddleware(router, [checkPathProps, mockData]);
  });
