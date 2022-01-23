export function JsonParse<T = any>(value: T): any {
  let valToReturn = null;
  console.log(value);
  

  if (typeof value['value'] === 'string') {
    try {
      valToReturn =
        value['value'] === 'null' ? null : JSON.parse(value['value'].trim());
    } catch {
      valToReturn = value['value'];
    }
  } else {
    valToReturn = value['value'];
  }

  console.log(valToReturn);
  

  return valToReturn;
}
