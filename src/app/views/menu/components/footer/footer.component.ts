import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class FooterComponent {

  title: string = "2023 - UTM";
  subtitle: string = "Todos los derechos reservados";

  constructor() { }

}
