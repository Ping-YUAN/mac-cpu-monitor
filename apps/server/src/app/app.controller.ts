import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  root(@Res() res: Response) {
    res.sendFile(path.join(__dirname, '../cpu-monitor/index.html'));
  }
}
