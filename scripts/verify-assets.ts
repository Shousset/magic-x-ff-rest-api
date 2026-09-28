import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from '../src/app.module';

async function verify() {
  console.log('🚀 Iniciando servidor de prueba para verificar diseño limpio e imágenes emblemáticas...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );

  const port = 3088;
  await app.listen(port);
  const baseUrl = `http://localhost:${port}`;

  try {
    console.log('\n--- 1. Probando Assets Estáticos Emblemáticos ---');
    const logoRes = await fetch(`${baseUrl}/img/magic-logo.svg`);
    console.log('Magic Logo status:', logoRes.status, 'size:', (await logoRes.arrayBuffer()).byteLength);
    if (logoRes.status !== 200) throw new Error('Logo de Magic no responde 200');

    const ringRes = await fetch(`${baseUrl}/img/sauron-ring.jpg`);
    console.log('Anillo de Sauron status:', ringRes.status, 'size:', (await ringRes.arrayBuffer()).byteLength);
    if (ringRes.status !== 200) throw new Error('Anillo de Sauron no responde 200');

    const swordRes = await fetch(`${baseUrl}/img/cloud-sword.jpg`);
    console.log('Espada de Cloud status:', swordRes.status, 'size:', (await swordRes.arrayBuffer()).byteLength);
    if (swordRes.status !== 200) throw new Error('Espada de Cloud no responde 200');

    console.log('\n--- 2. Probando HTML sin Emojis y con Imágenes ---');
    const rootRes = await fetch(`${baseUrl}/`);
    const html = await rootRes.text();
    
    // Check images
    if (!html.includes('/img/magic-logo.svg')) throw new Error('HTML no incluye magic-logo.svg');
    if (!html.includes('/img/sauron-ring.jpg')) throw new Error('HTML no incluye sauron-ring.jpg');
    if (!html.includes('/img/cloud-sword.jpg')) throw new Error('HTML no incluye cloud-sword.jpg');

    // Check absence of emojis
    const emojis = ['🗡️', '⚔️', '⭐', '✨', '🃏', '📚', '👤', '🌙', '☀️', '🔍', '📦', '🔒'];
    const foundEmojis = emojis.filter(e => html.includes(e));
    console.log('Emojis encontrados en la interfaz:', foundEmojis);
    if (foundEmojis.length > 0) {
      throw new Error(`Se encontraron emojis en el HTML: ${foundEmojis.join(' ')}`);
    }

    console.log('✅ Interfaz 100% limpia de emojis y con imágenes emblemáticas funcionando correctamente!');
  } finally {
    await app.close();
  }
}

verify().catch(err => {
  console.error('❌ Error en la verificación:', err);
  process.exit(1);
});
