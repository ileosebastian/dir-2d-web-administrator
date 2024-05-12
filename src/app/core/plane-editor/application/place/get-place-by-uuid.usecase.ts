import { UUID } from "../../../shared/models/core.types";
import { Place } from "../../domain/map.domain";
import { TemporalRepository } from '../../domain/repos/temporal.repository';


export class GetPlaceByUUIDUseCase {
    constructor(private readonly tempRepo: TemporalRepository){}
    
    run(uuidPlace: UUID) {
        const res = this.tempRepo.getPlace(uuidPlace);

        if (res) {
            return JSON.parse(res) as Place;
        } else {
            throw new Error("The place " + uuidPlace + " doesn't exist.")
        }
    }

}