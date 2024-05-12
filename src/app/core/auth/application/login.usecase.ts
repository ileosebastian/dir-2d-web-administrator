import { messages } from "../../shared/data/notifications.data";
import { UserRepository } from "../domain/repos/user.repository";
import { ValidUsersRepository } from "../domain/repos/valid-users.repository";
import { User } from "../domain/user.domain";


export class LoginUseCase {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly validUserRepo: ValidUsersRepository) { }

    async run(): Promise<User | messages> {
        let user = await this.userRepo.getUserCredentials();

        if (user instanceof User) {
            if (!this.isValidEmail(user))
                return 'invalid_email_error';
                
            let validUsers = await this.validUserRepo.getValidUsers();

            if (validUsers)
                if (!this.isValidUser(user, validUsers)) {
                    return 'invalid_user_error';
                }
            else
                return user;
        } else {
            return 'user_not_found_error';
        }

        return user;
    }

    private isValidEmail(user: User): boolean {
        const validRegEx: RegExp = /^[A-Z0-9._%+-]+@utm.edu.ec$/i;
        if (user.email != null && validRegEx.test(user.email)) {
            return true;
        }

        return false;
    }

    private isValidUser(possibleUser: User, validUsers: User[]): boolean {
        const possible = validUsers
            .filter(user =>
                user['email'] === possibleUser.email &&
                user['emailVerified'] === possibleUser.emailVerified);

        return possible.length > 0 ? true : false;
    }

}