import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { DrawSpriteUseCase } from "./draw-sprite.usecase";
import { Sprite, Plane, Box, Place } from "../../domain/map.domain";
import { SavePlacesUUIDUseCase } from "./save-uuid-places-by-floor.usecase";
import { loadBundle } from "@angular/fire/firestore";


export class AddNewSpriteUseCase {

    private readonly draw!: DrawSpriteUseCase;
    private readonly addPlacesUUID!: SavePlacesUUIDUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.draw = new DrawSpriteUseCase();
        this.addPlacesUUID = new SavePlacesUUIDUseCase(tempRepo);
    }

    async run(
        cellX: number,
        cellY: number,
        type: string,
        { ...newSpriteParamns },
        plane: Plane,
        canvas: HTMLCanvasElement
    ) {
        let ctx = canvas.getContext('2d');
        let belogsProfessors: boolean = newSpriteParamns['category'] === 'profe-office';
        let place: Place = {
            uuid: crypto.randomUUID(),
            name: newSpriteParamns['name'], // by default
            category: newSpriteParamns['category'],
            code: `${plane.floor === 1 ? 'PB' : 'P'+(plane.floor-1)}`, // by default
            belongsProfessor: belogsProfessors,
            professorsId: [''],
            wayPointId: 'X-X-X-X-X',
            planeId: plane.uuid,
        };
        let sprite: Sprite = {
            placeId: place.uuid,
            source: newSpriteParamns['spritePath'],
            width: 25, // by default
            height: 25, // by default
            spriteType: type,
            label: '' // by default, without label
        };

        if (ctx) {
            let newBox: Box = {
                x: cellX,
                y: cellY,
                contain: sprite, // add new sprite in box's stage
                type: 'place'
            };

            plane.stage[cellX][cellY] = newBox;

            await this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
            await this.tempRepo.savePlace(place.uuid, place);
            this.addPlacesUUID.run(plane.floor, place.uuid);

            let img = new Image();
            img.src = sprite.source;
            img.width = sprite.width;
            img.height = sprite.height;

            await this.draw.run(
                img,
                sprite.label || '',
                cellX, cellY,
                plane.widthTiles,
                plane.heightTiles,
                ctx
            );
        }

        return plane.stage[cellX][cellY];
    }

}