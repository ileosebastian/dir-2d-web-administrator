import { validEmail } from "../../shared/models/core.types";

export class User {
    
    readonly name!: string;
    readonly email!: validEmail;
    readonly photoURL!: string | null;
    readonly emailVerified!: boolean;

    constructor(name: string, email: validEmail, photoURL: string | null, emailVerified: boolean) {
        this.name = name;
        this.email = email;
        this.photoURL = photoURL;
        this.emailVerified = emailVerified;
    }
}