import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async findAll() {
    const cards = await this.cardsService.findAll();
    return { data: cards };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Post()
  create(createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }
}
