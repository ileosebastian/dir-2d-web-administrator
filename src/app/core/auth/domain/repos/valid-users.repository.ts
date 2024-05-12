import { User } from "../user.domain";


export interface ValidUsersRepository {
    getValidUsers(): Promise<User[] | null>; // possibly Observable
}