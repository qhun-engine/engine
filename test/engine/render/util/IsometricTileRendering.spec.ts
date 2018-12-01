import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { IsometricTileRendering } from "../../../../src/engine/render/util/IsometricTileRendering";
import { Vector } from "../../../../src/engine/math/Vector";

@suite("engine/render/util/IsometricTileRendering") class IsometricTileRenderingSpec {

    @test "Isometric calculation for positions are correct"() {

        const iso = new IsometricTileRendering();
        const tileSize = Vector.from(64);
        const cartesianPosition = Vector.from(2, 1);

        const isoPosition = iso.getDrawingCoordinate(cartesianPosition.x, cartesianPosition.y, tileSize.x, tileSize.y);
        expect(isoPosition.toString()).equals(Vector.from(32, 96).toString());
    }
}