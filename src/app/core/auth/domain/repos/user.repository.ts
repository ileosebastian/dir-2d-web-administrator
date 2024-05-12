import { User } from "../user.domain";

export interface UserRepository {
    getUser(): User | null;
    getUserCredentials(): Promise<User | null>;
    logOut(): Promise<void>;
}