import random from 'random';

export const entries: (obj: {}) => Array<[string, any]> = Object.entries.bind(Object);
export const run: (Function) => any = fn => fn();
export const normalizer: (Function) => (Array<any>, Array<any>) => Array<any> = handler => (acc, arr) => acc.concat(handler(arr));
export const spreadToArgs: (cb: Function) => (obj: {} | Array<any>) => any = cb => props => cb(...props);
export const normalizeUrlParams = (subst: RegExp, brackets?: string = ':$1') => (path: string) => path.replace(subst, brackets);
export const formatSwaggerPath: (path: string) => string = normalizeUrlParams(/:(\w+)/g, '{$1}');
export const formatRouterPath: (path: string) => string = normalizeUrlParams(/{(\w+)}/g, ':$1');
export const objectPath: (object: {}, path: string, separator?: string) => any = (object, path, separator = '.') => path.split(separator).reduce((acc, part) => acc[part], object);
export const randomElement: (arr: Array<any>) => any = (arr) => arr[random.int(0, arr.length-1)];
