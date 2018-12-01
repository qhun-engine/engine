export declare type LayeredWorldProperties<C = number> = {
    xy: {
        [xNumber: number]: {
            [yNumber: number]: C
        }
    },
    yx: {
        [yNumber: number]: {
            [xNumber: number]: C
        }
    }
}[];
