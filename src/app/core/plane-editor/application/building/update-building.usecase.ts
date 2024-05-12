import { Building } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class UpdateBuildingUseCase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    async run(newBuilding: Building) {
        await this.tempRepo.saveBuilding('building', newBuilding);
    }

}