#!/usr/bin/env node
import { ballboy } from "ballboy";
import { configure } from "./components/configure";
import { setSpec } from "./components/parser";
import { createMiddleware, listen } from "./components/router";
import { checkPathProps } from "./components/validator";
import { mockData } from "./components/mocker";
import YAML from 'yamljs';

const config = configure();
const SPEC_PATH = config.spec;
const PORT = config.port;

ballboy(SPEC_PATH)
  .then(YAML.parse)
  .then(setSpec)
  .then(spec => {
    const router = listen(spec.paths, {port: PORT});
    createMiddleware(router, [checkPathProps, mockData]);
  });
