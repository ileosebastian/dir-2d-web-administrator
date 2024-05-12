import { validEmail } from "./user.types";

export interface ValidUser {
    email: validEmail
    emailVerified: boolean
}
