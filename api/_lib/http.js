export function json(res, status, body) {
  res.status(status).setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  return res.end(JSON.stringify(body));
}
export function method(req, allowed) {
  if (!allowed.includes(req.method)) return false;
  return true;
}
