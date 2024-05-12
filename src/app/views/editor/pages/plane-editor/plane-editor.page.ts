import { NgIf } from '@angular/common';
import { Component, OnInit, inject, signal, OnDestroy, effect } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import { PlacesInfoComponent } from '../../components/places-info/places-info.component';
import { WaypointInfoComponent } from '../../components/waypoint-info/waypoint-info.component';
import { SubmitNewMapBtnComponent } from '../../../shared/components/editor/submit-new-map-btn/submit-new-map-btn.component';
import { HeaderEditorComponent } from '../../../shared/components/editor/header-editor/header-editor.component';
import { InformationFloorsComponent } from '../../../shared/components/editor/information-floors/information-floors.component';
import { DrawingOptionsComponent } from '../../../shared/components/editor/drawing-options/drawing-options.component';
import { PlaygroundEditorComponent } from '../../../shared/components/editor/playground-editor/playground-editor.component';
import { SpritesListComponent } from '../../../shared/components/editor/sprites-list/sprites-list.component';
import { FloorsListComponent } from '../../../shared/components/editor/floors-list/floors-list.component';

import { PlaneEditorController } from '../../../../core/plane-editor/infraestructure/plane-editor.controller';

import { Category } from '../../models/category.interface';
import { Box, Place, Plane, Sprite, Waypoint } from '../../../../core/plane-editor/domain/map.domain';


@Component({
  selector: 'app-plane-editor',
  templateUrl: './plane-editor.page.html',
  styleUrls: ['./plane-editor.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,

    HeaderEditorComponent,
    InformationFloorsComponent,

    SpritesListComponent,
    PlaygroundEditorComponent,
    FloorsListComponent,

    DrawingOptionsComponent,

    WaypointInfoComponent,
    PlacesInfoComponent,

    SubmitNewMapBtnComponent
  ]
})
export class PlaneEditorPage implements OnInit, OnDestroy {

  currentPlane!: Plane;
  rowsEditor!: number;
  categories!: Observable<Category[]>;

  showGuidelines!: boolean;
  showColorInput!: boolean;

  quantity = signal(1); // floors
  planes: number[] = [1];

  // places 
  typePlaceCategory!: Category;
  showPlaceInfo!: boolean;
  sprite!: Sprite;
  place!: Place;

  // waypoints
  showWaypointInfo!: boolean;
  waypoint!: Waypoint;

  box!: Box;

  private planeController = inject(PlaneEditorController);

  ngOnInit() {
    // show all categories to put in editor
    this.showGuidelines = true;
    this.showColorInput = false;
  }

  async ngOnDestroy(): Promise<void> {
    await this.planeController.removeIdentifier();
    await this.planeController.removeAllPlanes(this.planes);
    await this.planeController.removeBuilding();
    await this.planeController.removeAllPlaces(this.planes);
  }

  setQuantity(value: number) {
    this.quantity.update(val => val = value);
  }

  addFloorListener(infoFloor: {planes: number[], floor: number, isRemoved: boolean}) {
    // this.quantity.set(infoFloor.floor);
    this.quantity.update(val => val = infoFloor.floor);
    this.planes = infoFloor.planes;

    this.closeMoreFields();
  }

  async removeFloorListener(infoFloor: {planes: number[], floor: number, isRemoved: boolean}) {
    // this.quantity.set(infoFloor.floor);
    this.quantity.update(val => val = infoFloor.floor);
    this.planes = infoFloor.planes;

    
    this.closeMoreFields();
  }

  async closeMoreFields() {
    this.showPlaceInfo = false;
    this.showWaypointInfo = false;
  }

  toggleGuideListener(showGuide: boolean) {
    this.showGuidelines = showGuide;
  }

}
