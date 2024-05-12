import { Injectable, inject } from "@angular/core";
import {
    Auth,
    GoogleAuthProvider,
    UserCredential,
    browserSessionPersistence,
    signInWithPopup,
    User as GUser,
    signOut
} from "@angular/fire/auth";

import { UserRepository } from "../../domain/repos/user.repository";

import { User } from "../../domain/user.domain";
import { validEmail } from '../../../shared/models/core.types';


@Injectable({
    providedIn: 'root',
})
export class FirebaseUserRepository implements UserRepository {

    auth = inject(Auth);
    provider = new GoogleAuthProvider();

    constructor() {
        this.auth.languageCode = 'es';
        this.provider.setCustomParameters({
            'login_hint': 'user@utm.edu.ec',
            prompt: 'select_account' // to open whenever necesary
        });
    }

    getUser(): User | null {
        return this.changeGoogleUserToUser(this.auth.currentUser);
    }

    private changeGoogleUserToUser(user: GUser | null): User | null{
        if (user)
            return new User(user.displayName || '', <validEmail>user.email, user.photoURL, user.emailVerified);
        return null;
    }

    async getUserCredentials(): Promise<User | null> {
        try {
            this.auth.setPersistence(browserSessionPersistence);

            const response = await this.loginWithGoogle(this.auth, this.provider)
                .then(credentials => (credentials))
                .catch(err => (null));

            return response === null ? null : this.changeUserCredentialByUser(response);
        } catch (error) {
            return null;
        }
    }

    async logOut(): Promise<void> {
        await signOut(this.auth);
    }

    private async loginWithGoogle(auth: Auth, provider: GoogleAuthProvider) {
        const credentials: UserCredential = await signInWithPopup(auth, provider);

        return credentials;
    }

    private changeUserCredentialByUser(userCredential: UserCredential): User {
        return new User(
            userCredential.user.displayName || 'Guest Admin',
            <validEmail>userCredential.user.email,
            userCredential.user.photoURL, 
            userCredential.user.emailVerified);
    }
    
}