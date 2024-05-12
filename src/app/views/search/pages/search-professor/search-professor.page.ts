import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import { ProfessorCardComponent } from '../../../shared/components/cards/professor-card/professor-card.component';
import { HeaderSearchComponent } from '../../components/header-search/header-search.component';
import { AccordionMenuComponent } from '../../components/accordion-menu/accordion-menu.component';
import { FilterOption } from '../../models/filter-option.interface';

import { ProfessorContoller } from 'src/app/core/professor/infraestructure/professor.controller';

import { Professor } from '../../../../core/professor/domain/professor.domain';
import { SearchProfessorFilterPipe } from '../../../shared/pipes/search-filter.pipe';


@Component({
  selector: 'app-search-professor',
  templateUrl: './search-professor.page.html',
  styleUrls: ['./search-professor.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HeaderSearchComponent,
    AccordionMenuComponent,
    SearchProfessorFilterPipe,
    ProfessorCardComponent
  ]
})
export class SearchProfessorPage implements OnInit {

  professors!: Observable<Professor[]>;
  professorName: string = "";

  constructor(
    private professorController: ProfessorContoller
  ) { }

  ngOnInit() {
    this.professors = this.professorController.getAllProfessors();
  }

  listenSearchText(searchText: string) {
    this.professorName = searchText;
  }

  listenFilter(filterOption: FilterOption) {
    if (filterOption.filterBy === 'todos')
      this.professors = this.professorController.getAllProfessors();
    else
      this.professors = this.professorController
        .getProfessorsByFilter(filterOption.filterBy, filterOption.value);
  }

}
