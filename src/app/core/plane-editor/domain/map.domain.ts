import { UUID } from "../../shared/models/core.types";

export type BlockRole =
    'obstacle' |
    'invisible_lock_down' |
    'invisible_lock_up' |
    'waypoint';

export interface Block {
    color: string;
    blockType: BlockRole;
}

export type WaypointType =
    'origin_first_floor' |
    'origin_previous_floor' |
    'origin_next_floor' |
    'previous_floor' |
    'next_floor' |
    'destiny';

export interface Waypoint extends Block {
    name: string;
    pointType: WaypointType;
    uuid: UUID;
}

export interface Sprite {
    placeId: UUID;
    source: string;
    width: number;
    height: number;
    spriteType: string; // any category for places
    label?: string;
}

export interface Box {
    x: number;
    y: number;
    contain: Sprite | Block | null;
    type:
    'place' |
    'block' |
    'ground';
    isIgnored?: boolean;
}

export interface Building {
    id?: string;
    campus: string;
    faculty: string;
    name: string;
    floors: number;
    uuid: UUID;
}

export interface Editor {
    columns: number;
    rows: number;

    widthTiles: number;
    heightTiles: number;

    stage: Box[][];
}

export interface Plane extends Editor {
    id?: string;
    floor: number;
    wayPoints: Waypoint[];
    uuid: UUID;
    buildingId: UUID;
}

export interface Place {
    id?: string;
    uuid: UUID;
    name: string;
    category: string;
    code: string;
    belongsProfessor: boolean;
    professorsId: string[];
    wayPointId: UUID;
    planeId: UUID;
}
