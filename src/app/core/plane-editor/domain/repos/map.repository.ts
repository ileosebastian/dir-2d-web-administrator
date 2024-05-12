import { UUID } from "src/app/core/shared/models/core.types";
import { BuildingParsed, DetailPlaceParsed, PlaceParsed, PlaneParsed } from "../map-parsed.domain";
import { Building } from "../map.domain";

export interface MapRepository {
    insertBuilding(buildingParsed: BuildingParsed): Promise<void>;
    insertPlane(planeParsed: PlaneParsed): Promise<void>;
    insertPlace(placeParsed: PlaceParsed): Promise<void>;

    insertDetailPlace(detailPlaceParsed: DetailPlaceParsed): Promise<void>;

    getBuildingById(id: UUID): Promise<BuildingParsed>;
    getAllBuildings(): Promise<Building[]>;
    getBuildingsByCampus(campusName: string): Promise<Building[]>;
    getBuildingsByFaculty(facultyName: string): Promise<Building[]>;


    getPlanesByBuildingId(buildingId: UUID, floors: number): Promise<PlaneParsed[]>;

    getPlacesByPlaneId(planeID: UUID): Promise<PlaceParsed[]>;
    getDetailPlaceByPlaceId(placeId: UUID): Promise<DetailPlaceParsed>;

    updateBuilding(building: BuildingParsed): Promise<void>;
    updatePlane(plane: PlaneParsed): Promise<void>;
    updatePlace(place: PlaceParsed, detailPlace: DetailPlaceParsed): Promise<void>;
}