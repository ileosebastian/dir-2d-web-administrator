import { Component, OnInit, Output, Input, signal, inject, EventEmitter, WritableSignal } from '@angular/core';
import { IonButton, IonicModule } from '@ionic/angular';
import { MAX_QUANTITY_FLOORS, MIN_QUANTITY_FLOORS } from '../../../data/constans.data';
import { PlaneEditorController } from 'src/app/core/plane-editor/infraestructure/plane-editor.controller';
import { Plane } from 'src/app/core/plane-editor/domain/map.domain';


@Component({
  selector: 'app-information-floors',
  templateUrl: './information-floors.component.html',
  styleUrls: ['./information-floors.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class InformationFloorsComponent implements OnInit {

  @Input() currentPlanes!: number[];
  @Input() quantity!: WritableSignal<number>;
  @Input() showGuidelines!: boolean;
  @Output() emittPlanesAndFloor = new EventEmitter<{ planes: number[], floor: number, isRemoved: boolean }>();

  private planeController = inject(PlaneEditorController);

  ngOnInit() { }

  async removeFloor() {
    // update quantity
    if (this.quantity() <= MIN_QUANTITY_FLOORS) return;

    // Question if is really necessary delete floor
    const floor = `P${this.quantity() === 1 ? 'B' : this.quantity() - 1}`;
    const decision = confirm(`¿Esta seguro de eliminar los datos del piso ${floor}? Todo los datos se perderán.`);
    if (!decision) return;

    // if yes, procedure to remove plane into temproal storage
    this.planeController.removePlaneByFloor(this.quantity());
    this.quantity.update(value => value - 1);

    // update input files
    if (this.currentPlanes.length > 1) this.currentPlanes.pop();

    await this.planeController.updateBuildingFloor(this.quantity());
    await this.selectPreviousFloor(this.quantity());

    this.emittPlanesAndFloor.emit({
      planes: this.currentPlanes,
      floor: this.quantity(),
      isRemoved: true
    });
  }

  private async selectPreviousFloor(floor: number) {
    const previousPlane: Plane = await this.planeController.getPlaneByFloor(floor);

    this.planeController.generatePlane(previousPlane, this.showGuidelines);

    const planesBtn = document.getElementsByName('places-btn');
    
    planesBtn.forEach(btn => {
      const tmp = btn as unknown;
      const iBtn = tmp as IonButton; // WE KNOW THAT THESE ELEMENTS ARE ALWAYS ION BUTTON OF THE FLOOR-LIST COMPONENT

      if (iBtn.rel === `${floor}`) {
        iBtn.fill = 'solid';
        iBtn.target = 'selected'
      } else {
        iBtn.fill = 'outline';
        iBtn.target = '';
      }
    });
  }

  async addFloor() {
    // update quantity
    if (this.quantity() >= MAX_QUANTITY_FLOORS) return;
    this.quantity.update(value => value + 1);

    // update input files
    this.currentPlanes.push(this.quantity());
    await this.planeController.createNewPlane(this.quantity());
    await this.planeController.updateBuildingFloor(this.quantity());

    this.emittPlanesAndFloor.emit({
      planes: this.currentPlanes,
      floor: this.quantity(),
      isRemoved: false
    });
  }

}
