import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MenuOption } from '../../models/menu-options.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {

  constructor(
    private http: HttpClient
  ) { }

    // Get Data options for side bar menu
  getMenuOptions(): Observable<MenuOption[]> {
    return this.http.get<MenuOption[]>("/assets/data/menu-options.json");
  }
}
