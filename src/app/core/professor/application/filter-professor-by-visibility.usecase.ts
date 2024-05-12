import { ProfessorRepository } from "../domain/respos/professor.repository";


export class FilterProfessorByVisibility {

    constructor(private readonly professorRepository: ProfessorRepository) {}

    run() {
        return this.professorRepository.getProfessorsByVisibilty();
    }
}