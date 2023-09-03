import Handlebars from 'handlebars';
import * as he from 'he';

export default (paylod: { [n: string]: any }, data: string) => {
  try {
    const template = Handlebars.compile(data);
    const response = template(paylod);
    const unescapedString = he.decode(response);
    return unescapedString;
  } catch (e: any) {
    console.log('Error Handlebars:', e.message);
    return data;
  }
};