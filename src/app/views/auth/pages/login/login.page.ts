import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UiService } from '../../../shared/services/ui/ui.service';

import { UserController } from '../../../../core/auth/infraestructure/user.controller';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class LoginPage implements OnInit, OnDestroy {

  isDisabled!: boolean;
  userName!: string | null;

  constructor(
    private router: Router,
    private notifyService: UiService,
    private userController: UserController // for case user
  ) { }

  ngOnInit() {
    localStorage.removeItem("user");
    this.userName = "Guest";
    this.isDisabled = false;
  }

  async onLogin() {
    try {
      this.isDisabled = true;
      let res = await this.userController.loginUser();
      this.isDisabled = false;

      if (typeof res !== 'string') {
        this.userName = res.name;
        this.router.navigate(['/home'], { replaceUrl: true });
        return;
      }

      await this.userController.logoutUser(); // make sure the user is not authenticated
      await this.notifyService.showNotification({
        message: res,
        position: "top",
        duration: 10000,
        buttons: [
          {
            text: "Aceptar",
            role: 'cancel'
          }
        ]
      });
    } catch (error) {
      this.isDisabled = false;
      console.error("Login error => \n", error);
      this.notifyService.showNotification({
        message: "No se ha posido iniciar sesion. Por favor, intente mas tarde.",
        position: "top",
        duration: 5000
      });
    }
  }

  ngOnDestroy() {
    this.notifyService.showNotification({
      message: `Bienvenido al sistema, ${this?.userName}`,
      position: "top",
      duration: 3000
    });
  }

}
