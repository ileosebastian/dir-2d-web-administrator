import { Building } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class GetBuildingUseCase {

    constructor(private readonly tempRepo: TemporalRepository) { }

    run(): Building {
        const rawRes = this.tempRepo.getBuilding('building');
        if (rawRes) {
            return JSON.parse(rawRes) as Building;
        } else {
            throw new Error("Error getting building");
        }
    }

}