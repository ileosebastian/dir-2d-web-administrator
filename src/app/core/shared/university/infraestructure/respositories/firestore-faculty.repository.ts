import {
    collection,
    collectionData,
    CollectionReference,
    DocumentData,
    Firestore,
    query,
    where
} from "@angular/fire/firestore";
import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { Faculty } from "../../domain/faculty.domain";
import { FacultyRepository } from "../../domain/repos/faculty.repository";


@Injectable({
    providedIn: 'root'
})
export class FirestoreFacultyRepository implements FacultyRepository {

    private facultyCollection!: CollectionReference<DocumentData>;
    private readonly db = inject(Firestore);

    constructor() {
        this.facultyCollection = collection(this.db, "faculties");
    }

    getAllFaculties(): Observable<Faculty[]> {
        return collectionData(this.facultyCollection) as Observable<Faculty[]>;
    }

    getFacultyByCampus(campusName: string): Observable<Faculty[]> {
        const q = query(this.facultyCollection, where("campus", '==', campusName));
        return collectionData(q, { idField: 'id' }) as Observable<Faculty[]>;
    }

}