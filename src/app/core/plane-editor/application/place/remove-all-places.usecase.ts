import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class RemoveAllPlacesUseCase {

    constructor(private readonly tempRepo: TemporalRepository) { }

    async run(floors: number[]) {
        
        floors.forEach(async floor => {
            let placesUUID = this.tempRepo.getUUIDPlacesByFloor(`places_${floor}`);

            if (placesUUID) {
                placesUUID.forEach(async placeID => {
                    await this.tempRepo.deletePlace(placeID);
                });
                localStorage.removeItem(`places_${floor}`);
            }

        });
        
    }

}