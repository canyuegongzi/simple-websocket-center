import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { InitService } from '../service/service/init.service';

@Controller('chartInit')
export class InitController {
  constructor(
    @Inject(InitService) private readonly initService: InitService,
  ) {}
}
