import { NgFor } from '@angular/common';
import { Component, Input, OnInit, ViewChildren, inject, AfterViewInit, Output, EventEmitter, WritableSignal, signal, effect, OnChanges, SimpleChanges } from '@angular/core';
import { IonButton, IonicModule } from '@ionic/angular';
import { Plane } from 'src/app/core/plane-editor/domain/map.domain';
import { PlaneEditorController } from 'src/app/core/plane-editor/infraestructure/plane-editor.controller';


@Component({
  selector: 'app-floors-list',
  templateUrl: './floors-list.component.html',
  styleUrls: ['./floors-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor
  ]
})
export class FloorsListComponent implements OnInit, AfterViewInit {

  @Input() showGuidelines!: boolean;
  @Input() planes: number[] = [1];
  @Input() currentPlane!: Plane;

  @Output() emittCurrentPlane = new EventEmitter<Plane>;
  
  @ViewChildren('planes') planesBtns!: IonButton[];

  private planeController = inject(PlaneEditorController);

  ngOnInit() {  }

  ngAfterViewInit(): void {
    this.planesBtns.forEach(btn => {
      btn.fill = 'solid';
      btn.target = 'selected';
    });
  }

  async selectFloor(floor: number) {
    try {
      this.currentPlane = await this.planeController.getPlaneByFloor(floor);
      this.emittCurrentPlane.emit( this.currentPlane );
    } catch (err) {
      console.error("=> ", err);
      this.currentPlane = this.currentPlane;
      this.emittCurrentPlane.emit( this.currentPlane );
    }
    this.planeController.generatePlane(this.currentPlane, this.showGuidelines);

    this.planesBtns.forEach(btn => {
      if (btn.rel === `${floor}`) {
        btn.fill = 'solid';
        btn.target = 'selected'
      } else {
        btn.fill = 'outline';
        btn.target = '';
      }
    });
  }

}
