import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { ImagesService } from './images.service';

class ProxyImageQueryDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  url: string;
}

/**
 * Proxy seguro para imágenes externas.
 *
 * El catálogo muestra `imageUrl` de cada carta, que puede ser un host
 * externo (p. ej. cards.scryfall.io). En lugar de dejar que el navegador
 * cargue esa URL directamente — lo que exponería la IP del backend y permitiría
 * SSRF si alguien inyectara una URL interna en una carta — el frontend pide
 * `/images/proxy?url=...` y el backend descarga y reenvía el contenido.
 *
 * `ImagesService` rechaza URLs que apunten a direcciones internas/privadas
 * (loopback, link-local, RFC1918, etc.), cerrando la vía SSRF.
 */
@Controller('images')
export class ImagesController {
  private readonly logger = new Logger(ImagesController.name);

  constructor(private readonly imagesService: ImagesService) {}

  @Get('proxy')
  async proxy(@Query() query: ProxyImageQueryDto, @Res() response: Response) {
    try {
      const { buffer, contentType } = await this.imagesService.fetchImage(
        query.url,
      );
      response.set({
        'Content-Type': contentType,
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(buffer);
    } catch (error) {
      this.logger.warn('images/proxy rechazó la URL', query.url, error);
      response.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo obtener la imagen',
      });
    }
  }
}
