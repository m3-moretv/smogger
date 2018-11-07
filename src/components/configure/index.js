import program from 'commander';
import pkg from '../../../package.json';

export const configure = () => {
  program
    .version(pkg.version)
    .option('-s --spec <spec>', 'URL or path to spec file (yml, or json is same)')
    .option('-p --port <port>', 'Port for fake API')
    .parse(process.argv);

  return program;
};
