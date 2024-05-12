import { MapRepository } from '../../domain/repos/map.repository';


export class GetAllBuildingsUseCase {

    constructor(private readonly mapRepo: MapRepository) {}

    async run() {
        return await this.mapRepo.getAllBuildings();
    }

}