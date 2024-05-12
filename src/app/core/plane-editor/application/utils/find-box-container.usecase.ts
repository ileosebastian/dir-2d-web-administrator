
import { Plane, Block, Sprite, Waypoint, Box } from '../../domain/map.domain';


export class FindBoxContainerUseCase {

    constructor() { }

    run(cellX: number, cellY: number, plane: Plane): { boxSelected: Box, content: 'ground' | Block | Sprite | Waypoint } {

        let box = plane.stage[cellX][cellY];

        if (box.contain) {
            if (this.isASprite(box.contain)) {
                return { boxSelected: box, content: box.contain };
            }
            if (this.isABlock(box.contain)) {
                if (this.isAWaypoint(box.contain)) {
                    return { boxSelected: box, content: box.contain };
                }
                return { boxSelected: box, content: box.contain };
            }
        }
        return { boxSelected: box, content: 'ground' };
    }

    private isASprite(obj: any): obj is Sprite {
        return 'source' in obj &&
            'width' in obj &&
            'height' in obj &&
            'spriteType' in obj;
    }

    private isABlock(obj: any): obj is Block {
        return 'color' in obj && 'blockType' in obj;
    }

    private isAWaypoint(obj: any): obj is Waypoint {
        return 'name' in obj && 'pointType' in obj && 'uuid' in obj;
    }

}