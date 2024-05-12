import { Waypoint } from "../../plane-editor/domain/map.domain";

export const isAWaypoint = (obj: any): obj is Waypoint => {
    return 'name' in obj && 'pointType' in obj && 'uuid' in obj;
}