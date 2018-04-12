const log4js = require('log4js');
module.exports = ( options ) => {
  return async (ctx, next) => {
    const start = Date.now()
    log4js.configure({
      appenders: { 
        BaogoHi: { 
          type: 'dateFile',
          filename: `logs/task`,
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true 
      }},
      categories: { default: { appenders: ['BaogoHi'], level: 'info' } }
    }); 
    const logger = log4js.getLogger('BaogoHi');
    await next()
    const end = Date.now()
    const responseTime = end - start;
    logger.info(`响应时间为${responseTime/1000}s`);
  }
}