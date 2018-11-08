#!/usr/bin/env node
import { configure } from "./components/configure";
import { download, Parser } from "./components/parser";
import { listen } from "./components/router";


const program = configure();
const SPEC_PATH = program.spec;
const PORT = program.port;

download(SPEC_PATH).then(spec => {
  const router = listen(spec.paths, {port: PORT});
  router.use((ctx, next) => {
    debugger;
    next();
  })
});
