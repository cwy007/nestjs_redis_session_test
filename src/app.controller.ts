import { Controller, Get, Inject, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { type Request, type Response } from 'express';
import { SessionService } from './session/session.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Inject(SessionService)
  private readonly sessionService: SessionService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('count')
  async getCount(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies['sid'] !== 'undefined' ? req.cookies['sid'] : '';
    const session = await this.sessionService.getSession<{ count: string }>(sid);

    const curCount = session.count ? parseInt(session.count, 10) : 0;
    const newCount = curCount + 1;
    const newSid = await this.sessionService.setSession(sid, { count: newCount.toString() });

    res.cookie('sid', newSid, { httpOnly: true, maxAge: 30 * 60 * 1000 });

    return newCount;
  }
}
