// By Angular
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'professor',
    pathMatch: 'full'
  },
  {
    path: 'professor/:id',
    loadComponent: () => import('./pages/edit-professor/edit-professor.page')
        .then( p => p.EditProfessorPage)
  },
  {
    path: 'map/:id',
    loadComponent: () => import('./pages/edit-map/edit-map.page').then( m => m.EditMapPage)
  },
];