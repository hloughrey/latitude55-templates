import winston from 'winston';

export function createLogger(func: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { environment: process.env.STAGE, functionName: func },
    transports: [new winston.transports.Console()]
  });
}
