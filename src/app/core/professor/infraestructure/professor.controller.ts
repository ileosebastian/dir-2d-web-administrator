import { Injectable, inject } from '@angular/core';

import { SearchAllProfessorUseCase } from '../application/search-all-professor.usecase';
import { FirestoreProfessorRepository } from './repositories/firestore-professor.repository';
import { UpdateVisibilityUseCase } from '../application/update-visibility.usecase';
import { FilterProfessorListUseCase } from '../application/filter-professor-list.usecase';
import { DetailProfessor } from '../domain/detail-professor.domain';
import { CreateProfessorUseCase } from '../application/create-professor.usecase';

import { Professor } from '../domain/professor.domain';
import { FilterProfessorByVisibility } from '../application/filter-professor-by-visibility.usecase';
import { UUID } from '../../shared/models/core.types';
import { GetProfessorsByIdListUseCase } from '../application/get-professors-by-id-list.usecase';


@Injectable({
    providedIn: 'root'
})
export class ProfessorContoller {

    private repository = inject(FirestoreProfessorRepository);

    private readonly searchAllProfessor!: SearchAllProfessorUseCase;
    private readonly updateVisibility!: UpdateVisibilityUseCase;
    private readonly filterProfessors!: FilterProfessorListUseCase;
    private readonly getProfessorsByVisibilityUsecase!: FilterProfessorByVisibility;
    private readonly insertProfessor!: CreateProfessorUseCase;
    private readonly getProfessorsByIdListUseCase!: GetProfessorsByIdListUseCase;

    constructor() {
        this.searchAllProfessor = new SearchAllProfessorUseCase(this.repository);
        this.updateVisibility = new UpdateVisibilityUseCase(this.repository);
        this.filterProfessors = new FilterProfessorListUseCase(this.repository);
        this.getProfessorsByVisibilityUsecase = new FilterProfessorByVisibility(this.repository);
        this.insertProfessor = new CreateProfessorUseCase(this.repository);
        this.getProfessorsByIdListUseCase = new GetProfessorsByIdListUseCase(this.repository);
    }

    getAllProfessors() {
        return this.searchAllProfessor.run();
    }

    async updateProfeVisibility(professor: Professor) {
        return await this.updateVisibility.run(professor);
    }

    getProfessorsByFilter(filter: string, value: string) {
        return this.filterProfessors.run(filter, value);
    }

    getProfessorsByVisibility() {
        return this.getProfessorsByVisibilityUsecase.run();
    }

    async getProfessorsByIdList(professorsIdList: string[]) {
        return await this.getProfessorsByIdListUseCase.run(professorsIdList);
    }

    async getProfessorByID(professorId: string) {
        return await this.repository.getProfessorById(professorId);
    }

    getProfessorsByOffice(officeId: UUID) {

    }

    addNewProfessor(professor: Professor, detail: DetailProfessor) {
        return this.insertProfessor.run(professor, detail);
    }

    updateProfessor(professor: Professor, detailProfe: DetailProfessor) {
        return this.repository.updateProfessorComplete(professor, detailProfe);
    }

}