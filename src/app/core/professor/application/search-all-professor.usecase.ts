import { ProfessorRepository } from "../domain/respos/professor.repository";

export class SearchAllProfessorUseCase {

    constructor(private readonly professorRepository: ProfessorRepository) {}

    run() {
        return this.professorRepository.getAllProfessors();
    }

}