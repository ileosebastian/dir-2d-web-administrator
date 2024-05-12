import { Box, Waypoint } from "../../domain/map.domain";


export class DrawWaypointUseCase {

    constructor() { }

    run(
        box: Box,
        contentToDraw: Waypoint,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        // draw
        context.fillStyle = contentToDraw.color;
        context.fillRect(x * widthTiles, y * heightTiles, heightTiles, heightTiles);
        // save
        box.contain = contentToDraw;
        box.contain.blockType = 'waypoint';
        box.type = 'block';
        return box;
    }

}