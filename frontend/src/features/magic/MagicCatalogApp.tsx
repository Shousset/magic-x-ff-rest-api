/* eslint-disable @next/next/no-img-element -- catalog artwork can use any validated HTTP(S) image host. */
'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { request } from '@/lib/api';
import type {
  Card,
  CollectionEntry,
  CollectionSummary,
  PublicUser,
  SetInfo,
} from '@/types/magic';
import { AddCardModal } from '@/features/admin/AddCardModal';
import { LoginModal } from '@/features/auth/LoginModal';

const fallbackImage = '/img/MTG.png';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [sets, setSets] = useState<SetInfo[]>([]);
  const [rarities, setRarities] = useState<{ name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [rarity, setRarity] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [catalogStatus, setCatalogStatus] = useState('Cargando catálogo...');
  const [activeTab, setActiveTab] = useState<'catalog' | 'sets' | 'mine'>(
    'catalog',
  );
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [summary, setSummary] = useState<CollectionSummary | null>(null);
  const [collectionError, setCollectionError] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [modal, setModal] = useState<'login' | 'add-card' | null>(null);
  const [toast, setToast] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [addCardError, setAddCardError] = useState('');
  const [addCardPending, setAddCardPending] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [foil, setFoil] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(false);

  const totalSetCards = useMemo(
    () => sets.reduce((total, set) => total + set.totalCards, 0),
    [sets],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedTheme = window.localStorage.getItem('app_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
      setThemeLoaded(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('app_theme', theme);
  }, [theme, themeLoaded]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('jwt_token');
    if (!savedToken || savedToken === 'undefined') {
      window.localStorage.removeItem('jwt_token');
      window.localStorage.removeItem('user_info');
      return;
    }

    let cancelled = false;
    request<PublicUser>('/auth/me', {}, savedToken)
      .then((authenticatedUser) => {
        if (cancelled) return;
        setToken(savedToken);
        setUser(authenticatedUser);
        window.localStorage.setItem(
          'user_info',
          JSON.stringify(authenticatedUser),
        );
      })
      .catch(() => {
        if (cancelled) return;
        window.localStorage.removeItem('jwt_token');
        window.localStorage.removeItem('user_info');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      280,
    );
    return () => window.clearTimeout(timeout);
  }, [search]);

  const loadCollection = useCallback(async (activeToken: string) => {
    setLoadingCollection(true);
    setCollectionError('');
    try {
      const [nextSummary, nextEntries] = await Promise.all([
        request<CollectionSummary>('/collections/summary', {}, activeToken),
        request<CollectionEntry[]>('/collections', {}, activeToken),
      ]);
      setSummary(nextSummary);
      setEntries(nextEntries);
    } catch (error) {
      setCollectionError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar tu colección',
      );
    } finally {
      setLoadingCollection(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => {
      void loadCollection(token);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [token, loadCollection]);

  const loadCards = useCallback(async () => {
    setCatalogStatus('Buscando cartas...');
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (rarity) params.set('rarity', rarity);
    if (selectedSet) params.set('setCode', selectedSet);

    try {
      const result = await request<{ data: Card[] }>(`/cards?${params}`);
      setCards(result.data);
      const setLabel = selectedSet
        ? ` en ${selectedSet === 'HOB' ? 'The Hobbit' : 'Final Fantasy'}`
        : '';
      setCatalogStatus(
        `Mostrando ${result.data.length} carta${result.data.length === 1 ? '' : 's'}${setLabel}`,
      );
    } catch (error) {
      setCards([]);
      setCatalogStatus(
        error instanceof Error ? error.message : 'Error al consultar catálogo',
      );
    }
  }, [debouncedSearch, rarity, selectedSet]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      request<SetInfo[]>('/cards/sets'),
      request<{ name: string }[]>('/rarities'),
    ])
      .then(([availableSets, availableRarities]) => {
        if (cancelled) return;
        setSets(availableSets);
        setRarities(availableRarities);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          showToast(
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar los filtros del catálogo',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadCards();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadCards]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function selectSet(code: string) {
    setSelectedSet(code);
    setActiveTab('sets');
  }

  function changeTab(tab: 'catalog' | 'sets' | 'mine') {
    setActiveTab(tab);
    if (tab === 'sets') {
      document
        .getElementById('collections-showcase')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (tab === 'mine' && token) void loadCollection(token);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError('');
    setLoginPending(true);
    const form = new FormData(event.currentTarget);
    const username = String(form.get('username') ?? '').trim();
    const password = String(form.get('password') ?? '');

    try {
      const login = await request<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (!login.access_token) {
        throw new Error('El servidor no devolvió un token de acceso válido');
      }

      const authenticatedUser = await request<PublicUser>(
        '/auth/me',
        {},
        login.access_token,
      );
      setToken(login.access_token);
      setUser(authenticatedUser);
      window.localStorage.setItem('jwt_token', login.access_token);
      window.localStorage.setItem(
        'user_info',
        JSON.stringify(authenticatedUser),
      );
      setModal(null);
      showToast(`Bienvenido, ${authenticatedUser.username}`);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'No se pudo iniciar sesión',
      );
    } finally {
      setLoginPending(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setEntries([]);
    setSummary(null);
    window.localStorage.removeItem('jwt_token');
    window.localStorage.removeItem('user_info');
    showToast('Sesión cerrada');
  }

  async function addSelectedCard() {
    if (!token || !selectedCard) {
      setModal('login');
      return;
    }

    try {
      await request<CollectionEntry>(
        '/collections',
        {
          method: 'POST',
          body: JSON.stringify({
            cardId: selectedCard.id,
            quantity,
            isFoil: foil,
          }),
        },
        token,
      );
      showToast(`${quantity}x "${selectedCard.name}" añadida a tu colección`);
      await loadCollection(token);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'No se pudo agregar la carta',
      );
    }
  }

  async function updateEntry(entry: CollectionEntry, nextQuantity: number) {
    if (!token) return;
    if (nextQuantity <= 0) {
      await removeEntry(entry.id);
      return;
    }
    try {
      await request<CollectionEntry>(
        `/collections/${entry.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ quantity: nextQuantity }),
        },
        token,
      );
      await loadCollection(token);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Error al actualizar cantidad',
      );
    }
  }

  async function removeEntry(id: string) {
    if (!token) return;
    try {
      await request<void>(`/collections/${id}`, { method: 'DELETE' }, token);
      showToast('Carta eliminada de tu colección');
      await loadCollection(token);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Error al eliminar carta',
      );
    }
  }

  async function createCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setAddCardError('');
    setAddCardPending(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const stats = String(form.get('stats') ?? '').split('/');

    try {
      await request<Card>(
        '/cards',
        {
          method: 'POST',
          body: JSON.stringify({
            name: String(form.get('name') ?? '').trim(),
            setCode: String(form.get('setCode') ?? 'FIN'),
            rarity: String(form.get('rarity') ?? '').trim(),
            type: String(form.get('type') ?? '').trim(),
            collectorNumber: String(form.get('collectorNumber') ?? '').trim(),
            manaCost: String(form.get('manaCost') ?? '').trim() || null,
            power: stats.length > 1 ? stats[0].trim() || null : null,
            toughness: stats.length > 1 ? stats[1].trim() || null : null,
            oracleText: String(form.get('oracleText') ?? '').trim() || null,
            artist: String(form.get('artist') ?? '').trim() || null,
            imageUrl: String(form.get('imageUrl') ?? '').trim() || null,
          }),
        },
        token,
      );
      setModal(null);
      formElement.reset();
      showToast('Carta agregada al catálogo');
      const availableSets = await request<SetInfo[]>('/cards/sets');
      setSets(availableSets);
      await loadCards();
    } catch (error) {
      setAddCardError(
        error instanceof Error ? error.message : 'Error al guardar la carta',
      );
    } finally {
      setAddCardPending(false);
    }
  }

  const ownedEntries = selectedCard
    ? entries.filter((entry) => entry.cardId === selectedCard.id)
    : [];
  const ownedQuantity = ownedEntries.reduce(
    (total, entry) => total + entry.quantity,
    0,
  );

  return (
    <>
      <header className="main-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => changeTab('catalog')}
            type="button"
          >
            <img
              src="/img/magic-logo.svg"
              alt="Magic: The Gathering"
              className="brand-logo-img"
            />
            <span className="brand-divider" />
            <span className="brand-subtitle-badge">
              Final Fantasy &amp; The Hobbit
            </span>
          </button>
          <div className="header-actions">
            <button
              className="btn btn-outline btn-icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Alternar tema"
              aria-label="Alternar tema"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d={
                    theme === 'dark'
                      ? 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z'
                      : 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z'
                  }
                />
              </svg>
            </button>
            {user?.role === 'ADMINISTRATOR' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setModal('add-card')}
                type="button"
              >
                Nueva Carta
              </button>
            )}
            {user ? (
              <div className="header-user">
                <span>
                  <strong>{user.username}</strong>
                  <small>{user.role}</small>
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={logout}
                  type="button"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setModal('login')}
                type="button"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="app-container">
        <nav className="tabs-nav" aria-label="Secciones principales">
          <button
            className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => changeTab('catalog')}
            type="button"
          >
            Catálogo General
          </button>
          <button
            className={`tab-btn ${activeTab === 'sets' ? 'active' : ''}`}
            onClick={() => changeTab('sets')}
            type="button"
          >
            Búsqueda por Colección
            <span className="tab-badge">{sets.length} Sets</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
            onClick={() => changeTab('mine')}
            type="button"
          >
            Mi Colección
            <span className="tab-badge">{summary?.totalCards ?? 0}</span>
          </button>
        </nav>

        {activeTab !== 'mine' ? (
          <section>
            <div className="collections-section" id="collections-showcase">
              <div className="collections-header">
                <div>
                  <h2 className="section-title">Colecciones Disponibles</h2>
                  <p className="section-subtitle">
                    Selecciona una colección para restringir la búsqueda a sus
                    cartas oficiales
                  </p>
                </div>
                {selectedSet && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => selectSet('')}
                    type="button"
                  >
                    Ver todas las cartas
                  </button>
                )}
              </div>
              <div className="collections-grid">
                <button
                  className={`collection-hero-card card-hob ${selectedSet === 'HOB' ? 'active' : ''}`}
                  onClick={() => selectSet('HOB')}
                  type="button"
                >
                  <span className="collection-info">
                    <img
                      src="/img/sauron-ring.jpg"
                      className="franchise-thumb"
                      alt="Anillo de Sauron"
                    />
                    <span className="collection-meta">
                      <strong>The Hobbit</strong>
                      <span>
                        {sets.find((set) => set.setCode === 'HOB')
                          ?.totalCards ?? 0}{' '}
                        cartas registradas
                      </span>
                    </span>
                  </span>
                  <span className="collection-pill-code">HOB</span>
                </button>
                <button
                  className={`collection-hero-card card-fin ${selectedSet === 'FIN' ? 'active' : ''}`}
                  onClick={() => selectSet('FIN')}
                  type="button"
                >
                  <span className="collection-info">
                    <img
                      src="/img/cloud-sword.jpg"
                      className="franchise-thumb"
                      alt="Espada de Cloud"
                    />
                    <span className="collection-meta">
                      <strong>Final Fantasy</strong>
                      <span>
                        {sets.find((set) => set.setCode === 'FIN')
                          ?.totalCards ?? 0}{' '}
                        cartas registradas
                      </span>
                    </span>
                  </span>
                  <span className="collection-pill-code">FIN</span>
                </button>
                <button
                  className={`collection-hero-card card-all ${selectedSet === '' ? 'active' : ''}`}
                  onClick={() => selectSet('')}
                  type="button"
                >
                  <span className="collection-info">
                    <span className="all-sets-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                      </svg>
                    </span>
                    <span className="collection-meta">
                      <strong>Todas las Colecciones</strong>
                      <span>{totalSetCards} cartas en total</span>
                    </span>
                  </span>
                  <span className="collection-pill-code">TODAS</span>
                </button>
              </div>
            </div>

            <div className="filter-bar">
              <div className="search-wrapper">
                <svg
                  className="search-icon-svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="search"
                  className="search-input"
                  placeholder="Buscar carta por nombre (ej: Bilbo, Cloud, Sephiroth, Gandalf)..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <select
                className="select-input"
                aria-label="Filtrar por rareza"
                value={rarity}
                onChange={(event) => setRarity(event.target.value)}
              >
                <option value="">Todas las Rarezas</option>
                {rarities.map((item) => (
                  <option value={item.name} key={item.name}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="status-bar">
              <span>{catalogStatus}</span>
              {selectedSet && (
                <span className="active-collection-banner">
                  Colección activa:{' '}
                  {selectedSet === 'HOB'
                    ? 'The Hobbit (HOB)'
                    : 'Final Fantasy (FIN)'}
                </span>
              )}
            </div>

            <main className="cards-grid">
              {cards.length ? (
                cards.map((card) => (
                  <button
                    className="card-item"
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card);
                      setQuantity(1);
                      setFoil(false);
                    }}
                    type="button"
                  >
                    <span className="card-img-wrapper">
                      <span
                        className={`card-set-badge ${card.setCode === 'HOB' ? 'set-badge-hob' : 'set-badge-fin'}`}
                      >
                        {card.setCode || 'FIN'}
                      </span>
                      <img
                        src={card.imageUrl || fallbackImage}
                        className="card-img"
                        alt={card.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </span>
                    <span className="card-body">
                      <strong className="card-name">{card.name}</strong>
                      <span className="card-badges">
                        <span
                          className={`badge badge-rarity-${card.rarity.name.toLowerCase()}`}
                        >
                          {card.rarity.name}
                        </span>
                        <span className="badge">{card.cardType.name}</span>
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <h3>
                    {catalogStatus.startsWith('Error')
                      ? 'No se pudo cargar el catálogo'
                      : 'No se encontraron cartas'}
                  </h3>
                  <p>
                    {catalogStatus.startsWith('Error')
                      ? catalogStatus
                      : 'Modifica los términos de búsqueda o selecciona otra colección.'}
                  </p>
                </div>
              )}
            </main>
          </section>
        ) : (
          <section className="user-collection-section">
            <div className="collections-header">
              <div>
                <h2 className="section-title">Mi Colección Personal</h2>
                <p className="section-subtitle">
                  Inventario de cartas registradas en tu cuenta
                </p>
              </div>
            </div>
            {!token ? (
              <div className="collection-auth-warning">
                <h3>Inicia sesión para gestionar tu colección</h3>
                <p>
                  Registra cartas de Final Fantasy o The Hobbit en tu inventario
                  personal, marca versiones Foil y administra tus cantidades.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setModal('login')}
                  type="button"
                >
                  Iniciar Sesión
                </button>
              </div>
            ) : (
              <>
                {collectionError && (
                  <div className="collection-error" role="alert">
                    {collectionError}
                  </div>
                )}
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <span className="kpi-label">Total de Cartas</span>
                    <span className="kpi-value">
                      {summary?.totalCards ?? 0}
                    </span>
                    <span className="kpi-sub">Copias registradas</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">Cartas Únicas</span>
                    <span className="kpi-value">
                      {summary?.uniqueCards ?? 0}
                    </span>
                    <span className="kpi-sub">Modelos diferentes</span>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">Por Rarezas</span>
                    <span className="kpi-value kpi-rarities">
                      {summary
                        ? Object.entries(summary.byRarity)
                            .map(([name, count]) => `${name}: ${count}`)
                            .join(' · ') || 'Sin cartas registradas'
                        : '—'}
                    </span>
                    <span className="kpi-sub">Distribución en inventario</span>
                  </div>
                </div>
                {loadingCollection ? (
                  <p className="collection-loading">Cargando colección...</p>
                ) : entries.length ? (
                  <div className="collection-list">
                    {entries.map((entry) => (
                      <article className="collection-entry-item" key={entry.id}>
                        <img
                          src={entry.card.imageUrl || fallbackImage}
                          className="entry-thumbnail"
                          alt={entry.card.name}
                          onError={(event) => {
                            event.currentTarget.src = fallbackImage;
                          }}
                        />
                        <div className="entry-details">
                          <strong className="entry-title">
                            {entry.card.name}
                          </strong>
                          <div className="entry-badges">
                            <span
                              className={`collection-pill-code ${entry.card.setCode === 'HOB' ? 'card-hob' : 'card-fin'}`}
                            >
                              {entry.card.setCode}
                            </span>
                            <span className="badge">
                              {entry.card.rarity.name}
                            </span>
                            {entry.isFoil && (
                              <span className="entry-foil-badge">FOIL</span>
                            )}
                          </div>
                        </div>
                        <div className="entry-actions">
                          <div className="qty-counter">
                            <button
                              className="qty-btn"
                              onClick={() =>
                                void updateEntry(entry, entry.quantity - 1)
                              }
                              title="Reducir cantidad"
                              type="button"
                            >
                              -
                            </button>
                            <span className="qty-display">
                              {entry.quantity}
                            </span>
                            <button
                              className="qty-btn"
                              onClick={() =>
                                void updateEntry(entry, entry.quantity + 1)
                              }
                              title="Aumentar cantidad"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="btn btn-outline btn-sm remove-entry"
                            onClick={() => void removeEntry(entry.id)}
                            type="button"
                          >
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-collection">
                    <h4>Tu colección está vacía</h4>
                    <p>
                      Explora el catálogo y pulsa en “Añadir a Colección” en
                      cualquier carta.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>

      {selectedCard && (
        <div
          className="modal-backdrop active"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedCard(null);
          }}
        >
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedCard(null)}
              aria-label="Cerrar"
              type="button"
            >
              ×
            </button>
            <div className="detail-grid">
              <div className="detail-img-col">
                <img
                  src={selectedCard.imageUrl || fallbackImage}
                  alt={selectedCard.name}
                  className="detail-img"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="detail-pills">
                  <span
                    className={`collection-pill-code ${selectedCard.setCode === 'HOB' ? 'card-hob' : 'card-fin'}`}
                  >
                    {selectedCard.setCode}
                  </span>
                  <span className="badge">#{selectedCard.collectorNumber}</span>
                </div>
              </div>
              <div className="detail-info">
                <div>
                  <h2 className="detail-title">{selectedCard.name}</h2>
                  <div className="card-badges detail-badges">
                    <span className="badge">{selectedCard.rarity.name}</span>
                    <span className="badge">{selectedCard.cardType.name}</span>
                    <span className="badge">
                      {selectedCard.manaCost
                        ? `Maná: ${selectedCard.manaCost}`
                        : 'Sin coste'}
                    </span>
                  </div>
                </div>
                <div className="detail-field">
                  <span className="detail-label">
                    Texto de Habilidad (Oracle Text)
                  </span>
                  <div className="oracle-box">
                    {selectedCard.oracleText ||
                      'Sin texto de reglas registrado.'}
                  </div>
                </div>
                <div className="detail-stats-grid">
                  <div className="detail-field">
                    <span className="detail-label">Fuerza / Resistencia</span>
                    <span className="detail-value">
                      {selectedCard.power || selectedCard.toughness
                        ? `${selectedCard.power || '?'} / ${selectedCard.toughness || '?'}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Colección de Origen</span>
                    <span className="detail-value">
                      {selectedCard.setCode === 'HOB'
                        ? 'The Hobbit (HOB)'
                        : 'Final Fantasy (FIN)'}
                    </span>
                  </div>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Artista</span>
                  <span className="detail-value">
                    {selectedCard.artist || 'Desconocido'}
                  </span>
                </div>
                <div className="add-to-coll-box">
                  <h4>Guardar en Mi Colección Personal</h4>
                  {!token ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setModal('login')}
                      type="button"
                    >
                      Inicia sesión para registrar esta carta
                    </button>
                  ) : (
                    <>
                      {ownedQuantity > 0 && (
                        <p className="owned-message">
                          En tu colección: {ownedQuantity} copia
                          {ownedQuantity === 1 ? '' : 's'}
                          {ownedEntries.some((entry) => entry.isFoil)
                            ? ' (incluye Foil)'
                            : ''}
                          .
                        </p>
                      )}
                      <div className="coll-form-row">
                        <label className="foil-control">
                          <input
                            type="checkbox"
                            checked={foil}
                            onChange={(event) => setFoil(event.target.checked)}
                          />
                          Versión Foil
                        </label>
                        <label className="quantity-control">
                          Cantidad:
                          <input
                            type="number"
                            value={quantity}
                            min={1}
                            max={99}
                            onChange={(event) =>
                              setQuantity(
                                Math.max(
                                  1,
                                  Math.min(99, Number(event.target.value)),
                                ),
                              )
                            }
                          />
                        </label>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => void addSelectedCard()}
                          type="button"
                        >
                          Añadir a Colección
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'login' && (
        <LoginModal
          error={loginError}
          pending={loginPending}
          onClose={() => setModal(null)}
          onSubmit={handleLogin}
        />
      )}

      {modal === 'add-card' && user?.role === 'ADMINISTRATOR' && (
        <AddCardModal
          error={addCardError}
          pending={addCardPending}
          onClose={() => setModal(null)}
          onSubmit={createCard}
        />
      )}

      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast">{toast}</div>
        </div>
      )}
    </>
  );
}
