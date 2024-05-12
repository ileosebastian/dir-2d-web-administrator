import { Injectable } from '@angular/core';

import { NOTIFICATIONS } from "../../shared/data/notifications.data";

import { LoginUseCase } from "../application/login.usecase";
import { LogoutUseCase } from "../application/logout.usecase";

import { User } from "../domain/user.domain";

import { FirebaseUserRepository } from "./repositories/firebase-user-repository.repository";
import { InMemoryUserRepository } from "./repositories/in-memory-user.respository";


@Injectable({
    providedIn: 'root'
})
export class UserController {

    private readonly login!: LoginUseCase;
    private readonly logout!: LogoutUseCase;
    private readonly firestore = new FirebaseUserRepository();


    constructor() {
        this.login = new LoginUseCase(this.firestore, new InMemoryUserRepository);
        this.logout = new LogoutUseCase(this.firestore);
    }

    async loginUser(): Promise<User | string> {
        let result = await this.login.run();

        if (result instanceof User) {
            return result;
        }

        return NOTIFICATIONS[result];
    }

    async logoutUser() {
        await this.logout.run();
    }

    getCurrentUser(): User | null {
        return this.firestore.getUser();
    }
}