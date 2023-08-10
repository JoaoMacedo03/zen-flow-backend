export const GetObject = (obj: any, prop: any) => {
  if (!prop || !prop.split) return prop;
  let tmp = obj;
  try {
    const campos = prop.split('.');
    for (const i in campos) {
      if (tmp.hasOwnProperty(campos[i])) {
        tmp = tmp[campos[i]];
      } else {
        tmp = campos[i];
      }
    }
  } catch (e) {
    console.log('Erro: ', prop, e);
  }
  return tmp;
};
