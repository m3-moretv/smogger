export type Schema = {
  format: string;
  type: string;
  properties?: {}
};

export type ParameterIn = 'query' | 'body' | 'path';

export type Parameter = {
  description?: string;
  name: string;
  required?: boolean;
  in: ParameterIn;
  schema: Schema
}

export type Response = {
  description?: string;
  content: {
    [contentType: string]: {
      schema: Schema
    }
  };
}

export type Method = {
  operationId?: string;
  parameters?: Array<Parameter>;
  summary?: string;
  responses: {
    [status: string | number]: Response
  }
}

export type Path = {
  [httpMethod: string]: Method
}

export type Paths = {
  [key: string]: Path
}
