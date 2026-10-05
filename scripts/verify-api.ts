import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

async function verify() {
  console.log('🚀 Iniciando servidor de verificación...');
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );

  const port = 3099;
  await app.listen(port);
  const baseUrl = `http://localhost:${port}`;

  try {
    console.log('\n--- 1. Probando GET / (Interfaz Web HTML) ---');
    const rootRes = await fetch(`${baseUrl}/`);
    console.log('Status:', rootRes.status);
    const html = await rootRes.text();
    const hasHobbit = html.includes('The Hobbit');
    const hasFF = html.includes('Final Fantasy');
    const hasCollectionSearch = html.includes('Búsqueda por Colección');
    const hasMobileMeta = html.includes('viewport-fit=cover');
    console.log('Contiene "The Hobbit":', hasHobbit);
    console.log('Contiene "Final Fantasy":', hasFF);
    console.log('Contiene "Búsqueda por Colección":', hasCollectionSearch);
    console.log('Contiene meta móvil viewport-fit=cover:', hasMobileMeta);
    if (!hasHobbit || !hasFF || !hasCollectionSearch || !hasMobileMeta) {
      throw new Error('Faltan secciones requeridas en el HTML');
    }

    console.log('\n--- 2. Probando GET /cards/sets (Catálogo de Colecciones) ---');
    const setsRes = await fetch(`${baseUrl}/cards/sets`);
    console.log('Status:', setsRes.status);
    const sets = await setsRes.json();
    console.log('Colecciones recibidas:', sets);
    if (!Array.isArray(sets) || sets.length < 2) {
      throw new Error('Se esperaban al menos 2 colecciones (FIN y HOB)');
    }
    const hobSet = sets.find((s: any) => s.setCode === 'HOB');
    const finSet = sets.find((s: any) => s.setCode === 'FIN');
    console.log('Set HOB:', hobSet);
    console.log('Set FIN:', finSet);
    if (!hobSet || !finSet) {
      throw new Error('No se encontraron los sets HOB o FIN');
    }

    console.log('\n--- 3. Probando GET /cards?setCode=HOB (Filtro por The Hobbit) ---');
    const hobCardsRes = await fetch(`${baseUrl}/cards?setCode=HOB`);
    console.log('Status:', hobCardsRes.status);
    const hobData = await hobCardsRes.json();
    console.log('Total de cartas HOB retornadas:', hobData.data?.length);
    const sampleHob = hobData.data?.slice(0, 3).map((c: any) => ({ name: c.name, set: c.setCode }));
    console.log('Muestra cartas HOB:', sampleHob);
    if (!hobData.data || hobData.data.length === 0 || hobData.data[0].setCode !== 'HOB') {
      throw new Error('El filtro por setCode=HOB no retornó cartas válidas del Hobbit');
    }

    console.log('\n--- 4. Probando GET /cards?setCode=FIN (Filtro por Final Fantasy) ---');
    const finCardsRes = await fetch(`${baseUrl}/cards?setCode=FIN`);
    console.log('Status:', finCardsRes.status);
    const finData = await finCardsRes.json();
    console.log('Total de cartas FIN retornadas:', finData.data?.length);
    if (!finData.data || finData.data.length === 0 || finData.data[0].setCode !== 'FIN') {
      throw new Error('El filtro por setCode=FIN no retornó cartas válidas de Final Fantasy');
    }

    console.log('\n--- 5. Probando GET /cards?search=Bilbo (Búsqueda textual) ---');
    const bilboRes = await fetch(`${baseUrl}/cards?search=Bilbo`);
    const bilboData = await bilboRes.json();
    console.log('Cartas con "Bilbo":', bilboData.data?.map((c: any) => c.name));
    if (!bilboData.data || bilboData.data.length === 0) {
      throw new Error('No se encontró la carta de Bilbo');
    }

    console.log('\n✅ TODAS LAS PRUEBAS DE VERIFICACIÓN PASARON EXITOSAMENTE!');
  } finally {
    await app.close();
  }
}

verify().catch((err) => {
  console.error('❌ Error en la verificación:', err);
  process.exit(1);
});
