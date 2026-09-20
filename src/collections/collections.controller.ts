import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionEntryDto } from './dto/create-collection-entry.dto';
import { UpdateCollectionEntryDto } from './dto/update-collection-entry.dto';

type AuthenticatedRequest = { user: { id: string } };

// El userId sale siempre de request.user (del token), nunca del body:
// así nadie arma la colección de otro usuario.
@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(@Request() request: AuthenticatedRequest) {
    return this.collectionsService.findAllForUser(request.user.id); // 200
  }

  @Get('summary')
  summary(@Request() request: AuthenticatedRequest) {
    return this.collectionsService.summary(request.user.id); // 200
  }

  @Post()
  create(
    @Request() request: AuthenticatedRequest,
    @Body() dto: CreateCollectionEntryDto,
  ) {
    return this.collectionsService.create(request.user.id, dto); // 201
  }

  @Patch(':id')
  update(
    @Request() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCollectionEntryDto,
  ) {
    return this.collectionsService.update(request.user.id, id, dto); // 200 / 404
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Request() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.collectionsService.remove(request.user.id, id); // 204 / 404
  }
}
