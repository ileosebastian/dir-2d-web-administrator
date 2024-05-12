import { UUID } from "../../../shared/models/core.types";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { Box, Plane, Sprite } from "../../domain/map.domain";
import { FindBoxContainerUseCase } from "../utils/find-box-container.usecase";
import { sortedChanges } from "@angular/fire/firestore";


export class RemovePlaceByUUIDUseCase {

    private findBox!: FindBoxContainerUseCase;

    constructor(private readonly tempRepo: TemporalRepository){
        this.findBox = new FindBoxContainerUseCase();
    }
    
    async run(cellX: number, cellY: number, placeID: UUID, plane: Plane, canvas: HTMLCanvasElement) {
        const currentSelected = this.findBox.run(cellX, cellY, plane);
        const ctx = canvas.getContext('2d');

        if (ctx && currentSelected.boxSelected.type === 'place') {
            const newBox: Box = {
                x: cellX,
                y: cellY,
                contain: null,
                type: 'ground'
            };

            plane.stage[cellX][cellY] = newBox; // replace totally

            const spriteToRemove = currentSelected.content as Sprite;
            this.removeSprite(
                cellX, cellY,
                plane.widthTiles, plane.heightTiles,
                spriteToRemove.width, spriteToRemove.height,
                ctx
            );
            this.drawGround(cellX, cellY, plane.widthTiles, plane.heightTiles, ctx);

            await this.tempRepo.deletePlace(spriteToRemove.placeId);
            const res = this.tempRepo.getUUIDPlacesByFloor(`places_${plane.floor}`);
            if (res) {
                const newPlaces = res.filter(placeID => placeID !== spriteToRemove.placeId);
                this.tempRepo.savePlacesByFloor(`places_${plane.floor}`, newPlaces);
            }
            await this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
        } else {
            throw new Error("This box isn't a block type!");
        }
    }

    private removeSprite(
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        widht: number, height: number,
        context: CanvasRenderingContext2D
    ) {
        context.clearRect(x*widthTiles, y*heightTiles, widht, height + 10); // for label
    }

    private drawGround(
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        context.fillStyle = 'white';
        context.fillRect(x* widthTiles, y*heightTiles, heightTiles, heightTiles);
    }

}