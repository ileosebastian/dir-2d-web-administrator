import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AppConfigService } from '../../../shared/services/config/app-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "Menu";
  checked: boolean = false; // is unchecked by default

  constructor(
    private configThemeSrvc: AppConfigService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    let { colorTheme, checked } = this.configThemeSrvc.getLocalConfig("local-config");
    this.checked = <boolean>checked;

    this.changeColorTheme("color-theme", <string>colorTheme, this.checked);
  }

  // To change color icon from toggle event
  onToggleColorTheme(ev: any): void {
    this.checked = ev.detail.checked;
    let [attribute, color] = this.configTheme(this.checked);

    this.changeColorTheme(attribute, color, this.checked);
  }

  changeColorTheme(attribute: string, colorTheme: string, checked: boolean): void {
    this.configThemeSrvc.saveLocalConfig("local-config", { colorTheme, checked });
    this.renderer.setAttribute(document.body, attribute, colorTheme); // render Color theme on pages
  }

  // Function that 
  configTheme(isChecked: boolean): string[] {
    return isChecked ? ["color-theme", "dark"] : ["color-theme", "light"];
  }

}