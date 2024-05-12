import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { Place } from "../../domain/map.domain";
import { UUID } from "src/app/core/shared/models/core.types";


export class GetAllPlacesByFloorUseCase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    run(floor: number): Place[] {
        const places: Place[] = [];
        // get array of places id by floor (places_1 or places_2... etc)
        const res = this.tempRepo.getUUIDPlacesByFloor(`places_${floor}`);
        let listOfIDPlace: UUID[] = [];

        if (res) {
            listOfIDPlace = res;
        }

        // loop throught this key array and GET places
        listOfIDPlace.forEach(idPlace => {
            const rawPlace = this.tempRepo.getPlace(idPlace);
            if (rawPlace) {
                const place: Place = JSON.parse(rawPlace) as Place;

                places.push(place);
            }
        });
        // save places in a new array of places
        return places;
    }

}