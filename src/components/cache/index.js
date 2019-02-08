#!/usr/bin/env node
const responseCache: { [string]: any } = new Map();

const cacheKey = (path: string, method: string): any => `${method}_${path}`;

export const setToCache = (path: string, method: string, data: any) =>
  responseCache.set(cacheKey(path, method), data);

export const getFromCache = (path: string, method: string): any =>
  responseCache.get(cacheKey(path, method));
