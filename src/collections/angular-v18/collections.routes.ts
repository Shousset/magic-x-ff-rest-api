import { Routes } from '@angular/router';

/**
 * Enrutamiento funcional de Angular 18 para el Módulo de Colecciones
 * Utiliza lazy loading sin necesidad de RouterModule.forChild()
 */
export const COLLECTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./collections.component').then((m) => m.CollectionsComponent),
  },
];
