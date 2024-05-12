import { MapRepository } from '../../domain/repos/map.repository';


export class GetBuildingsByCampusUseCase {

    constructor(private readonly mapRepo: MapRepository) {}

    async run(campusName: string) {
        return await this.mapRepo.getBuildingsByCampus(campusName);
    }

}