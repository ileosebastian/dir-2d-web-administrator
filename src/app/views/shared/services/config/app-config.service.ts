import { Injectable } from '@angular/core';
import { Config } from '../../models/config.interface'

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  defaultConfig: Config = {
    colorTheme: null,
    checked: null,
  }

  localConfig: Config = this.defaultConfig;

  constructor() { }

  saveLocalConfig(obj: string, config: Config) {
    this.localConfig = config;
    localStorage.setItem(obj, JSON.stringify(this.localConfig));
  }

  getLocalConfig(obj: string): Config {
    this.localConfig = JSON.parse(<string>localStorage.getItem(obj));

    if (!this.localConfig) { // si no existe el objecto
      this.localConfig = this.defaultConfig;
      // guardarlo en el localstorage
      this.localConfig.checked = false;
      this.localConfig.colorTheme = "light"
      this.saveLocalConfig(obj, this.localConfig);
    }

    return this.localConfig;
  }

  setColor(isChecked: boolean | null): string {
    return isChecked ? "dark" : "light"
  }

}
