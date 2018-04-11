module.exports = (ctx, message, commonInfo) => {
  const {
    method,
    url,
    host,
    headers
  } = ctx.request
  const client = {
    method,
    url,
    host,
    message,
    referer: headers['referer'],
    userAgent: headers['user-agent']
  }
}