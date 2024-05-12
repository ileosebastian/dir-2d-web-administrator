import {Box, Sprite, Block, Plane, Place, Building} from '../map.domain'
import { UUID, placesID } from '../../../shared/models/core.types';


export interface TemporalRepository {
    getTemporalStorage(): Storage;
    
    saveBuilding(identifier: string, building: Building): Promise<void>;
    getBuilding(identifier: string): string | null;
    deleteBuilding(identifier: string): Promise<void>;

    saveIdentifier(type: string): Promise<void>;
    getIdentifier(): Promise<string | null>;
    deleteIdentifier(): Promise<void>;

    saveBox(box: Box): Promise<void>;
    saveDataContainerChages(container: Sprite | Block): Promise<void>;
    getBox(x: number, y: number): Promise<Box |null>;
    deleteBox(x: number, y: number): Promise<void>;

    savePlace(identifier: UUID, place: Place): Promise<void>;
    savePlacesByFloor(identifier: placesID, placesUUID: UUID[]): Promise<void>;
    getUUIDPlacesByFloor(identifier: placesID): UUID[] | null;
    getPlace(identifier: UUID): string | null;
    deletePlace(uuidPlace: UUID): Promise<void>;
    
    savePlane(identifier: string, plane: Plane): Promise<void>;
    getPlanes(): Promise<Plane[] | null>;
    getPlaneByFloor(identifier: string): Promise<string | null>;
    deletePlane(identifier: string): Promise<void>;
}