import { ProfessorRepository } from "../domain/respos/professor.repository";
import { Professor } from '../domain/professor.domain';
import { DetailProfessor } from "../domain/detail-professor.domain";


export class UpdateProfessorCompleteUseCase {

    constructor(private readonly profeRepo: ProfessorRepository) {

    }

    run(professor: Professor, detail: DetailProfessor) {
        
    }
}