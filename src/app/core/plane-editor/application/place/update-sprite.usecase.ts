import { Box, Place, Plane, Sprite } from "../../domain/map.domain";
import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { DrawSpriteUseCase } from "./draw-sprite.usecase";
import { signal } from '@angular/core';


export class UpdatePlaceUseCase {

    private readonly draw!: DrawSpriteUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.draw = new DrawSpriteUseCase();
    }

    async run(
        cellX: number,
        cellY: number,
        newCellX: number,
        newCellY: number,
        newPlace: Place,
        newSprite: Sprite,
        plane: Plane,
        canvas: HTMLCanvasElement
    ) {
        let box = plane.stage[cellX][cellY];
        let ctx = canvas.getContext('2d');

        if (ctx && box.contain !== null) {
            // for sprite
            let oldSprite: Sprite = box.contain as Sprite;

            // remove old sprite
            this.removeSprite(
                cellX, cellY,
                plane.widthTiles, plane.heightTiles,
                oldSprite.width,
                oldSprite.height,
                ctx
            );

            // update box
            box.x = newCellX;
            box.y = newCellY;
            box.contain = newSprite; // new content 
            box.type = 'place';

            // draw current sprite
            let img = new Image();
            img.src = newSprite.source;
            img.width = newSprite.width;
            img.height = newSprite.height;

            await this.draw.run(img, newSprite.label || '', newCellX, newCellY, plane.widthTiles, plane.heightTiles, ctx);
            let boxInSamgeCoordinates: Box = {
                x: cellX,
                y: cellY,
                contain: null,
                type: 'ground'
            };
            plane.stage[cellX][cellY] = boxInSamgeCoordinates; // replace
            plane.stage[newCellX][newCellY] = box; // new sprite
            await this.tempRepo.savePlane(`plane_${plane.floor}`, plane);

            // for place
            await this.tempRepo.savePlace(newSprite.placeId, newPlace);
        }
    }

    private removeSprite(
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        widht: number, height: number,
        context: CanvasRenderingContext2D
    ) {
        context.clearRect(x * widthTiles, y * heightTiles, widht, height + 10);
    }

}