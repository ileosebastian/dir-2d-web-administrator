import { map } from 'rxjs';
import { CampusRepository } from '../domain/repos/campus.repository';
import { FacultyRepository } from "../domain/repos/faculty.repository";

export class GroupListsUseCase {

    constructor(private readonly campusRepository: CampusRepository, private readonly facultyRepository: FacultyRepository)
    { }

    run() {
        let campus = this.campusRepository.getAllCampus();

        let faculties = this.facultyRepository.getAllFaculties();

        let res = campus.pipe(
            map(campus => campus.map(camp => {
                return {
                    campusName: camp.name,
                    faculties: faculties.pipe(
                        map(faculties => faculties.filter(facu => facu.campus === camp.name)),
                        map(faculties => faculties.map(facu => ({campus: facu.campus, name: facu.name})))
                    )
                };
            }))
        );

        // console.log(res);
        return res;
    }

}