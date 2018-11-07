import { bellhop } from "./index";
import fs from "fs";

jest.mock('node-fetch');
jest.mock('fs');

const mockedSpec = fs.readFileSync('src/components/specLoader/__mocks__/petstore.yaml').toString();

test('Download by HTTPS', () => {
  const link = 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml';
  return expect(bellhop(link)).resolves.toEqual(mockedSpec);
});

test('Download by file', () => {
  const link = '/path/to/file.yml';
  return expect(bellhop(link)).resolves.toEqual('some file content');
});
