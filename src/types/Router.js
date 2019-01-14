import type { HTTPMethod } from "./Swagger";

export type Context = {
  body: string;
  params: {
    [name: string]: any;
  };
  req: {
    method: HTTPMethod;
  };
  _matchedRoute: string;
}
export type RouteParams = {
  [key: string]: number | string | boolean;
}
