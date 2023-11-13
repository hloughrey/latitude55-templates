import { sayHello } from './hello-world';

describe('sayHello', () => {
  it('should say hello', () => {
    expect(sayHello('bob')).toEqual('Hello bob');
  });
});
