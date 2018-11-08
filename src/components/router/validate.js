
const validate =  (params, required) => {
  
};

export const validatorMiddleware = spec => (ctx, next) => {
  //const rules = spec
  const { params } = ctx;
  console.log(spec);
  debugger;
  next();
};
