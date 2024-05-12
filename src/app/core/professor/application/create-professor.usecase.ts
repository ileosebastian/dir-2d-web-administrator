import { DetailProfessor } from "../domain/detail-professor.domain";
import { Professor } from "../domain/professor.domain";
import { ProfessorRepository } from "../domain/respos/professor.repository";


export class CreateProfessorUseCase {

    constructor(private readonly professorRespository: ProfessorRepository) { }

    async run(professor: Professor, detail: DetailProfessor): Promise<void> {
        try {
            await this.professorRespository.insertNewProfessor(professor, detail);
            return;
        } catch (error) {
            throw new Error("An error ocurred when insert professor.");
        }
    }

}