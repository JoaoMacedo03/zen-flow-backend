import Handlebars from 'handlebars';
import * as he from 'he';
export const convertBars = (paylod, data) => {
  const template = Handlebars.compile(data);
  const response = template(paylod);
  const unescapedString = he.decode(response);
  return unescapedString;
};
