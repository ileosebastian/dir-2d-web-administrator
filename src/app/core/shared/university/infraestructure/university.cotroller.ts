import { Injectable } from "@angular/core";
import { GroupListsUseCase } from "../application/group-lists.usecase";
import { FirestoreCampusRepository } from "./respositories/firestore-campus.repository";
import { FirestoreFacultyRepository } from "./respositories/firestore-faculty.repository";
import { SearchFacultyByCampus } from "../application/search-faculty-by-campus.usecase";
import { GetCampusListUseCase } from "../application/get-campus-list.usecase";


@Injectable({
    providedIn: 'root'
})
export class UniversityController {

    private readonly groupList!: GroupListsUseCase;
    private readonly searchFacultyByCampus!: SearchFacultyByCampus;
    private readonly campusList!: GetCampusListUseCase;

    constructor() {
        let facultyRepository = new FirestoreFacultyRepository();
        let campusRepository = new FirestoreCampusRepository();
        this.groupList = new GroupListsUseCase(campusRepository, facultyRepository);
        this.searchFacultyByCampus = new SearchFacultyByCampus(facultyRepository);
        this.campusList = new GetCampusListUseCase(campusRepository);
    }

    getOptionList() {
        return this.groupList.run();
    }

    getFacultyByCampus(campusName: string) {
        return this.searchFacultyByCampus.run(campusName);
    }

    getCampusList() {
        return this.campusList.run();
    }

}