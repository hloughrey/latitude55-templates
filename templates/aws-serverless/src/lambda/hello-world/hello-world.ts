import { APIGatewayEvent } from 'aws-lambda';
import { sayHello } from '@latitude55/modules/hello-world';
import { response } from '@latitude55/libs';

export async function handler({ pathParameters }: APIGatewayEvent) {
  if (pathParameters?.name) {
    const message = sayHello(pathParameters?.name);
    return response(200, { message });
  }

  response(400, { message: 'Please provide name' });
}
