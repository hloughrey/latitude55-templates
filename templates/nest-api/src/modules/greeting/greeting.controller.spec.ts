import { Test, TestingModule } from '@nestjs/testing';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';

describe('GreetingController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [GreetingController],
      providers: [GreetingService],
    }).compile();
  });

  describe('getGreeting', () => {
    it('should return greeting', () => {
      const greetingController = app.get(GreetingController);
      expect(greetingController.getGreeting('Bob')).toEqual({
        greeting: 'Hello Bob!',
      });
    });
  });
});
