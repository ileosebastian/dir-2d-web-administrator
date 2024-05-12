import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class RemoveBuildingUseCase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    async run() {
        await this.tempRepo.deleteBuilding('building');
    }

}