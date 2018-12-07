import { Vector } from "../../math/Vector";
import { RectangleShape } from "./RectangleShape";
import { Shape } from "./Shape";

export class PolygonShape implements Shape {

    /**
     * all points of this polygon
     */
    public points: number[] = [];

    /**
     * @param points
     * - **Number[]**: All points of the polygon as `number[]` in the form [x1, y1, x2, y2, ...]
     * - **Vector[]**: All points of the polygon as `Vector[]`
     */
    constructor(...points: (Vector | number)[]) {

        if (points.length <= 0) {
            return;
        }

        if (typeof points[0] === "number") {
            this.points = points as number[];
        }

        // check for vector instances
        if (points[0] instanceof Vector) {

            // map all points
            (points as Vector[]).forEach(point => {
                this.points.push(point.x, point.y);
            });
        }
    }

    /**
     * @inheritdoc
     */
    public contains(object: Vector): boolean {

        // contains flag that may be overwritten
        let contained: boolean = false;

        // [x,y] length / 2 check = points in the polygon
        const checkLength = this.points.length / 2;

        // iterate over all points
        for (let i = 0, j = checkLength - 1; i < checkLength; j = i++) {

            // make a raycast intersection test
            const xi = this.points[i * 2];
            const yi = this.points[(i * 2) + 1];

            const xj = this.points[j * 2];
            const yj = this.points[(j * 2) + 1];

            // now the intersection test
            const intersection = ((yi > object.y) !== (yj > object.y)) && (object.x < ((xj - xi) * ((object.y - yi) / (yj - yi))) + xi);

            // toggle the flag
            if (intersection) {

                contained = !contained;
            }
        }

        return contained;
    }

    /**
     * @inheritdoc
     */
    public clone(): PolygonShape {

        return new PolygonShape(...this.points);
    }

    /**
     * @inheritdoc
     */
    public getBounds(): RectangleShape {

        // @todo: implement!

        return new RectangleShape(0, 0, 0, 0);
    }
}
