import { Place } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";

export class SavePlaceUseCase {
    constructor(private readonly tempRepo: TemporalRepository) {}

    async run(place: Place) {
        await this.tempRepo.savePlace(place.uuid, place);
    }

}