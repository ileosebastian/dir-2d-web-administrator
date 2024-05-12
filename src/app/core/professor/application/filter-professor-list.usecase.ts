import { ProfessorRepository } from "../domain/respos/professor.repository";

export class FilterProfessorListUseCase {

    constructor(private readonly professorRepository: ProfessorRepository) { }

    run(filterBy: string, value: string) {
        return this.professorRepository.getProfessorsByFilter(filterBy, value);
    }

}