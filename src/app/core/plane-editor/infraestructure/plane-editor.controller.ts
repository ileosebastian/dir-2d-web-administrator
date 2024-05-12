import { AddBlockUseCase } from "../application/block/add-block.usecase";
import { AddNewSpriteUseCase } from "../application/place/add-sprite.usecase";
import { CreatePlaneUseCase } from "../application/plane/create-plane.usecase";
import { GenerateCoordinatesUseCase } from "../application/utils/generate-coordinates.usecase";
import { GeneratePlaneUseCase } from "../application/utils/generate-editor.usecase";
import { GetPlaneByFloorUsecase } from "../application/plane/get-plane-by-floor.usecase";
import { RemoveAllPlanesUseCase } from "../application/plane/remove-all-planes.usecase";
import { RemovePlaneByFloorUseCase } from "../application/plane/remove-plane-by-floor.usecase";
import { RestorePlansUseCase } from "../application/plane/restore-plans.usecase";
import { LocalStorageEditorRepository } from "./repositories/local-storage-editor.repository";

import { Injectable } from '@angular/core';

import { Box, Plane, Waypoint, Building, Place, Sprite, BlockRole } from '../domain/map.domain';
import { AddWaypointUseCase } from "../application/waypoint/add-waypoint.usecase";
import { UpdateWaypointUseCase } from "../application/waypoint/update-waypoint.usecase";
import { RemoveWaypointUseCase } from "../application/waypoint/remove-waypoint.usecase";
import { FindBoxContainerUseCase } from "../application/utils/find-box-container.usecase";
import { UUID } from "../../shared/models/core.types";
import { GetPlaceByUUIDUseCase } from "../application/place/get-place-by-uuid.usecase";
import { CreateNewBuildingUseCase } from "../application/building/create-new-building.usecase";
import { RemoveBuildingUseCase } from "../application/building/remove-building.usecase";
import { GetBuildingUseCase } from "../application/building/get-building.usecase";
import { UpdateBuildingUseCase } from "../application/building/update-building.usecase";
import { RemoveAllPlacesUseCase } from "../application/place/remove-all-places.usecase";
import { RemovePlaceByUUIDUseCase } from "../application/place/remove-place-by-uuid.usecase";
import { UpdatePlaceUseCase } from "../application/place/update-sprite.usecase";
import { GetAllPlacesByFloorUseCase } from "../application/place/get-all-places-by-floor.usecase";
import { UpdateWayPointIdUseCase } from "../application/place/update-waypoint-id.usecase";
import { CreateMapUseCase } from "../application/create-map.usecase";
import { FirestoreMapRepository } from "./repositories/firestore-map.repository";
import { GetAllBuildingsUseCase } from "../application/building/get-all-buildings.usecase";
import { GetBuildingsByFacultyUseCase } from '../application/building/get-buildings-by-faculty.usecase';
import { GetBuildingsByCampusUseCase } from "../application/building/get-buildings-by-campus.usecase";
import { GetTotalMapUseCase } from "../application/get-total-map.usecase";
import { ToastController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class PlaneEditorController {

    private planes!: Plane[];
    private canvas!: HTMLCanvasElement;
    private temporalRepo!: LocalStorageEditorRepository;
    private firestoreRepo!: FirestoreMapRepository;

    private getCoordinatesUseCase!: GenerateCoordinatesUseCase;

    private createNewBuildingUseCase!: CreateNewBuildingUseCase;
    private getBuildingUseCase!: GetBuildingUseCase;
    private getAllBuildingsUseCase!: GetAllBuildingsUseCase;
    private getBuildingsByFacultyUseCase!: GetBuildingsByFacultyUseCase;
    private getBuildingByCampusUseCase!: GetBuildingsByCampusUseCase;
    private updateBuildingUseCase!: UpdateBuildingUseCase;
    private removeBuildingUseCase!: RemoveBuildingUseCase;

    private createPlaneUseCase!: CreatePlaneUseCase;
    private generatePlaneUseCase!: GeneratePlaneUseCase;
    private getPlaneByFloorUseCase!: GetPlaneByFloorUsecase;
    private removePlaneByFloorUseCase!: RemovePlaneByFloorUseCase;
    private removeAllPlanesUseCase!: RemoveAllPlanesUseCase;

    private restorePlansUseCase!: RestorePlansUseCase;

    // private findBoxTypeUseCase!: FindBoxTypeUseCase;
    private findBoxContainerUseCase!: FindBoxContainerUseCase;

    private addBlockUseCase!: AddBlockUseCase;
    private addWaypointUseCase!: AddWaypointUseCase;
    private updateWaypointUseCase!: UpdateWaypointUseCase;
    private removeWaypointUseCase!: RemoveWaypointUseCase;

    private addNewSprite!: AddNewSpriteUseCase;

    private getPlaceUseCase!: GetPlaceByUUIDUseCase;
    private getAllPlacesByFloorUseCase!: GetAllPlacesByFloorUseCase;
    private updatePlaceUseCase!: UpdatePlaceUseCase;
    private updateWaypointIdPlaceUseCase!: UpdateWayPointIdUseCase;
    private removeAllPlacesUseCase!: RemoveAllPlacesUseCase;
    private removePlaceByUUIDUseCase!: RemovePlaceByUUIDUseCase;

    private createMapUseCase!: CreateMapUseCase;

    private getTotalMapUseCase!: GetTotalMapUseCase;

    constructor() {
        this.planes = [];
        this.temporalRepo = new LocalStorageEditorRepository();
        this.firestoreRepo = new FirestoreMapRepository();

        this.createNewBuildingUseCase = new CreateNewBuildingUseCase(this.temporalRepo);
        this.getBuildingUseCase = new GetBuildingUseCase(this.temporalRepo);
        this.updateBuildingUseCase = new UpdateBuildingUseCase(this.temporalRepo);
        this.removeBuildingUseCase = new RemoveBuildingUseCase(this.temporalRepo);

        this.getCoordinatesUseCase = new GenerateCoordinatesUseCase();

        this.restorePlansUseCase = new RestorePlansUseCase(this.temporalRepo);

        this.createPlaneUseCase = new CreatePlaneUseCase(this.temporalRepo);
        this.generatePlaneUseCase = new GeneratePlaneUseCase();
        this.getPlaneByFloorUseCase = new GetPlaneByFloorUsecase(this.temporalRepo);
        this.removePlaneByFloorUseCase = new RemovePlaneByFloorUseCase(this.temporalRepo);
        this.removeAllPlanesUseCase = new RemoveAllPlanesUseCase(this.temporalRepo);

        this.findBoxContainerUseCase = new FindBoxContainerUseCase();

        this.addBlockUseCase = new AddBlockUseCase(this.temporalRepo);
        this.addWaypointUseCase = new AddWaypointUseCase(this.temporalRepo);
        this.updateWaypointUseCase = new UpdateWaypointUseCase(this.temporalRepo);
        this.removeWaypointUseCase = new RemoveWaypointUseCase(this.temporalRepo);

        this.addNewSprite = new AddNewSpriteUseCase(this.temporalRepo);

        this.getPlaceUseCase = new GetPlaceByUUIDUseCase(this.temporalRepo);
        this.getAllPlacesByFloorUseCase = new GetAllPlacesByFloorUseCase(this.temporalRepo);
        this.updatePlaceUseCase = new UpdatePlaceUseCase(this.temporalRepo);
        this.updateWaypointIdPlaceUseCase = new UpdateWayPointIdUseCase(this.temporalRepo);

        this.removeAllPlacesUseCase = new RemoveAllPlacesUseCase(this.temporalRepo);
        this.removePlaceByUUIDUseCase = new RemovePlaceByUUIDUseCase(this.temporalRepo);

        this.createMapUseCase = new CreateMapUseCase(this.firestoreRepo, this.temporalRepo);

        // get buildings
        this.getAllBuildingsUseCase = new GetAllBuildingsUseCase(this.firestoreRepo);
        this.getBuildingByCampusUseCase = new GetBuildingsByCampusUseCase(this.firestoreRepo);
        this.getBuildingsByFacultyUseCase = new GetBuildingsByFacultyUseCase(this.firestoreRepo);

        this.getTotalMapUseCase = new GetTotalMapUseCase(this.firestoreRepo, this.temporalRepo);
    }

    set setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    async createMap(floors: number[], isAnUpdate: boolean = false) {
        await this.createMapUseCase.run(floors, isAnUpdate);
    }

    async saveBuilding(building: Building) {
        this.updateBuildingUseCase.run(building);
    }

    async getTotalMap(buildingId: UUID) {
        await this.getTotalMapUseCase.run(buildingId);
    }

    /* **** Utils **** */
    async restorePlanes(firstFloor: number) {
        return await this.restorePlansUseCase.run(firstFloor);
    }

    normalizeCoordinates(mouseEv: MouseEvent, plane: Plane) {
        if (this.canvas) {
            return this.getCoordinatesUseCase.run(mouseEv, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    findBoxContainer(cellX: number, cellY: number, plane: Plane) {
        return this.findBoxContainerUseCase.run(cellX, cellY, plane);
    }

    /* **** Identifier **** */
    async saveIdentifier(identifier: string) {
        await this.temporalRepo.saveIdentifier(identifier);
    }

    async getIdentifier(): Promise<string> {
        let res = await this.temporalRepo.getIdentifier();
        if (!res)
            throw new Error("The identifier doesn's exist");
        return res;
    }

    async removeIdentifier() {
        await this.temporalRepo.deleteIdentifier();
    }

    /* **** BUILDING **** */
    createNewBuilding(name: string, campus: string, faculty: string) {
        this.createNewBuildingUseCase.run(name, campus, faculty);
    }

    getBuilding() {
        return this.getBuildingUseCase.run();
    }

    async searchBuildings(isCampus: boolean, value: string) {
        if (value === 'todos') {
            return await this.getAllBuildingsUseCase.run();
        }
        if (isCampus) {
            return await this.getBuildingByCampusUseCase.run(value);
        } else {
            return await this.getBuildingsByFacultyUseCase.run(value);
        }
    }

    async updateBuildingFloor(floors: number) {
        let currentBuilding: Building = this.getBuildingUseCase.run();

        let newBuilding: Building = { ...currentBuilding, floors };

        await this.updateBuildingUseCase.run(newBuilding);
    }

    async removeBuilding() {
        await this.removeBuildingUseCase.run();
    }


    /* **** Editor Plane **** */
    generatePlane(plane: Plane, checked: boolean) {
        if (this.canvas) {
            this.generatePlaneUseCase.run(plane, this.canvas, checked);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    async createNewPlane(floor: number): Promise<Plane> {
        if (this.canvas) {
            let plane = await this.createPlaneUseCase.run(floor, this.canvas);
            // this.generatePlaneUseCase.run(plane, this.canvas, true);
            this.planes.push(plane);
            return plane;
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    async getPlaneByFloor(floor: number): Promise<Plane> {
        let res = await this.getPlaneByFloorUseCase.run(floor);
        if (res) {
            return res;
        } else {
            throw new Error(`Doesn't get the plane in ${floor}`);
        }
    }

    async removePlaneByFloor(floor: number) {
        await this.removePlaneByFloorUseCase.run(floor);
    }

    async removeAllPlanes(floors: number[]) {
        await this.removeAllPlanesUseCase.run(floors);
        this.planes = [];
    }


    /* **** Box **** */
    addBlock(cellX: number, cellY: number, color: string, plane: Plane, blockType: BlockRole): Box {
        if (this.canvas) {
            return this.addBlockUseCase.run(cellX, cellY, color, plane, this.canvas, blockType);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    addWayPoint(cellX: number, cellY: number, plane: Plane): Box {
        if (this.canvas) {
            return this.addWaypointUseCase.run(cellX, cellY, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    updateWayPoint(cellX: number, cellY: number, newWaypoint: Waypoint, plane: Plane) {
        if (this.canvas) {
            this.updateWaypointUseCase.run(cellX, cellY, newWaypoint, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    async removeWaypoint(cellX: number, cellY: number, plane: Plane) {
        if (this.canvas) {
            await this.removeWaypointUseCase.run(cellX, cellY, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    addSprite(cellX: number, cellY: number, category: string, { ...newSpriteParamns }, plane: Plane) {
        if (this.canvas) {
            return this.addNewSprite.run(cellX, cellY, category, newSpriteParamns, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    async updatePlace(cellX: number, cellY: number, newCellX: number, newCellY: number, newPlace: Place, newSprite: Sprite, plane: Plane) {
        if (this.canvas) {
            await this.updatePlaceUseCase.run(cellX, cellY, newCellX, newCellY, newPlace, newSprite, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }

    async updateWaypointIdInPlace(oldPlace: Place | null, newPlace: Place | null, floor: number) {
        try {
            await this.updateWaypointIdPlaceUseCase.run(oldPlace, newPlace, floor);
        } catch (err) {
            console.error("=>", err);
        }
    }

    getPlace(uuidPlace: UUID) {
        try {
            return this.getPlaceUseCase.run(uuidPlace);
        } catch (err) {
            console.error("Error to get place", err);
            return null;
        }
    }

    getAllPlacesByFloor(floor: number) {
        return this.getAllPlacesByFloorUseCase.run(floor);
    }

    async removeAllPlaces(floors: number[]) {
        await this.removeAllPlacesUseCase.run(floors);
    }

    async removePlaceByUUID(cellX: number, cellY: number, placeID: UUID, plane: Plane) {
        if (this.canvas) {
            await this.removePlaceByUUIDUseCase.run(cellX, cellY, placeID, plane, this.canvas);
        } else {
            throw new Error("Canvas Element is missing for plane editor!");
        }
    }


}