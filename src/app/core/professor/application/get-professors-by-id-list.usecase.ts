import { Professor } from "../domain/professor.domain";
import { ProfessorRepository } from "../domain/respos/professor.repository";

export class GetProfessorsByIdListUseCase {

    constructor(private readonly profeRepo: ProfessorRepository){}

    async run(professorIdList: string[]) {
        const professors: Professor[] = [];
        professorIdList.forEach(async id => {
            const profe = await this.profeRepo.getProfessorsById(id);
            professors.push(profe);
        });

        return professors;
    }

}