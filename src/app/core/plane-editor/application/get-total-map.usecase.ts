import { sourceByCategory } from "../../shared/data/constants.data";
import { UUID } from "../../shared/models/core.types";
import { isASprite } from "../../shared/utils/is-a-sprite.util";
import { PlaceParsed } from "../domain/map-parsed.domain";
import { Box, Building, Place, Plane, Waypoint } from "../domain/map.domain";
import { MapRepository } from "../domain/repos/map.repository";
import { TemporalRepository } from "../domain/repos/temporal.repository";


export class GetTotalMapUseCase {

    constructor(
        private readonly mapRepo: MapRepository,
        private readonly tempRepo: TemporalRepository
    ) { }

    async run(buildingId: UUID) {
        try {

            const rawBuilding = await this.mapRepo.getBuildingById(buildingId);

            const building: Building = {
                id: rawBuilding.id,
                uuid: rawBuilding.uuid,
                name: rawBuilding.name,
                campus: rawBuilding.campus,
                faculty: rawBuilding.faculty,
                floors: rawBuilding.floors
            };

            // console.log("EDIFICIO TRAIDO: ", building);
            await this.tempRepo.saveBuilding('building', building);

            // obtener planos a partir del building
            const rawPlanes = await this.mapRepo.getPlanesByBuildingId(building.uuid, building.floors);

            const planes: Plane[] = [];

            rawPlanes.forEach(async rawPlane => {
                const plane: Plane = {
                    id: rawPlane.id,
                    uuid: rawPlane.uuid,
                    buildingId: rawPlane.buildingId,
                    columns: rawPlane.columns,
                    rows: rawPlane.rows,
                    floor: rawPlane.floor,
                    heightTiles: rawPlane.heightTiles,
                    widthTiles: rawPlane.widthTiles,
                    stage: JSON.parse(rawPlane.stage) as Box[][],
                    wayPoints: JSON.parse(rawPlane.waypoints) as Waypoint[]
                };

                plane.stage.forEach(col => col.forEach(row => {
                    if (row.contain && isASprite(row.contain)) {
                        row.contain.source = sourceByCategory[row.contain.spriteType];
                    }
                }));

                planes.push(plane);

                await this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
            });

            // console.log(planes);
            // obtener los places a partir del plans
            const rawPlacesByFloor: Map<number, PlaceParsed[]> = new Map();
            let placesID: UUID[] = [];
            planes.forEach(async plane => {
                const rawPlaces = await this.mapRepo.getPlacesByPlaneId(plane.uuid);
                // console.log("PLACES: ", rawPlaces)
                rawPlacesByFloor.set(plane.floor, rawPlaces);

                rawPlaces.forEach(async rawPlace => {
                    const rawDetailPlace = await this.mapRepo.getDetailPlaceByPlaceId(rawPlace.uuid);

                    const place: Place = {
                        id: rawPlace.id,
                        uuid: rawPlace.uuid,
                        belongsProfessor: rawDetailPlace.belongsProfessor,
                        code: rawPlace.code,
                        category: rawPlace.category,
                        name: rawPlace.name,
                        planeId: rawPlace.planeId,
                        professorsId: rawDetailPlace.professorsId,
                        wayPointId: rawDetailPlace.wayPointId
                    };

                    // console.log("El place del piso ", plane.floor, "=> ", place);
                    // placesID.push(place.uuid);
                    await this.tempRepo.savePlace(place.uuid, place);
                });
                rawPlaces.forEach(rPlace => placesID.push(rPlace.uuid));
                await this.tempRepo.savePlacesByFloor(`places_${plane.floor}`, placesID);
                placesID = [];
            });
        } catch (error) {
            console.error("=>  ", error);
        }
    }

}