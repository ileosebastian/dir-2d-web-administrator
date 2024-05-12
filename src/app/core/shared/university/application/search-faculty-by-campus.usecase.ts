import { FacultyRepository } from "../domain/repos/faculty.repository";

export class SearchFacultyByCampus {

    constructor(private readonly facultyRepository: FacultyRepository) {}

    run(campusName: string) {
        return this.facultyRepository.getFacultyByCampus(campusName);
    }
}