import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';

import { IonButton, IonItem, IonicModule } from '@ionic/angular';

import { Observable } from 'rxjs';

import { UniversityController } from '../../../../core/shared/university/infraestructure/university.cotroller';

import { FilterOption } from '../../models/filter-option.interface';


@Component({
  selector: 'app-accordion-menu',
  templateUrl: './accordion-menu.component.html',
  styleUrls: ['./accordion-menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    AsyncPipe
  ]
})
export class AccordionMenuComponent implements OnInit, AfterViewInit {
  // data
  res!: Observable<{
    campusName: string,
    faculties: Observable<{ campus: string, name: string }[]>
  }[]>;

  // control elements
  @ViewChild(IonButton) allProfessorsBtn!: IonButton;
  @ViewChildren('campus') options!: IonItem[];
  @ViewChildren('faculty') facultyOpts!: IonItem[];

  @Output() filterEmitter = new EventEmitter<FilterOption>();

  constructor(
    private universityController: UniversityController
  ) { }

  ngOnInit() {
    this.res = this.universityController.getOptionList();
  }

  // load ui behavior
  ngAfterViewInit(): void {
    this.allProfessorsBtn.color = "primary";
  }

  showAllProfessors(): void {
    this.allProfessorsBtn.color = "primary";
    this.options.forEach(opt => opt.color = 'light')
    this.facultyOpts?.forEach(opt => opt.color = '');

    this.filterEmitter.emit({ filterBy: 'todos', value: 'todos' });
  }

  showProfessorsByCampus(campName: string): void {
    this.allProfessorsBtn.color = "light";

    this.options.forEach(opt => opt.color = 'light')

    this.options
      .filter(opt => opt.target === campName)
      .map(o => o.color = 'primary');

    // this.filterEmitter.emit(`profe por campus ${campName}`);
    this.filterEmitter.emit({ filterBy: 'campus', value: campName });
  }

  showProfessorsByFaculty(facultyName: string): void {
    this.allProfessorsBtn.color = "light";

    this.options.forEach(opt => opt.color = 'light')

    this.facultyOpts?.forEach(opt => opt.color = '');

    this.facultyOpts
      .filter(opt => opt.target === facultyName)
      .map(o => o.color = 'primary')

    // this.filterEmitter.emit(`profe por facultad de ${facultyName}`);
    this.filterEmitter.emit({ filterBy: 'faculty', value: facultyName });
  }

}
