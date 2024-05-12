import { NgFor } from '@angular/common';
import { Component, Input, OnInit, inject, Output, EventEmitter, ViewChildren } from '@angular/core';
import { IonRadio, IonicModule } from '@ionic/angular';
import { Place, Waypoint } from 'src/app/core/plane-editor/domain/map.domain';
import { PlaneEditorController } from '../../../../core/plane-editor/infraestructure/plane-editor.controller';

import { getNameByCategory } from '../../../shared/utils/get-name-by-category';
import { UUID } from '../../../../core/shared/models/core.types';


@Component({
  selector: 'app-place-selector-card',
  templateUrl: './place-selector-card.component.html',
  styleUrls: ['./place-selector-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor
  ]
})
export class PlaceSelectorCardComponent  implements OnInit {

  @Input() placePicked!: Place | null;
  @Input() floor!: number;
  @Input() waypoint!: Waypoint;
  @Output() emmitPlaceWithWaypoint = new EventEmitter<Place | null>;

  @ViewChildren(IonRadio) btnPlaces!: IonRadio[];

  places!: Place[];

  planeController = inject(PlaneEditorController);

  constructor() { }

  ngOnInit() {
    this.places = this.planeController.getAllPlacesByFloor(this.floor); // is old version list
      // .filter(plc => plc.wayPointId === 'X-X-X-X-X');
  }

  getNameByCategory(category: string) {
    return getNameByCategory(category);
  }

  async emittNewPlaceSelection(ev: any, wayPointId: UUID, place: Place) {
  
    let oldWP = place.wayPointId;
    // update place selected
    place.wayPointId = wayPointId;

    this.places.forEach(plc => {
      if (plc.uuid !== place.uuid && plc.wayPointId === wayPointId) {
        plc.wayPointId = 'X-X-X-X-X';
      }
    });

    // if (place.wayPointId === this.placePicked?.wayPointId) {
    //   place.wayPointId = 'X-X-X-X-X';
    //   this.placePicked = null;
    // } else {
    //   place.wayPointId = wayPointId;
    //   this.placePicked = place;
    // }

    // this.placePicked = oldWP === this.placePicked?.wayPointId ? null : place;
    this.placePicked = place;
    this.emmitPlaceWithWaypoint.emit(this.placePicked);
  }

}

// place.wayPointId = wayPointId;

//     this.places = this.places.map(plc => {
//       if (plc.uuid === place.uuid) {
//         if (plc.wayPointId === place.wayPointId) {
//           plc.wayPointId = 'X-X-X-X-X';
//           return plc;
//         } 
//         return place;
//       }
//       return plc;
//     });
//     console.log(this.places)
//     this.emmitPlaceWithWaypoint.emit(place);