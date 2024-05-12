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
    loadComponent: () => import('./pages/create-professor/create-professor.page')
      .then(p => p.CreateProfessorPage)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/create-map/create-map.page')
      .then(p => p.CreateMapPage),
    // children: [

    // ]
  },
  {
    path: 'plane-editor',
    loadComponent: () => import('../editor/pages/plane-editor/plane-editor.page').then(m => m.PlaneEditorPage)
  }

];