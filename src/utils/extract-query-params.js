export function extractQueryParams(query) {
  query = query.split('%20').join(' ');
  
  return query
    .substr(1)
    .split('&')
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=');

      queryParams[key] = value;

      return queryParams;
    }, {});
}
