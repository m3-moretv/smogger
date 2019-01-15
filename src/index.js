#!/usr/bin/env node
import 'source-map-support/register'

import { ballboy } from "ballboy";
import { configure } from "./components/configure";
import { setSpec } from "./components/parser";
import { createMiddleware, listen } from "./components/router";
import { mockData } from "./components/mocker";
import YAML from 'yamljs';

const config = configure();
const SPEC_PATH = config.spec;
const PORT = Number(config.port);

ballboy(SPEC_PATH)
  .then(YAML.parse)
  .then(setSpec)
  .then(spec => {
    const router = listen(spec.paths, {port: PORT});
    const cfg = {
      imageProvider: config.imageProvider
    };
    createMiddleware(router, [mockData(cfg)]);
  });
