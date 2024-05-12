import { TemporalRepository } from "../../domain/repos/temporal.repository";


export class RemovePlaneByFloorUseCase {

    constructor(private readonly tempRepo: TemporalRepository) {}

    async run(floor: number) {
        const placesUUIDs = this.tempRepo.getUUIDPlacesByFloor(`places_${floor}`);

        if (placesUUIDs) {
            placesUUIDs.forEach(async uuid => {
                await this.tempRepo.deletePlace(uuid);
            });
        }
        localStorage.removeItem(`places_${floor}`);

        await this.tempRepo.deletePlane(`plane_${floor}`);
    }

}