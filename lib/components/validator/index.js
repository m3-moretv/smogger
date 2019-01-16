"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPathProps = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _Swagger = require("../../types/Swagger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getValidJoiType = type => {
  switch (type) {
    case 'number':
    case 'integer':
      return 'number';

    default:
      return type;
  }
};

const createSchema = rules => {
  const schema = rules.reduce((schema, rule) => {
    const type = getValidJoiType(rule.type || rule.schema.type);

    const joiSchema = _joi.default[type]();

    schema[rule.name] = joiSchema;

    if (rule.required) {
      schema[rule.name] = joiSchema.required();
    }

    return schema;
  }, {});
  return _joi.default.object(schema);
};

const checkPathProps = config => (params, {
  parameters
}) => {
  const schema = createSchema(parameters);

  const {
    error
  } = _joi.default.validate(params, schema);

  if (error) {
    return {
      error: error.details
    };
  }
};

exports.checkPathProps = checkPathProps;
//# sourceMappingURL=index.js.map