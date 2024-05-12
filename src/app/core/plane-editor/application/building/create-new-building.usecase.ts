import { Building } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class CreateNewBuildingUseCase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    async run(name: string, campus: string, faculty: string) {
        let building: Building = {
            uuid: crypto.randomUUID(),
            floors: 1, // by default, init with one floor
            name,
            campus,
            faculty
        };

        // alert(JSON.stringify(building));
        await this.tempRepo.saveBuilding('building', building);
    }

}