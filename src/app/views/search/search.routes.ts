// By Angular
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'professor',
    pathMatch: 'prefix'
  },
  {
    path: 'professor',
    loadComponent: () => import('./pages/search-professor/search-professor.page')
        .then(p => p.SearchProfessorPage)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/search-map/search-map.page')
        .then( p => p.SearchMapPage)
  }

];