import { pathToFileURL } from 'url';
import fetch from 'node-fetch';
import fs from 'fs';


type Bellhop = {
  (specPath: string): Promise<string>;
};

const getUrl = (path: string): URL => {
  let url;
  try {
    url = new URL(path);
  } catch (e) {
    url = pathToFileURL(path);
  }
  return url;
};


const downloadByHttp = async (path) => {
  const data = await fetch(path.href);
  return data.text();
};

const downloadByFile = async (path) => {
  return fs.readFileSync(path.pathname).toString();
};

const download = async (url: URL) => {
  switch (url.protocol) {
    case 'http:':
    case 'https:':
      return downloadByHttp(url);
    case 'file:':
      return downloadByFile(url);
  }
};

export const bellhop: Bellhop = (specPath) => {
  const url = getUrl(specPath);
  return download(url);
};
