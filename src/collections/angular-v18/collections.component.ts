import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionsService } from './collections.service';
import { CollectionEntry } from './collections.model';

/**
 * CollectionsComponent — Angular 18 Standalone
 * 
 * Innovaciones de sintaxis Angular 18:
 * 1. Componente Standalone (`standalone: true` sin `NgModule`).
 * 2. Inyección funcional mediante `inject(CollectionsService)`.
 * 3. Nuevo Control Flow nativo: `@if`, `@else`, `@for (item of items; track item.id)`, `@empty`.
 * 4. Consumo directo de Signals reactivos sin necesidad de `| async` pipe.
 */
@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="collections-container">
      <!-- Encabezado del Módulo -->
      <header class="module-header">
        <h2>⭐ Mi Colección de Cartas (Angular 18 Standalone)</h2>
        <p>Gestión reactiva de cartas personales con Angular Signals y nuevo Control Flow</p>
      </header>

      <!-- Resumen Estadístico con Signals -->
      @if (collectionsService.summary(); as summary) {
        <section class="summary-cards">
          <div class="kpi-card">
            <span class="label">Total de Cartas</span>
            <span class="value">{{ summary.totalCards }}</span>
          </div>
          <div class="kpi-card">
            <span class="label">Cartas Únicas</span>
            <span class="value">{{ summary.uniqueCards }}</span>
          </div>
          <div class="kpi-card">
            <span class="label">Versiones Foil ✨</span>
            <span class="value">{{ collectionsService.totalFoilCount() }}</span>
          </div>
        </section>
      }

      <!-- Indicador de Carga -->
      @if (collectionsService.isLoading()) {
        <div class="loading-state">
          <p>Cargando colección...</p>
        </div>
      }

      <!-- Mensaje de Error -->
      @if (collectionsService.errorMessage(); as error) {
        <div class="error-banner">
          <p>⚠️ {{ error }}</p>
        </div>
      }

      <!-- Lista de Cartas con Nuevo Control Flow @for / @empty -->
      <section class="entries-list">
        @for (entry of collectionsService.entries(); track entry.id) {
          <article class="entry-card" [class.is-foil]="entry.isFoil">
            <img [src]="entry.card.imageUrl || '/img/MTG.png'" [alt]="entry.card.name" class="entry-img" />
            
            <div class="entry-info">
              <h3>{{ entry.card.name }}</h3>
              <div class="entry-tags">
                <span class="badge" [class.badge-hob]="entry.card.setCode === 'HOB'">
                  {{ entry.card.setCode }} #{{ entry.card.collectorNumber }}
                </span>
                <span class="badge badge-rarity">{{ entry.card.rarity.name }}</span>
                @if (entry.isFoil) {
                  <span class="badge badge-foil">FOIL ✨</span>
                }
              </div>
            </div>

            <div class="entry-controls">
              <div class="qty-stepper">
                <button type="button" (click)="decrementQty(entry)">-</button>
                <span class="qty-val">{{ entry.quantity }}</span>
                <button type="button" (click)="incrementQty(entry)">+</button>
              </div>
              <button type="button" class="btn-delete" (click)="removeEntry(entry.id)" title="Eliminar">
                🗑️
              </button>
            </div>
          </article>
        } @empty {
          <div class="empty-state">
            <p>📦 Tu colección está vacía actualmente.</p>
            <small>Agrega cartas desde el catálogo de The Hobbit o Final Fantasy.</small>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .collections-container {
      padding: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .module-header h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
    .module-header p { font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem; }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .kpi-card .label { font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .kpi-card .value { font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    .entries-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .entry-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      transition: all 0.2s ease;
    }
    .entry-card.is-foil {
      border-color: #f59e0b;
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
    }
    .entry-img { width: 44px; height: 60px; object-fit: contain; border-radius: 6px; }
    .entry-info { flex: 1; min-width: 0; }
    .entry-info h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
    .entry-tags { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .badge { font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #e2e8f0; color: #334155; }
    .badge-hob { background: #fef3c7; color: #b45309; }
    .badge-foil { background: linear-gradient(135deg, #f59e0b, #ec4899); color: #ffffff; }
    .entry-controls { display: flex; align-items: center; gap: 0.5rem; }
    .qty-stepper { display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; }
    .qty-stepper button { width: 28px; height: 28px; border: none; background: #f1f5f9; cursor: pointer; font-weight: bold; }
    .qty-val { min-width: 24px; text-align: center; font-size: 0.85rem; font-weight: 700; }
    .btn-delete { background: transparent; border: none; font-size: 1.1rem; cursor: pointer; padding: 4px; }
    .empty-state { text-align: center; padding: 3rem; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; color: #64748b; }
  `]
})
export class CollectionsComponent implements OnInit {
  // Inyección funcional moderna de Angular 18
  readonly collectionsService = inject(CollectionsService);

  ngOnInit(): void {
    this.collectionsService.loadEntries().subscribe();
    this.collectionsService.loadSummary().subscribe();
  }

  incrementQty(entry: CollectionEntry): void {
    this.collectionsService.updateQuantity(entry.id, { quantity: entry.quantity + 1 }).subscribe();
  }

  decrementQty(entry: CollectionEntry): void {
    if (entry.quantity > 1) {
      this.collectionsService.updateQuantity(entry.id, { quantity: entry.quantity - 1 }).subscribe();
    } else {
      this.removeEntry(entry.id);
    }
  }

  removeEntry(id: string): void {
    this.collectionsService.removeCard(id).subscribe();
  }
}
