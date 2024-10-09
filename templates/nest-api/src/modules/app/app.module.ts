import { Module } from '@nestjs/common';
import { GreetingModule } from '@msa/modules/greeting';

@Module({
  imports: [GreetingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
