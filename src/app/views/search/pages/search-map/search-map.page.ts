import { Component, OnInit, inject } from '@angular/core';
import { NgFor } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { HeaderSearchComponent } from '../../components/header-search/header-search.component';
import { AccordionMenuComponent } from '../../components/accordion-menu/accordion-menu.component';
import { MapCardComponent } from '../../../shared/components/cards/map-card/map-card.component';
import { PlaneEditorController } from '../../../../core/plane-editor/infraestructure/plane-editor.controller';
import { Building } from '../../../../core/plane-editor/domain/map.domain';
import { FilterOption } from '../../models/filter-option.interface';


@Component({
  selector: 'app-search-map',
  templateUrl: './search-map.page.html',
  styleUrls: ['./search-map.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    HeaderSearchComponent,
    AccordionMenuComponent,
    MapCardComponent
  ]
})
export class SearchMapPage implements OnInit {

  buildings: Building[] = [];
  buildingName: string = '';

  private planeCtrl = inject(PlaneEditorController);

  async ngOnInit() {
    this.buildings = await this.planeCtrl.searchBuildings(true, 'todos');
  }

  listenSearchText(searchText: string) {
    this.buildingName = searchText;
  }

  async listenFilter(filterOption: FilterOption) {
    if (filterOption.filterBy === 'todos')
      this.buildings = await this.planeCtrl.searchBuildings(true, 'todos');
    else {
        console.log(filterOption);
        this.buildings = await this.planeCtrl.searchBuildings(filterOption.filterBy === 'campus', filterOption.value);
    }
  }

}
