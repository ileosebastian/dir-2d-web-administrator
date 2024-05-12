import { UserRepository } from "../domain/repos/user.repository";


export class LogoutUseCase {

    constructor(private readonly user: UserRepository) {}

    async run() {
        await this.user.logOut();
    }
}