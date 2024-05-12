import { Injectable, inject } from "@angular/core";
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, limit, query, updateDoc, where } from '@angular/fire/firestore';
import { MapRepository } from "../../domain/repos/map.repository";
import { Building, Place, Plane } from "../../domain/map.domain";
import { BuildingParsed, DetailPlaceParsed, PlaceParsed, PlaneParsed } from '../../domain/map-parsed.domain';
import { Observable, firstValueFrom } from "rxjs";
import { UUID } from "src/app/core/shared/models/core.types";


@Injectable({
    providedIn: 'root'
})
export class FirestoreMapRepository implements MapRepository {
    private buildingCollection!: CollectionReference<DocumentData>;
    private planeCollection!: CollectionReference<DocumentData>;
    private placeCollection!: CollectionReference<DocumentData>;
    private detailPlaceCollection!: CollectionReference<DocumentData>;

    private readonly db = inject(Firestore);

    constructor() {
        this.buildingCollection = collection(this.db, "buildings");
        this.planeCollection = collection(this.db, "plans");
        this.placeCollection = collection(this.db, "places");
        this.detailPlaceCollection = collection(this.db, "place-details");
    }

    async getPlanesByBuildingId(buildingId: UUID, floors: number): Promise<PlaneParsed[]> {
        const q = query(this.planeCollection, where('buildingId', '==', buildingId), limit(floors));

        const obs = collectionData(q, {idField: 'id'}) as Observable<PlaneParsed[]>;

        return await firstValueFrom(obs);
    }

    async getPlacesByPlaneId(planeID: UUID): Promise<PlaceParsed[]> {
        const q = query(this.placeCollection, where('planeId', '==', planeID));

        const obs = collectionData(q, {idField: 'id'}) as Observable<PlaceParsed[]>;

        return await firstValueFrom(obs);
    }

    async getDetailPlaceByPlaceId(placeId: UUID): Promise<DetailPlaceParsed> {
        const q = query(this.detailPlaceCollection, where('placeId', '==', placeId), limit(1));

        const obs = collectionData(q, {idField: 'id'}) as Observable<DetailPlaceParsed[]>;

        const details = await firstValueFrom(obs);

        return details[0];
    }

    async getBuildingById(id: UUID): Promise<BuildingParsed> {
        const q = query(this.buildingCollection, where('uuid', '==', id), limit(1));

        const obs = collectionData(q, {idField: 'id'}) as Observable<BuildingParsed[]>;

        const buildings = await firstValueFrom(obs); 

        return buildings[0];
    }
    
    async getAllBuildings(): Promise<Building[]> {
        const obs = collectionData(this.buildingCollection, { idField: 'id' }) as Observable<BuildingParsed[]>;
        return await firstValueFrom(obs);
    }

    async getBuildingsByCampus(campusName: string): Promise<Building[]> {
        const q = query(this.buildingCollection, where('campus', "==", campusName));
        const obs = collectionData(q, { idField: 'id' }) as Observable<BuildingParsed[]>;

        return await firstValueFrom(obs);
    }

    async getBuildingsByFaculty(facultyName: string): Promise<Building[]> {
        const q = query(this.buildingCollection, where('faculty', "==", facultyName));
        const obs = collectionData(q, { idField: 'id' }) as Observable<BuildingParsed[]>;

        return await firstValueFrom(obs);
    }

    async insertBuilding(buildingParsed: BuildingParsed): Promise<void> {
        await addDoc(this.buildingCollection, buildingParsed);
    }

    async insertPlane(planeParsed: PlaneParsed): Promise<void> {
        await addDoc(this.planeCollection, planeParsed);
    }

    async insertDetailPlace(detailPlaceParsed: DetailPlaceParsed): Promise<void> {
        await addDoc(this.detailPlaceCollection, detailPlaceParsed);
    }

    async insertPlace(placeParsed: PlaceParsed): Promise<void> {
        await addDoc(this.placeCollection, placeParsed);
    }

    async updateBuilding(building: BuildingParsed): Promise<void> {
        const buildingDocReference = doc(
            this.db,
            `buildings/${building.id}`
        );

        return await updateDoc(buildingDocReference, {...building});
    }

    async updatePlane(plane: PlaneParsed): Promise<void> {
        const planeDocReference = doc(
            this.db,
            `plans/${plane.id}`
        );

        return await updateDoc(planeDocReference, {...plane});
    }

    async updatePlace(place: PlaceParsed, detailPlace: DetailPlaceParsed): Promise<void> {
        const placeDocReference = doc(
            this.db,
            `places/${place.id}`
        );
        
        const detail = await this.getDetailPlaceByPlaceId(place.uuid);
        
        const detailPlaceDocReference = doc(
            this.db,
            `place-details/${detail.id}`
        );

        try {
            await updateDoc(detailPlaceDocReference, {...detailPlace});
            return await updateDoc(placeDocReference, {...place});
        } catch(err){
            console.log("=>", err);
        }

        throw new Error("Error in backend service when updating place...");
    }

}