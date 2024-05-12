import { Observable } from "rxjs";
import { Professor } from "../professor.domain";
import { DetailProfessor } from "../detail-professor.domain";


export interface ProfessorRepository {
    getAllProfessors(): Observable<Professor[]>;
    updateVisibility(professor: Professor): Promise<void>;
    updateProfessorComplete(professor: Professor, detailProfessor: DetailProfessor): Promise<void>;
    getProfessorsByFilter(filterBy: string, value: string): Observable<Professor[]>;
    getProfessorsByVisibilty(): Observable<Professor[]>;
    getProfessorsById(id: string): Promise<Professor>;
    getProfessorById(profeId: string): Promise<{ professor: Professor, detail: DetailProfessor }>;
    insertNewProfessor(professor: Professor, detail: DetailProfessor): Promise<void>;
}