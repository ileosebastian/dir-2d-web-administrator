import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    SideMenuComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class HomePage implements OnInit {

  ngOnInit() {}

}
