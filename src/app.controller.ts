import { Controller, Get, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('count')
  getCount(@Session() session: Record<string, any>) {
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
}
