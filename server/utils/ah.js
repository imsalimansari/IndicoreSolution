// Express 4 does not catch rejected promises in async handlers - this forwards them to the error middleware.
export const ah = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
