import { Component, OnInit, inject, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PlaneEditorController } from 'src/app/core/plane-editor/infraestructure/plane-editor.controller';
import { UiService } from '../../../services/ui/ui.service';


@Component({
  selector: 'app-submit-new-map-btn',
  templateUrl: './submit-new-map-btn.component.html',
  styleUrls: ['./submit-new-map-btn.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class SubmitNewMapBtnComponent  implements OnInit {

  @Input() planes: number[] = [1];
  @Input() isAnUpdate: boolean = false;

  private planeController = inject(PlaneEditorController);
  private notify = inject(UiService);

  ngOnInit() {}

  async submitNewMap() {

    try {
      await this.planeController.createMap(this.planes, this.isAnUpdate);

      this.notify.showNotification({
        message: this.isAnUpdate ?
          "El mapa se ha actualizado exitosamente!" : 
          "El mapa se ha guardado exitosamente!", 
        duration: 2000,
        position: 'top'
      });
    } catch (err) {
      console.error("ERROR: ", err);
    }

  }

}
