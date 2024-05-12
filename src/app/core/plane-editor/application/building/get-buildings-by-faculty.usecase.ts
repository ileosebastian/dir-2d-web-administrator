import { MapRepository } from '../../domain/repos/map.repository';


export class GetBuildingsByFacultyUseCase {

    constructor(private readonly mapRepo: MapRepository) {}

    async run(facultyName: string) {
        return await this.mapRepo.getBuildingsByFaculty(facultyName);
    }

}