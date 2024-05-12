import { Professor } from "../domain/professor.domain";
import { ProfessorRepository } from "../domain/respos/professor.repository";

export class UpdateVisibilityUseCase {

    constructor(private readonly professorRepository: ProfessorRepository) {}

    async run(professor: Professor): Promise<Professor | null> {
        try {
            professor.isVisible = professor.isVisible ? false : true;
            await this.professorRepository.updateVisibility(professor);
            return professor;
        } catch(err) {
            console.error("=>", err);
            return null;
        }
    }

}