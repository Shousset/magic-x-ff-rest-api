import { Injectable, Logger } from '@nestjs/common';
import type { LookupAddress } from 'node:dns';
import { promises as dns } from 'node:dns';

type FetchResult = {
  buffer: Buffer;
  contentType: string;
};

/**
 * Lista de rangos de IP privados/reservados que NO deben ser accesibles
 * desde el proxy de imágenes. Cualquier URL que resuelva a estas IPs será
 * rechazada para prevenir SSRF.
 */
const PRIVATE_IP_RANGES = [
  // Loopback
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  // RFC1918 (privadas)
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  // Link-local
  /^169\.254\.\d{1,3}\.\d{1,3}$/,
  // Carrier-grade NAT
  /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/,
  // Multicast
  /^22[4-9]\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^23[0-9]\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  // Reserved
  /^24[0-9]\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^25[0-5]\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  // 0.0.0.0/8
  /^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
];

/**
 * Lista de hostnames que siempre están prohibidos (adicional a IPs).
 */
const FORBIDDEN_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  'metadata',
  'metadata.google.internal',
  '169.254.169.254', // AWS/GCP metadata
];

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  /**
   * Descarga una imagen desde una URL externa, validando antes que no apunte
   * a recursos internos/privados (SSRF prevention).
   */
  async fetchImage(url: string): Promise<FetchResult> {
    this.validateUrl(url);

    let hostname: string;
    try {
      const parsed = new URL(url);
      hostname = parsed.hostname;
    } catch {
      throw new Error('URL inválida');
    }

    // Resolver DNS y verificar que la IP no sea privada
    await this.checkHostname(hostname);

    // Descargar con timeout y límite de tamaño
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'magic-x-ff-image-proxy/1.0',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.startsWith('image/')) {
        throw new Error(`Content-Type no es imagen: ${contentType}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Límite de tamaño: 5 MB
      if (buffer.length > 5 * 1024 * 1024) {
        throw new Error('Imagen demasiado grande (>5MB)');
      }

      return { buffer, contentType };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Valida que la URL tenga esquema http/https y no use esquemas peligrosos.
   */
  private validateUrl(url: string): void {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Solo se permiten esquemas http/https');
      }

      if (FORBIDDEN_HOSTNAMES.includes(parsed.hostname.toLowerCase())) {
        throw new Error('Hostname prohibido');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Hostname prohibido') {
        throw error;
      }
      throw new Error('URL inválida');
    }
  }

  /**
   * Resuelve el hostname y verifica que la IP no esté en rangos privados.
   */
  private async checkHostname(hostname: string): Promise<void> {
    // Si ya es una IP, validar directamente
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      this.checkIp(hostname);
      return;
    }

    // Resolver DNS
    let addresses: string[];
    try {
      const result = await dns.lookup(hostname, { family: 4, all: true });
      addresses = result.map((r: LookupAddress) => r.address);
    } catch {
      throw new Error('No se pudo resolver el hostname');
    }

    for (const address of addresses) {
      this.checkIp(address);
    }
  }

  /**
   * Verifica que una IP no esté en rangos privados/reservados.
   */
  private checkIp(ip: string): void {
    // Manejar IPv6 mapeado a IPv4 (::ffff:192.168.x.x)
    const ipv4 = ip.replace(/^::ffff:/, '');

    for (const range of PRIVATE_IP_RANGES) {
      if (range.test(ipv4)) {
        throw new Error(`Acceso a IP privada/reservada denegado: ${ipv4}`);
      }
    }
  }
}
