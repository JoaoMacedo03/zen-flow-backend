import Handlebars from "./Handlebars";

const PrepareParams = (params:  { [n: string]: any }, dataset: any):  { [n: string]: any }  => {
    const newParams:{ [x: string]: any } = Array.isArray(params) ? [...params] : { ...params };
    for (const key in newParams) {
      if (newParams.hasOwnProperty(key)) {
        const value = newParams[key];
        if (key === 'flow') {
          newParams[key] = value;
          continue;
        }
        if (typeof value === 'object' && value !== null) {
          newParams[key] = PrepareParams(value, dataset);
        } else {
          newParams[key] =
            typeof value === 'string' ? Handlebars(dataset, value) : value;
        }
      }
    }
    return newParams as any;
  }
  export default PrepareParams