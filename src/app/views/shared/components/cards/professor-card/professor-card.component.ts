import { AsyncPipe, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import { UiService } from '../../../services/ui/ui.service';

import { ProfessorContoller } from 'src/app/core/professor/infraestructure/professor.controller';
import { Professor } from '../../../../../core/professor/domain/professor.domain';


@Component({
  selector: 'app-professor-card',
  templateUrl: './professor-card.component.html',
  styleUrls: ['./professor-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    AsyncPipe
  ]
})
export class ProfessorCardComponent implements OnInit {

  @Input() professors!: Observable<Professor[]> | null;

  constructor(
    private professorController: ProfessorContoller,
    private ui: UiService,
    private router: Router
  ) { }

  ngOnInit() { }

  // TODO: Redirect to edit professor
  redirectEditor(profe: Professor) {
    this.router.navigate(['/home/edit/professor', profe.id ], { replaceUrl: true });
  }

  async updateVisibility(profe: Professor) {
    let response = await this.professorController.updateProfeVisibility(profe);
    let message: string;

    if (response) {
      message = "Cambio de visibilidad del docente con exito!";
      profe = response;
    } else {
      message = "Error al actualizar docente. Por favor, intente mas tarde.";
    }

    await this.ui.showNotification({
      message: message,
      position: 'top',
      duration: 3000
    });
  }

}
