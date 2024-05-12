import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, OnChanges, SimpleChanges } from '@angular/core';

import { IonToggle, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Professor } from '../../../../core/professor/domain/professor.domain';
import { ProfessorContoller } from '../../../../core/professor/infraestructure/professor.controller';


@Component({
  selector: 'app-professor-selector-card',
  templateUrl: './professor-selector-card.component.html',
  styleUrls: ['./professor-selector-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    AsyncPipe
  ]
})
export class ProfessorSelectorCardComponent  implements OnInit, OnChanges {
  @Input() professors!: Observable<Professor[]> | null;
  @Input() professorsSelected: Professor[] = [];
  @Input() professorUnselected!: Professor;
  @Output() emittProfeUnselected = new EventEmitter<Professor>;
  @Output() emittProfessor = new EventEmitter<Professor[]>;

  @ViewChildren('toggle') profesToggle!: IonToggle[];

  constructor(
    private professorController: ProfessorContoller,
  ) { }

  ngOnInit(): void {
    this.professors = this.professorController.getProfessorsByVisibility();
  }

  ngOnChanges(changes: SimpleChanges): void {
      let currentProfessorUnselected: Professor = changes['professorUnselected'].currentValue;

      console.log("DEntro del selector se debe deseleccionar", changes)

      this.profesToggle.forEach(toggle => toggle.checked = toggle.checked)
      let res = this.profesToggle
        .find(toggle => toggle?.value === currentProfessorUnselected?.id)

      console.log("ENCONTRADO", res)
      if (res)
        res.checked = false;

      this.emittProfeUnselected.emit( undefined );
  }

  emittNewProfessorSelection(ev: any, professor: Professor) {
    // alert(JSON.stringify(professor));
    console.log(ev.target.id, );
    if (ev.target.checked === false) {
      this.professorsSelected.push(professor);
      this.emittProfessor.emit(this.professorsSelected);
    } else {
      this.professorsSelected = this.professorsSelected.filter(prof => prof?.id !== professor?.id);
      this.emittProfessor.emit(this.professorsSelected);
    }
  }

  isSelected(profe: Professor) {
    return this.professorsSelected.some(prof => prof?.id === profe?.id);
  }
  
}
