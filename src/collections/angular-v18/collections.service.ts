import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  CollectionEntry,
  CollectionSummary,
  CreateCollectionEntryDto,
  UpdateCollectionEntryDto,
} from './collections.model';

/**
 * CollectionsService — Angular 18
 * 
 * Características clave de Angular 18 implementadas:
 * 1. Inyección funcional mediante la función `inject()` (reemplaza constructor injection).
 * 2. Reactividad nativa con Angular Signals (`signal`, `computed`).
 * 3. Provisión en la raíz con `providedIn: 'root'`, eliminando la necesidad de NgModule providers.
 */
@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/collections';

  // Signals de estado reactivo
  readonly entries = signal<CollectionEntry[]>([]);
  readonly summary = signal<CollectionSummary | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  // Computed signals: valores derivados reactivos
  readonly totalFoilCount = computed(() =>
    this.entries().reduce((acc, entry) => (entry.isFoil ? acc + entry.quantity : acc), 0),
  );

  readonly totalStandardCount = computed(() =>
    this.entries().reduce((acc, entry) => (!entry.isFoil ? acc + entry.quantity : acc), 0),
  );

  /**
   * Carga todas las cartas de la colección del usuario autenticado
   */
  loadEntries(): Observable<CollectionEntry[]> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.get<CollectionEntry[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.entries.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al cargar colección');
          this.isLoading.set(false);
        },
      }),
    );
  }

  /**
   * Carga el resumen estadístico de la colección
   */
  loadSummary(): Observable<CollectionSummary> {
    return this.http.get<CollectionSummary>(`${this.apiUrl}/summary`).pipe(
      tap({
        next: (data) => this.summary.set(data),
        error: (err) => console.error('Error al cargar resumen:', err),
      }),
    );
  }

  /**
   * Agrega una carta a la colección o incrementa su cantidad
   */
  addCard(dto: CreateCollectionEntryDto): Observable<CollectionEntry> {
    return this.http.post<CollectionEntry>(this.apiUrl, dto).pipe(
      tap(() => {
        this.loadEntries().subscribe();
        this.loadSummary().subscribe();
      }),
    );
  }

  /**
   * Actualiza cantidad o condición foil de una carta
   */
  updateQuantity(id: string, dto: UpdateCollectionEntryDto): Observable<CollectionEntry> {
    return this.http.patch<CollectionEntry>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(() => {
        this.loadEntries().subscribe();
        this.loadSummary().subscribe();
      }),
    );
  }

  /**
   * Elimina una carta del inventario personal
   */
  removeCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadEntries().subscribe();
        this.loadSummary().subscribe();
      }),
    );
  }
}
