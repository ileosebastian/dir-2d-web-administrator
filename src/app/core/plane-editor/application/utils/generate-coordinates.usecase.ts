// import { Editor } from "../domain/editor.domain";
import { Plane } from "../../domain/map.domain";


export class GenerateCoordinatesUseCase {

    constructor() {}

    run(mouseEv: MouseEvent, plane: Plane, canvas: HTMLCanvasElement): { x: number, y: number } | null {
        if (mouseEv.button !== 0) return null;

        const canvasBoundingRect = canvas.getBoundingClientRect();
        const x = mouseEv.clientX - canvasBoundingRect.left;
        const y = mouseEv.clientY - canvasBoundingRect.top;

        const cellX = Math.floor(x / plane.heightTiles);
        const cellY = Math.floor(y / plane.heightTiles);

        return {x: cellX, y: cellY};
    }

}