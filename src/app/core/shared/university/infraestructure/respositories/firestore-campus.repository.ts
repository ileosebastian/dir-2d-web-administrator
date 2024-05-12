import { CollectionReference, DocumentData, Firestore, collection, collectionData } from "@angular/fire/firestore";

import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

import { Campus } from "../../domain/campus.domain";
import { CampusRepository } from "../../domain/repos/campus.repository";


@Injectable({
    providedIn: 'root'
})
export class FirestoreCampusRepository implements CampusRepository {

    private campusCollection!: CollectionReference<DocumentData>;
    private readonly db = inject(Firestore);

    constructor() {
        this.campusCollection = collection(this.db, "campus");
    }

    getAllCampus(): Observable<Campus[]> {
        return collectionData(this.campusCollection) as Observable<Campus[]>;
    }

}