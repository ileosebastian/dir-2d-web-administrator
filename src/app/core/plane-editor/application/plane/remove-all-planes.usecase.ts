import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class RemoveAllPlanesUseCase {

    constructor(private readonly tempRepo: TemporalRepository){}

    async run(floors: number[]) {
        floors.forEach(async floor => {
            await this.tempRepo.deletePlane(`plane_${floor}`);
        });
    }

}