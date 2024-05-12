import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailProfessor } from 'src/app/core/professor/domain/detail-professor.domain';
import { Professor } from 'src/app/core/professor/domain/professor.domain';
import { UniversityController } from 'src/app/core/shared/university/infraestructure/university.cotroller';
import { ProfessorContoller } from 'src/app/core/professor/infraestructure/professor.controller';
import { UiService } from 'src/app/views/shared/services/ui/ui.service';
import { Observable, Subscription } from 'rxjs';
import { Campus } from 'src/app/core/shared/university/domain/campus.domain';
import { Faculty } from 'src/app/core/shared/university/domain/faculty.domain';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-professor',
  templateUrl: './edit-professor.page.html',
  styleUrls: ['./edit-professor.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule
  ]
})
export class EditProfessorPage implements OnInit, OnDestroy {
  campusList!: Observable<Campus[]>;
  facultyList!: Observable<Faculty[]>;

  profeForm!: FormGroup;
  NAME_PATTNER: RegExp = /^(?=.{10,100}$)[a-zñA-ZÑ]+(\s[a-zñA-ZÑ]+)+$/;

  currentId!: string;
  currentProfe!: Professor;
  currentDetailProfe!: DetailProfessor;

  private route = inject(ActivatedRoute);
  suscriptorParams!: Subscription;

  constructor(
    private universityController: UniversityController,
    private professorController: ProfessorContoller,
    private formBuilder: FormBuilder,
    private ui: UiService
  ) {

  }

  async ngOnInit() {

    this.suscriptorParams = this.route.params.subscribe(async params => {

      console.log("ID por GET: ", params['id']);
      this.currentId = params['id'];
      let resposne = await this.professorController.getProfessorByID(this.currentId);

      this.currentProfe = resposne.professor;
      this.currentDetailProfe = resposne.detail;

      console.log(resposne);
      this.campusList = this.universityController.getCampusList();
      this.facultyList = this.universityController.getFacultyByCampus(this.currentProfe.campus);

      this.profeForm = this.formBuilder.group({
        //general
        name: [this.currentProfe.name, Validators.required, [this.validNamePattern.bind(this)]],
        visible: [`${this.currentProfe.isVisible}`, Validators.required],
        campus: [this.currentProfe.campus, Validators.required],
        faculty: [this.currentProfe.faculty, Validators.required],
        department: [this.currentProfe.department?.toUpperCase() || '', Validators.required],
        office: [this.currentProfe.office || '', Validators.required],
        //specific
        email: [this.currentDetailProfe.email, Validators.required,
        [this.validEmailPattern.bind(this)]],
        category: [this.currentDetailProfe.category, [Validators.required, Validators.minLength(4)]],
        dedication: [this.currentDetailProfe.dedication, [Validators.required, Validators.minLength(4)]],
        firstSchedule: [this.currentDetailProfe.schedule.first, [Validators.required, Validators.minLength(4)]],
        secondSchedule: [this.currentDetailProfe.schedule.second, [Validators.required, Validators.minLength(4)]]
      });
    });

  }

  ngOnDestroy(): void {
    this.suscriptorParams.unsubscribe();
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

  onSelectCamp(ev: any) {
    console.log(ev.detail);

    this.facultyList = this.universityController.getFacultyByCampus(ev.detail['value']);
  }

  async submitNewProfessor() {
    let message = "Ingrese los datos para todos los campos antes de agregar el docente!";
    if (this.profeForm.valid) { // if it's filled all fields
      // Set objects to send for insertion
      const professor: Professor = {
        id: this.currentProfe.id,
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
        id: this.currentDetailProfe.id,
        uuid: professor.infoId ?? "",
        category: this.profeForm.get('category')?.value.toLowerCase(),
        dedication: this.profeForm.get('dedication')?.value.toLowerCase(),
        email: this.profeForm.get('email')?.value,
        schedule: {
          first: "08h00 - 12h00",
          second: "14h00 - 17h30"
        },
        published: professor.isVisible,
      }

      // insert into database new objects
      this.professorController.updateProfessor(professor, detail)
        .then(async () => {
          message = "El docente ha sido actualizado con exito en el sistema!";
          await this.notifyAction(message);
        })
        .catch(async (err) => {
          console.error("=>", err);
          message = "Error al actualizar el/la docente, por favor, vuelva a intentarlo mas tarde."
          await this.notifyAction(message);
        });

      // this.profeForm.reset();
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
