export type Schema = {
  format: string;
  type: string;
};

export type Parameter = {
  description?: string;
  name: string;
  required?: boolean;
  in: 'query' | 'body';
  schema: Schema
}

export type Method = {
  operationId?: string;
  parameters: Array<Parameter>;
  summary?: string;
}

export type Path = {
  [key: string] : Method
}

export type Paths = {
  [key: string]: Path
}
