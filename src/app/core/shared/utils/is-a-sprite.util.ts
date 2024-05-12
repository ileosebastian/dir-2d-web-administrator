import { Sprite } from "../../plane-editor/domain/map.domain";

export const isASprite = (obj: any): obj is Sprite => {
    return 'source' in obj &&
        'width' in obj &&
        'height' in obj &&
        'spriteType' in obj;
}