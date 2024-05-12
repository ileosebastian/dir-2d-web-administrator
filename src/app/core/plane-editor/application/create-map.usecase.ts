import { UUID } from "../../shared/models/core.types";
import { isABlock } from "../../shared/utils/is-a-block.util";
import { isASprite } from "../../shared/utils/is-a-sprite.util";
import { BuildingParsed, DetailPlaceParsed, PlaceParsed, PlaneParsed } from "../domain/map-parsed.domain";
import { Box, Building, Place, Plane, Sprite } from '../domain/map.domain';
import { MapRepository } from "../domain/repos/map.repository";
import { TemporalRepository } from "../domain/repos/temporal.repository";


export class CreateMapUseCase {

    constructor(
        private readonly mapRepo: MapRepository,
        private readonly temporalRepo: TemporalRepository
    ) { }

    async run(floors: number[], isAnUpdate: boolean = false) {

        // ----- BUILDING -----
        console.log("FLOORS", floors)
        const rawBuilding: string | null = this.temporalRepo.getBuilding('building');

        if (rawBuilding) {
            try {
                const currentBuilding: Building = JSON.parse(rawBuilding) as Building;

                const newBuilding: BuildingParsed = {
                    id: currentBuilding.id || '',
                    uuid: currentBuilding.uuid,
                    floors: currentBuilding.floors,
                    name: currentBuilding.name,
                    campus: currentBuilding.campus,
                    faculty: currentBuilding.faculty,

                    published: true
                }

                if (isAnUpdate) {
                    await this.mapRepo.updateBuilding(newBuilding);
                } else {
                    await this.mapRepo.insertBuilding(newBuilding);
                }


                // ----- PLANE -----
                floors.forEach(async floor => {
                    setTimeout(async () => {

                        const rawPlane = await this.temporalRepo.getPlaneByFloor(`plane_${floor}`);

                        if (rawPlane) {
                            let currentPlane: Plane = JSON.parse(rawPlane) as Plane;
                            // console.log("PLANO", currentPlane);

                            currentPlane.stage.forEach(col => col.forEach(row => {
                                if (row.contain && isASprite(row.contain)) {
                                    row.contain.source = ''; // it's not necesaty original value in data store...
                                }
                            }));

                            currentPlane = this.updatePlane(currentPlane);

                            const newPlane: PlaneParsed = {
                                id: currentPlane.id || '',
                                columns: currentPlane.columns,
                                rows: currentPlane.rows,
                                widthTiles: currentPlane.widthTiles,
                                heightTiles: currentPlane.heightTiles,
                                stage: JSON.stringify(currentPlane.stage),
                                uuid: currentPlane.uuid,
                                floor: currentPlane.floor,
                                waypoints: JSON.stringify(currentPlane.wayPoints),
                                buildingId: currentPlane.buildingId,

                                published: true
                            };

                            if (isAnUpdate) {
                                console.log("Actualiza el plane como: ", newPlane, currentPlane.stage);
                                await this.mapRepo.updatePlane(newPlane);
                            } else {
                                await this.mapRepo.insertPlane(newPlane);
                            }


                            // ----- PLACE -----
                            const rawPlacesByID = this.temporalRepo.getUUIDPlacesByFloor(`places_${currentPlane.floor}`);

                            if (rawPlacesByID) {
                                const placesByID: UUID[] = rawPlacesByID;

                                placesByID.forEach(async placeID => {
                                    const rawPlace = this.temporalRepo.getPlace(placeID);

                                    if (rawPlace) {
                                        const place: Place = JSON.parse(rawPlace) as Place;

                                        const newPlace: PlaceParsed = {
                                            id: place.id || '',
                                            uuid: place.uuid,
                                            name: place.name,
                                            title: place.name + ' ' + place.code,
                                            category: place.category,
                                            code: place.code,
                                            campus: newBuilding.campus,
                                            faculty: newBuilding.faculty,
                                            planeId: place.planeId,

                                            wayPointId: place.wayPointId,
                                            published: true
                                        };

                                        const newDetailPlace: DetailPlaceParsed = {
                                            placeId: place.uuid,
                                            belongsProfessor: place.belongsProfessor,
                                            professorsId: place.professorsId,
                                            wayPointId: place.wayPointId,

                                            floor: currentPlane.floor,

                                            published: true
                                        }

                                        if (isAnUpdate) {
                                            await this.mapRepo.updatePlace(newPlace, newDetailPlace);
                                        } else {
                                            await this.mapRepo.insertPlace(newPlace);
                                            await this.mapRepo.insertDetailPlace(newDetailPlace);
                                        }
                                    } else {
                                        throw new Error("The place that pretend save doesn't exist...");
                                    }
                                });
                            } else {
                                throw new Error("The place that pretend save doesn't exist...");
                            }
                        } else {
                            throw new Error("The plane that pretend saves doesn't exist...");
                        }
                    });
                }, 1000);
            } catch (err) {
                console.error("Error when saving or creating map...", err);
            }
        } else {
            throw new Error("The building that pretend saves doesn't exist...");
        }
    }

    private updatePlane(plane: Plane) {
        plane.stage.forEach(col => col.forEach(row => {
            if (row.contain && isABlock(row.contain) && row.contain.blockType === 'obstacle') {
                row.isIgnored = true;
            } else {
                row.isIgnored = false;
            }
        }));

        return plane;
    }

}