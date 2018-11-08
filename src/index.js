#!/usr/bin/env node
import { configure } from "./components/configure";
import { parser } from "./components/parser";
import { listen } from "./components/router";


const program = configure();
const SPEC_PATH = program.spec;
const PORT = program.port;

parser(SPEC_PATH).then(spec => {
  listen(PORT, spec.paths);
});
