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
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Magic: The Gathering — Catálogo & Colecciones</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* CSS Variables & Themes - Clean Professional Palette */
    :root[data-theme="dark"] {
      --bg-base: #090D16;
      --bg-surface: #101726;
      --bg-card: #151F33;
      --bg-modal: #131C2E;
      --bg-glass: rgba(16, 23, 38, 0.92);
      --border: #1F2D44;
      --border-subtle: #172235;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --accent: #E11D48; /* Magic Red accent */
      --accent-hover: #BE123C;
      --accent-light: rgba(225, 29, 72, 0.12);
      --accent-glow: rgba(225, 29, 72, 0.3);
      --badge-bg: #1E293B;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.35);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.65);
      
      /* Franchise Palette */
      --fin-color: #38BDF8;
      --fin-bg: rgba(56, 189, 248, 0.12);
      --fin-border: rgba(56, 189, 248, 0.35);
      --hob-color: #F59E0B;
      --hob-bg: rgba(245, 158, 11, 0.12);
      --hob-border: rgba(245, 158, 11, 0.35);
    }

    :root[data-theme="light"] {
      --bg-base: #F8FAFC;
      --bg-surface: #FFFFFF;
      --bg-card: #FFFFFF;
      --bg-modal: #FFFFFF;
      --bg-glass: rgba(255, 255, 255, 0.94);
      --border: #E2E8F0;
      --border-subtle: #F1F5F9;
      --text-main: #0F172A;
      --text-muted: #64748B;
      --text-dim: #94A3B8;
      --accent: #DC2626; /* Magic Red accent */
      --accent-hover: #B91C1C;
      --accent-light: rgba(220, 38, 38, 0.08);
      --accent-glow: rgba(220, 38, 38, 0.2);
      --badge-bg: #F1F5F9;
      --shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.04);
      --shadow-md: 0 8px 20px rgba(15, 23, 42, 0.08);
      --shadow-lg: 0 20px 40px rgba(15, 23, 42, 0.12);

      --fin-color: #0284C7;
      --fin-bg: rgba(2, 132, 199, 0.08);
      --fin-border: rgba(2, 132, 199, 0.25);
      --hob-color: #D97706;
      --hob-bg: rgba(217, 119, 6, 0.08);
      --hob-border: rgba(217, 119, 6, 0.25);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      transition: background-color 0.25s ease, color 0.25s ease;
      overflow-x: hidden;
    }

    /* Container */
    .app-container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px 20px;
      flex: 1;
    }

    /* Header */
    header.main-header {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 10px 20px;
      transition: all 0.2s ease;
    }
    .header-inner {
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
      gap: 14px;
      text-decoration: none;
      color: inherit;
    }
    .brand-logo-img {
      height: 38px;
      max-width: 150px;
      object-fit: contain;
      filter: drop-shadow(0 2px 6px rgba(225, 29, 72, 0.25));
    }
    .brand-divider {
      width: 1px;
      height: 24px;
      background: var(--border);
    }
    .brand-subtitle-badge {
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    /* Header Controls */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Clean Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 40px;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      font-family: inherit;
      white-space: nowrap;
    }
    .btn-primary {
      background: var(--accent);
      color: #FFFFFF;
      box-shadow: 0 3px 10px var(--accent-glow);
    }
    .btn-primary:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }
    .btn-outline {
      background: transparent;
      border-color: var(--border);
      color: var(--text-main);
    }
    .btn-outline:hover {
      background: var(--accent-light);
      border-color: var(--accent);
    }
    .btn-sm {
      min-height: 34px;
      padding: 6px 12px;
      font-size: 12.5px;
      border-radius: 8px;
    }
    .btn-icon {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 10px;
      flex-shrink: 0;
    }
    .btn-icon svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    /* Navigation Bar / Tabs */
    .tabs-nav {
      display: flex;
      gap: 6px;
      background: var(--bg-surface);
      padding: 5px;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin: 16px 0 20px 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs-nav::-webkit-scrollbar { display: none; }
    .tab-btn {
      flex: 1;
      min-width: 130px;
      padding: 10px 16px;
      border-radius: 9px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-size: 13.5px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .tab-btn.active {
      background: var(--bg-card);
      color: var(--text-main);
      box-shadow: 0 2px 8px var(--shadow-sm);
      border: 1px solid var(--border);
    }
    .tab-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 6px;
      background: var(--badge-bg);
      color: var(--text-dim);
    }
    .tab-btn.active .tab-badge {
      background: var(--accent-light);
      color: var(--accent);
    }

    /* SECTION: BÚSQUEDA EXCLUSIVA POR COLECCIÓN */
    .collections-section {
      margin-bottom: 24px;
    }
    .collections-header {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 8px;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-subtitle {
      font-size: 12.5px;
      color: var(--text-muted);
    }

    /* Collection Showcase Cards with Iconic Franchise Imagery */
    .collections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }
    .collection-hero-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .collection-hero-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--text-dim);
    }
    .collection-hero-card.active {
      border-color: var(--accent);
      box-shadow: 0 0 0 1px var(--accent), var(--shadow-md);
      background: var(--bg-card);
    }
    .collection-hero-card.card-fin.active {
      border-color: var(--fin-color);
      box-shadow: 0 0 0 1px var(--fin-color), 0 6px 20px rgba(56, 189, 248, 0.18);
    }
    .collection-hero-card.card-hob.active {
      border-color: var(--hob-color);
      box-shadow: 0 0 0 1px var(--hob-color), 0 6px 20px rgba(245, 158, 11, 0.18);
    }
    .collection-info {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    
    /* Franchise Emblem Imagery (Sauron's Ring & Cloud's Buster Sword) */
    .franchise-thumb {
      width: 54px;
      height: 54px;
      border-radius: 10px;
      object-fit: cover;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
      flex-shrink: 0;
      border: 1px solid var(--border);
    }
    .card-fin .franchise-thumb {
      border-color: var(--fin-border);
    }
    .card-hob .franchise-thumb {
      border-color: var(--hob-border);
    }
    .all-sets-icon {
      width: 54px;
      height: 54px;
      border-radius: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--accent);
    }
    .all-sets-icon svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .collection-meta {
      min-width: 0;
    }
    .collection-meta h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 15.5px;
      font-weight: 700;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .collection-meta p {
      font-size: 12px;
      color: var(--text-muted);
    }
    .collection-pill-code {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 6px;
      align-self: flex-start;
      flex-shrink: 0;
    }
    .card-fin .collection-pill-code {
      background: var(--fin-bg);
      color: var(--fin-color);
      border: 1px solid var(--fin-border);
    }
    .card-hob .collection-pill-code {
      background: var(--hob-bg);
      color: var(--hob-color);
      border: 1px solid var(--hob-border);
    }
    .card-all .collection-pill-code {
      background: var(--badge-bg);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .search-wrapper {
      flex: 1;
      min-width: 220px;
      position: relative;
    }
    .search-icon-svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      fill: var(--text-dim);
      pointer-events: none;
    }
    .search-input, .select-input {
      width: 100%;
      padding: 11px 14px 11px 38px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-main);
      font-size: 14.5px;
      outline: none;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .select-input {
      padding: 11px 14px;
      min-width: 150px;
      width: auto;
      cursor: pointer;
    }
    .search-input:focus, .select-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent-light);
    }
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--text-muted);
      flex-wrap: wrap;
      gap: 8px;
    }
    .active-collection-banner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent-light);
      padding: 4px 12px;
      border-radius: 16px;
      font-weight: 600;
      font-size: 12px;
      color: var(--accent);
    }

    /* Responsive Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 16px;
    }
    .card-item {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
      box-shadow: var(--shadow-sm);
      position: relative;
    }
    .card-item:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--accent);
    }
    .card-img-wrapper {
      position: relative;
      width: 100%;
      height: 250px;
      background: rgba(0, 0, 0, 0.25);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }
    .card-item:hover .card-img {
      transform: scale(1.02);
    }
    .card-set-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 2px 7px;
      border-radius: 5px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      backdrop-filter: blur(6px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    }
    .set-badge-fin {
      background: #0284C7;
      color: #FFFFFF;
    }
    .set-badge-hob {
      background: #D97706;
      color: #FFFFFF;
    }
    .card-body {
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }
    .card-name {
      font-family: 'Outfit', sans-serif;
      font-size: 14.5px;
      font-weight: 700;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: auto;
    }
    .badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 5px;
      background: var(--badge-bg);
      color: var(--text-muted);
      text-transform: capitalize;
    }
    .badge-rarity-mythic { background: rgba(239, 68, 68, 0.15); color: #F87171; }
    .badge-rarity-rare { background: rgba(245, 158, 11, 0.15); color: #FBBF24; }
    .badge-rarity-uncommon { background: rgba(59, 130, 246, 0.15); color: #60A5FA; }
    .badge-rarity-common { background: var(--badge-bg); color: var(--text-muted); }

    /* MI COLECCIÓN VIEW */
    .user-collection-section {
      display: none;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .kpi-label {
      font-size: 11.5px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-value {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--text-main);
    }
    .kpi-sub {
      font-size: 11.5px;
      color: var(--text-dim);
    }
    .collection-entry-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 14px;
      margin-bottom: 8px;
      transition: border-color 0.2s;
    }
    .collection-entry-item:hover {
      border-color: var(--accent);
    }
    .entry-thumbnail {
      width: 44px;
      height: 60px;
      border-radius: 6px;
      object-fit: contain;
      background: rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }
    .entry-details {
      flex: 1;
      min-width: 0;
    }
    .entry-title {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .entry-badges {
      display: flex;
      gap: 6px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .entry-foil-badge {
      background: var(--accent);
      color: #FFFFFF;
      font-size: 9.5px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .entry-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qty-counter {
      display: flex;
      align-items: center;
      background: var(--bg-base);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
    }
    .qty-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--text-main);
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn:hover {
      background: var(--accent-light);
    }
    .qty-display {
      min-width: 26px;
      text-align: center;
      font-size: 12.5px;
      font-weight: 700;
    }

    /* MODALS & BOTTOM SHEETS */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      padding: 16px;
    }
    .modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      background: var(--bg-modal);
      border: 1px solid var(--border);
      border-radius: 16px;
      width: min(100%, 760px);
      max-height: 90vh;
      overflow-y: auto;
      padding: 24px;
      box-shadow: var(--shadow-lg);
      position: relative;
    }
    .close-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-main);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: var(--accent-light);
      border-color: var(--accent);
      color: var(--accent);
    }

    /* Detail Modal Layout */
    .detail-grid {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 24px;
      align-items: start;
    }
    .detail-img-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .detail-img {
      width: 100%;
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      object-fit: contain;
      background: rgba(0, 0, 0, 0.2);
    }
    .detail-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .detail-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.2;
    }
    .detail-field {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .detail-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }
    .detail-value {
      font-size: 13.5px;
      line-height: 1.5;
    }
    .oracle-box {
      background: var(--bg-surface);
      border-left: 3px solid var(--accent);
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 13.5px;
      line-height: 1.6;
    }

    /* Add To Collection Component inside Modal */
    .add-to-coll-box {
      margin-top: 10px;
      padding: 14px;
      border-radius: 10px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
    }
    .add-to-coll-box h4 {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--text-main);
    }
    .coll-form-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* Forms */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-top: 14px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group.full { grid-column: 1 / -1; }
    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }

    /* Toasts */
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 8px;
      pointer-events: auto;
      animation: toastIn 0.25s ease forwards;
    }
    @keyframes toastIn {
      from { transform: translateY(15px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* ============================================================
       MOBILE RESPONSIVENESS & BREAKPOINTS (Max width: 768px & 420px)
       ============================================================ */
    @media (max-width: 768px) {
      .app-container {
        padding: 12px 14px;
      }
      header.main-header {
        padding: 8px 14px;
      }
      .brand-logo-img {
        height: 30px;
      }
      .brand-divider, .brand-subtitle-badge {
        display: none;
      }
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 14px;
      }
      .detail-img {
        max-height: 260px;
        object-fit: contain;
      }
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .card-img-wrapper {
        height: 180px;
      }
      .card-body {
        padding: 10px;
      }
      .card-name {
        font-size: 13px;
      }
      .collections-grid {
        grid-template-columns: 1fr;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .modal-backdrop {
        align-items: flex-end;
        padding: 0;
      }
      .modal-content {
        width: 100%;
        max-height: 85vh;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        padding: 20px 16px;
      }
      .filter-bar {
        flex-direction: column;
      }
      .select-input {
        width: 100%;
      }
    }

    @media (max-width: 420px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      .card-img-wrapper {
        height: 155px;
        padding: 4px;
      }
      .badge {
        font-size: 9.5px;
        padding: 1px 5px;
      }
    }
  </style>
</head>
<body>

  <!-- Clean Professional Header -->
  <header class="main-header">
    <div class="header-inner">
      <a href="#" class="brand" onclick="switchTab('tab-catalog'); return false;">
        <!-- Original Magic Logo in Red -->
        <img src="/img/magic-logo.svg" alt="Magic: The Gathering" class="brand-logo-img">
        <div class="brand-divider"></div>
        <span class="brand-subtitle-badge">Final Fantasy & The Hobbit</span>
      </a>

      <div class="header-actions">
        <!-- Theme Toggle (Clean SVG Icons) -->
        <button class="btn btn-outline btn-icon" onclick="toggleTheme()" id="theme-btn" title="Alternar tema" aria-label="Alternar tema">
          <svg id="theme-icon" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        </button>

        <!-- Admin Add Card Button -->
        <div id="admin-actions"></div>

        <!-- Auth Controls (User Login / Logout) -->
        <div id="auth-controls">
          <button class="btn btn-primary btn-sm" onclick="openModal('login-modal')">
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="app-container">

    <!-- Mobile-First Navigation Tabs (Clean text & counters) -->
    <nav class="tabs-nav" aria-label="Secciones principales">
      <button class="tab-btn active" id="btn-tab-catalog" onclick="switchTab('tab-catalog')">
        <span>Catálogo General</span>
      </button>
      <button class="tab-btn" id="btn-tab-collections" onclick="switchTab('tab-collections')">
        <span>Búsqueda por Colección</span>
        <span class="tab-badge" id="sets-count-badge">2 Sets</span>
      </button>
      <button class="tab-btn" id="btn-tab-mycoll" onclick="switchTab('tab-mycoll')">
        <span>Mi Colección</span>
        <span class="tab-badge" id="mycoll-count-badge">0</span>
      </button>
    </nav>

    <!-- ========================================== -->
    <!-- TAB 1 & 2: VISTA DE CATÁLOGO & COLECCIONES -->
    <!-- ========================================== -->
    <section id="cards-view-section">

      <!-- Apartado Destacado: Búsqueda Exclusiva por Colección -->
      <div class="collections-section" id="collections-showcase">
        <div class="collections-header">
          <div>
            <h2 class="section-title">Colecciones Disponibles</h2>
            <p class="section-subtitle">Selecciona una colección para restringir la búsqueda a sus cartas oficiales</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="selectCollection('')" id="btn-clear-coll" style="display: none;">
            Ver todas las cartas
          </button>
        </div>

        <div class="collections-grid">
          <!-- Colección The Hobbit — Anillo de Sauron -->
          <div class="collection-hero-card card-hob" id="card-set-hob" onclick="selectCollection('HOB')">
            <div class="collection-info">
              <img src="/img/sauron-ring.jpg" class="franchise-thumb" alt="Anillo de Sauron">
              <div class="collection-meta">
                <h3>The Hobbit</h3>
                <p id="hob-count-text">321 cartas registradas</p>
              </div>
            </div>
            <span class="collection-pill-code">HOB</span>
          </div>

          <!-- Colección Final Fantasy — Espada de Cloud -->
          <div class="collection-hero-card card-fin" id="card-set-fin" onclick="selectCollection('FIN')">
            <div class="collection-info">
              <img src="/img/cloud-sword.jpg" class="franchise-thumb" alt="Espada de Cloud">
              <div class="collection-meta">
                <h3>Final Fantasy</h3>
                <p id="fin-count-text">594 cartas registradas</p>
              </div>
            </div>
            <span class="collection-pill-code">FIN</span>
          </div>

          <!-- Todas las cartas -->
          <div class="collection-hero-card card-all active" id="card-set-all" onclick="selectCollection('')">
            <div class="collection-info">
              <div class="all-sets-icon">
                <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
              </div>
              <div class="collection-meta">
                <h3>Todas las Colecciones</h3>
                <p id="total-count-text">915 cartas en total</p>
              </div>
            </div>
            <span class="collection-pill-code">TODAS</span>
          </div>
        </div>
      </div>

      <!-- Filtros de búsqueda limpios -->
      <div class="filter-bar">
        <div class="search-wrapper">
          <svg class="search-icon-svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="search" id="search-input" class="search-input" placeholder="Buscar carta por nombre (ej: Bilbo, Cloud, Sephiroth, Gandalf)..." autocomplete="off">
        </div>

        <select id="rarity-select" class="select-input" aria-label="Filtrar por rareza">
          <option value="">Todas las Rarezas</option>
        </select>
      </div>

      <!-- Barra de estado limpia -->
      <div class="status-bar">
        <div id="status-text">Cargando catálogo...</div>
        <div id="active-collection-indicator" style="display: none;">
          <span class="active-collection-banner" id="active-collection-text">Colección: Todas</span>
        </div>
      </div>

      <!-- Grilla responsiva de cartas -->
      <main class="cards-grid" id="cards-grid">
        <!-- Renderizado por JS -->
      </main>
    </section>

    <!-- ========================================== -->
    <!-- TAB 3: VISTA DE MI COLECCIÓN PERSONAL      -->
    <!-- ========================================== -->
    <section id="my-collection-section" class="user-collection-section">
      <div class="collections-header">
        <div>
          <h2 class="section-title">Mi Colección Personal</h2>
          <p class="section-subtitle">Inventario de cartas registradas en tu cuenta</p>
        </div>
      </div>

      <div id="my-coll-auth-warning" style="display: none; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 14px; padding: 36px 20px; text-align: center; margin-bottom: 24px;">
        <h3 style="font-family: 'Outfit'; font-size: 18px; margin-bottom: 6px;">Inicia sesión para gestionar tu colección</h3>
        <p style="color: var(--text-muted); font-size: 13.5px; max-width: 440px; margin: 0 auto 16px auto;">
          Registra cartas de Final Fantasy o The Hobbit en tu inventario personal, marca versiones Foil y administra tus cantidades.
        </p>
        <button class="btn btn-primary btn-sm" onclick="openModal('login-modal')">Iniciar Sesión</button>
      </div>

      <div id="my-coll-content" style="display: none;">
        <!-- KPI Cards Limpias -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-label">Total de Cartas</span>
            <span class="kpi-value" id="kpi-total-cards">0</span>
            <span class="kpi-sub">Copias registradas</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Cartas Únicas</span>
            <span class="kpi-value" id="kpi-unique-cards">0</span>
            <span class="kpi-sub">Modelos diferentes</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Por Rarezas</span>
            <span class="kpi-value" style="font-size: 15px; font-weight: 700; margin-top: 6px;" id="kpi-rarities-breakdown">-</span>
            <span class="kpi-sub">Distribución en inventario</span>
          </div>
        </div>

        <div id="my-collection-list">
          <!-- Entradas de la colección -->
        </div>
      </div>
    </section>

  </div>

  <!-- ========================================== -->
  <!-- MODAL 1: DETALLE DE CARTA (LIMPIO)         -->
  <!-- ========================================== -->
  <div class="modal-backdrop" id="detail-modal" onclick="handleBackdropClick(event, 'detail-modal')">
    <div class="modal-content">
      <button class="close-btn" onclick="closeModal('detail-modal')" aria-label="Cerrar">×</button>
      
      <div class="detail-grid">
        <div class="detail-img-col">
          <img id="detail-img" src="" alt="Carta" class="detail-img">
          <div style="display: flex; gap: 8px; justify-content: center;">
            <span id="detail-set-badge" class="collection-pill-code">SET</span>
            <span id="detail-collector-num" class="badge">#000</span>
          </div>
        </div>

        <div class="detail-info">
          <div>
            <h2 id="detail-title" class="detail-title">Nombre de Carta</h2>
            <div class="card-badges" style="margin-top: 8px;">
              <span id="detail-rarity" class="badge">Rareza</span>
              <span id="detail-type" class="badge">Tipo</span>
              <span id="detail-mana" class="badge" style="background: var(--bg-surface); color: var(--text-main);">Coste</span>
            </div>
          </div>

          <div class="detail-field">
            <span class="detail-label">Texto de Habilidad (Oracle Text)</span>
            <div id="detail-oracle" class="oracle-box">-</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="detail-field">
              <span class="detail-label">Fuerza / Resistencia</span>
              <span id="detail-stats" class="detail-value">-</span>
            </div>
            <div class="detail-field">
              <span class="detail-label">Colección de Origen</span>
              <span id="detail-collection-name" class="detail-value">-</span>
            </div>
          </div>

          <div class="detail-field">
            <span class="detail-label">Artista</span>
            <span id="detail-artist" class="detail-value">-</span>
          </div>

          <!-- MÓDULO DE COLECCIÓN: GUARDAR CARTA -->
          <div class="add-to-coll-box" id="detail-coll-box">
            <h4>Guardar en Mi Colección Personal</h4>
            <div id="coll-box-login-prompt" style="font-size: 13px; color: var(--text-muted);">
              Inicia sesión para registrar esta carta en tu inventario.
            </div>
            <div id="coll-box-actions" style="display: none;">
              <div class="coll-form-row">
                <label style="font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" id="add-coll-foil" style="width: 16px; height: 16px; accent-color: var(--accent);">
                  <span>Versión Foil</span>
                </label>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <label style="font-size: 13px; color: var(--text-muted);">Cantidad:</label>
                  <input type="number" id="add-coll-qty" value="1" min="1" max="99" class="select-input" style="width: 65px; padding: 6px 10px; min-width: auto;">
                </div>
                <button class="btn btn-primary btn-sm" onclick="addCurrentCardToCollection()" id="btn-add-to-coll">
                  Añadir a Colección
                </button>
              </div>
              <div id="coll-already-owned" style="font-size: 12px; color: var(--accent); margin-top: 8px; display: none;"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL 2: INICIAR SESIÓN (LIMPIO)           -->
  <!-- ========================================== -->
  <div class="modal-backdrop" id="login-modal" onclick="handleBackdropClick(event, 'login-modal')">
    <div class="modal-content" style="width: min(100%, 400px);">
      <button class="close-btn" onclick="closeModal('login-modal')">×</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-family: 'Outfit'; font-size: 20px;">Iniciar Sesión</h2>
        <p style="font-size: 13px; color: var(--text-muted);">Accede para administrar tu inventario de cartas</p>
      </div>

      <form id="login-form" onsubmit="handleLogin(event)">
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label">Usuario</label>
          <input type="text" id="login-username" class="search-input" style="padding-left: 14px;" required placeholder="admin_finalfantasy o jugador_prueba">
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Contraseña</label>
          <input type="password" id="login-password" class="search-input" style="padding-left: 14px;" required placeholder="••••••••">
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-size: 12px; color: var(--text-dim); margin-bottom: 14px;">
          <strong>Credenciales de prueba:</strong><br>
          • Admin: <code>admin_finalfantasy</code> / <code>AdminPassword123!</code><br>
          • Jugador: <code>jugador_prueba</code> / <code>Password123!</code>
        </div>

        <div id="login-error" style="color: #EF4444; font-size: 12px; margin-bottom: 12px; display: none;"></div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Ingresar</button>
      </form>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL 3: AGREGAR CARTA (ADMINISTRADOR)     -->
  <!-- ========================================== -->
  <div class="modal-backdrop" id="add-card-modal" onclick="handleBackdropClick(event, 'add-card-modal')">
    <div class="modal-content">
      <button class="close-btn" onclick="closeModal('add-card-modal')">×</button>
      <h2 style="font-family: 'Outfit'; font-size: 20px; margin-bottom: 4px;">Registrar Nueva Carta</h2>
      <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">Panel para administradores.</p>

      <form id="add-card-form" onsubmit="handleAddCard(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nombre de la Carta *</label>
            <input type="text" id="card-name" class="search-input" style="padding-left: 14px;" required placeholder="Ej: Bilbo Baggins o Sephiroth">
          </div>
          <div class="form-group">
            <label class="form-label">Colección (Set) *</label>
            <select id="card-set-input" class="select-input" required>
              <option value="HOB">The Hobbit (HOB)</option>
              <option value="FIN">Final Fantasy (FIN)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Rareza *</label>
            <input type="text" id="card-rarity" class="search-input" style="padding-left: 14px;" required placeholder="mythic, rare, uncommon, common">
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de Carta *</label>
            <input type="text" id="card-type" class="search-input" style="padding-left: 14px;" required placeholder="Legendary Creature — Halfling...">
          </div>
          <div class="form-group">
            <label class="form-label">N.º Coleccionista *</label>
            <input type="text" id="card-collector" class="search-input" style="padding-left: 14px;" required placeholder="Ej: 999">
          </div>
          <div class="form-group">
            <label class="form-label">Coste de Maná</label>
            <input type="text" id="card-mana" class="search-input" style="padding-left: 14px;" placeholder="Ej: {2}{W}">
          </div>
          <div class="form-group">
            <label class="form-label">Fuerza / Resistencia</label>
            <input type="text" id="card-stats" class="search-input" style="padding-left: 14px;" placeholder="Ej: 2/2">
          </div>
          <div class="form-group">
            <label class="form-label">Artista</label>
            <input type="text" id="card-artist" class="search-input" style="padding-left: 14px;" placeholder="Ej: John Howe / Tetsuya Nomura">
          </div>
          <div class="form-group full">
            <label class="form-label">URL de la Imagen</label>
            <input type="url" id="card-image" class="search-input" style="padding-left: 14px;" placeholder="https://cards.scryfall.io/...">
          </div>
          <div class="form-group full">
            <label class="form-label">Texto de Habilidad (Oracle Text)</label>
            <textarea id="card-oracle" class="search-input" style="padding-left: 14px; min-height: 80px;" placeholder="Habilidades y efectos..."></textarea>
          </div>
        </div>

        <div id="add-card-error" style="color: #EF4444; font-size: 13px; margin-top: 12px; display: none;"></div>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-outline" onclick="closeModal('add-card-modal')">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar Carta</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toast-container"></div>

  <!-- ========================================== -->
  <!-- JAVASCRIPT APP LOGIC (NO EMOJIS)           -->
  <!-- ========================================== -->
  <script>
    // State
    let allCards = [];
    let currentSelectedCard = null;
    let selectedSetCode = '';
    let userToken = localStorage.getItem('jwt_token') || null;
    let currentUser = JSON.parse(localStorage.getItem('user_info') || 'null');
    let userEntries = [];

    // Theme Switcher with SVG Icon Update
    function updateThemeIcon(theme) {
      const icon = document.getElementById('theme-icon');
      if (theme === 'dark') {
        // Moon icon
        icon.innerHTML = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';
      } else {
        // Sun icon
        icon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
      }
    }

    function initTheme() {
      const savedTheme = localStorage.getItem('app_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    }
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('app_theme', next);
      updateThemeIcon(next);
    }

    // Modal Control & Backdrop Clicks
    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }
    function handleBackdropClick(e, id) {
      if (e.target.id === id) closeModal(id);
    }

    // Toast Notifications (Clean, No Emojis)
    function showToast(message) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      const cardsSection = document.getElementById('cards-view-section');
      const myCollSection = document.getElementById('my-collection-section');
      const showcase = document.getElementById('collections-showcase');

      if (tabId === 'tab-catalog') {
        document.getElementById('btn-tab-catalog').classList.add('active');
        cardsSection.style.display = 'block';
        myCollSection.style.display = 'none';
        showcase.style.display = 'block';
      } else if (tabId === 'tab-collections') {
        document.getElementById('btn-tab-collections').classList.add('active');
        cardsSection.style.display = 'block';
        myCollSection.style.display = 'none';
        showcase.style.display = 'block';
        showcase.scrollIntoView({ behavior: 'smooth' });
      } else if (tabId === 'tab-mycoll') {
        document.getElementById('btn-tab-mycoll').classList.add('active');
        cardsSection.style.display = 'none';
        myCollSection.style.display = 'block';
        loadUserCollection();
      }
    }

    // Collection Selection
    function selectCollection(code) {
      selectedSetCode = code;
      
      document.getElementById('card-set-all').classList.toggle('active', code === '');
      document.getElementById('card-set-fin').classList.toggle('active', code === 'FIN');
      document.getElementById('card-set-hob').classList.toggle('active', code === 'HOB');

      const clearBtn = document.getElementById('btn-clear-coll');
      const indicator = document.getElementById('active-collection-indicator');
      const indicatorText = document.getElementById('active-collection-text');

      if (code) {
        clearBtn.style.display = 'inline-flex';
        indicator.style.display = 'block';
        const collName = code === 'HOB' ? 'The Hobbit (HOB)' : 'Final Fantasy (FIN)';
        indicatorText.textContent = 'Colección activa: ' + collName;
      } else {
        clearBtn.style.display = 'none';
        indicator.style.display = 'none';
      }

      loadCards();
    }

    // App Initialization
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      updateAuthUI();
      loadSetsMetadata();
      loadRarities();
      loadCards();
      if (userToken) loadUserCollection();
    });

    // Load available sets metadata
    async function loadSetsMetadata() {
      try {
        const res = await fetch('/cards/sets');
        if (!res.ok) return;
        const sets = await res.json();
        
        let totalAll = 0;
        sets.forEach(s => {
          totalAll += s.totalCards;
          if (s.setCode === 'FIN') {
            document.getElementById('fin-count-text').textContent = s.totalCards + ' cartas registradas';
          } else if (s.setCode === 'HOB') {
            document.getElementById('hob-count-text').textContent = s.totalCards + ' cartas registradas';
          }
        });
        document.getElementById('total-count-text').textContent = totalAll + ' cartas en total';
        document.getElementById('sets-count-badge').textContent = sets.length + ' Sets';
      } catch (e) {
        console.warn('Error obteniendo metadata de colecciones:', e);
      }
    }

    // Auth State UI Update (Clean, No Emojis)
    function updateAuthUI() {
      const authDiv = document.getElementById('auth-controls');
      const adminDiv = document.getElementById('admin-actions');
      const collPrompt = document.getElementById('coll-box-login-prompt');
      const collActions = document.getElementById('coll-box-actions');

      if (userToken && currentUser) {
        authDiv.innerHTML = \`
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2;">
              <span style="font-size: 13px; font-weight: 700;">\${currentUser.username}</span>
              <span style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">\${currentUser.role}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="handleLogout()">Salir</button>
          </div>
        \`;
        if (currentUser.role === 'ADMINISTRATOR') {
          adminDiv.innerHTML = \`<button class="btn btn-primary btn-sm" onclick="openModal('add-card-modal')">Nueva Carta</button>\`;
        } else {
          adminDiv.innerHTML = '';
        }

        if (collPrompt) collPrompt.style.display = 'none';
        if (collActions) collActions.style.display = 'block';
      } else {
        authDiv.innerHTML = \`
          <button class="btn btn-primary btn-sm" onclick="openModal('login-modal')">
            <span>Iniciar Sesión</span>
          </button>
        \`;
        adminDiv.innerHTML = '';
        if (collPrompt) collPrompt.style.display = 'block';
        if (collActions) collActions.style.display = 'none';
      }
    }

    // Load Rarities for Filter Select
    async function loadRarities() {
      try {
        const res = await fetch('/rarities');
        const rarities = await res.json();
        const select = document.getElementById('rarity-select');
        select.innerHTML = '<option value="">Todas las Rarezas</option>';
        rarities.forEach(r => {
          const opt = document.createElement('option');
          opt.value = r.name;
          opt.textContent = r.name.charAt(0).toUpperCase() + r.name.slice(1);
          select.appendChild(opt);
        });
      } catch (e) {
        console.error('Error cargando rarezas:', e);
      }
    }

    // Load Cards
    async function loadCards() {
      const search = document.getElementById('search-input').value;
      const rarity = document.getElementById('rarity-select').value;
      const params = new URLSearchParams();

      if (search) params.set('search', search);
      if (rarity) params.set('rarity', rarity);
      if (selectedSetCode) params.set('setCode', selectedSetCode);

      const statusEl = document.getElementById('status-text');
      statusEl.textContent = 'Buscando cartas...';

      try {
        const res = await fetch('/cards?' + params.toString());
        const result = await res.json();
        allCards = result.data || [];
        renderCards(allCards);

        const collLabel = selectedSetCode ? ' en ' + (selectedSetCode === 'HOB' ? 'The Hobbit' : 'Final Fantasy') : '';
        statusEl.textContent = \`Mostrando \${allCards.length} carta\${allCards.length === 1 ? '' : 's'}\${collLabel}\`;
      } catch (err) {
        document.getElementById('cards-grid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Error al cargar las cartas.</div>';
        statusEl.textContent = 'Error al consultar catálogo';
      }
    }

    // Render Cards Grid (Clean, No Emojis)
    function renderCards(cards) {
      const grid = document.getElementById('cards-grid');
      if (cards.length === 0) {
        grid.innerHTML = \`
          <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 48px 16px; background: var(--bg-surface); border-radius: 14px; border: 1px dashed var(--border);">
            <h3 style="font-family: 'Outfit'; font-size: 16px; margin-bottom: 4px;">No se encontraron cartas</h3>
            <p style="font-size: 13px;">Modifica los términos de búsqueda o selecciona otra colección.</p>
          </div>
        \`;
        return;
      }

      grid.innerHTML = cards.map(card => {
        const isHob = card.setCode === 'HOB';
        const setBadgeClass = isHob ? 'set-badge-hob' : 'set-badge-fin';
        const setCodeDisplay = card.setCode || 'FIN';
        const rarityClass = 'badge-rarity-' + (card.rarity.name.toLowerCase());

        return \`
          <article class="card-item" onclick="openCardDetail(\${card.id})">
            <div class="card-img-wrapper">
              <span class="card-set-badge \${setBadgeClass}">\${setCodeDisplay}</span>
              <img src="\${card.imageUrl || '/img/MTG.png'}" class="card-img" alt="\${card.name}" loading="lazy" onerror="this.src='/img/MTG.png'">
            </div>
            <div class="card-body">
              <h3 class="card-name">\${card.name}</h3>
              <div class="card-badges">
                <span class="badge \${rarityClass}">\${card.rarity.name}</span>
                <span class="badge">\${card.cardType.name}</span>
              </div>
            </div>
          </article>
        \`;
      }).join('');
    }

    // Open Card Detail Modal
    function openCardDetail(id) {
      const card = allCards.find(c => c.id === id);
      if (!card) return;
      currentSelectedCard = card;

      document.getElementById('detail-img').src = card.imageUrl || '/img/MTG.png';
      document.getElementById('detail-title').textContent = card.name;
      document.getElementById('detail-rarity').textContent = card.rarity.name;
      document.getElementById('detail-type').textContent = card.cardType.name;
      document.getElementById('detail-mana').textContent = card.manaCost ? 'Maná: ' + card.manaCost : 'Sin coste';
      document.getElementById('detail-oracle').textContent = card.oracleText || 'Sin texto de reglas registrado.';
      document.getElementById('detail-stats').textContent = (card.power || card.toughness) ? \`\${card.power || '?'} / \${card.toughness || '?'}\` : 'N/A';
      document.getElementById('detail-collector-num').textContent = '#' + card.collectorNumber;
      document.getElementById('detail-artist').textContent = card.artist || 'Desconocido';

      const isHob = card.setCode === 'HOB';
      const setBadge = document.getElementById('detail-set-badge');
      setBadge.textContent = card.setCode;
      setBadge.className = 'collection-pill-code ' + (isHob ? 'card-hob' : 'card-fin');

      document.getElementById('detail-collection-name').textContent = isHob ? 'The Hobbit (HOB)' : 'Final Fantasy (FIN)';

      checkExistingInCollection(card.id);
      openModal('detail-modal');
    }

    // Check if card is in user's personal collection
    function checkExistingInCollection(cardId) {
      const alreadyOwnedDiv = document.getElementById('coll-already-owned');
      if (!userToken || !alreadyOwnedDiv) return;

      const owned = userEntries.filter(e => e.cardId === cardId);
      if (owned.length > 0) {
        const total = owned.reduce((sum, e) => sum + e.quantity, 0);
        const hasFoil = owned.some(e => e.isFoil);
        alreadyOwnedDiv.textContent = \`En tu colección: \${total} copia\${total > 1 ? 's' : ''}\${hasFoil ? ' (incluye Foil)' : ''}.\`;
        alreadyOwnedDiv.style.display = 'block';
      } else {
        alreadyOwnedDiv.style.display = 'none';
      }
    }

    // Add Current Card to User Personal Collection
    async function addCurrentCardToCollection() {
      if (!userToken || !currentSelectedCard) {
        openModal('login-modal');
        return;
      }

      const qty = parseInt(document.getElementById('add-coll-qty').value, 10) || 1;
      const isFoil = document.getElementById('add-coll-foil').checked;
      const btn = document.getElementById('btn-add-to-coll');
      btn.disabled = true;
      btn.textContent = 'Guardando...';

      try {
        const res = await fetch('/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify({
            cardId: currentSelectedCard.id,
            quantity: qty,
            isFoil
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al guardar');

        showToast(\`\${qty}x "\${currentSelectedCard.name}" añadida a tu colección\`);
        await loadUserCollection();
        checkExistingInCollection(currentSelectedCard.id);
      } catch (err) {
        showToast(err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Añadir a Colección';
      }
    }

    // Load User Personal Collection
    async function loadUserCollection() {
      const warning = document.getElementById('my-coll-auth-warning');
      const content = document.getElementById('my-coll-content');
      const badge = document.getElementById('mycoll-count-badge');

      if (!userToken) {
        warning.style.display = 'block';
        content.style.display = 'none';
        badge.textContent = '0';
        return;
      }

      warning.style.display = 'none';
      content.style.display = 'block';

      try {
        const summaryRes = await fetch('/collections/summary', {
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        if (summaryRes.ok) {
          const sum = await summaryRes.json();
          document.getElementById('kpi-total-cards').textContent = sum.totalCards || 0;
          document.getElementById('kpi-unique-cards').textContent = sum.uniqueCards || 0;
          badge.textContent = sum.totalCards || 0;

          const rList = Object.entries(sum.byRarity || {}).map(([r, c]) => \`\${r}: \${c}\`).join(' • ');
          document.getElementById('kpi-rarities-breakdown').textContent = rList || 'Sin cartas registradas';
        }

        const listRes = await fetch('/collections', {
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        if (listRes.ok) {
          userEntries = await listRes.json();
          renderUserCollectionList(userEntries);
        }
      } catch (err) {
        console.error('Error cargando colección de usuario:', err);
      }
    }

    // Render User Collection List (Clean, No Emojis)
    function renderUserCollectionList(entries) {
      const listContainer = document.getElementById('my-collection-list');
      if (entries.length === 0) {
        listContainer.innerHTML = \`
          <div style="text-align: center; color: var(--text-muted); padding: 40px 16px; background: var(--bg-surface); border-radius: 12px; border: 1px dashed var(--border);">
            <h4 style="font-family: 'Outfit'; font-size: 15px;">Tu colección está vacía</h4>
            <p style="font-size: 13px; margin-top: 4px;">Explora el catálogo y pulsa en "Añadir a Colección" en cualquier carta.</p>
          </div>
        \`;
        return;
      }

      listContainer.innerHTML = entries.map(entry => {
        const card = entry.card;
        const isHob = card.setCode === 'HOB';
        const setBadgeClass = isHob ? 'card-hob' : 'card-fin';

        return \`
          <div class="collection-entry-item">
            <img src="\${card.imageUrl || '/img/MTG.png'}" class="entry-thumbnail" alt="\${card.name}" onerror="this.src='/img/MTG.png'">
            <div class="entry-details">
              <div class="entry-title">\${card.name}</div>
              <div class="entry-badges">
                <span class="collection-pill-code \${setBadgeClass}" style="font-size: 10px; padding: 1px 6px;">\${card.setCode}</span>
                <span class="badge" style="font-size: 10px;">\${card.rarity.name}</span>
                \${entry.isFoil ? '<span class="entry-foil-badge">FOIL</span>' : ''}
              </div>
            </div>
            <div class="entry-actions">
              <div class="qty-counter">
                <button class="qty-btn" onclick="updateEntryQuantity('\${entry.id}', \${entry.quantity - 1})">-</button>
                <span class="qty-display">\${entry.quantity}</span>
                <button class="qty-btn" onclick="updateEntryQuantity('\${entry.id}', \${entry.quantity + 1})">+</button>
              </div>
              <button class="btn btn-outline btn-sm" onclick="removeEntry('\${entry.id}')" style="color: #EF4444; border-color: rgba(239, 68, 68, 0.25);" title="Eliminar de la colección">Eliminar</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Update quantity
    async function updateEntryQuantity(id, newQty) {
      if (newQty <= 0) {
        removeEntry(id);
        return;
      }

      try {
        const res = await fetch('/collections/' + id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify({ quantity: newQty })
        });
        if (!res.ok) throw new Error('Error al actualizar cantidad');
        await loadUserCollection();
      } catch (err) {
        showToast(err.message);
      }
    }

    // Remove entry
    async function removeEntry(id) {
      try {
        const res = await fetch('/collections/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        if (!res.ok) throw new Error('Error al eliminar carta');
        showToast('Carta eliminada de tu colección');
        await loadUserCollection();
      } catch (err) {
        showToast(err.message);
      }
    }

    // Login Handler
    async function handleLogin(e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const errorDiv = document.getElementById('login-error');
      errorDiv.style.display = 'none';

      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Credenciales incorrectas');

        userToken = data.accessToken;
        currentUser = { username: data.username || username, role: data.role || 'PLAYER' };
        localStorage.setItem('jwt_token', userToken);
        localStorage.setItem('user_info', JSON.stringify(currentUser));

        updateAuthUI();
        closeModal('login-modal');
        showToast('Bienvenido, ' + currentUser.username);
        await loadUserCollection();
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      }
    }

    // Logout Handler
    function handleLogout() {
      userToken = null;
      currentUser = null;
      userEntries = [];
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      updateAuthUI();
      loadUserCollection();
      showToast('Sesión cerrada');
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
        setCode: document.getElementById('card-set-input').value,
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
          throw new Error(msg || 'Error al guardar la carta');
        }

        closeModal('add-card-modal');
        document.getElementById('add-card-form').reset();
        showToast('Carta agregada al catálogo');
        await loadSetsMetadata();
        await loadCards();
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      }
    }

    // Search and Filter Listeners
    let searchDebounce;
    document.getElementById('search-input').addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(loadCards, 280);
    });
    document.getElementById('rarity-select').addEventListener('change', loadCards);
  </script>
</body>
</html>`;
  }
}
