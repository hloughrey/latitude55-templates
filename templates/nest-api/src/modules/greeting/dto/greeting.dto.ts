import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Greeting {
  @ApiProperty()
  @IsString()
  greeting: string;
}
