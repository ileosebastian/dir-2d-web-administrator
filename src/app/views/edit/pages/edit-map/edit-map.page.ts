import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { AfterContentInit, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import { PlaneEditorController } from 'src/app/core/plane-editor/infraestructure/plane-editor.controller';
import { UniversityController } from 'src/app/core/shared/university/infraestructure/university.cotroller';

import { SubmitNewMapBtnComponent } from 'src/app/views/shared/components/editor/submit-new-map-btn/submit-new-map-btn.component';

import { Faculty } from 'src/app/core/shared/university/domain/faculty.domain';
import { Campus } from 'src/app/core/shared/university/domain/campus.domain';
import { InformationFloorsComponent } from 'src/app/views/shared/components/editor/information-floors/information-floors.component';
import { Box, Building, Place, Plane, Sprite, Waypoint } from 'src/app/core/plane-editor/domain/map.domain';
import { Category } from 'src/app/views/editor/models/category.interface';
import { SpritesListComponent } from 'src/app/views/shared/components/editor/sprites-list/sprites-list.component';
import { PlaygroundEditorComponent } from 'src/app/views/shared/components/editor/playground-editor/playground-editor.component';
import { FloorsListComponent } from 'src/app/views/shared/components/editor/floors-list/floors-list.component';
import { DrawingOptionsComponent } from 'src/app/views/shared/components/editor/drawing-options/drawing-options.component';
import { WaypointInfoComponent } from 'src/app/views/editor/components/waypoint-info/waypoint-info.component';
import { PlacesInfoComponent } from 'src/app/views/editor/components/places-info/places-info.component';
import { UUID } from 'src/app/core/shared/models/core.types';


@Component({
  selector: 'app-edit-map',
  templateUrl: './edit-map.page.html',
  styleUrls: ['./edit-map.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,

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
export class EditMapPage implements OnInit, AfterContentInit, OnDestroy {

  mapForm!: FormGroup

  campusList!: Observable<Campus[]>;
  facultyList!: Observable<Faculty[]>;

  building!: Building;

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

  buildingId!: UUID;
  loadError!: boolean;
  private planeController = inject(PlaneEditorController);
  private formBuilder = inject(FormBuilder);
  private universityController = inject(UniversityController);
  private route = inject(Router);
  
  constructor() {
    this.loadError = false;
    this.mapForm = this.formBuilder.group({
      buildingName: ['', [Validators.required, Validators.min(4)]],
      campus: ['', Validators.required],
      faculty: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.campusList = this.universityController.getCampusList();
    await this.setUpdateStage();
  }

  private async setUpdateStage() {
    const id = this.route.url.split('/').pop();
    if (id) this.buildingId = id as UUID;

    console.log(this.buildingId);
    await this.planeController.getTotalMap(this.buildingId);
  }
  
  async ngAfterContentInit(): Promise<void> {
    try {
      setTimeout(async () => {
        const building = this.planeController.getBuilding(); 
        this.building = building;
        this.facultyList = this.universityController.getFacultyByCampus(this.building.campus);
        this.mapForm.setValue({
          buildingName: this.building.name,
          campus: this.building.campus,
          faculty: this.building.faculty
        });
      }, 1000);
    } catch (error) {
      console.error("ERROR OBTENIENDO BUILDING: ", error);
      this.loadError = true;
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.planeController.removeIdentifier();
    await this.planeController.removeAllPlanes(this.planes);
    await this.planeController.removeBuilding();
    await this.planeController.removeAllPlaces(this.planes);
  }

  async onSelectCamp(ev: any) {
    this.facultyList = this.universityController.getFacultyByCampus(ev.detail['value']);

    this.building.campus = ev.detail['value'];
    console.log("cambio del edificio ", this.building);
    this.planeController.saveBuilding(this.building);    
  }

  async onSelectFacu( ev: any ) {
    this.building.faculty = ev.detail['value'];
    console.log("cambio de facultad: ", this.building);
    this.planeController.saveBuilding(this.building);    
  }

  async setBuildingName( ev: any ) {
    this.building.name = ev.detail['value'];
    console.log("cambio de nombre: ", this.building);
    this.planeController.saveBuilding(this.building);    
  }

  setQuantity(value: number) {
    this.quantity.update(val => val = value);
  }

  addFloorListener(infoFloor: {planes: number[], floor: number, isRemoved: boolean}) {
    this.quantity.update(val => val = infoFloor.floor);
    this.planes = infoFloor.planes;

    this.closeMoreFields();
  }

  async removeFloorListener(infoFloor: {planes: number[], floor: number, isRemoved: boolean}) {
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
