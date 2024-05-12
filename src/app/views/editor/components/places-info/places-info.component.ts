import { Component, OnInit, Input, Output, EventEmitter, inject, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

import { IonInput, IonicModule } from '@ionic/angular';

import { Observable } from 'rxjs';

import { ProfessorSelectorCardComponent } from '../../../shared/components/professor-selector-card/professor-selector-card.component';
import { ProfessorsSearchBarComponent } from '../../../shared/components/professors-search-bar/professors-search-bar.component';
import { SearchProfessorFilterPipe } from '../../../shared/pipes/search-filter.pipe';
import { ProfessorPickedCardComponent } from '../../../shared/components/professor-picked-card/professor-picked-card.component';

import { PlaneEditorController } from '../../../../core/plane-editor/infraestructure/plane-editor.controller';
import { ProfessorContoller } from '../../../../core/professor/infraestructure/professor.controller';
import { UiService } from '../../../shared/services/ui/ui.service';

import { Category } from '../../../editor/models/category.interface';
import { Professor } from '../../../../core/professor/domain/professor.domain';
import { Box, Place, Plane, Sprite } from '../../../../core/plane-editor/domain/map.domain';


@Component({
  selector: 'app-places-info',
  templateUrl: './places-info.component.html',
  styleUrls: ['./places-info.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    ProfessorPickedCardComponent,
    ProfessorsSearchBarComponent,
    SearchProfessorFilterPipe,
    ProfessorSelectorCardComponent
  ]
})
export class PlacesInfoComponent implements OnInit {
  @Input() showPlaceInfo!: boolean;
  @Input() typePlace!: Category;
  @Output() showEmitter = new EventEmitter<string>;

  @Input() box!: Box;
  @Input() place!: Place;
  @Input() sprite!: Sprite;
  @Input() plane!: Plane;

  // Fields to fill
  @ViewChild('placeName') placeNameInput!: IonInput;
  @ViewChild('placeCode') placeCodeInput!: IonInput;
  @ViewChild('label') labelInput!: IonInput;
  @ViewChild('x') xInput!: IonInput;
  @ViewChild('y') yInput!: IonInput;
  @ViewChild('width') widthInput!: IonInput;
  @ViewChild('height') heightInput!: IonInput;

  // professor
  showSelector!: boolean;
  professorsSelected: Professor[] = [];
  unselectedProfe!: Professor;
  professors!: Observable<Professor[]> | null;
  professorName: string = '';

  planeController = inject(PlaneEditorController);
  notify = inject(UiService);
  profeController = inject(ProfessorContoller);

  constructor() { }

  async ngOnInit() {
    this.professors = this.profeController.getProfessorsByVisibility();
    // console.log("tiene esto:", this.place);
    if (this.place.belongsProfessor && this.place.professorsId.length > 0) {
      this.professorsSelected = await this.profeController.getProfessorsByIdList(this.place.professorsId); 
    }
  }

  close() {
    this.showPlaceInfo = false;
    this.showEmitter.emit('');
  }

  closeProfessorSelector() {
    alert("cierra")
  }

  showProfeSelector() {
    this.showSelector = true;
    this.place.belongsProfessor = true;
  }

  hideProfeSelector() {
    if (this.professorsSelected.length > 0) {
      const message = `¿Esta usted seguro de desligar a los docentes seleccionados para este ambiente? Los cambios afectaran al ambiente.`;
      this.showSelector = confirm(message);
    } else {
      this.showSelector = false;
      this.place.belongsProfessor = false;
    }
  }

  search(text: string) {
    this.professorName = text;
  }

  unSelectProfessor(professor: Professor) {
    this.professorsSelected = this.professorsSelected.filter(profe => profe?.id !== professor?.id);
    this.unselectedProfe = professor;
  }

  removeProfeUnselected(profe: Professor) {
    this.unselectedProfe = profe;
  }

  saveNewProfessor(newProfessor: Professor[]) {
    this.professorsSelected = newProfessor;
  }

  async update() {
    // get fields
    let placeNameValue = this.placeNameInput.value;
    let placeCodeValue = this.placeCodeInput.value;
    let labelValue = this.labelInput.value;
    let xValue = this.xInput.value; let x: number = this.box.x;
    let yValue = this.yInput.value; let y: number = this.box.y;
    let widthValue = this.widthInput.value;
    let heightValue = this.heightInput.value;

    // for place
    this.place.name = typeof placeNameValue === 'string' ? placeNameValue : this.place.name;
    this.place.code = typeof placeCodeValue === 'string' ? placeCodeValue : this.place.code;

    // for sprite (convert to number type)
    x = typeof xValue === 'string' ? parseInt(xValue) : this.box.x;
    y = typeof yValue === 'string' ? parseInt(yValue) : this.box.y;
    this.sprite.label = `${labelValue}`;
    this.sprite.width = typeof widthValue === 'string' ? parseInt(widthValue) : this.sprite.width;
    this.sprite.height = typeof heightValue === 'string' ? parseInt(heightValue) : this.sprite.height;

    if ((this.place.category === 'profe-office' || this.place.category === 'admin-office') && this.professorsSelected.length > 0) {

      this.place.professorsId = []; this.place.belongsProfessor = true;
      this.professorsSelected.forEach(profe => {
        if (profe.id)
          this.place.professorsId.push(profe.id);
      });
    } else {
      this.place.belongsProfessor = false;
      this.place.professorsId = [];
    }

    try {
      await this.planeController.updatePlace(this.box.x, this.box.y, x, y, this.place, this.sprite, this.plane);

      this.notify.showNotification({
        message: 'Se ha cambiado los datos del ambiente con exito!',
        position: 'top',
        duration: 1000,
      });
    } catch (error) {
      this.notify.showNotification({
        message: 'No se ha podido guardar los cambios, por favor, intente mas tarde.',
        position: 'top',
        duration: 1500,
      });
      console.error("=>", error);
    }
  }

  async remove() {
    let message = `Esta seguro de eliminar el ambiente: ${this.place.name}? Todos los datos de este se perderan.`;

    let decision = confirm(message);

    if (decision) {
      try {
        // await this.planeController.removeWaypoint(this.box.x, this.box.y, this.plane);
        await this.planeController.removePlaceByUUID(this.box.x, this.box.y, this.place.uuid, this.plane)

        this.notify.showNotification({
          message: 'Se ha eliminado el ambiente con exito!',
          position: 'top',
          duration: 1500,
        });
        this.close();
      } catch (err) {
        console.error("=>", err);
        this.notify.showNotification({
          message: 'No se ha podido eliminar el ambiente, por favor, intente mas tarde.',
          position: 'top',
          duration: 1500,
        });
      }
    }
  }

}
