#!/usr/bin/env node
import { configure } from "./components/configure";
import { bellhop } from "./components/bellhop";
import SwaggerParser from "swagger-parser";

const program = configure();
const specPath = program.spec;
SwaggerParser.parse(specPath).then(res => {
  debugger
});

// bellhop(specPath).then((spec: string) => {
//
//
// });
