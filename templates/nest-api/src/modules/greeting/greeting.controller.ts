import { Controller, Get, Param } from '@nestjs/common';
import { GreetingService } from './greeting.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Greeting } from './dto';

@ApiTags('greeting')
@Controller('greeting')
export class GreetingController {
  constructor(private readonly service: GreetingService) {}

  @Get(':name')
  @ApiResponse({ status: 200, description: 'OK', type: Greeting })
  getGreeting(@Param('name') name: string): Greeting {
    return this.service.getGreeting(name);
  }
}
