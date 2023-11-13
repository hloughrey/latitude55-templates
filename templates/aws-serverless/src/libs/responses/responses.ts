function setHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
  };
}

export function response<T>(statusCode: number, body: T) {
  return {
    statusCode,
    headers: setHeaders(),
    body: JSON.stringify(body)
  };
}
