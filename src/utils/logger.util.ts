import log4js = require('log4js');

export function getLogger(name: string): log4js.Logger {
  const logger = log4js.getLogger(name);
  logger.level = 'debug';
  return logger;
}
