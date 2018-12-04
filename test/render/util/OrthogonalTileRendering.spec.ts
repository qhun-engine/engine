import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { OrthogonalTileRendering } from "../../../src/render/util/OrthogonalTileRendering";
import { Vector } from "../../../src/math/Vector";

@suite("engine/render/util/OrthogonalTileRendering") class OrthogonalTileRenderingSpec {

    @test "Orthogonal calculation for positions are correct"() {

        const cart = new OrthogonalTileRendering();
        const tileSize = Vector.from(64);
        const cartesianPosition = Vector.from(2, 1);

        const isoPosition = cart.getDrawingCoordinate(cartesianPosition.x, cartesianPosition.y, tileSize.x, tileSize.y);
        expect(isoPosition.toString()).equals(Vector.from(128, 64).toString());
    }
}