import config from 'commander';
import pkg from '../../../package.json';

export const configure = () => {
  config
    .version(pkg.version)
    .option('-s --spec <spec>', 'URL or path to spec file (yml, or json is same)', './swagger.yml')
    .option('-p --port <port>', 'Port for fake API', 3000)
    .parse(process.argv);

  return config;
};
