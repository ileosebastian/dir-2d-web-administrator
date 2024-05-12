import { UUID, placesID } from "../../../shared/models/core.types";
import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class SavePlacesUUIDUseCase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    run(floor: number, placeUUID: UUID) {

        let identifier: placesID = `places_${floor}`;

        // let res = localStorage.getItem(identifier);
        let res = this.tempRepo.getUUIDPlacesByFloor(identifier);

        let listOfUUIDPlaces: UUID[] = [];
        if (res) { // hay ya al menos un places registrado 
            // listOfUUIDPlaces = JSON.parse(res) as UUID[];
            listOfUUIDPlaces = res;
            listOfUUIDPlaces.push(placeUUID); // agregar uno nuevo 
        } else {
            listOfUUIDPlaces = [placeUUID]; // agregar como primero
        }

        // localStorage.setItem(identifier, JSON.stringify(listOfUUIDPlaces));
        this.tempRepo.savePlacesByFloor(identifier, listOfUUIDPlaces);

    }

}