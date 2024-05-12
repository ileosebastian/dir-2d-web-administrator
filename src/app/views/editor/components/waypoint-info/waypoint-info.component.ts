import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { PlaneEditorController } from '../../../../core/plane-editor/infraestructure/plane-editor.controller';
import { UiService } from '../../../shared/services/ui/ui.service';

import { PlaceSelectorCardComponent } from '../../../shared/components/place-selector-card/place-selector-card.component';

import { getNameByCategory } from '../../../shared/utils/get-name-by-category';
import { Box, Place, Plane, Waypoint, WaypointType } from '../../../../core/plane-editor/domain/map.domain';


@Component({
  selector: 'app-waypoint-info',
  templateUrl: './waypoint-info.component.html',
  styleUrls: ['./waypoint-info.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    PlaceSelectorCardComponent
  ]
})
export class WaypointInfoComponent implements OnInit {

  @Input() showWaypointInfo!: boolean;
  @Input() box!: Box;
  @Input() waypoint!: Waypoint;
  @Input() plane!: Plane;
  @Output() showEmitter = new EventEmitter<string>;

  pointType!: WaypointType;
  waypointName!: string;
  placePicked!: Place | null;

  planeController = inject(PlaneEditorController);
  notify = inject(UiService);

  constructor() { }

  ngOnInit() {
    this.pointType = this.waypoint.pointType;
    this.placePicked = this.getPreviouslyPlaceSaved();    
  }

  getNameByCategory(category: string) {
    return getNameByCategory(category);
  }

  getPreviouslyPlaceSaved() {
    const places = this.planeController.getAllPlacesByFloor(this.plane.floor);

    const possiblePlacePicked = places.find(place => place.wayPointId === this.waypoint.uuid); 

    return possiblePlacePicked ?? null;
  }

  close() {
    this.showWaypointInfo = false;
    this.showEmitter.emit();
  }

  selectPointType(ev: any) {
    this.pointType = ev.detail.value;

    if (this.pointType !== 'destiny') {
      this.placePicked = null;
    } else {
      this.placePicked = this.getPreviouslyPlaceSaved();
    }
  }

  updatingWPName(ev: any) {
    this.waypointName = ev.detail['value'];
  }

  listenPlaceUpdated(place: Place | null) {
    this.placePicked = place;
  }

  unbindPlace(place: Place) {
    this.placePicked = null;
  }

  update() {

    if (this.placePicked === null && this.pointType === 'destiny') {
      alert("Debe seleccionar un ambiente si lo que quiere es guardarlo como un punto de destino");
      return;
    }
    this.waypoint.pointType = this.pointType.length === 0 || this.pointType === undefined ? this.waypoint.pointType: this.pointType;
    this.waypoint.name = this.waypointName === undefined ? this.waypoint.name : this.waypointName;

    try {
      this.planeController.updateWayPoint(this.box.x, this.box.y, this.waypoint, this.plane);
      this.planeController.updateWaypointIdInPlace(this.getPreviouslyPlaceSaved(), this.placePicked, this.plane.floor);

      this.notify.showNotification({
        message: 'Se ha cambiado los datos del punto de referencia con exito!',
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
    const message = `Esta seguro de eliminar el punto de referencia? Todos los datos de este se perderan.`;

    const decision = confirm(message);

    if (decision) {
      try {
        await this.planeController.removeWaypoint(this.box.x, this.box.y, this.plane);

        this.notify.showNotification({
          message: 'Se ha eliminado el punto de referencia con exito!',
          position: 'top',
          duration: 1500,
        });
        this.close();
      } catch (err) {
        console.error("=>", err);
        this.notify.showNotification({
          message: 'No se ha podido eliminar el punto de referencia, por favor, intente mas tarde.',
          position: 'top',
          duration: 1500,
        });
      }
    }
  }

}
