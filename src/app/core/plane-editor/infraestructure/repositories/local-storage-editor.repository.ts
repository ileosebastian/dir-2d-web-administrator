import { TemporalRepository } from "../../domain/repos/temporal.repository";
import {Box, Plane, Block, Sprite, Place, Building, } from '../../domain/map.domain';
import { UUID, placesID } from "../../../shared/models/core.types";


export class LocalStorageEditorRepository implements TemporalRepository {

    ls!: Storage;

    constructor() {
        this.ls = localStorage;
    }

    getTemporalStorage() {
        return this.ls;
    }

    async saveBuilding(identifier: UUID, building: Building): Promise<void> {
        try {
            this.ls.setItem(identifier, JSON.stringify(building));
        } catch (err) {
            console.error("=>", err);
        }
    }

    getBuilding(identifier: string): string | null {
        let res = this.ls.getItem(identifier);

        return res;
    }

    async deleteBuilding(identifier: string): Promise<void> {
        try {
            this.ls.removeItem(identifier);
        } catch(err) {
            console.error("=>", err);
        }
    }

    async savePlace(identifier: UUID, place: Place): Promise<void> {
        try {
            this.ls.setItem(identifier, JSON.stringify(place));
        } catch (err) {
            console.error("=>", err);
        }
    }
    async savePlacesByFloor(identifier: placesID, placesUUID: UUID[]): Promise<void> {
        try {
            this.ls.setItem(identifier, JSON.stringify(placesUUID));
        } catch (err) {
            console.error("=>", err);
        }
    }
    getUUIDPlacesByFloor(identifier: placesID): UUID[] | null {
        let res = this.ls.getItem(identifier);

        if (res) {
            try {
                return JSON.parse(res) as UUID[];
            } catch(err) {
                console.error(err);
                return null;
            }
        } else {
            return null;
        }
    }
    getPlace(uuidPlace: UUID): string | null {
        let res = this.ls.getItem(uuidPlace);
        return res;
    }
    async deletePlace(uuidPlace: UUID): Promise<void> {
        try {
            this.ls.removeItem(uuidPlace);
        } catch(err) {
            console.error("=>", err);
        } 
    }

    async saveIdentifier(type: string): Promise<void> {
        try {
            this.ls.setItem("identifier", type);
        } catch (err) {
            console.error("=>", err);
        }
    }

    async getIdentifier(): Promise<string | null> {
        return this.ls.getItem("identifier");
    }

    async deleteIdentifier(): Promise<void> {
        try {
            this.ls.removeItem("identifier");
        } catch(err) {
            console.error("=>", err);
        }
    }

    //
    async savePlane(identifier: string, plane: Plane): Promise<void> {
        try {
            this.ls.setItem(identifier, JSON.stringify(plane));
        } catch (err) {
            console.error("Save Plane error =>", err);
        }
    }

    getPlanes(): Promise<Plane[] | null> {
        throw new Error("Method not implemented.");
    }

    async getPlaneByFloor(identifier: string): Promise<string | null> {
        let res = this.ls.getItem(identifier);
        return res;
    }

    async deletePlane(identifier: string): Promise<void> {
        try {
            this.ls.removeItem(identifier);
        } catch(err) {
            console.error("=>", err);
        }
    }


    saveBox(box: Box): Promise<void> {
        throw new Error("Method not implemented.");
    }

    saveDataContainerChages(container: Sprite | Block): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getBox(x: number, y: number): Promise<Box | null> {
        throw new Error("Method not implemented.");
    }

    deleteBox(x: number, y: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}