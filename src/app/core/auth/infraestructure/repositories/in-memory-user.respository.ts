import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

import { ValidUsersRepository } from "../../domain/repos/valid-users.repository";
import { User } from "../../domain/user.domain";


@Injectable({
    providedIn: 'root'
})
export class InMemoryUserRepository implements ValidUsersRepository {

    private http = inject(HttpClient);

    async getValidUsers(): Promise<User[] | null> {
        let source = this.http.get<User[]>("/assets/data/valid-users.json");

        return await lastValueFrom(source);
    }
}