import { Express } from 'express';
import { Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import { getApp } from '../app';

export let cachedApp: Express;

const bootstrapApp = async (): Promise<Handler> => {
  if (!cachedApp) {
    cachedApp = await getApp();
  }
  return serverlessExpress({
    app: cachedApp
  });
};

export const handler: Handler = async (event: any, context: Context, callback: any) => {
  const expressInstance = await bootstrapApp();

  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda "main" is warm!');

    // Delay(50ms) response to ensure concurrent invocation
    await new Promise((resolve) => setTimeout(resolve, 50));

    return 'Lambda "main" is warm!';
  }

  return expressInstance(event, context, callback);
};
