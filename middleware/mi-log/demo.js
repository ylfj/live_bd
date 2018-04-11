const log4js = require('log4js');
log4js.configure({
  /**
   * cheese 指定要记录的日志分类
   * file 展示方式为文件类型
   * cheese.log 日志输出的文件名
   */
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  /**
   * 指定日志的默认配置项
   * 如果 log4js.getLogger 中没有指定，默认为 cheese 日志配置项
   * 指定 cheese 日志的记录内容为error 及 error 以上级别的信息
   */
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger('cheese');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');