import { NgFor } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { Professor } from '../../../../core/professor/domain/professor.domain';


@Component({
  selector: 'app-professor-picked-card',
  templateUrl: './professor-picked-card.component.html',
  styleUrls: ['./professor-picked-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor
  ]
})
export class ProfessorPickedCardComponent  implements OnInit {

  @Input() professorsPicked: Professor[] = [];
  @Output() emittProfessorUnpicked = new EventEmitter<Professor>;

  constructor() { }

  ngOnInit() {}

  unbindProfessor(professor: Professor) {
    this.emittProfessorUnpicked.emit( professor );
  }

}
