import { TemporalRepository } from "../../domain/repos/temporal.repository";
import { DrawBlockUseCase } from "./draw-block.usecase";
import { Plane, Block, BlockRole } from '../../domain/map.domain';


export class AddBlockUseCase {

    private readonly draw!: DrawBlockUseCase;

    constructor(private readonly tempRepo: TemporalRepository) {
        this.draw = new DrawBlockUseCase();
    }

    run(cellX: number, cellY: number, color: string, plane: Plane, canvas: HTMLCanvasElement, blockType: BlockRole) {
        const ctx = canvas.getContext('2d');
        const block: Block = {
            blockType: blockType,
            color:
                blockType === 'obstacle' ? color :
                blockType === 'invisible_lock_up' ? 'purple' :
                blockType === 'invisible_lock_down' ? 'green' : 'red',
        };
        console.log("BLOQUE CREADO:", block)

        if (ctx) {
            plane.stage[cellX][cellY] = this.draw.run(
                plane.stage[cellX][cellY],
                block,
                cellX, cellY,
                plane.widthTiles,
                plane.heightTiles,
                ctx
            );

            // update current plane
            this.tempRepo.savePlane(`plane_${plane.floor}`, plane);
        }

        return plane.stage[cellX][cellY];
    }

}