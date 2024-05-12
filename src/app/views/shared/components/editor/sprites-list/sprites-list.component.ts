import { Component, EventEmitter, OnInit, Output, Renderer2, inject } from '@angular/core';

import { IonButton, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Category } from '../../../../editor/models/category.interface';
import { StaticDataService } from 'src/app/views/create/services/static-data.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { PlaneEditorController } from 'src/app/core/plane-editor/infraestructure/plane-editor.controller';


@Component({
  selector: 'app-sprites-list',
  templateUrl: './sprites-list.component.html',
  styleUrls: ['./sprites-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgFor,
    AsyncPipe
  ]
})
export class SpritesListComponent implements OnInit {

  @Output() emittTypePlaceCategory = new EventEmitter<Category>;
  @Output() emittShowColorInput = new EventEmitter<boolean>;

  categories!: Observable<Category[]>;

  private staticDataService = inject(StaticDataService);
  private renderer = inject(Renderer2);
  private planeController = inject(PlaneEditorController);

  ngOnInit() {
    this.categories = this.staticDataService.getCategories();
  }

  async selectCategory(cat: Category) {
    // check if chip its always selected
    const categoryName = cat.category;
    const possibleChipClicked = document.getElementsByClassName('chip-selected');

    if (possibleChipClicked.item(0)?.id === categoryName) {
      this.unselectedCatetory(categoryName);
      return;
    }

    try {
      const btnId = await this.planeController.getIdentifier();
      this.clearDrawingOptionButtonById(btnId);
    } catch(err) {
      console.error("error", err);
    }
    await this.planeController.saveIdentifier(categoryName);

    this.categories.forEach(category => {
      category.forEach(cat => {
        const chip = document.getElementById(cat.category);

        if (cat.category === categoryName) {
          // draw chip clicked
          this.renderer.addClass(chip, 'chip-selected');
        } else {
          this.renderer.removeClass(chip, 'chip-selected');
        }

      });
    });

    this.emittTypePlaceCategory.emit(cat);
  }

  private clearDrawingOptionButtonById(id: string) {
    const btnOpt = document.getElementById(id);
    if (btnOpt) {
      const tmp = btnOpt as unknown;
      const btn = tmp as IonButton;

      btn.color = 'primary';
      btn.fill = 'outline';
      btn.strong = false;
      btn.rel = '';

      this.emittShowColorInput.emit( false );
    }
  }

  private async unselectedCatetory(categoryName: string) {
    await this.planeController.removeIdentifier();

    const chip = document.getElementById(categoryName);
    if (chip) {
      this.renderer.removeClass(chip, 'chip-selected');
    }
  }

}
