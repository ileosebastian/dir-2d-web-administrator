import { UUID } from "../../shared/models/core.types";


export interface BuildingParsed {
    id?: string;
    uuid: UUID;
    floors: number;
    name: string;
    campus: string;
    faculty: string;

    published: boolean;
}

export interface PlaneParsed {
    id?: string;
    columns: number;
    rows: number;

    widthTiles: number;
    heightTiles: number;

    stage: string;

    uuid: UUID;
    floor: number;
    waypoints: string;
    buildingId: UUID

    published: boolean;
}

export interface PlaceParsed {
    id?: string;
    uuid: UUID;
    name: string;
    title?: string;
    category: string;
    code: string;
    campus: string;
    faculty: string;
    planeId: UUID;

    wayPointId: UUID;
    published: boolean;
}

export interface DetailPlaceParsed {
    id?: string;
    placeId: UUID;
    belongsProfessor: boolean;
    professorsId: string[];
    wayPointId: UUID;

    floor?: number;

    published: boolean;
}