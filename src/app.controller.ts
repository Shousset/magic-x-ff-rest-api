import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getInterface(): string {
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Magic The Gathering (MTG) Collection</title>
  <style>
    :root { color-scheme: light; font-family: system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #eef1f5; color: #17202a; }
    main { width: min(100%, 780px); min-height: 100vh; margin: auto; padding: 22px 16px 32px; background: #fff; }
    header { margin-bottom: 20px; }
    h1 { margin: 0 0 4px; font-size: 28px; }
    header p { margin: 0; color: #667085; font-size: 14px; }
    .controls { display: grid; gap: 10px; margin-bottom: 16px; }
    input, select { width: 100%; padding: 12px; border: 1px solid #d0d5dd; border-radius: 8px; background: #fff; color: inherit; font: inherit; }
    .status { min-height: 22px; margin-bottom: 12px; color: #667085; font-size: 14px; }
    .grid { display: grid; gap: 16px; }
    article { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: 330px; overflow: hidden; border: 1px solid #e4e7ec; border-radius: 10px; background: #fff; box-shadow: 0 2px 8px #10182812; }
    article img { display: block; width: 100%; height: 100%; min-height: 330px; object-fit: contain; background: #f2f4f7; }
    .content { min-width: 0; overflow: auto; padding: 16px 14px; }
    h2 { margin: 0 0 6px; font-size: 18px; }
    .meta { margin: 0 0 14px; color: #667085; font-size: 13px; }
    .field { margin: 0 0 12px; }
    .label { display: block; margin-bottom: 3px; color: #667085; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .value { margin: 0; font-size: 13px; line-height: 1.4; white-space: pre-line; word-break: break-word; }
    .empty { padding: 24px 0; color: #667085; text-align: center; }
    @media (min-width: 700px) { body { padding: 28px 0; } main { border-radius: 14px; box-shadow: 0 8px 30px #10182814; } }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Magic The Gathering (MTG) Collection</h1>
      <p>Coleccion de cartas de Magic The Gathering</p>
      <img src="./img/MTG.png">
    <section class="controls" aria-label="Filtros de cartas">
      <input id="search" type="search" placeholder="Buscar por nombre..." autocomplete="off">
      <select id="rarity" aria-label="Elegir rareza">
        <option value="">Todas las rarezas</option>
      </select>
    </section>
    <div id="status" class="status">Cargando cartas...</div>
    <section id="cards" class="grid" aria-live="polite"></section>
  </main>
  <script>
    const searchInput = document.querySelector('#search');
    const raritySelect = document.querySelector('#rarity');
    const status = document.querySelector('#status');
    const cardsContainer = document.querySelector('#cards');
    let searchTimer;

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    }

    function renderCards(cards) {
      if (!cards.length) {
        cardsContainer.innerHTML = '<p class="empty">No se encontraron cartas.</p>';
        return;
      }
      cardsContainer.innerHTML = cards.map(card => {
        const image = card.imageUrl ? '<img src="' + escapeHtml(card.imageUrl) + '" alt="' + escapeHtml(card.name) + '" loading="lazy">' : '<div></div>';
        const field = (label, value) => value ? '<div class="field"><span class="label">' + label + '</span><p class="value">' + escapeHtml(value) + '</p></div>' : '';
        const stats = card.power || card.toughness ? (card.power || '?') + ' / ' + (card.toughness || '?') : '';
        return '<article>' + image + '<div class="content"><h2>' + escapeHtml(card.name) + '</h2><p class="meta">' + escapeHtml(card.rarity.name) + ' · ' + escapeHtml(card.cardType.name) + '</p>' + field('Coste de maná', card.manaCost) + field('Texto', card.oracleText) + field('Fuerza / resistencia', stats) + field('Colección', card.setCode) + field('N.º coleccionista', card.collectorNumber) + field('Artista', card.artist) + '</div></article>';
      }).join('');
    }

    async function loadRarities() {
      const response = await fetch('/rarities');
      const rarities = await response.json();
      rarities.forEach(rarity => {
        const option = document.createElement('option');
        option.value = rarity.name;
        option.textContent = rarity.name;
        raritySelect.append(option);
      });
    }

    async function loadCards() {
      const params = new URLSearchParams();
      if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
      if (raritySelect.value) params.set('rarity', raritySelect.value);
      status.textContent = 'Buscando...';
      try {
        const response = await fetch('/cards?' + params.toString());
        if (!response.ok) throw new Error('No se pudo consultar la API');
        const result = await response.json();
        renderCards(result.data);
        status.textContent = result.data.length + ' carta' + (result.data.length === 1 ? '' : 's');
      } catch (error) {
        cardsContainer.innerHTML = '<p class="empty">No se pudo cargar la información.</p>';
        status.textContent = error.message;
      }
    }

    searchInput.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadCards, 250); });
    raritySelect.addEventListener('change', loadCards);
    Promise.all([loadRarities(), loadCards()]).catch(error => { status.textContent = error.message; });
  </script>
</body>
</html>`;
  }
}
