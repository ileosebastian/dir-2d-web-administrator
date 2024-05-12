import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import { UniversityController } from 'src/app/core/shared/university/infraestructure/university.cotroller';
import { PlaneEditorController } from '../../../../core/plane-editor/infraestructure/plane-editor.controller';

import { Campus } from '../../../../core/shared/university/domain/campus.domain';
import { Faculty } from '../../../../core/shared/university/domain/faculty.domain';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-create-map',
  templateUrl: './create-map.page.html',
  styleUrls: ['./create-map.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class CreateMapPage implements OnInit, OnDestroy {

  mapForm!: FormGroup
  campusList!: Observable<Campus[]>;
  facultyList!: Observable<Faculty[]>;

  showNextStep!: boolean;
  showPlaneEditor!: boolean;
  planeController = inject(PlaneEditorController);

  constructor(
    private formBuildier: FormBuilder,
    private universityController: UniversityController,
  ) {
    this.mapForm = this.formBuildier.group({
      buildingName: ['', [Validators.required, Validators.min(4)]],
      campus: ['', Validators.required],
      faculty: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.showNextStep = true;
    this.showPlaneEditor = false;
    this.campusList = this.universityController.getCampusList();
  }

  ngOnDestroy(): void {}

  onSelectCamp(ev: any) {
    this.facultyList = this.universityController.getFacultyByCampus(ev.detail['value']);
  }

  onNextForCreatePlane() {
    this.generateBuilding();
  }

  generateBuilding() {
    const name: string = this.mapForm.get('buildingName')?.value;
    const campus: string = this.mapForm.get('campus')?.value;
    const faculty: string = this.mapForm.get('faculty')?.value;

    this.planeController.createNewBuilding(name, campus, faculty);
  }

}