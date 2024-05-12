import { pathImageSVG } from "../../shared/models/app.types";

interface Option {
    option: string
    redirectTo: string
    pathIcon: pathImageSVG
    pathIconDark?: pathImageSVG
    pathIconLight?: pathImageSVG
}

export interface MenuOption {
    domain: string
    pathIcon: pathImageSVG
    pathIconDark?: pathImageSVG
    pathIconLight?: pathImageSVG
    options: Option[]
}
