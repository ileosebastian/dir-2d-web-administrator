import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChildren, inject } from '@angular/core';

import { IonButton, IonicModule } from '@ionic/angular';

import { PlaneEditorController } from '../../../../../core/plane-editor/infraestructure/plane-editor.controller';
import { Plane } from '../../../../../core/plane-editor/domain/map.domain';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-drawing-options',
  templateUrl: './drawing-options.component.html',
  styleUrls: ['./drawing-options.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf
  ]
})
export class DrawingOptionsComponent implements OnInit {
  
  @Input() currentPlane!: Plane;
  @Input() showColorInput!: boolean;
  
  @Output() emittShowGuidelines = new EventEmitter<boolean>;

  @ViewChildren('btn') buttons!: IonButton[];


  private renderer = inject(Renderer2);
  private planeController = inject(PlaneEditorController);

  ngOnInit() { }

  toggleGuide(ev: any) {
    const checked: boolean = ev.detail.checked;

    const guide = document.getElementById('guide');
    if (guide) {
      this.renderer.setStyle(guide, 'display', `${checked ? '' : 'none'}`);
    }

    this.planeController.generatePlane(this.currentPlane, checked);
    this.emittShowGuidelines.emit(checked);
  }

  async selectBlockOrWP(target: string, color: string) {
    // check if button its always selected
    const btn = this.buttons.filter(btn => btn.rel === 'selected');

    if (btn.pop()?.target === target) {
      this.showColorInput = false;
      this.unselectedBlockOrWP();
      return;
    }

    try {
      const catId = await this.planeController.getIdentifier();
      this.clearChipByCategoryName(catId);
    } catch(err) {
      console.error("error", err);
    }
    await this.planeController.saveIdentifier(target);

    this.clearButtonFocus();

    this.showColorInput = target === 'block';

    this.buttons.forEach(btn => {
      if (btn.target === target) {
        btn.fill = target === 'waypoint' ? 'outline' : 'solid';
        btn.color = color;
        btn.strong = true;
        btn.rel = 'selected';
      } else {
        btn.fill = 'outline';
        btn.color = 'primary';
        btn.strong = false;
        btn.rel = '';
      }
    });
  }

  private async unselectedBlockOrWP() {
    await this.planeController.removeIdentifier();
    this.clearButtonFocus();
  }

  private clearChipByCategoryName(categoryName: string) {
    const chip = document.getElementById(categoryName);
    if (chip) {
      this.renderer.removeClass(chip, 'chip-selected');
    }
  }

  private clearButtonFocus() {
    this.buttons.forEach(btn => {
      btn.fill = 'outline';
      btn.color = 'primary';
      btn.strong = false;
      btn.rel = '';
    });
  }

}
