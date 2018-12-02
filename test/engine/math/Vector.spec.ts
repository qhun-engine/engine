import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { Vector } from "../../../src/engine/math/Vector";

@suite("engine/meth/Vector") class VectorSpec {

    @test "Public x and y are available"() {

        const v = new Vector(1, 2);
        expect(v.x).to.equal(1);
        expect(v.y).to.equal(2);
    }

    @test ".toString() must be overwritten"() {

        expect(new Vector(1, 2).toString()).to.equal(`${Vector.name}[1, 2]`);
    }
}