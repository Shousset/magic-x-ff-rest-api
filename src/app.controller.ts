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
  <title>Magic: The Gathering - Final Fantasy (v2.0)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0B0E14;
      --bg-card: #151921;
      --bg-glass: rgba(21, 25, 33, 0.75);
      --border-glass: rgba(255, 255, 255, 0.08);
      --accent-primary: #6366F1;
      --accent-primary-hover: #4F46E5;
      --accent-gold: #F59E0B;
      --accent-emerald: #10B981;
      --text-main: #F3F4F6;
      --text-muted: #9CA3AF;
      --radius-lg: 16px;
      --radius-md: 12px;
      --shadow-glow: 0 0 25px rgba(99, 102, 241, 0.25);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.1) 0%, transparent 40%);
      background-attachment: fixed;
    }

    /* Layout Header */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-glass);
      padding: 14px 24px;
    }
    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-main);
    }
    .brand img {
      width: 42px;
      height: 42px;
      object-fit: contain;
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
    }
    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #FFF 0%, #A5B4FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-badge {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #A5B4FC;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
    }

    /* Auth & Nav controls */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-tabs {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-glass);
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: var(--accent-primary);
      color: #FFF;
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%);
      color: #FFF;
      box-shadow: var(--shadow-glow);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
    }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-glass);
      color: var(--text-main);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      border-radius: 30px;
      font-size: 13px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      background: var(--accent-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
    }

    /* Container & Sections */
    main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    /* Dynamic Hero Carousel */
    .carousel-section {
      margin-bottom: 40px;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .carousel-wrapper {
      position: relative;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-glass);
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      min-height: 380px;
    }
    .carousel-inner {
      display: flex;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .carousel-item {
      min-width: 100%;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      padding: 32px;
      align-items: center;
    }
    .carousel-img-wrap {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .carousel-img-wrap img {
      width: 100%;
      height: 340px;
      object-fit: contain;
      display: block;
      background: #000;
    }
    .carousel-info {
      display: flex;
      flex-col;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
    }
    .carousel-rarity {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--accent-gold);
    }
    .carousel-name {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 800;
      line-height: 1.1;
    }
    .carousel-type {
      color: var(--text-muted);
      font-size: 14px;
    }
    .carousel-text {
      font-size: 14px;
      line-height: 1.6;
      color: #D1D5DB;
      background: rgba(0, 0, 0, 0.2);
      padding: 14px;
      border-radius: 8px;
      border-left: 3px solid var(--accent-primary);
    }
    .carousel-controls {
      position: absolute;
      bottom: 20px;
      right: 30px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .carousel-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-glass);
      color: #FFF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.2s ease;
    }
    .carousel-btn:hover {
      background: var(--accent-primary);
      transform: scale(1.05);
    }
    .carousel-indicators {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .dot.active {
      width: 24px;
      border-radius: 4px;
      background: var(--accent-primary);
    }

    /* Filter Controls */
    .controls-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      min-width: 260px;
      position: relative;
    }
    .input-field {
      width: 100%;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
    }
    .input-field:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    /* Card Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }
    .card-item {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-item:hover {
      transform: translateY(-6px);
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5), var(--shadow-glow);
    }
    .card-img {
      width: 100%;
      height: 280px;
      object-fit: contain;
      background: #000;
      padding: 8px;
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;
    }
    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
    }
    .card-badge {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
    }
    .card-text {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    .card-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s ease;
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-box {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 32px;
      width: min(100%, 420px);
      box-shadow: 0 25px 50px rgba(0,0,0,0.6);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .modal-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 700;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-glass);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .carousel-item { grid-template-columns: 1fr; gap: 16px; }
      .carousel-img-wrap img { height: 220px; }
      .header-container { flex-direction: column; align-items: flex-start; }
      .nav-actions { width: 100%; justify-content: space-between; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="header-container">
      <a href="#" class="brand">
        <img src="/img/MTG.png" alt="MTG Final Fantasy" onerror="this.style.display='none'">
        <div>
          <div class="brand-title">MAGIC: FINAL FANTASY</div>
          <span class="brand-badge">REST API v2.0</span>
        </div>
      </a>

      <div class="nav-actions">
        <nav class="nav-tabs">
          <button class="tab-btn active" id="tab-explore" onclick="switchTab('explore')">🔥 Explorar Cartas</button>
          <button class="tab-btn" id="tab-collection" onclick="switchTab('collection')">📦 Mi Colección</button>
        </nav>

        <div id="auth-controls">
          <button class="btn btn-primary" onclick="openLoginModal()">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main>

    <!-- Carousel Section -->
    <section class="carousel-section" id="carousel-container">
      <h2 class="section-title">✨ Cartas Destacadas (Colección FIN)</h2>
      <div class="carousel-wrapper">
        <div class="carousel-inner" id="carousel-inner">
          <div class="carousel-item">
            <div style="padding: 40px; text-align: center; width: 100%;">Cargando carrusel...</div>
          </div>
        </div>
        <div class="carousel-controls">
          <button class="carousel-btn" onclick="prevSlide()">‹</button>
          <div class="carousel-indicators" id="carousel-dots"></div>
          <button class="carousel-btn" onclick="nextSlide()">›</button>
        </div>
      </div>
    </section>

    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="search-box">
        <input type="search" id="search-input" class="input-field" placeholder="🔍 Buscar cartas por nombre..." autocomplete="off">
      </div>
      <select id="rarity-filter" class="input-field" style="max-width: 200px;">
        <option value="">Todas las Rarezas</option>
      </select>
    </div>

    <!-- Status Bar -->
    <div id="status-bar" style="margin-bottom: 16px; font-size: 13px; color: var(--text-muted);">
      Cargando catálogo de cartas...
    </div>

    <!-- Cards Grid -->
    <section class="cards-grid" id="cards-grid">
      <!-- Generated via JS -->
    </section>

  </main>

  <!-- Login Modal -->
  <div class="modal-overlay" id="login-modal">
    <div class="modal-box">
      <div class="modal-header">
        <h3 class="modal-title">Iniciar Sesión v2.0</h3>
        <button class="btn btn-outline" onclick="closeLoginModal()" style="padding: 4px 10px;">✕</button>
      </div>
      <form id="login-form" onsubmit="handleLogin(event)">
        <div class="form-group">
          <label class="form-label">Usuario</label>
          <input type="text" id="login-username" class="input-field" required placeholder="Ej: jugador_prueba">
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input type="password" id="login-password" class="input-field" required placeholder="Password123!">
        </div>
        <div id="login-error" style="color: #EF4444; font-size: 12px; margin-bottom: 12px; display: none;"></div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
      </form>
    </div>
  </div>

  <script>
    let currentTab = 'explore';
    let allCards = [];
    let carouselCards = [];
    let carouselIndex = 0;
    let userToken = localStorage.getItem('jwt_token') || null;
    let currentUser = JSON.parse(localStorage.getItem('user_info') || 'null');
    let userCollection = [];

    // App Init
    document.addEventListener('DOMContentLoaded', () => {
      updateAuthUI();
      loadRarities();
      loadCards();
      if (userToken) loadCollection();
    });

    function updateAuthUI() {
      const container = document.getElementById('auth-controls');
      if (userToken && currentUser) {
        container.innerHTML = \`
          <div class="user-pill">
            <div class="user-avatar">\${currentUser.username.substring(0, 2).toUpperCase()}</div>
            <span>\${currentUser.username} (\${currentUser.role})</span>
            <button class="btn btn-outline" onclick="handleLogout()" style="padding: 4px 8px; font-size: 11px;">Salir</button>
          </div>
        \`;
      } else {
        container.innerHTML = \`<button class="btn btn-primary" onclick="openLoginModal()">Iniciar Sesión</button>\`;
      }
    }

    function switchTab(tab) {
      currentTab = tab;
      document.getElementById('tab-explore').classList.toggle('active', tab === 'explore');
      document.getElementById('tab-collection').classList.toggle('active', tab === 'collection');
      
      const carouselSec = document.getElementById('carousel-container');
      if (tab === 'collection') {
        carouselSec.style.display = 'none';
        if (!userToken) {
          document.getElementById('cards-grid').innerHTML = \`
            <div class="empty-state">
              <h3>🔒 Inicia sesión para ver tu colección</h3>
              <p style="margin-top: 8px;">Usa las credenciales de prueba: <b>jugador_prueba</b> / <b>Password123!</b></p>
              <button class="btn btn-primary" onclick="openLoginModal()" style="margin-top: 16px;">Iniciar Sesión</button>
            </div>
          \`;
          document.getElementById('status-bar').textContent = '';
          return;
        }
        renderCollectionGrid();
      } else {
        carouselSec.style.display = 'block';
        renderCardsGrid(allCards);
      }
    }

    async function loadRarities() {
      try {
        const res = await fetch('/rarities');
        const data = await res.json();
        const select = document.getElementById('rarity-filter');
        data.forEach(r => {
          const opt = document.createElement('option');
          opt.value = r.name;
          opt.textContent = r.name;
          select.appendChild(opt);
        });
      } catch (err) { console.error('Error cargando rarezas', err); }
    }

    async function loadCards() {
      const search = document.getElementById('search-input').value;
      const rarity = document.getElementById('rarity-filter').value;
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (rarity) params.set('rarity', rarity);

      try {
        const res = await fetch('/cards?' + params.toString());
        const data = await res.json();
        allCards = data.data || [];
        
        if (carouselCards.length === 0 && allCards.length > 0) {
          carouselCards = allCards.slice(0, 5);
          renderCarousel();
        }

        if (currentTab === 'explore') {
          renderCardsGrid(allCards);
          document.getElementById('status-bar').textContent = \`Mostrando \${allCards.length} cartas del set FIN\`;
        }
      } catch (err) {
        document.getElementById('cards-grid').innerHTML = '<div class="empty-state">Error cargando cartas</div>';
      }
    }

    async function loadCollection() {
      if (!userToken) return;
      try {
        const res = await fetch('/collections', {
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        if (res.ok) {
          userCollection = await res.json();
          if (currentTab === 'collection') renderCollectionGrid();
        }
      } catch (err) { console.error('Error cargando colección', err); }
    }

    function renderCarousel() {
      const inner = document.getElementById('carousel-inner');
      const dots = document.getElementById('carousel-dots');
      
      inner.innerHTML = carouselCards.map(card => \`
        <div class="carousel-item">
          <div class="carousel-img-wrap">
            <img src="\${card.imageUrl || '/img/MTG.png'}" alt="\${card.name}" onerror="this.src='/img/MTG.png'">
          </div>
          <div class="carousel-info">
            <div class="carousel-rarity">⭐ \${card.rarity.name} · SET \${card.setCode}</div>
            <h1 class="carousel-name">\${card.name}</h1>
            <div class="carousel-type">\${card.cardType.name} | Coste: \${card.manaCost || 'N/A'}</div>
            <div class="carousel-text">\${card.oracleText || 'Sin texto descriptivo.'}</div>
            <div style="margin-top: 12px;">
              <button class="btn btn-primary" onclick="addToCollection(\${card.id})">+ Añadir a mi Colección</button>
            </div>
          </div>
        </div>
      \`).join('');

      dots.innerHTML = carouselCards.map((_, i) => \`
        <div class="dot \${i === carouselIndex ? 'active' : ''}" onclick="goToSlide(\${i})"></div>
      \`).join('');

      updateCarouselPosition();
    }

    function updateCarouselPosition() {
      document.getElementById('carousel-inner').style.transform = \`translateX(-\${carouselIndex * 100}%)\`;
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, i) => dot.classList.toggle('active', i === carouselIndex));
    }

    function nextSlide() {
      carouselIndex = (carouselIndex + 1) % carouselCards.length;
      updateCarouselPosition();
    }

    function prevSlide() {
      carouselIndex = (carouselIndex - 1 + carouselCards.length) % carouselCards.length;
      updateCarouselPosition();
    }

    function goToSlide(i) {
      carouselIndex = i;
      updateCarouselPosition();
    }

    function renderCardsGrid(cards) {
      const grid = document.getElementById('cards-grid');
      if (cards.length === 0) {
        grid.innerHTML = '<div class="empty-state">No se encontraron cartas.</div>';
        return;
      }

      grid.innerHTML = cards.map(card => {
        const inCollection = userToken ? userCollection.find(entry => entry.cardId === card.id) : null;
        return \`
          <div class="card-item">
            <img src="\${card.imageUrl || '/img/MTG.png'}" class="card-img" alt="\${card.name}" onerror="this.src='/img/MTG.png'">
            <div class="card-body">
              <div class="card-title">\${card.name}</div>
              <span class="card-badge">\${card.rarity.name} · \${card.cardType.name}</span>
              <p class="card-text">\${card.oracleText || ''}</p>
              <div class="card-footer">
                <span style="font-size: 11px; color: var(--text-muted);">\${card.setCode} #\${card.collectorNumber}</span>
                <button class="btn btn-outline" style="padding: 6px 10px; font-size: 11px;" onclick="addToCollection(\${card.id})">
                  \${inCollection ? '➕ (' + inCollection.quantity + ')' : '➕ Añadir'}
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderCollectionGrid() {
      const grid = document.getElementById('cards-grid');
      document.getElementById('status-bar').textContent = \`Tu Colección: \${userCollection.length} tipos de cartas guardadas\`;

      if (userCollection.length === 0) {
        grid.innerHTML = \`
          <div class="empty-state">
            <h3>📦 Tu colección está vacía</h3>
            <p style="margin-top: 8px;">Explora las cartas y haz clic en "+ Añadir a mi Colección" para comenzar.</p>
          </div>
        \`;
        return;
      }

      grid.innerHTML = userCollection.map(entry => \`
        <div class="card-item">
          <img src="\${entry.card.imageUrl || '/img/MTG.png'}" class="card-img" alt="\${entry.card.name}" onerror="this.src='/img/MTG.png'">
          <div class="card-body">
            <div class="card-title">\${entry.card.name}</div>
            <span class="card-badge" style="background: rgba(16, 185, 129, 0.2); color: #10B981;">
              Cantidad: \${entry.quantity} \${entry.isFoil ? '✨ Foil' : ''}
            </span>
            <div class="card-footer" style="margin-top: auto;">
              <button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px;" onclick="updateQuantity('\${entry.id}', \${entry.quantity + 1})">+</button>
              <button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px;" onclick="updateQuantity('\${entry.id}', \${entry.quantity - 1})">-</button>
              <button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px; color: #EF4444;" onclick="deleteEntry('\${entry.id}')">🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      \`).join('');
    }

    async function addToCollection(cardId) {
      if (!userToken) {
        openLoginModal();
        return;
      }
      try {
        const res = await fetch('/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify({ cardId: Number(cardId), quantity: 1, isFoil: false })
        });
        if (res.ok) {
          await loadCollection();
          if (currentTab === 'explore') renderCardsGrid(allCards);
        } else {
          alert('No se pudo añadir la carta a la colección');
        }
      } catch (err) { console.error('Error añadiendo a colección', err); }
    }

    async function updateQuantity(entryId, newQuantity) {
      if (newQuantity <= 0) {
        deleteEntry(entryId);
        return;
      }
      try {
        const res = await fetch('/collections/' + entryId, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify({ quantity: newQuantity })
        });
        if (res.ok) await loadCollection();
      } catch (err) { console.error('Error actualizando cantidad', err); }
    }

    async function deleteEntry(entryId) {
      try {
        const res = await fetch('/collections/' + entryId, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        if (res.ok) await loadCollection();
      } catch (err) { console.error('Error eliminando entrada', err); }
    }

    // Modal & Auth Handlers
    function openLoginModal() { document.getElementById('login-modal').classList.add('active'); }
    function closeLoginModal() {
      document.getElementById('login-modal').classList.remove('active');
      document.getElementById('login-error').style.display = 'none';
    }

    async function handleLogin(e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const errorDiv = document.getElementById('login-error');

      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Credenciales inválidas');

        userToken = data.accessToken;
        currentUser = { username: data.username || username, role: data.role || 'PLAYER' };
        localStorage.setItem('jwt_token', userToken);
        localStorage.setItem('user_info', JSON.stringify(currentUser));

        updateAuthUI();
        closeLoginModal();
        await loadCollection();
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      }
    }

    function handleLogout() {
      userToken = null;
      currentUser = null;
      userCollection = [];
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      updateAuthUI();
      if (currentTab === 'collection') switchTab('explore');
      else renderCardsGrid(allCards);
    }

    // Search & Filter listeners
    let searchDebounce;
    document.getElementById('search-input').addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(loadCards, 300);
    });
    document.getElementById('rarity-filter').addEventListener('change', loadCards);
  </script>
</body>
</html>`;
  }
}
