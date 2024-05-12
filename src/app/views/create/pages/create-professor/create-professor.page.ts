import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { IonicModule } from '@ionic/angular';

import { UiService } from '../../../shared/services/ui/ui.service';
import { UniversityController } from 'src/app/core/shared/university/infraestructure/university.cotroller';

import { ProfessorContoller } from 'src/app/core/professor/infraestructure/professor.controller';

import { Campus } from '../../../../core/shared/university/domain/campus.domain';
import { Faculty } from '../../../../core/shared/university/domain/faculty.domain';
import { Professor } from '../../../../core/professor/domain/professor.domain';
import { DetailProfessor } from '../../../../core/professor/domain/detail-professor.domain';


@Component({
  selector: 'app-create-professor',
  templateUrl: './create-professor.page.html',
  styleUrls: ['./create-professor.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule
  ]
})
export class CreateProfessorPage implements OnInit {
  campusList!: Observable<Campus[]>;
  facultyList!: Observable<Faculty[]>;

  profeForm: FormGroup;
  NAME_PATTNER: RegExp = /^(?=.{10,100}$)[a-zñA-ZÑ]+(\s[a-zñA-ZÑ]+)+$/;

  constructor(
    private universityController: UniversityController,
    private professorController: ProfessorContoller,
    private formBuilder: FormBuilder,
    private ui: UiService
  ) {
    this.profeForm = this.formBuilder.group({
      //general
      name: ['', Validators.required, [this.validNamePattern.bind(this)]],
      visible: ['true', Validators.required],
      campus: ['', Validators.required],
      faculty: ['', Validators.required],
      department: ['', Validators.required],
      //specific
      email: ['', Validators.required,
        [this.validEmailPattern.bind(this)]],
      office: ['', Validators.required],
      category: ['', [Validators.required, Validators.minLength(4)]],
      dedication: ['', [Validators.required, Validators.minLength(4)]],
      firstSchedule: ['', [Validators.required, Validators.minLength(4)]],
      secondSchedule: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async validNamePattern(control: FormControl) {
    if (control.value && !this.NAME_PATTNER.test(control.value)) {
      return { pattern: true }
    }

    return null;
  }

  async validEmailPattern(control: FormControl) {
    const pattern = /^[A-Za-z0-9._%+-]+@utm\.edu\.ec$/;

    if (control.value && !pattern.test(control.value)) {
      return { pattern: true }
    }

    return null;
  }

  ngOnInit() {
    this.campusList = this.universityController.getCampusList();
  }

  onSelectCamp(ev: any) {
    console.log(ev.detail);

    this.facultyList = this.universityController.getFacultyByCampus(ev.detail['value']);
  }

  async submitNewProfessor() {
    let message = "Ingrese los datos para todos los campos antes de agregar el docente!";
    console.log("entra")
    if (this.profeForm.valid) { // if it's filled all fields
      // Set objects to send for insertion
      const professor: Professor = {
        name: this.profeForm.get('name')?.value.toLowerCase(),
        isVisible: Boolean(this.profeForm.get('visible')?.value),
        faculty: this.profeForm.get('faculty')?.value,
        campus: this.profeForm.get('campus')?.value,
        department: this.profeForm.get('department')?.value.toLowerCase(),
        office: this.profeForm.get('office')?.value,
        infoId: crypto.randomUUID(),
        published: Boolean(this.profeForm.get('visible')?.value)
      };
      const detail: DetailProfessor = {
        uuid: professor.infoId ?? "",
        category: this.profeForm.get('category')?.value.toLowerCase(),
        dedication: this.profeForm.get('dedication')?.value.toLowerCase(),
        email: this.profeForm.get('email')?.value,
        schedule: {
          first: "08h00 - 12h00",
          second: "14h00 - 17h30"
        },
        published: professor.isVisible 
      };

      console.log(professor, detail);

      // insert into database new objects
      this.professorController.addNewProfessor(professor, detail)
        .then(async () => {
          message = "El docente ha sido ingresado con exito al sistema!";
          await this.notifyAction(message);
        })
        .catch(async (err) => {
          console.error("=>", err);
          message = "Error al crear nuevo docente, por favor, vuelva a intentarlo mas tarde."
          await this.notifyAction(message);
        });

      this.profeForm.reset();
      return;
    }

    await this.notifyAction(message);
  }

  async notifyAction(message: string) {
    return this.ui.showNotification({
      message: message,
      position: 'top',
      duration: 3000,
      buttons: [
        {
          text: "Aceptar",
          role: 'cancel'
        }
      ]
    });
  }

}
