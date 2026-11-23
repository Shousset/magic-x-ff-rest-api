import { Controller, Get } from '@nestjs/common';
import { RaritiesService } from './rarities.service';

@Controller('rarities')
export class RaritiesController {
  constructor(private readonly raritiesService: RaritiesService) {}

  @Get()
  findAll() {
    return this.raritiesService.findAll();
  }
}
