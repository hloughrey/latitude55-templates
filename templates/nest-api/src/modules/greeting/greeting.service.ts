import { Injectable } from '@nestjs/common';
import { Greeting } from './dto';

@Injectable()
export class GreetingService {
  getGreeting(name: string): Greeting {
    return { greeting: `Hello ${name}!` };
  }
}
