import { Block } from "../../plane-editor/domain/map.domain";

export const isABlock = (obj: any): obj is Block => {
    return 'color' in obj && 'blockType' in obj;
}