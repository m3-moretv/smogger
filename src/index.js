#!/usr/bin/env node
import SwaggerParser from "swagger-parser";
import { configure } from "./components/configure";
import { setSpec } from "./components/parser";
import { listen } from "./components/router";
import { createMiddleware } from "./components/validator";


const config = configure();
const SPEC_PATH = config.spec;
const PORT = config.port;

SwaggerParser.parse(SPEC_PATH)
  .then(setSpec)
  .then(spec => {
    const router = listen(spec.paths, {port: PORT});
    const validators = createMiddleware(router, [(ctx) => {
      debugger
    }]);
  });
