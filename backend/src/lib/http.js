export function sendJson(res, statusCode, payload, options = {}) {
  if (res.headersSent || res.writableEnded) {
    return
  }

  Object.entries(options.headers ?? {}).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  res.status(statusCode).json(payload)
}

export async function parseBody(req) {
  return req.body ?? {}
}
