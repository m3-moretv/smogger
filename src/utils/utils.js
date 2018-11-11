import type { Context } from "../types/Router";

export const entries: (obj: {}) => Array<string, any> = Object.entries.bind(Object);
export const run: (Function) => any = fn => fn();
export const normalizer: (Function) => (Array<any>, Array<any>) => Array<any> = handler => (acc, arr) => acc.concat(handler(arr));
export const spreadToArgs: (cb: Function) => (obj: {} | Array<any>) => any = cb => props => cb(...props);
export const dataToResponse: (data: {}, ctx: Context) => string = (data, ctx) => ctx.body = JSON.stringify(data);
export const normalizeUrlParams = (subst: RegExp, brackets?: string = ':$1') => (path: string) => path.replace(subst, brackets);
export const formatSwaggerPath: (path: string) => string = normalizeUrlParams(/:(\w+)/g, '{$1}');
export const formatRouterPath: (path: string) => string = normalizeUrlParams(/{(\w+)}/g, ':$1');
export const arrayToMap: (key: string, arr: Array<any>) => {[key: string]: any}
  = (arr, key) => arr.reduce((acc, item) => {
  const data = {...acc};
  data[item[key]] = item;
  return data;
}, {});
