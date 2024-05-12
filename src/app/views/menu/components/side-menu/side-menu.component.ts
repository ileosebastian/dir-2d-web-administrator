import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Observable } from 'rxjs';

import { AppConfigService } from '../../../shared/services/config/app-config.service';
import { MenuOptionsService } from '../../services/get-data/menu-options.service';

import { UserController } from '../../../../core/auth/infraestructure/user.controller';

import { MenuOption } from '../../models/menu-options.interface';
import { User } from '../../../../core/auth/domain/user.domain';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    AsyncPipe,
    RouterLink
  ]
})
export class SideMenuComponent implements OnInit, OnDestroy {

  user!: User | null;
  menuOptions: Observable<MenuOption[]> | null = null;
  darkMode: boolean = false; // flag that change icon image

  constructor(
    private configThemeSrvc: AppConfigService,
    private userController: UserController,
    private dataOptionsService: MenuOptionsService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Get user data
    this.user = this.userController.getCurrentUser();

    this.menuOptions = this.dataOptionsService.getMenuOptions();
    this.darkMode = false;
  }

  ngOnDestroy(): void {
    this.user = null;
    this.menuOptions = null;
  }

  changeIconTheme() {
    let { colorTheme, checked } = this.configThemeSrvc.getLocalConfig("local-config");

    this.darkMode = colorTheme === "dark" ? false : true;
  }

  async onLogout() {
    await this.userController.logoutUser();
    this.router.navigate(['login'], { replaceUrl: true });
  }

}
