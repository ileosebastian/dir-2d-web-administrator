import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { Plane } from "../../domain/map.domain";


export class GetPlaneByFloorUsecase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    async run(floor: number): Promise<Plane | null> {
        let identifier = `plane_${floor}`;

        let res = await this.tempRepo.getPlaneByFloor(identifier);
        
        if (!res) return null;
        try {
            return {...JSON.parse(res ?? '')};
        } catch (err) {
            console.error("Get Plane Error =>", err);
            return null;
        }
    }
}