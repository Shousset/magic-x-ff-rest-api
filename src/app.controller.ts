import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getInterface(): string {
    return `<!doctype html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Magic: The Gathering - Colección Final Fantasy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* CSS Theme Tokens */
    :root[data-theme="dark"] {
      --bg-body: #0F172A;
      --bg-surface: #1E293B;
      --bg-card: #1E293B;
      --bg-modal: #1E293B;
      --border-color: #334155;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --accent: #6366F1;
      --accent-hover: #4F46E5;
      --accent-light: rgba(99, 102, 241, 0.15);
      --badge-bg: #334155;
      --shadow-color: rgba(0, 0, 0, 0.4);
    }
    :root[data-theme="light"] {
      --bg-body: #F8FAFC;
      --bg-surface: #FFFFFF;
      --bg-card: #FFFFFF;
      --bg-modal: #FFFFFF;
      --border-color: #E2E8F0;
      --text-main: #0F172A;
      --text-muted: #64748B;
      --accent: #4F46E5;
      --accent-hover: #4338CA;
      --accent-light: rgba(79, 70, 229, 0.1);
      --badge-bg: #F1F5F9;
      --shadow-color: rgba(15, 23, 42, 0.08);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-body);
      color: var(--text-main);
      min-height: 100vh;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Container */
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Header */
    header {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 20px var(--shadow-color);
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
    }
    .brand-subtitle {
      font-size: 13px;
      color: var(--text-muted);
    }

    /* Header Controls */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: var(--accent);
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background: var(--accent-hover);
    }
    .btn-outline {
      background: transparent;
      border-color: var(--border-color);
      color: var(--text-main);
    }
    .btn-outline:hover {
      background: var(--accent-light);
    }
    .btn-theme {
      padding: 10px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      justify-content: center;
    }

    /* Filters Bar */
    .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .search-input, .select-input {
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      background: var(--bg-surface);
      color: var(--text-main);
      font-size: 14px;
      outline: none;
    }
    .search-input { flex: 1; min-width: 240px; }
    .search-input:focus, .select-input:focus {
      border-color: var(--accent);
    }
    .status-text {
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--text-muted);
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
    .card-item {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 12px var(--shadow-color);
    }
    .card-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px var(--shadow-color);
      border-color: var(--accent);
    }
    .card-img {
      width: 100%;
      height: 260px;
      object-fit: contain;
      background: rgba(0, 0, 0, 0.1);
      padding: 8px;
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .card-name {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
    }
    .card-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--badge-bg);
      color: var(--text-muted);
    }
    .badge-rarity {
      background: var(--accent-light);
      color: var(--accent);
    }

    /* Modals (Full-screen Detail & Admin Add Form) */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
      padding: 20px;
    }
    .modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      background: var(--bg-modal);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      width: min(100%, 860px);
      max-height: 90vh;
      overflow-y: auto;
      padding: 32px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      position: relative;
    }
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border-color);
      background: transparent;
      color: var(--text-main);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover { background: var(--accent-light); }

    /* Detail Modal Specifics */
    .detail-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 32px;
      align-items: start;
    }
    .detail-img {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      object-fit: contain;
      background: rgba(0,0,0,0.2);
    }
    .detail-info {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .detail-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
    }
    .detail-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .detail-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .detail-value {
      font-size: 14px;
      line-height: 1.5;
    }
    .oracle-box {
      background: var(--accent-light);
      border-left: 4px solid var(--accent);
      padding: 14px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
    }

    /* Form Grid for Add Card Modal */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group.full { grid-column: 1 / -1; }
    .form-label { font-size: 12px; font-weight: 600; color: var(--text-muted); }

    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
      .header-actions { flex-wrap: wrap; }
      .form-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <div class="app-container">
    <!-- Header -->
    <header>
      <div class="brand-group">
        <img src="/img/MTG.png" alt="Magic FF Logo" class="brand-logo" onerror="this.style.display='none'">
        <div>
          <h1 class="brand-title">Magic: Final Fantasy</h1>
          <p class="brand-subtitle">Colección e inventario de cartas</p>
        </div>
      </div>

      <div class="header-actions">
        <!-- Theme Switcher -->
        <button class="btn btn-outline btn-theme" onclick="toggleTheme()" id="theme-btn" title="Cambiar tema">🌙</button>

        <!-- Admin Add Card Button (visible when logged in as admin) -->
        <div id="admin-actions"></div>

        <!-- Auth Controls -->
        <div id="auth-controls">
          <button class="btn btn-primary" onclick="openModal('login-modal')">Iniciar Sesión</button>
        </div>
      </div>
    </header>

    <!-- Filters Bar -->
    <div class="filter-bar">
      <input type="search" id="search-input" class="search-input" placeholder="🔍 Buscar carta por nombre..." autocomplete="off">
      <select id="rarity-select" class="select-input">
        <option value="">Todas las Rarezas</option>
      </select>
    </div>

    <!-- Status Text -->
    <div id="status-bar" class="status-text">Cargando catálogo de cartas...</div>

    <!-- Cards Grid -->
    <main class="cards-grid" id="cards-grid">
      <!-- Generated via JavaScript -->
    </main>
  </div>

  <!-- 1. FULLSCREEN CARD DETAIL MODAL -->
  <div class="modal-backdrop" id="detail-modal">
    <div class="modal-content">
      <button class="close-btn" onclick="closeModal('detail-modal')">✕</button>
      <div class="detail-grid">
        <img id="detail-img" src="" alt="Carta" class="detail-img">
        <div class="detail-info">
          <h2 id="detail-title" class="detail-title">Nombre de Carta</h2>
          <div class="card-badges">
            <span id="detail-rarity" class="badge badge-rarity">Rareza</span>
            <span id="detail-type" class="badge">Tipo</span>
            <span id="detail-mana" class="badge" style="background: rgba(245, 158, 11, 0.2); color: #F59E0B;">Coste</span>
          </div>

          <div class="detail-field">
            <span class="detail-label">Texto de la Carta (Oracle Text)</span>
            <div id="detail-oracle" class="oracle-box">-</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="detail-field">
              <span class="detail-label">Fuerza / Resistencia</span>
              <span id="detail-stats" class="detail-value">-</span>
            </div>
            <div class="detail-field">
              <span class="detail-label">Set / Coleccionista</span>
              <span id="detail-set" class="detail-value">-</span>
            </div>
          </div>

          <div class="detail-field">
            <span class="detail-label">Artista</span>
            <span id="detail-artist" class="detail-value">-</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. LOGIN MODAL -->
  <div class="modal-backdrop" id="login-modal">
    <div class="modal-content" style="width: min(100%, 400px);">
      <button class="close-btn" onclick="closeModal('login-modal')">✕</button>
      <h2 style="font-family: 'Outfit'; font-size: 20px; margin-bottom: 16px;">Iniciar Sesión</h2>
      <form id="login-form" onsubmit="handleLogin(event)">
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label">Usuario</label>
          <input type="text" id="login-username" class="search-input" style="width: 100%;" required placeholder="admin_finalfantasy">
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Contraseña</label>
          <input type="password" id="login-password" class="search-input" style="width: 100%;" required placeholder="AdminPassword123!">
        </div>
        <div id="login-error" style="color: #EF4444; font-size: 12px; margin-bottom: 12px; display: none;"></div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Entrar</button>
      </form>
    </div>
  </div>

  <!-- 3. ADMIN ADD CARD MODAL -->
  <div class="modal-backdrop" id="add-card-modal">
    <div class="modal-content">
      <button class="close-btn" onclick="closeModal('add-card-modal')">✕</button>
      <h2 style="font-family: 'Outfit'; font-size: 22px; margin-bottom: 8px;">➕ Agregar Nueva Carta al Catálogo</h2>
      <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">Función disponible para administradores.</p>

      <form id="add-card-form" onsubmit="handleAddCard(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nombre de la Carta *</label>
            <input type="text" id="card-name" class="search-input" required placeholder="Ej: Sephiroth, One-Winged Angel">
          </div>
          <div class="form-group">
            <label class="form-label">Rareza *</label>
            <input type="text" id="card-rarity" class="search-input" required placeholder="Ej: Mythic, Rare, Common">
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de Carta *</label>
            <input type="text" id="card-type" class="search-input" required placeholder="Ej: Legendary Creature — Human Soldier">
          </div>
          <div class="form-group">
            <label class="form-label">N.º Coleccionista *</label>
            <input type="text" id="card-collector" class="search-input" required placeholder="Ej: 001">
          </div>
          <div class="form-group">
            <label class="form-label">Coste de Maná</label>
            <input type="text" id="card-mana" class="search-input" placeholder="Ej: {3}{B}{B}">
          </div>
          <div class="form-group">
            <label class="form-label">Fuerza / Resistencia</label>
            <input type="text" id="card-stats" class="search-input" placeholder="Ej: 5/5">
          </div>
          <div class="form-group full">
            <label class="form-label">Texto de Habilidad (Oracle Text)</label>
            <textarea id="card-oracle" class="search-input" rows="3" placeholder="Descripción de las habilidades de la carta..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Artista</label>
            <input type="text" id="card-artist" class="search-input" placeholder="Ej: Tetsuya Nomura">
          </div>
          <div class="form-group">
            <label class="form-label">URL de la Imagen</label>
            <input type="url" id="card-image" class="search-input" placeholder="https://...">
          </div>
        </div>

        <div id="add-card-error" style="color: #EF4444; font-size: 13px; margin-top: 12px; display: none;"></div>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="btn btn-outline" onclick="closeModal('add-card-modal')">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar Carta</button>
        </div>
      </form>
    </div>
  </div>

  <!-- JavaScript App Logic -->
  <script>
    let allCards = [];
    let userToken = localStorage.getItem('jwt_token') || null;
    let currentUser = JSON.parse(localStorage.getItem('user_info') || 'null');

    // Theme Management
    function initTheme() {
      const savedTheme = localStorage.getItem('app_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.getElementById('theme-btn').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('app_theme', next);
      document.getElementById('theme-btn').textContent = next === 'dark' ? '☀️' : '🌙';
    }

    // Modal Control
    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    // App Initialization
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      updateAuthUI();
      loadRarities();
      loadCards();
    });

    function updateAuthUI() {
      const authDiv = document.getElementById('auth-controls');
      const adminDiv = document.getElementById('admin-actions');

      if (userToken && currentUser) {
        authDiv.innerHTML = \`
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 13px; font-weight: 600;">\${currentUser.username}</span>
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="handleLogout()">Salir</button>
          </div>
        \`;
        if (currentUser.role === 'ADMINISTRATOR') {
          adminDiv.innerHTML = \`<button class="btn btn-primary" onclick="openModal('add-card-modal')">➕ Agregar Carta</button>\`;
        } else {
          adminDiv.innerHTML = '';
        }
      } else {
        authDiv.innerHTML = \`<button class="btn btn-primary" onclick="openModal('login-modal')">Iniciar Sesión</button>\`;
        adminDiv.innerHTML = '';
      }
    }

    async function loadRarities() {
      try {
        const res = await fetch('/rarities');
        const rarities = await res.json();
        const select = document.getElementById('rarity-select');
        rarities.forEach(r => {
          const opt = document.createElement('option');
          opt.value = r.name;
          opt.textContent = r.name;
          select.appendChild(opt);
        });
      } catch (e) { console.error('Error cargando rarezas:', e); }
    }

    async function loadCards() {
      const search = document.getElementById('search-input').value;
      const rarity = document.getElementById('rarity-select').value;
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (rarity) params.set('rarity', rarity);

      document.getElementById('status-bar').textContent = 'Buscando cartas...';
      try {
        const res = await fetch('/cards?' + params.toString());
        const result = await res.json();
        allCards = result.data || [];
        renderCards(allCards);
        document.getElementById('status-bar').textContent = \`Mostrando \${allCards.length} carta\${allCards.length === 1 ? '' : 's'}\`;
      } catch (err) {
        document.getElementById('cards-grid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Error cargando las cartas.</div>';
      }
    }

    function renderCards(cards) {
      const grid = document.getElementById('cards-grid');
      if (cards.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No se encontraron cartas.</div>';
        return;
      }

      grid.innerHTML = cards.map(card => \`
        <div class="card-item" onclick="openCardDetail(\${card.id})">
          <img src="\${card.imageUrl || '/img/MTG.png'}" class="card-img" alt="\${card.name}" onerror="this.src='/img/MTG.png'">
          <div class="card-body">
            <div class="card-name">\${card.name}</div>
            <div class="card-badges">
              <span class="badge badge-rarity">\${card.rarity.name}</span>
              <span class="badge">\${card.cardType.name}</span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    // Full-screen Detail Modal
    function openCardDetail(id) {
      const card = allCards.find(c => c.id === id);
      if (!card) return;

      document.getElementById('detail-img').src = card.imageUrl || '/img/MTG.png';
      document.getElementById('detail-title').textContent = card.name;
      document.getElementById('detail-rarity').textContent = card.rarity.name;
      document.getElementById('detail-type').textContent = card.cardType.name;
      document.getElementById('detail-mana').textContent = card.manaCost ? 'Maná: ' + card.manaCost : 'Sin coste';
      document.getElementById('detail-oracle').textContent = card.oracleText || 'Sin texto explicativo.';
      document.getElementById('detail-stats').textContent = (card.power || card.toughness) ? \`\${card.power || '?'} / \${card.toughness || '?'}\` : 'N/A';
      document.getElementById('detail-set').textContent = \`\${card.setCode} #\${card.collectorNumber}\`;
      document.getElementById('detail-artist').textContent = card.artist || 'Desconocido';

      openModal('detail-modal');
    }

    // Login Handler
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
        if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');

        userToken = data.accessToken;
        currentUser = { username: data.username || username, role: data.role || 'PLAYER' };
        localStorage.setItem('jwt_token', userToken);
        localStorage.setItem('user_info', JSON.stringify(currentUser));

        updateAuthUI();
        closeModal('login-modal');
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      }
    }

    function handleLogout() {
      userToken = null;
      currentUser = null;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      updateAuthUI();
    }

    // Admin Add Card Handler
    async function handleAddCard(e) {
      e.preventDefault();
      const errorDiv = document.getElementById('add-card-error');
      errorDiv.style.display = 'none';

      const stats = document.getElementById('card-stats').value.trim();
      let power = null, toughness = null;
      if (stats.includes('/')) {
        const parts = stats.split('/');
        power = parts[0].trim();
        toughness = parts[1].trim();
      }

      const body = {
        name: document.getElementById('card-name').value.trim(),
        rarity: document.getElementById('card-rarity').value.trim(),
        type: document.getElementById('card-type').value.trim(),
        collectorNumber: document.getElementById('card-collector').value.trim(),
        manaCost: document.getElementById('card-mana').value.trim() || null,
        power,
        toughness,
        oracleText: document.getElementById('card-oracle').value.trim() || null,
        artist: document.getElementById('card-artist').value.trim() || null,
        imageUrl: document.getElementById('card-image').value.trim() || null,
      };

      try {
        const res = await fetch('/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) {
          const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
          throw new Error(msg || 'Error al crear la carta');
        }

        closeModal('add-card-modal');
        document.getElementById('add-card-form').reset();
        await loadCards();
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      }
    }

    // Debounced Search
    let searchDebounce;
    document.getElementById('search-input').addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(loadCards, 300);
    });
    document.getElementById('rarity-select').addEventListener('change', loadCards);
  </script>
</body>
</html>`;
  }
}
