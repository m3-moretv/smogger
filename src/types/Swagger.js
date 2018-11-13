export type ObjectModificator = {
  requred?: Array<string>;
  additionalProperties?: boolean;
  minProperties: number;
  maxProperties: number;
  properties?: {
    [key: string]: Schema;
  };
}

export type ArrayModificator = {
  items?: Schema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export type NumberModificator = {
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
  nullable?: boolean;
}

export type StringModificator = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export type Schema = {
  format?: DataFormat;
  type: DataTypes;
  readOnly?: boolean;
  writeOnly?: boolean;
} & NumberModificator & StringModificator & ArrayModificator & ObjectModificator;

export type ParameterIn = 'query' | 'body' | 'path';
export type ContentType = 'application/json' | 'application/xml' | 'text/plain';
export type DataTypes = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
export type DataFormat = 'float' | 'double' | 'int32' | 'int64' | 'binary' | 'byte';

export type Parameter = {
  description?: string;
  name: string;
  required?: boolean;
  in: ParameterIn;
  schema?: Schema;
  type?: DataTypes;
  format?: DataFormat;
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
