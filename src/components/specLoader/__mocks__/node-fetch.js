import fs from 'fs';

export default (url: string) => {
  return new Promise((resolve, reject) => {
    resolve({
      text: () => {
        return fs.readFileSync('src/components/specLoader/__mocks__/petstore.yaml').toString();
      }
    })
  });
};
