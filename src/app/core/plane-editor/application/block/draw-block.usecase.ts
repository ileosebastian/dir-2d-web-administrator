import { Box, Block } from '../../domain/map.domain';


export class DrawBlockUseCase {

    run(
        box: Box,
        contentToDraw: Block,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ): Box {

        if (box.type === 'ground') {
            context.fillStyle = contentToDraw.color;
            context.fillRect(x * widthTiles, y * heightTiles, heightTiles, heightTiles);
            box.contain = contentToDraw;
            box.type = 'block';
            return box;
        }

        context.fillStyle = 'white'; // backgraaound;
        context.fillRect(x * widthTiles, y * heightTiles, heightTiles, heightTiles);
        box.contain = null; 
        box.type = 'ground';

        return box;
    }
}

