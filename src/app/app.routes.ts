import { Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate
} from '@angular/fire/auth-guard'

// Pipes
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./views/menu/pages/home/home.page').then(m => m.HomePage),
    ...canActivate(redirectUnauthorizedToLogin), // Pipe para activar vista si no ha iniciado sesion
    children: [
      {
        path: 'search',
        loadChildren: () => import('./views/search/search.routes').then(r => r.routes)
      },
      {
        path: 'create',
        loadChildren: () => import('./views/create/create.routes').then(r => r.routes),
      },
      {
        path: 'edit',
        loadChildren: () => import('./views/edit/edit.routes').then(r => r.routes)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/pages/login/login.page').then(m => m.LoginPage),
    ...canActivate(redirectLoggedInToHome) // Pipe para activar si ha iniciado sesion
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },



];
