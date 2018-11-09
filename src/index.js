#!/usr/bin/env node
import { configure } from "./components/configure";
import { findMethodById, setSpec } from "./components/parser";
import { listen } from "./components/router";
import SwaggerParser from "swagger-parser";


const program = configure();
const SPEC_PATH = program.spec;
const PORT = program.port;

SwaggerParser.parse(SPEC_PATH)
  .then(setSpec)
  .then(spec => {
    const router = listen(spec.paths, {port: PORT});
    router.use((ctx, next) => {
      next();
    })
  });
