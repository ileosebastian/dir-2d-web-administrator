import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Category } from '../../editor/models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  private readonly http = inject(HttpClient);

  constructor() { }
  
  getCategories() {
    return this.http.get<Category[]>('/assets/data/categories.json');
  }

}
