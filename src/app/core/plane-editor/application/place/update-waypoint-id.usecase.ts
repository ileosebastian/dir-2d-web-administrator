import { UUID } from "src/app/core/shared/models/core.types";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { Place } from "../../domain/map.domain";
import { GetAllPlacesByFloorUseCase } from "./get-all-places-by-floor.usecase";
import { platformCore } from "@angular/core";


export class UpdateWayPointIdUseCase {

    private readonly getAllPlaces!: GetAllPlacesByFloorUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.getAllPlaces = new GetAllPlacesByFloorUseCase(tempRepo);
    }

    // async run(wayPointId: UUID, place: Place) {
    async run(oldPlace: Place | null, newPlace: Place | null, floor: number) {
        let allCurrentPlaces = this.getAllPlaces.run(floor); 
            allCurrentPlaces.filter(plc => plc.wayPointId === newPlace?.wayPointId)
            .forEach(async place => {
                place.wayPointId = 'X-X-X-X-X';
                await this.tempRepo.savePlace(place.uuid, place);
            });
        if (oldPlace) {
            if (newPlace) {
                // if (oldPlace.wayPointId !== newPlace.wayPointId) {
                //     oldPlace.wayPointId = 'X-X-X-X-X';
                //     await this.tempRepo.savePlace(oldPlace.uuid, oldPlace);
                // }

                await this.tempRepo.savePlace(newPlace.uuid, newPlace);
            } else { // ya no es un punto de referencia de tipo destino
                oldPlace.wayPointId = 'X-X-X-X-X';
                await this.tempRepo.savePlace(oldPlace.uuid, oldPlace);
            }
        } else { // como no hay anteriormente un wp enlazado, ahora se enlaza el nuevo
            if (newPlace) {
                await this.tempRepo.savePlace(newPlace.uuid, newPlace);
            }
        }

        

    }

}