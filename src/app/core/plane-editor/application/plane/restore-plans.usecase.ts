// import { Plane } from "../domain/plane.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { Plane } from '../../domain/map.domain';


export class RestorePlansUseCase {

    constructor(private readonly tempRepo: TemporalRepository) { }

    async run(firstFloor: number): Promise<Plane[]> {

        let floor = firstFloor;
        let res = await this.tempRepo.getPlaneByFloor(`plane_${floor}`);

        let planes = res === null ? [] : [JSON.parse(res) as Plane];

        while (res !== null) {
            floor++;
            res = await this.tempRepo.getPlaneByFloor(`plane_${floor}`);
            if (res !== null) {
                planes.push(JSON.parse(res) as Plane);
            }
        }

        return planes;
    }

}