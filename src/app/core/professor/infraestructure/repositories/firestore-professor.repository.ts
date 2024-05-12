import { Injectable, inject, Pipe } from '@angular/core';
import {
    CollectionReference,
    DocumentData,
    Firestore,
    addDoc,
    collection,
    collectionData,
    doc,
    query,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import { Observable, firstValueFrom, take } from 'rxjs';

import { Professor } from '../../domain/professor.domain';
import { ProfessorRepository } from "../../domain/respos/professor.repository";
import { DetailProfessor } from '../../domain/detail-professor.domain';


@Injectable({
    providedIn: 'root'
})
export class FirestoreProfessorRepository implements ProfessorRepository {

    private professorCollection!: CollectionReference<DocumentData>;
    private professorDetailsCollection!: CollectionReference<DocumentData>;

    private readonly db = inject(Firestore);

    constructor() {
        this.professorCollection = collection(this.db, "professors");
        this.professorDetailsCollection = collection(this.db, "professor-details");
    }

    async getProfessorsById(id: string): Promise<Professor> {
        const qProfe = query(this.professorCollection, where('id', "==", id));

        const resProfe = collectionData(qProfe, { idField: 'id' }) as Observable<Professor[]>;

        const restultProfe = await firstValueFrom(resProfe);

        return restultProfe[0];
    }

    async getProfessorById(profeId: string): Promise<{ professor: Professor; detail: DetailProfessor; }> {
        const qProfe = query(this.professorCollection, where('id', "==", profeId));
        const resProfe = collectionData(qProfe, { idField: 'id' }) as Observable<Professor[]>;

        const restultProfe = await firstValueFrom(resProfe);

        const professor = restultProfe[0];

        const qDetail = query(this.professorDetailsCollection, where('uuid', "==", professor.infoId));
        let resDetail = collectionData(qDetail, { idField: 'id' }) as Observable<DetailProfessor[]>;
        let restultDetail = await firstValueFrom(resDetail);
        let detail = restultDetail[0];

        return { professor, detail };
    }

    getProfessorsByVisibilty(): Observable<Professor[]> {
        const q = query(this.professorCollection, where('isVisible', "==", true));
        return collectionData(q, { idField: 'id' }) as Observable<Professor[]>;
    }

    getProfessorsByFilter(filterBy: string, value: string): Observable<Professor[]> {
        const q = query(this.professorCollection, where(filterBy, "==", value));
        return collectionData(q, { idField: 'id' }) as Observable<Professor[]>;
    }

    getAllProfessors(): Observable<Professor[]> {
        return collectionData(this.professorCollection) as Observable<Professor[]>;
    }

    updateVisibility(professor: Professor): Promise<void> {
        const professorDocReference = doc(
            this.db,
            `professors/${professor.id}`
        );

        return updateDoc(professorDocReference, { ...professor });
    }

    async updateProfessorComplete(professor: Professor, detailProfessor: DetailProfessor): Promise<void> {
        const professorDocReference = doc(
            this.db,
            `professors/${professor.id}`
        );

        const detailDocReference = doc(
            this.db,
            `professor-details/${detailProfessor.id}`
        );

        await updateDoc(detailDocReference, {...detailProfessor});
        return updateDoc(professorDocReference, { ...professor });
    }

    async insertNewProfessor(professor: Professor, detail: DetailProfessor): Promise<void> {
        // add professor and detail document
        let newProfessor = await addDoc(this.professorCollection, professor);
        // get document ID generated autoamtically by firebase
        let newID = newProfessor.id;
        await addDoc(this.professorDetailsCollection, detail);

        // update professor ID
        professor.id = newID;
        const professorDocReference = doc(
            this.db,
            `professors/${newID}`
        );
        await updateDoc(professorDocReference, { ...professor });
    }

}